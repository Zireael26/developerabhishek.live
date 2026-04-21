# ADR-0008 — HyperFrames for case-study reel rendering

**Status:** Accepted, 2026-04-21
**Context:** Post-launch visual polish — the four home Work cards and the four case-study hero bands each shipped with an SVG placeholder (`components/work/reels.tsx`) plus a `neev/reel.mp4 · hyperframes` label promising a video follow-up. This ADR captures the decision to use HeyGen's HyperFrames HTML-to-video pipeline for that follow-up, and the shape of the integration.
**Author:** Claude (Code), co-author to Abhishek Kaushik.

## Context

The placeholder SVGs are good static stills — they carry the right design vocabulary (parchment bed, forest accent, node/edge primitives, comparison tables) — but they read as brochure art when the rest of the site leans into motion (hero R3F agent-graph in 5.1b, Wanderer crane in 5.1c). The cards in particular sit on the home page's "Selected work" band where every neighbour breathes; a still SVG next to a pulsing hero graph flattens the whole section.

Three constraints on any video solution:

1. **Visual continuity.** The reels have to share the exact design tokens + vocabulary with the rest of the site. Any solution that forces a second aesthetic system (stock motion libraries, Lottie JSON from a designer's AE file, generic Rive scenes) costs us more than the motion buys.
2. **No cross-browser live animation.** The home Work section already has a sticky-positioned reel layout (`@media (min-width: 960px) { .case-reel { position: sticky; top: 96px; } }`). Layering a second live animation system (GSAP timelines + motion libs) on top of the hero R3F canvas + Wanderer crane pushes main-thread work past what a Chromebook on 3G should tolerate. A pre-rendered clip pays its cost once.
3. **Author-time friction.** Abhishek has a strong preference for "tools that work locally, commit the output, never gate a build on a third-party API." (See `docs/PRD.md §9` + existing agent-readiness work.) Any solution that couples ship-ability to a live SaaS render queue is out.

## Decision

Adopt HyperFrames (https://hyperframes.heygen.com/introduction) as the rendering pipeline for all case-study reels. Author compositions as local HTML projects under `scripts/hyperframes/`, render to MP4 with the OSS CLI (`npx hyperframes render`), and commit the resulting `public/video/work/<slug>.mp4` + `<slug>.webp` poster pair as build artifacts alongside the composition source.

**Specifically:**

- **One HyperFrames project per composition.** Eight projects total — four card reels (600×400, 5s loop) and four hero bands (1600×900, 10s loop). The alternative (one big project with eight compositions) looked appealing but the HyperFrames CLI's multi-composition selection story is underdocumented and one project per composition means a broken timeline never blocks the others rendering. See `scripts/hyperframes/README.md`.
- **GSAP as the timeline engine.** HyperFrames mirrors `window.performance.now` to deterministic timestamps and seeks frame-by-frame; GSAP's `{ paused: true, repeat: -1 }` timeline registered on `window.__timelines["root"]` is the supported integration shape. We already depend on `gsap@^3.13.0` in the main bundle (framer-motion adjacent) — adding it to HTML `<script>` via a CDN inside a HyperFrames project costs nothing at runtime on the site.
- **CSS mirrored from `app/globals.css`, not imported.** `scripts/hyperframes/shared/tokens.css` carries the subset of design tokens the reels actually use (parchment, forest, ink shades, Newsreader/JetBrains Mono). Pulling the site's full `globals.css` into a 600×400 headless viewport would be wasteful and would re-introduce Tailwind's JIT into the render sandbox. Drift risk flagged explicitly in the file header.
- **Commit the MP4s.** `public/video/work/*.mp4` are author-time artifacts, not CI-generated. CI does **not** run `pnpm render:work`. Rationale: a) FFmpeg + headless Chrome on GitHub Actions adds ~90s of cold-start every run for assets that change on the order of "once per composition edit," b) deterministic builds benefit from pinned binaries rather than whatever Chrome HyperFrames bootstraps in a given month, c) a one-off local render then `git add public/video/work/` is the same pattern the repo already uses for OG images + agent-skills digest. The tradeoff is that a composition edit has a manual render step — accepted, because "edit composition, run `pnpm render:work -- --only neev`, commit both the HTML and the MP4" is still just two commits of muscle memory.
- **React integration layers video over SVG.** `components/work/reels.tsx` now renders both `<svg class="reel-fallback">` and `<video class="reel-video">` in the same parent. `app/globals.css` hides `.reel-video` under `@media (prefers-reduced-motion: reduce)` and `[data-motion="off"]`. `<video preload="none">` means motion-disabled users never pay bytes for the MP4; the poster WebP is the only cost, and it's proportional to the reel's visible footprint. Gating is pure CSS — no client component, no hydration cost.
- **Two variants per reel.** `variant="card"` resolves to `/video/work/<slug>.mp4` (600×400, 5s). `variant="hero"` resolves to `/video/work/<slug>-hero.mp4` (1600×900, 10s, lower opacity, longer cadence). `CaseStudyPage.tsx` + `CaseStudyStub.tsx` both pass `variant="hero"` so the detail-page band reads as an ambient header, not a loud widget.

