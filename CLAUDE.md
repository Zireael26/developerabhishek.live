# akaushik.org

Personal portfolio site. Next.js 16 + React 19 + Tailwind 4 + Three.js / Framer Motion for motion work. Domain history: this repo lived under `developerabhishek.live` until 2026-04-20; canonical is now `akaushik.org` (`akaushik.dev` redirects). Decision in `docs/adr/0003-domain-and-canonical-url.md`. Directory + GitHub repo rename landed 2026-04-24; on-disk path and remote are both `akaushik.org` now.

---

## Parent rules

Inherit the full Trellis rule set:

@/Users/abhishek/projects/trellis-instance/core-rules/CLAUDE.md

Everything below is **project-specific** and extends the parent. If a rule below conflicts with the parent, the parent wins — raise the conflict with me instead of working around it.

---

## Project-specific notes

### Stack quirks worth knowing
- Next.js 16 with Turbopack (`next dev --turbo`). Some plugins lag behind.
- React 19 — use the new hooks (`use`, `useOptimistic`) when they fit; don't polyfill.
- Tailwind 4 — config lives in `postcss.config.mjs` + CSS imports, not `tailwind.config.js`.
- Three.js via `@react-three/fiber` + drei for the hero `AgentGraph`; raw `three` for any new 3D work (the Wanderer crane, currently disabled, uses raw three).
- No `framer-motion`, no `gsap`, no `lucide-react` in `package.json` — all three were dropped 2026-05-19 (PR-6 of gap-analysis plan, finding D3) because nothing in `app/`, `components/`, or `lib/` imported them. If new motion work needs a library, add it back with an ADR.

### Commands (pnpm — see `pnpm-lock.yaml`)
- `pnpm dev` — dev server with turbo.
- `pnpm typecheck` — `tsc --noEmit`. Stop hook auto-detects and runs this.
- `pnpm lint` — `eslint .`. Also auto-run by Stop hook.
- `pnpm test` — `vitest run`. Five `lib/*.test.ts` files; coverage thresholds in `vitest.config.ts`. Run via pre-push husky hook too.
- `pnpm test:coverage` — vitest with v8 coverage; thresholds 75/55/75 lines/branches/functions.
- `pnpm test:e2e` — Playwright. Requires `pnpm start` or `pnpm dev` on `:3000`.
- `pnpm process:check` — project-local process gate (`scripts/process-gate.mjs`). Keep green.

### EPM policy
- EPM artefacts under `docs/epm/` cover Phase-0-style scaffolding only (one file today: `EPIC-01-pixel-parity.md`). Per-phase narrative since Phase 1 lives in `docs/CHANGELOG.md`. **Backfill not required.** New EPMs only when a piece of work spans more than one subsystem and the CHANGELOG alone won't carry the planning shape.

### Working conventions
- Content lives in `src/content/` as MDX. Don't generate new MDX files without asking — each one is a deliberate editorial unit.
- `_reference/` is scratchpad/archive. Read-only in normal work.
- `HANDOFF.md` at repo root is the session-between-sessions log. If you wrote something there, read it first next session.

### Gotchas and context
- `gotchas.md` — lessons specific to this repo.
- `context-log.md` — maintained by `save-context-log` hook.
