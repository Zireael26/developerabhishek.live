# Roadmap

A living document. Phases are ordered by dependency, not calendar. Each phase is a set of one-PR slices; the site is deployable at every milestone.

## Phase 0 — Scaffold

- [x] Archive SvelteKit at `legacy-v1-final`
- [x] Next.js 16.2 + Tailwind 4.2 scaffold
- [x] Agent-readiness scaffold (`llms.txt`, `/.well-known/*`, Link headers)
- [x] `pnpm install && pnpm typecheck && pnpm lint && pnpm build` run clean
- [x] Process-gate policy codified — ADR-0002 / `scripts/process-gate.mjs`
- [x] EPIC-01 (pixel parity) written — `docs/epm/EPIC-01-pixel-parity.md`
- [x] Vercel preview green

> Phase 1 tracked in `docs/epm/EPIC-01-pixel-parity.md`.

## Phase 1 — Pixel parity

- [x] Hero (01): taglines A/B/C, hero-facts DL, static SVG agent-graph scene, marquee
- [x] About (02) — portrait placeholder + bio + meta rows
- [x] Work (03) — four case cards + stub detail pages
- [x] Writing (04) — post list (replaced with real MDX in Phase 2)
- [x] Services (05) — three engagement shapes
- [x] Process (06) — inverted block + artifact list
- [x] In the open (07) — GitHub stats sparkline + contribution number
- [x] Contact (08) — CTA + link DL
- [x] Wanderer SVG fallback + `#companion` mount wiring (R3F full port reseq'd to Phase 5.1c)
- [x] TweakBridge dev panel — Claude Design iframe protocol (tagline / accent / mode / density / motion)
- [x] Stats tile wired from `public/data/stats.json`

## Phase 2 — Content fill

- [x] MDX infrastructure (`lib/content.ts`, `next-mdx-remote@6`, Shiki, ADR-0004)
- [x] Neev case study (hero)
- [x] VeriCite case study (AI-systems depth)
- [x] Bluehost agents — permanent stub (confidentiality framing)
- [x] curat.money case study (product-breadth framing)
- [x] About long-form prose in section (full edit pending Abhishek's pass)
- [x] Services + Process copy ported
- [x] Writing seeds × 3 (micrograd, MSME, fastembed → TEI)

## Phase 3 — Engineering polish

- [x] CI pipeline (verify + test + audit workflows on every PR)
- [x] ADRs written for every decision in Phase 0–2
- [x] Axe-core + Lighthouse CI + Playwright smoke tests wired (ADR-0005)
- [x] `pnpm build` under 60s, bundle budget tracked (`docs/BUNDLE_BUDGET.md`)
- [x] Phase 3 review follow-ups — mobile Lighthouse, budget doc alignment, iPhone SE viewport

## Phase 4 — Agent readiness

- [x] `sitemap.ts` + `robots.ts` (Content-Signal directive) + correct Link headers per RFC 8288
- [x] `/llms-full.txt` route handler (full corpus concatenation)
- [x] `.md` alternates + content negotiation Pattern A + Pattern B (ADR-0006)
- [x] RFC 9727 API Catalog + OpenAPI 3.1 + JSON listings (`/api/writing`, `/api/case-studies`)
- [x] Agent Skills `SKILL.md` + digest prebuild
- [x] Phase 4 review follow-ups — middleware rewrites carry Link header, rel URIs corrected, home Accept negotiation, content-negotiation E2E spec
- [ ] MCP server implementation at `/api/mcp` (deferred to v1.1 per plan default)

## Phase 5 — Launch

- [x] R3F 9 + drei 10 bump — React 19 peer warnings cleared (ADR-0007)
- [x] Hero R3F canvas — agent-graph live scene (4 nodes, rings, labels, edges, packets, pointer parallax)
- [x] Wanderer full Three.js port — 8 POSES, IntersectionObserver dispatch, damp lerp, scroll-velocity rotation, accent sync, 80ms WebGL bail-out
- [x] OG images via `next/og` — home + per case study + per writing post
- [x] Cloudflare Web Analytics beacon (token-gated, cookieless)
- [x] Head `<link>` tags synced to middleware Link header shape
- [x] Launch announcement post (`content/writing/building-this-portfolio.mdx`)
- [x] Canvas + Wanderer Playwright smoke (`e2e/canvas.spec.ts`)
- [x] Phase 5 review follow-ups — ROADMAP ticks, launch-post URLs, runtime reduced-motion gates, theme-toggle flicker fix

## Post-launch (honest open items)

- [ ] Calendly / Cal.com URL wired into Contact ghost button (currently `href="#"`)
- [ ] Portrait photo swap (`/images/abhishek.webp`, 4:5) — SVG placeholder today
- [~] Case-study reel MP4s — HyperFrames scaffold + 8 compositions + React integration landed (ADR-0008); remaining work is the render pass (`pnpm render:work && pnpm render:posters`) + committing `public/video/work/*.{mp4,webp}`. Blocked in-sandbox on FFmpeg/Chrome availability; runs cleanly on a local dev box
- [ ] `isitagentready.com` scan against prod + dated PNG into `docs/agent-readiness-snapshots/`
- [ ] `pnpm analyze` Phase-5 bundle audit — update `docs/BUNDLE_BUDGET.md` with measured initial JS, tighten `lighthouserc.yml` ceiling back toward 150 KiB target (currently 200 KiB `warn`)
- [ ] Lighthouse category thresholds — flip to `error` severity at PRD §5 targets (0.95 / 1.0 / 0.95 / 1.0) once first prod numbers are in
- [ ] `/api/docs` human-readable page rendering the OpenAPI spec (deferred with note in Phase 4.4 PR)
- [ ] MCP server for v1.1 — `/api/mcp` with `lookup_case_study` + `get_availability` tools
- [ ] Abhishek's edit pass on `About.tsx` prose + case-study honest-scope paragraphs + curat.money framing check
- [ ] Directory + repo rename `developerabhishek.live` → `akaushik.org`; flip repo visibility to public; Cloudflare Email Routing for `hello@akaushik.org`; legacy-domain 308 via `vercel.json`; social-bio sync