## Consequences

**Good:**
- Each of the four case studies gets a 5s card reel + a 10s ambient hero band that extend the existing design vocabulary rather than replacing it. The SVG fallback is a literal port of the current placeholder, so motion-off users see exactly the same composition they see today.
- Render pipeline is fully local — `pnpm render:work` on a dev box, no HeyGen credentials or SaaS dependency. `npx hyperframes doctor` is the only self-check needed.
- `<video preload="none">` + CSS-only motion gate means the cost-of-motion is paid by the users who want it, not stamped on every page.
- One project per composition caps the blast radius of a broken timeline — a regression in `curat-money-hero` doesn't block shipping the Neev card.

**Costs:**
- Eight MP4s committed to the repo. Ballpark: card reels at 600×400 standard quality run ~200 KB, hero bands at 1600×900 run ~900 KB. ~4.5 MB total on disk, served from Vercel's CDN (not in the JS bundle, not counted against the 160 KB initial-script ceiling). Posters add ~15-40 KB each. Acceptable.
- Re-rendering eight compositions takes ~3-5 minutes on a dev box (headless Chrome seek + FFmpeg encode). Not a CI-critical path, but it's the cost of a composition edit.
- Token drift risk — `scripts/hyperframes/shared/tokens.css` duplicates a subset of `app/globals.css:root`. Flagged in the file header; the subset is small enough that a quarterly audit catches drift.
- Bundle-budget pressure from gsap on the composition side does not touch the main site bundle (compositions ship only the CDN copy inside the render sandbox). Already-present `gsap` in `package.json` is a Phase-5 reservation that continues to tree-shake out of the live site.

**Risks:**

- **R1 — HyperFrames CLI API drift.** The OSS CLI is young and the `render`/`browser ensure`/`doctor` subcommand shapes could shift in a minor version. **Mitigation:** `scripts/hyperframes/render-all.mjs` is a thin wrapper around the documented subcommands; a breaking change is a small patch in one file. Telemetry + update checks are disabled via `HYPERFRAMES_NO_TELEMETRY=1` + `HYPERFRAMES_NO_UPDATE_CHECK=1` so a published update doesn't silently change render output.
- **R2 — Browser-autoplay regression.** Safari and some Chrome flavours tighten autoplay rules periodically. `<video autoplay muted loop playsInline>` is the current supported combination and matches the Chrome MDN guidance as of April 2026. If a future policy blocks silent loops even on `muted`, the `.reel-video` CSS gate lets us fall back to the SVG floor without code churn — just toggle `<video>` off entirely in the component.
- **R3 — SVG ↔ MP4 visual drift.** The MP4s are an extension of the SVG vocabulary, not a literal first-frame match. If a composition drifts (different palette, different node positions) the CSS-hidden SVG fallback won't match what motion-on users see. **Mitigation:** `scripts/hyperframes/<slug>/index.html` carries the same coordinates + colour tokens as the SVG floor. A quarterly visual diff pass against `components/work/reels.tsx` is added to `docs/CHANGELOG.md` if drift surfaces.

## Alternatives considered

- **Lottie JSON from Figma/After Effects.** Designer-authored JSON imported via `lottie-web` or `@lottiefiles/react-lottie-player`. Rejected: designer dependency we don't have today, second design system to maintain, ~60 KB runtime added to every case-study page even when motion is off.
- **Framer Motion + React `<motion.svg>` at runtime.** Keeps everything in React, reuses our existing FM dep. Rejected: live animation cost on every page load, sticky-positioned reels on desktop would fight the R3F canvas + Wanderer for main-thread frames, no clean reduced-motion path when multiple FM scenes share the page.
- **Rive scenes.** Similar to Lottie — good runtime, designer-authored, wrong constraint: we're writing the compositions ourselves in HTML/SVG already, and Rive files can't be code-reviewed in the PR-diff sense.
- **Pre-rendered with Remotion.** Technically the closest fit (React-native, FFmpeg-backed, MP4 output). Rejected as a heavier solution than we need: Remotion forces a full React + Webpack render pipeline per composition, when a 600×400 5s GSAP timeline in static HTML is 80% of Remotion's surface. If a future composition needs MDX-driven content, Remotion is the right next step.

## Implementation

- `scripts/hyperframes/` — project layout per README
- `scripts/hyperframes/shared/{tokens,base}.css` — mirrored tokens + composition-level helpers
- `scripts/hyperframes/<slug>/{index.html,hyperframes.json}` — one project per composition, eight total
- `scripts/hyperframes/render-all.mjs` — orchestrator; wraps `npx hyperframes render` + ffmpeg `+faststart` pass
- `scripts/hyperframes/generate-posters.mjs` — pulls frame @ t=0.5s as WebP
- `package.json` scripts — `render:work` + `render:posters`
- `components/work/reels.tsx` — video+SVG stacking, `variant: 'card' | 'hero'` prop
- `components/work/CaseStudyPage.tsx` + `components/sections/CaseStudyStub.tsx` — pass `variant="hero"`
- `app/globals.css` — `.reel-video` positioning + motion gating rules
