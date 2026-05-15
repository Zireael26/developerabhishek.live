---
slug: mdx-content-pipeline
purpose: Custom YAML frontmatter parser + filesystem loader feeding case studies and writing posts, with reading-time calc and agent-facing JSON listings.
pinned_to: e73ab4026fe93e8f216d4c3fea227ca26a1fdbac
created: 2026-05-15
last_refreshed: 2026-05-15
related_primers: [og-image-generation, agent-readiness-contract]
---

# MDX Content Pipeline

## Purpose

Load case-study and writing-post MDX files from `content/` at build/request time, parse their frontmatter without pulling `gray-matter` or `js-yaml`, and expose them to (a) MDX-rendered pages, (b) sitemap + OG-image generators, and (c) agent-facing JSON listings under `/api/`.

## Entry points

- `lib/content.ts` — `parseFrontmatter()`, `getPost()`, `getAllPosts()`, `getAllPostsWithReadingTime()` — the only readers of `content/**/*.mdx`. Defines `CaseStudyFrontmatter` and `WritingFrontmatter` types.
- `lib/reading-time.ts` — `getReadingTime()` — derives a reading-time label when frontmatter omits one.
- `app/api/case-studies/route.ts` — JSON listing for case studies; respects the curated `ORDER` array (Neev → VeriCite → Bluehost → curat.money), not alphabetical.
- `app/api/writing/route.ts` — JSON listing for writing posts; newest-first by `frontmatter.date`.
- `lib/mdx-options.ts` — shared remark/rehype plugin config (gfm, slug, pretty-code/shiki) for `next-mdx-remote`.

## Data flow

Representative path: a request for the home page's Writing list.

1. `app/page.tsx` (or whichever consumer) calls `getAllPostsWithReadingTime('writing')`.
2. `lib/content.ts:getPostSlugs('writing')` lists `content/writing/*.mdx` via `node:fs.readdirSync`, strips `.mdx`, sorts alphabetically.
3. For each slug, `getPost(type, slug)` reads the file and hands the raw string to `parseFrontmatter()`.
4. `parseFrontmatter()` matches the `---…---` fence, walks each line, and yields scalar values, inline-array values (`[a, b]`), or YAML-list values (`-` per line). Bare strings, single-quoted, and double-quoted forms all collapse via `stripQuotes()`.
5. If the frontmatter omits `readingTime`, `getReadingTime(body)` runs against the MDX body to derive one.
6. Caller renders the list. For JSON consumers (`/api/writing`, `/api/case-studies`), the body is dropped — frontmatter + slug + canonical URL + `.md` alternate URL are the only fields returned.
7. Pages that render bodies (work/[slug], writing/[slug]) pass `post.content` to `next-mdx-remote` with `lib/mdx-options.ts` plugins.

## Dependencies

- `node:fs` — synchronous filesystem reads (intentional; runs at build time and on edge revalidate windows, not per-request hot paths).
- `lib/reading-time.ts` — reading-time derivation.
- `next-mdx-remote` + `remark-gfm` + `rehype-slug` + `rehype-pretty-code` + `shiki` — body rendering on consumer pages, not in `lib/content.ts` itself.
- `agent-readiness-contract` primer — `/llms-full.txt` and `/work/<slug>.md` alternates consume the same `getPost()`/`getAllPosts()` surface, so a frontmatter schema change ripples there.
- `og-image-generation` primer — OG handlers slice `frontmatter` fields (`fm.title`, `fm.dek`, `fm.year`, `fm.tag`, `fm.stack`); add a field and update the consumers.

## Test commands

```bash
# Vitest unit suite (covers reading-time and any parser regressions)
pnpm test

# Quick spot-check of a JSON listing in dev
pnpm dev
curl -s http://localhost:3000/api/case-studies | jq '.caseStudies[].slug'
curl -s http://localhost:3000/api/writing       | jq '.posts[].slug'

# Full Playwright suite (e2e — exercises page rendering, not the loader)
pnpm test:e2e
```

There is no dedicated fixture: the loader reads the real `content/` directory, so adding an MDX file in a new branch is the integration test.

## Gotchas

- **Custom parser, not `gray-matter`.** Comment at `lib/content.ts:42` is load-bearing — the parser only handles the scalar + inline-array + YAML-list shapes the project's frontmatter actually uses. Nested objects, multi-line scalars (`|` / `>`), or anchors will throw `frontmatter parse failure at line N`. If a new field needs richer YAML, either keep it flat or swap in `gray-matter` (and accept the bundle cost).
- **`getAllPosts` returns frontmatter only.** It deliberately drops `content` to keep callers honest about cost. Use `getPost()` when you need the body.
- **`getAllPostsWithReadingTime` reads every body.** Each call re-reads N files to compute reading time. Cheap at N≈10, but don't loop it on a hot path — sitemap and listings call it once during static generation and that's the expected pattern.
- **Curated order in `/api/case-studies`.** `ORDER` in `app/api/case-studies/route.ts` is hand-maintained; adding a case study without updating that array silently drops it from the JSON listing. Slugs not in `content/` are silently filtered out by the `available` set, which means a typo fails open.
- **Frontmatter keys are case-sensitive and unquoted-key only.** The regex `^([A-Za-z_][\w-]*)\s*:\s*(.*)$` rejects `"weird key":` style. Stick to lowerCamelCase like `evidenceOf`.
- **`force-static` + `revalidate = 300`** on the JSON routes — content changes propagate on a 5-minute cache window in production, not on every request.

## Out of scope

- MDX body rendering (`next-mdx-remote`, shiki theme, GFM details) — covered by `lib/mdx-options.ts`, not this primer.
- Markdown content-negotiation (`/work/<slug>.md`, `Accept: text/markdown`) — see `agent-readiness-contract` primer.
- OG-image rendering of frontmatter fields — see `og-image-generation` primer.
- Sitemap + `/llms-full.txt` corpus assembly — separate consumers of the same loader.

## Notes

- Frontmatter schema lives at `lib/content.ts:7-24` (`CaseStudyFrontmatter`, `WritingFrontmatter`). Treat those types as the contract — every consumer ultimately narrows through them.
- ADR-0004 covers the MDX pipeline + bundle isolation decisions; read it before changing the loader's API.
