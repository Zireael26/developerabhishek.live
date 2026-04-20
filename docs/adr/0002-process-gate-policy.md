# ADR 0002 — Process-gate policy and git-hook tool

**Status:** Accepted · 2026-04-20
**Supersedes:** — (extends the engineering process spelled out in PRD §7 and HANDOFF §9)

## Context

HANDOFF §9 requires the portfolio to ship with a tgsc-style process discipline:
every non-trivial change carries an ADR (for decisions), an EPM (for
cross-subsystem work), a ROADMAP entry, a CHANGELOG entry, and passes
`pnpm process:check`. The scaffold landed a stub at `scripts/process-gate.mjs`
that exited 0 unconditionally — useful as a placeholder, useless as a gate.

Two decisions are bundled here because they are inseparable:

1. **What the gate actually enforces.** A policy vague enough to not bite
   is just another comment. A policy strict enough to enforce discipline
   has to be testable against a staged diff.
2. **How the gate runs automatically.** A check that developers remember
   to run is not a check. The project needs a pre-commit hook.

## Decision

### D1. Process-gate policy (implemented in `scripts/process-gate.mjs`)

Three rules, each keyed off the staged file set:

| # | When staged paths match | Required companion |
| - | --- | --- |
| R1 | `app/**`, `components/**`, `lib/**`, `scripts/**`, `content/**` | `docs/CHANGELOG.md` must be staged |
| R2 | `next.config.*`, `middleware.ts`, `proxy.ts`, `package.json`, `tsconfig.json`, `eslint.config.*` | `docs/adr/NNNN-*.md` (new or modified) **or** `docs/CHANGELOG.md` | 
| R3 | `docs/epm/**` | `docs/ROADMAP.md` must be staged |

Rationale per rule:

- **R1** — code changes without a CHANGELOG entry rot the history. The
  CHANGELOG is the outward-facing record; we treat it as a first-class
  release asset, not a generated artifact.
- **R2** — structural / dependency / config churn is exactly the kind of
  change a future reader asks "why" about. Either write the ADR (for
  load-bearing decisions) or note the change in the CHANGELOG with an
  ADR reference (for mechanical bumps that are implied by an earlier
  ADR, e.g. patch bumps of pinned stack deps).
- **R3** — EPMs are plans; the ROADMAP is the public index of plans.
  New EPM, new ROADMAP line.

The gate **does not** enforce that a commit touches a new ADR — that is
too strict. It enforces that the staged diff includes *some* documented
trail. The reviewer is still the ultimate gate.

Bypass: `SKIP_PROCESS_GATE=1 git commit …` — logged to stderr. For
emergency hotfix only; reviewer must flag any bypassed commit in PR
review.

### D2. Git-hook tool: `simple-git-hooks`

Chosen over `husky`.

- **Why `simple-git-hooks`:** one dev-dependency, no runtime, hooks are
  declared as a single map in `package.json`, applied on `pnpm install`
  via a `prepare`/`postinstall` lifecycle. No `.husky/` subdirectory to
  maintain. Matches the "no silent additions" norm from HANDOFF §3
  — the dependency is listed, the config is one place, no magic.
- **Why not `husky`:** the .husky/ directory layout is conventional but
  adds a second source of truth (shell scripts per hook vs. one map).
  For a single pre-commit hook we don't need the flexibility.

Wiring (to land with Phase 1's first code PR, not in this grounding PR):

```jsonc
// package.json
{
  "devDependencies": { "simple-git-hooks": "^2.11.0" },
  "scripts": {
    "prepare": "simple-git-hooks || true"
  },
  "simple-git-hooks": {
    "pre-commit": "pnpm process:check"
  }
}
```

The `|| true` on `prepare` keeps CI / fresh-clone installs green in
environments that run `pnpm install` outside a git working tree.

## Consequences

- **Positive.** Every commit has enforced doc hygiene. The CHANGELOG
  stays usable as a release note. ADR churn is visible in git log.
- **Negative.** Small commits (docs-only, typo fixes) will sometimes
  require a CHANGELOG entry that feels like ceremony. Acceptable tax
  for the signal.
- **Neutral.** The policy is a JS file; lint it like any other script.
  The rules can evolve in a followup ADR without re-wiring.

## Alternatives considered

- **tgsc's exact gate script, copy-pasted.** Rejected: tgsc is not
  vendored here and a copy would drift. We mirror the *policy*, not
  the bytes.
- **A YAML policy file consumed by a generic runner.** Rejected: two
  moving parts where one suffices. The JS gate reads a staged diff and
  emits a decision — inlining the rules in JS is simpler.
- **GitHub Action check instead of a pre-commit hook.** Rejected as the
  *only* enforcement — too late. Useful as a belt-and-suspenders layer
  added during Phase 3 CI work.
- **`husky`.** Rejected per D2 above.

## Followups

- Phase 1 first code PR wires `simple-git-hooks` into `package.json` and
  adds the `prepare` script. That PR gets its own ADR only if the wiring
  reveals something surprising; otherwise a CHANGELOG entry cross-linking
  this ADR suffices.
- Phase 3 adds the same `pnpm process:check` invocation to CI so
  branches that bypassed the hook locally are caught before merge.
