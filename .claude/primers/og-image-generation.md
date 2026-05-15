---
slug: og-image-generation
purpose: Next.js ImageResponse handlers rendering parchment-and-forest Open Graph previews for home, case-study, and writing pages from MDX frontmatter.
pinned_to: e73ab4026fe93e8f216d4c3fea227ca26a1fdbac
created: 2026-05-15
last_refreshed: 2026-05-15
related_primers: [mdx-content-pipeline, hyperframes-reels]
---

# Open Graph Image Generation

## Purpose

Render social-preview images at 1200×630 for every shareable URL: the home page, each `/work/<slug>` case study, and each `/writing/<slug>` post. Designed to extend the site's parchment background + forest accent + Newsreader/Menlo typography to embedded link previews on Slack, Twitter, LinkedIn, iMessage.

## Entry points

- `app/opengraph-image.tsx` — home OG image. Edge runtime. Hand-coded layout (kicker, hero headline, footer); no frontmatter input.
- `app/work/[slug]/opengraph-image.tsx` — per case-study image. Node runtime (required because `generateStaticParams` runs against `lib/content.ts`). Pulls `fm.index`, `fm.tag`, `fm.year`, `fm.title`, `fm.dek`, `fm.role`, `fm.stack`.
- `app/writing/[slug]/opengraph-image.tsx` — per writing post. Node runtime. Pulls `fm.title`, `fm.dek`, `fm.date` (formatted via `lib/dates.ts:formatMonthYear`).

## Data flow

A LinkedIn unfurl of `https://akaushik.org/work/neev`:

1. The platform fetches `https://akaushik.org/work/neev/opengraph-image` (Next.js wires this from the file route automatically).
2. `generateStaticParams()` in the per-slug handler called `getPostSlugs('case-studies')` at build time, so `neev` is already in the prerendered set.
3. The route handler awaits `params`, calls `getPost('case-studies', slug)` from `lib/content.ts`. Missing slug → `notFound()` (404). Found → frontmatter narrowed to `CaseStudyFrontmatter`.
4. The handler returns `new ImageResponse(<jsx>)` with inline styles. Layout: top row (`akaushik.org / work` ↔ `fm.year`), middle (`fm.index · fm.tag` kicker in forest, `fm.title` at 88px, italic `fm.dek` at 34px), bottom row (`fm.role` ↔ `fm.stack.join(' · ')`).
5. `next/og` rasterises the JSX (Satori under the hood) to PNG at 1200×630. Result is cached as a static asset per deploy.
6. Writing variant differs only in fields used (`formatMonthYear(fm.date)` instead of year, no kicker, smaller heading at 64px). Home variant is purely static and edge-rendered for quick refresh when copy changes.

## Dependencies

- `next/og` — `ImageResponse` (Satori-based renderer). Limited CSS subset; flex-only, no grid.
- `lib/content.ts` (`mdx-content-pipeline` primer) — `getPost`, `getPostSlugs` for params + frontmatter.
- `lib/dates.ts:formatMonthYear` — writing-post date formatting.
- `app/layout.tsx` `metadata.openGraph.images` — Next.js auto-wires the file-route OG image when the route opts in; no manual `<meta>` registration needed.

## Test commands

```bash
# Render in dev and view directly
pnpm dev
open http://localhost:3000/opengraph-image
open "http://localhost:3000/work/neev/opengraph-image"
open "http://localhost:3000/writing/the-evidence-of-shipping/opengraph-image"

# Verify the OG image surfaces via the page metadata
curl -s http://localhost:3000/work/neev | rg -i 'og:image'

# Production check
pnpm build && pnpm start
```

No dedicated test fixture — visual review is the verification. Playwright (`pnpm test:e2e`) covers HTML page rendering, not the rasterised image.

## Gotchas

- **Edge runtime caps assets at ~1MB and forbids `node:fs`.** The home `opengraph-image.tsx` declares `runtime = 'edge'` because it ships zero MDX-derived data; per-slug variants stay on the Node runtime so `getPost` + `getPostSlugs` can read the filesystem. Don't promote them to edge without first replacing the loader.
- **No custom font loading today.** All three handlers fall back to `Georgia, serif` + `Menlo, monospace`, which Satori serves from its built-in subset. If a redesign demands the on-page Newsreader/JetBrains Mono fonts, you must `fetch` the WOFF/TTF bytes at build (or co-locate them) and pass them as `fonts: [{ name, data, … }]` on `ImageResponse`. Watch the edge size budget when you do.
- **Satori's CSS subset is restrictive.** Flexbox only — no `grid`, no `gap`. `border-bottom`/`border-top` are supported, but shorthand `border` is finicky. Any unsupported property throws at render time, not at build, so verify visually after edits.
- **Field shape from `lib/content.ts` is the contract.** `fm.stack` may be `string[]` _or_ `string` historically; per-slug handlers defend with `Array.isArray(fm.stack) ? fm.stack.join(' · ') : ''`. Don't drop the guard.
- **Forest accent hex `#13423D` is hardcoded.** Same hex appears in all three files. If the design system retones the accent (see ADR-0007's swatch follow-ups), grep for `#13423D` across `app/**/opengraph-image.tsx` and update each — they don't import from a shared tokens module yet.
- **`generateStaticParams` runs at build time, not on demand.** A new case study or writing post needs a build to surface its OG image. ISR (`revalidate`) is not configured on these handlers — they're treated as build-pinned assets.
- **`notFound()` for missing slugs.** Edge unfurlers occasionally probe non-existent paths; the 404 response is fine for them. Don't switch to a placeholder image — empty OG is better than a misleading one.

## Out of scope

- Twitter Card / `twitter:image` metadata — Next.js wires this from the same OG image file unless overridden in `metadata`.
- Favicon + apple-touch-icon — separate concern under `app/icon.tsx` / `app/apple-icon.tsx` (or static files in `app/`).
- HyperFrames reel posters (`.webp` at `public/video/work/*.webp`) — case-study card visuals, not OG images. See `hyperframes-reels` primer.
- Open Graph metadata strings (`title`, `description`) — owned by each page's `generateMetadata`, not by the OG handler.

## Notes

- The home OG declares `alt = "Abhishek Kaushik — AI systems for businesses that haven't met AI yet"` — that string surfaces in screen-reader contexts on share previews. Keep it in sync with the home headline if copy changes.
- ADR-0003 covers the canonical domain (`akaushik.org`) the OG handlers hard-code in their visible chrome (`akaushik.org / work`). If the canonical changes, those strings need touching even though they're decorative.
