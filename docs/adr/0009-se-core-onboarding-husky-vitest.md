# ADR-0009: SE Core onboarding — simple-git-hooks → husky, add vitest smoke

Status: Accepted
Date: 2026-04-24

## Context

This project was running `simple-git-hooks` as its git-hook manager (`prepare: simple-git-hooks || true` in `package.json`, config `"simple-git-hooks": { "pre-commit": "pnpm process:check" }`). The SE Core fleet canonical is husky@9 (see `/Users/abhishek/projects/se-core/core-rules/hooks.md` §Tier-3 git-boundary). The 2026-04-24 `cross-project-process-audit` flagged this project as missing `.husky/` and not aligned with the SE Core hook stack.

Additionally the project had no fast unit-test suite (only `test:e2e: playwright test`), so the SE Core `stop-verify` hook had no suite to run on Claude-turn completion.

## Decision

Migrate to husky@9 for git hooks, preserving the existing `process:check` gate:

1. Replace `prepare: simple-git-hooks || true` → `prepare: husky`. Remove `simple-git-hooks` devDep and top-level config key.
2. Install SE Core canonical `.husky/{pre-commit, commit-msg, pre-push}` (pm-agnostic scripts that detect lockfile and degrade gracefully on missing tools). Append `pnpm process:check` to `.husky/pre-commit` as a project-specific extension — the gate defined in ADR-0002 continues to run, just under husky instead of simple-git-hooks.
3. Add `vitest@^4.1.5` + `"test": "vitest run"` + a root-level `smoke.test.ts` so `stop-verify` and the new `.husky/pre-push` have a suite to run.
4. `.husky/pre-push` includes the SE Core PR-flow guard that blocks direct push to `main`/`master`. Emergency override: `SE_CORE_ALLOW_MAIN_PUSH=1 git push`.

## Consequences

- Single source of truth for git hooks across the SE Core fleet.
- ADR-0002 process-gate policy is unchanged — the gate still fires, just under husky.
- Branch-protection on GitHub is not yet configured (sole-maintainer org on GitHub Free — self-approval not available). The local `.husky/pre-push` guard is the primary enforcement until branch protection is added.
- `pnpm test` now runs a real (trivial) suite instead of failing with "no test specified". Expanding the suite is a separate piece of work.
