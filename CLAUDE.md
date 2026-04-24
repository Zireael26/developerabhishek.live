# akaushik.org

Personal portfolio site. Next.js 16 + React 19 + Tailwind 4 + Three.js / Framer Motion for motion work. Domain history: this repo lived under `developerabhishek.live` until 2026-04-20; canonical is now `akaushik.org` (`akaushik.dev` redirects). Decision in `docs/adr/0003-domain-and-canonical-url.md`. The repo + directory rename happens post Phase-1 handoff; until then the on-disk path stays `developerabhishek.live` — do not assume otherwise.

---

## Parent rules

Inherit the full Software Engineering Core rule set:

@/Users/abhishek/projects/se-core/core-rules/CLAUDE.md

Everything below is **project-specific** and extends the parent. If a rule below conflicts with the parent, the parent wins — raise the conflict with me instead of working around it.

---

## Project-specific notes

### Stack quirks worth knowing
- Next.js 16 with Turbopack (`next dev --turbo`). Some plugins lag behind.
- React 19 — use the new hooks (`use`, `useOptimistic`) when they fit; don't polyfill.
- Tailwind 4 — config lives in `postcss.config.mjs` + CSS imports, not `tailwind.config.js`.
- Three.js via `@react-three/fiber` + drei. Heavy objects go in `src/scenes/`; components consume them via Suspense.

### Commands (pnpm — see `pnpm-lock.yaml`)
- `pnpm dev` — dev server with turbo.
- `pnpm typecheck` — `tsc --noEmit`. Stop hook auto-detects and runs this.
- `pnpm lint` — `next lint`. Also auto-run by Stop hook.
- `pnpm process:check` — project-local process gate (`scripts/process-gate.mjs`). Keep green.
- No `test` script yet. The weekly `test-health` audit will flag this as `no-test-configured` — add a minimal smoke test when the portfolio grows beyond a static shell.

### Working conventions
- Content lives in `src/content/` as MDX. Don't generate new MDX files without asking — each one is a deliberate editorial unit.
- `_reference/` is scratchpad/archive. Read-only in normal work.
- `HANDOFF.md` at repo root is the session-between-sessions log. If you wrote something there, read it first next session.

### Gotchas and context
- `gotchas.md` — lessons specific to this repo.
- `context-log.md` — maintained by `save-context-log` hook.
