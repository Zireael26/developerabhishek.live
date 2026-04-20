# Changelog

All notable changes to developerabhishek.live are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) for released milestones.

## [Unreleased]

### Added
- Phase 1 chrome slice (EPIC-01 §2, §3.1): sticky `SiteNav` with wordmark + six section links + status line + `ThemeToggle`, terminal `SiteFooter` with build-notes + commit SHA + license links, and a single-page `<main id="top">` that lays out eight section scaffolds (`#hero…#contact`) with `data-companion-pose` / `data-screen-label` anchors ready for The Wanderer. Section bodies land in per-slice PRs.
- `components/site/{SiteNav,SiteFooter,ThemeToggle}.tsx` — nav + footer are server components; `ThemeToggle` is the only client island in the chrome (flips `html[data-mode]`, persists to `localStorage['abhishek.portfolio.mode']`, respects `prefers-color-scheme` on first mount).
- `app/globals.css` — ported site-chrome rules verbatim from `_reference/portfolio/styles.css` (+ the inline `<style>` diffs for nav meta / theme toggle / companion). Design tokens unchanged.
- `#companion` mount point in `<body>` so the Wanderer slice has a place to render without touching chrome again.
- `public/init-theme.js` — pre-hydration theme bootstrap. Sync `<script src>` in `<head>` reads `localStorage['abhishek.portfolio.mode']` / `prefers-color-scheme` and sets `html[data-mode]` before first paint. Prevents a light-mode flash for dark-preference users before `ThemeToggle`'s effect reconciles.
- Phase 1 hero slice (EPIC-01 §2, §3.2): `components/sections/Hero.tsx` renders the 88px Newsreader hero title with three tagline variants (A visible, B/C carry the `hidden` attr ready for TweakBridge to swap), the `hero-lede` sub-copy, primary + ghost CTAs, the four-item `hero-facts` DL with `data-stat="total"` injected from `public/data/stats.json` at build time, a static SVG agent-graph scene inside the framed `.scene-frame`, and the sticky hero marquee (stack/tooling names, duplicated track for seamless CSS loop).
- `app/globals.css` — ported hero-specific rules from the reference: `.hero`, `.hero-grid`, `.hero-title` (+ tagline-a `em` accent), `.hero-lede`, `.hero-cta-row`, `.hero-facts` / `dt` / `dd`, `.scene-frame`, `.scene-label` / `.scene-label-key`, `.scene-svg` (+ `.node-core`, `.node-ring`, `.nodes text`, `.edges path`), `.scene-foot`, `@keyframes spin`, and the 900px hero media query.
- `app/page.tsx` — hero placeholder scaffold replaced with `<Hero />`; sections 02–08 remain placeholders.

### Deferred
- Three.js agent-graph canvas (the ~250-line IIFE from the reference) — ships in a dedicated slice. Hero currently renders the static SVG graph verbatim from the reference fallback markup, which is what `prefers-reduced-motion: reduce` / `[data-motion="off"]` users would see anyway.
- Tagline A/B/C live swap — needs `TweakBridge` (dedicated slice per HANDOFF §6). Spans are authored with the reference's valueless `data-tagline-*` markers + `hidden` on B/C so TweakBridge only has to toggle `hidden`.
- Next.js 16.2 scaffold: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `middleware.ts`, `eslint.config.js`.
- Design token foundation in `app/globals.css` mirroring the Claude Design reference (parchment, ink, forest accent, Newsreader + Plus Jakarta Sans + JetBrains Mono).
- Agent-readiness scaffold: `public/robots.txt` with Content Signals, `public/llms.txt`, `public/.well-known/agent-skills/index.json`, `public/.well-known/mcp.json`, Link-header middleware.
- `scripts/fetch-github-stats.mjs` + `.github/workflows/stats.yml` (weekly refresh).
- `scripts/process-gate.mjs` real policy (R1 code→CHANGELOG, R2 structural→ADR/CHANGELOG, R3 EPM→ROADMAP). Bypass via `SKIP_PROCESS_GATE=1`. See ADR-0002.
- ADR-0002 — process-gate policy + git-hook tool (`simple-git-hooks`, wired in Phase 1).
- EPIC-01 — pixel-parity plan for Phase 1 (`docs/epm/EPIC-01-pixel-parity.md`).
- `turbopack.root = process.cwd()` in `next.config.ts` to silence the multi-lockfile warning.
- `app/layout.tsx`: swapped Google Fonts `<link>` for `next/font/google` (Newsreader + Plus Jakarta Sans + JetBrains Mono). Self-hosted, eliminates external handshake, clears the `@next/next/no-page-custom-font` warning. `app/globals.css` resolves `--serif/--sans/--mono` through the next/font CSS variables.
- `vercel.json` — pins `framework: "nextjs"`, `buildCommand: "pnpm run build"`, `installCommand: "pnpm install --frozen-lockfile"`, `outputDirectory: ".next"`. Fixes the SvelteKit-era dashboard setting (`outputDirectory: "build"`) that was still live on the Vercel project and made every PR preview fail with `No Output Directory named "build" found after the Build completed`. In-repo config overrides dashboard drift and survives any future framework preset changes.
- `next-mdx-remote` bumped `^5.0.0 → ^6.0.0`. Vercel's deploy pipeline blocks 5.x as vulnerable (`Vulnerable version of next-mdx-remote detected (5.0.0). Please update to version 6.0.0 or later.`). 6.0.0 is API-compatible for our usage (we don't call it yet — MDX pipeline lands in Phase 2).

### Changed
- Repository migrated from SvelteKit to Next.js 16.2. Prior state preserved at tag `legacy-v1-final`.
- Renamed `docs/prd.md` → `docs/PRD.md` to match the PascalCase convention used everywhere else in `docs/`.
- `next.config.ts`: moved `typedRoutes` out of `experimental` (stable in Next 16.2).
- `package.json`: `lint` script switched from `next lint` (removed in Next 16) to `eslint .`.
- `package.json`: TypeScript pin corrected `6.0.0 → 6.0.3` — `6.0.0` was never published; `6.0.x` patch drift is the intended pin.
- `eslint.config.js`: named the default export to satisfy `import/no-anonymous-default-export`.
- `tsconfig.json`: Next 16.2 auto-applied `jsx: react-jsx` and added `.next/dev/types/**/*.ts` to `include` on first build; committed as-is.

### Removed
- SvelteKit source: `src/**`, `static/**`, `svelte.config.js`, `vite.config.ts`, the prior `pnpm-lock.yaml`. Reachable at the `legacy-v1-final` tag.
