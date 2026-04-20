# Roadmap

A living document. Phases are ordered by dependency, not calendar. The goal is shippable vertical slices at each phase boundary — the site is deployable at every milestone.

## Phase 0 — Scaffold · (current)

- [x] Archive SvelteKit at `legacy-v1-final`
- [x] Next.js 16.2 + Tailwind 4.2 scaffold
- [x] Agent-readiness scaffold (`llms.txt`, `/.well-known/*`, Link headers)
- [x] `pnpm install && pnpm typecheck && pnpm lint && pnpm build` run clean (local — Abhishek to verify `pnpm dev` on his machine)
- [x] Process-gate policy codified — ADR-0002 / `scripts/process-gate.mjs`
- [x] EPIC-01 (pixel parity) written — `docs/epm/EPIC-01-pixel-parity.md`
- [ ] Vercel preview green

> Phase 1 tracked in `docs/epm/EPIC-01-pixel-parity.md`.

## Phase 1 — Pixel parity with the Claude Design reference

- [x] Hero section (01): taglines A/B/C, hero-facts DL, static SVG agent-graph scene, marquee
- [ ] About (02), Work (03) w/ stub detail pages, Writing (04), Services (05), Process (06), In the open (07), Contact (08)
- [ ] The Wanderer — SVG fallback + `#companion` mount wiring (r3f full port reseq'd to Phase 5)
- [ ] `tweaks.js` Claude Design iframe protocol (tagline / accent / mode / density / motion)
- [ ] Stats tile wired from `public/data/stats.json`

> Reseq note (2026-04-20): the Hero Three.js canvas and the Wanderer r3f
> full port move to Phase 5 Slices 5.1b/5.1c. Rationale is bundle-budget
> stability and decoupling pixel parity from the R3F 9 + drei 10
> peer-dep bump. Slice 1.9 ships the SVG-only Wanderer mount so every
> `[data-companion-pose]` anchor is live during Phases 2–4.

## Phase 2 — Content fill

- [ ] Port the four case studies (Neev, VeriCite, Bluehost Agents, curat.money) as MDX
- [ ] About long-form + short-form variants (see `docs/BIO_DRAFT.md`)
- [ ] Services + Process copy
- [ ] In the open: writing seeds + GitHub activity surface

## Phase 3 — Engineering polish

- [ ] Process-gate policy codified (ADR/ROADMAP/EPM/CHANGELOG required on substantive changes)
- [ ] ADRs back-filled for each decision from Phase 0–2
- [ ] Axe-core, lighthouse-ci, and Playwright smoke tests in CI
- [ ] `pnpm build` ≤ 60s, bundle budget set

## Phase 4 — Agent-readiness compliance

- [ ] Pass `isitagentready.com` scan across all four dimensions
- [ ] Populate agent skill SKILL.md files + digests
- [ ] MCP server implementation at `/api/mcp`
- [ ] `api-catalog` wired

## Phase 5 — Launch

- [ ] R3F 9 + drei 10 bump (ADR) — resolves React 19 peer warnings
- [ ] Hero Three.js canvas port (agent-graph live scene) — reseq'd from Phase 1
- [ ] Wanderer r3f full port — 8 POSES, IntersectionObserver lerp, pointer parallax, accent sync, WebGL bail-out
- [ ] OG images via Next.js ImageResponse (home, case studies, writing posts)
- [ ] Custom domain + HSTS
- [ ] Analytics (privacy-respecting: Plausible or Vercel Web Analytics)
- [ ] Announcement post
