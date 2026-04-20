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

- [ ] Hero section (01): taglines A/B/C, hero-facts DL, hero-scene (canvas + SVG fallback), marquee
- [ ] About (02), Work (03), Writing (04), Services (05), Process (06), In the open (07), Contact (08)
- [ ] The Wanderer Three.js companion — 8 POSES, pointer parallax, accent sync, reduced-motion fallback
- [ ] `tweaks.js` Claude Design iframe protocol (tagline / accent / mode / density / motion)
- [ ] Stats tile wired from `public/data/stats.json`

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

- [ ] Custom domain + HSTS
- [ ] Social cards + OG images
- [ ] Analytics (privacy-respecting: Plausible or Vercel Web Analytics)
- [ ] Announcement post
