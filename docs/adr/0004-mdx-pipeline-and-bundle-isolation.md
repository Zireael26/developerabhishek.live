# ADR 0004 — MDX pipeline via `next-mdx-remote@6` with server-only compilation and Shiki bundle isolation

**Status:** Accepted · 2026-04-20

## Context

Phase 2 needs MDX for case studies (`content/case-studies/*.mdx`) and writing posts (`content/writing/*.mdx`). Three options were on the table:

1. **`@next/mdx` (official plugin).** Treats `.mdx` files as first-class routes. Requires `experimental.mdxRs: true` (already on). Simple, but the syntax-highlighting path still pulls in Shiki — with no built-in story for keeping it server-only. Tooling couples MDX to the route filesystem instead of content files the editor can iterate on.
2. **`next-mdx-remote@6` with its RSC API (`next-mdx-remote/rsc`).** MDX compiled at request time (or at build time via static params) inside a React Server Component. Content stays as `.mdx` files under `content/`; routes render via `<MDXRemote source={...} />`. The RSC API is the v6 recommended path.
3. **Custom pipeline (`@mdx-js/mdx` directly).** Flexible but re-implements frontmatter, syntax-highlighting, and link-plugin wiring that `next-mdx-remote` already solves.

Plan called out risk R3 (Shiki leaking to the client bundle) and risk R7 (`next-mdx-remote@6` API changes vs. v5).

## Decision

Use **`next-mdx-remote@6`** with the `next-mdx-remote/rsc` import. Compile MDX in server components only. Plugins:

- **remark:** `remark-gfm` (tables, task lists, footnotes, autolinks).
- **rehype:** `rehype-slug` (heading anchors), `rehype-pretty-code` (Shiki-backed code highlighting).

Frontmatter is parsed by a tiny in-repo YAML subset parser in `lib/content.ts` (scalars + inline arrays + YAML lists). Avoids adding `gray-matter` or `js-yaml` as explicit deps. Frontmatter shapes are typed via `CaseStudyFrontmatter` and `WritingFrontmatter`.

Bundle isolation story:

- MDX rendering lives only in server components / route handlers (`components/work/CaseStudyPage.tsx`, `app/writing/[slug]/page.tsx`). No `'use client'` file imports `next-mdx-remote/rsc` or Shiki.
- `@next/bundle-analyzer` is wired via `next.config.ts` (gated on `ANALYZE=true`). The new `pnpm analyze` script snapshots client vs. server bundles. Run after any change that touches the MDX compile path.

## Consequences

**Positive**

- Content is just `.mdx` files under `content/` — no route-filesystem coupling, editor-friendly, Phase-4 `llms-full.txt` route can read and concatenate them verbatim.
- The server-only compilation path means Shiki's tokenizer tables (~2–3MB unpacked) never ship to the browser. Verified via bundle analyzer on Slice 2.1 merge.
- `next-mdx-remote`'s RSC path composes with React 19 Server Components without a client/server shim.
- The frontmatter parser is ~50 LOC, trivially reviewable, and avoids two transitive-dep upgrade paths.

**Negative**

- Per-request compilation is slower than pre-compiled `@next/mdx` (tens of ms on small files). Mitigated by `generateStaticParams` prerendering every known slug at build time. Real request-time cost applies only to ISR / on-demand revalidation, which isn't in v1 scope.
- The frontmatter parser handles only scalars, inline arrays, and YAML-list arrays. Anything more complex (nested objects, multi-line strings) throws with a clear error. Extending it would be straightforward if content needs grow.
- `as never` cast on `rehypePlugins` arrays in `CaseStudyPage.tsx` + writing detail page to satisfy `next-mdx-remote`'s non-readonly `Pluggable[]` signature. Compile-only — no runtime effect.

**Neutral**

- The `next-mdx-remote@6` major bump from v5 was already applied in Slice 0. No migration pain — v5 was installed but never exercised.
- `@next/bundle-analyzer` adds one devDep and a conditional `next.config.ts` block.

## Alternatives considered

- **`@next/mdx`** — rejected on bundle-isolation grounds. Shiki default-ships to the client unless guarded with additional config; adding that guard is more surface than `next-mdx-remote/rsc`'s built-in RSC boundary.
- **Custom `@mdx-js/mdx` pipeline** — rejected on complexity. Re-implementing frontmatter + plugin wiring isn't worth the flexibility for this use case.
- **Prism for syntax highlighting** — rejected on visual quality. Shiki's TextMate-grammar fidelity matters for code-heavy case studies (VeriCite, Bluehost); the server-only isolation makes the tokenizer-weight concern moot.
- **Pre-compile MDX to HTML at build via a custom script** — rejected on authoring ergonomics. HMR during local dev needs the compile-on-render path.

## Follow-ups

- Per-phase review gate: verify Shiki stays in the server chunk after each MDX slice merge. Script: `pnpm analyze` → inspect `.next/analyze/client.html`.
- Phase 4 Slice 4.2 (`app/llms-full.txt/route.ts`) reuses `lib/content.ts` — no additional plugins needed there; the route serves raw MDX body without rendering.
- Risk-R3 mitigation is continuous, not one-time. Any new MDX consumer must import from `next-mdx-remote/rsc`, not the root package.
