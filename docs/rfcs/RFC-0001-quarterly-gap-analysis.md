# RFC-0001: Quarterly gap analysis as standard process

**Status:** Draft → awaiting operator sign-off
**Author:** Claude Code (autonomous execution of the 2026-05-19 gap-analysis plan)
**Date:** 2026-05-19
**Related:** `docs/gap-analysis-2026-05-19.md`, `docs/gap-analysis-2026-05-19-implementation-plan.md`, `docs/gap-analysis-2026-05-19-execution-summary.md`

## Context

The 2026-05-19 gap analysis surfaced 28 distinct findings, six of which were silently load-bearing — most notably:

- `mcp.json` advertising a non-existent `/api/mcp` endpoint to crawlers for ~4 weeks.
- `e2e/canvas.spec.ts` asserting against `#companion` (the Wanderer host) for 8 days after PR #58 removed `<Wanderer />` from `app/layout.tsx`. The assertions would fail — but **didn't** fire because the CI workflow was waiting on a Vercel preview URL that hadn't been emitted since 2026-04-24, so the e2e and Lighthouse jobs never ran.
- ~30 axe-core WCAG contrast violations on the home page, invisible because the same un-running CI gate.
- A 377 KiB script payload against a 200 KiB target, suppressed because the budget gate was `warn` not `error` and nobody was reading the lhci output.

Each individual finding is small. The pattern is that **regressions accumulate silently when the gate that's supposed to catch them is itself broken**. Lint, type checks, and process-gate ran on every PR; they kept the codebase legible but didn't catch the surface-level drift between docs and code.

The audit took ~6 hours end-to-end (four parallel explorers, plan write, six-PR execution). The cost is small enough that running it on a cadence is plausible.

## Proposal

Adopt a **quarterly gap analysis** as a standard project process, with the following shape:

### 1. Cadence

- **Trigger:** First Monday of each calendar quarter (Jan / Apr / Jul / Oct).
- **Owner:** The active maintainer runs (or commissions) one autonomous gap-analysis session per project per quarter. Projects with low velocity may skip on a per-quarter basis with a one-line `gap-analysis-status.md` note.
- **Out-of-band trigger:** Any of these forces an early audit: a CI pipeline change, a primary deploy-target change (Vercel → other), a directory / repo rename, a major-version dependency bump across more than three packages.

### 2. Method

Replicate the 2026-05-19 shape, codified:

- **Four parallel explorer agents** (single message, multiple `Agent` tool calls):
  1. Code-marker scan — TODO / FIXME / HACK / stub / placeholder / hardcoded / not-implemented / @ts-ignore / `test.skip` / `test.fixme`.
  2. Doc-vs-code audit — every doc in `docs/` + every primer in `.claude/primers/` checked against the code paths they reference. SHA pins verified reachable. ADR claims cross-referenced against current implementation.
  3. Code-surface inventory — full enumeration of routes, components, lib modules, content files, scripts, static assets, middleware behaviour, tests, package.json deps, CI workflows.
  4. Build/lint/test ground truth — run `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm process:check`. Read every config file. Identify loose gates (warn vs error, `test.fixme`, missing coverage thresholds, severity floors that don't match PRD targets).

- **Synthesis into a single dated gap report** at `docs/gap-analysis-YYYY-MM-DD.md` with this structure:
  1. Executive summary (2–3 paragraphs).
  2. Methodology (commands run + scope).
  3. Findings grouped into six categories: critical (misleading reality) / untracked debt / open ROADMAP items / doc drift / loose quality gates / process hygiene.
  4. Prioritised implementation plan (P0 / P1 / P2 with size estimates).
  5. Out-of-scope (owner-only).
  6. Raw counts appendix.

- **Plan document** at `docs/gap-analysis-YYYY-MM-DD-implementation-plan.md` capturing PR-by-PR file-level intent, verification commands, acceptance criteria, risks. **This document is the contract for autonomous execution.**

- **Execution summary** at `docs/gap-analysis-YYYY-MM-DD-execution-summary.md` written at the end — PR-by-PR receipts, findings closed, ROADMAP follow-ups created, owner handoff queue updates.

### 3. PR shape

Sequence the work into typed PRs:

1. `chore/gap-pN-cleanup` — misleading-artefact fixes. Cheap, high signal.
2. `chore/ci-runner-local` or equivalent — fix any gate-shaped CI that's broken (lest subsequent PRs land blind).
3. `perf/baseline-and-gates` — re-baseline budgets + flip warn→error on what passes.
4. `test/coverage-and-gates` — add unit + e2e for surfaces missing tests; arm a11y / accessibility gates.
5. `feat/<deferred-feature>` — close at most one deferred feature whose deferral is causing drift (`/api/docs` was the right example this quarter).
6. `chore/dep-and-docs-hygiene` — final cleanup: dead deps, dead files, primer refreshes, policy clarifiers.

The six-PR sequence is not mandatory. Some quarters yield only two PRs; some yield more. The key invariant: **every PR's branch CI must be green before the next opens.** Sequential merge, not parallel.

### 4. Operator interventions

The autonomous session asks for disambiguation **upfront** before drafting the plan, on no more than four questions:

1. Any feature whose deferred-vs-retired decision the agent cannot make.
2. Any CI/infra fix where the agent has multiple reasonable approaches.
3. Any pattern decision where the codebase has two valid examples (e.g., About copy direction).
4. PR cadence preference.

Owner-only items (URL acquisition, dashboard logins, account creates, prose edits) are explicitly carved out at the top of the plan and surfaced as `STATUS.md` handoff-queue entries, never silently attempted.

### 5. Success criteria

A gap-analysis cycle is "done" when:

- Every P0 finding is closed by a merged PR.
- P1 + P2 findings are either closed, explicitly deferred with a tracked ROADMAP line, or moved to the owner handoff queue.
- A dated execution summary exists with PR-by-PR receipts.
- The CI pipeline that was broken at the start (if any) is green at the end.
- `gotchas.md` carries any new lessons surfaced during execution.

## Alternatives considered

- **Ad-hoc audits when something feels off.** Cheap but reactive — the failure mode (silent drift) is precisely the case where "something feels off" doesn't fire.
- **Daily / weekly scheduled scans.** Higher cost; the corpus doesn't change that fast for a personal portfolio. Use the existing scheduled tasks (`seo-monthly-health`, `seo-redirect-health`) for surfaces with weekly cadence; reserve full gap analysis for the quarterly slot.
- **CI-only enforcement.** Tightening CI (PR-3 of this cycle) closes most regression paths. The gap-analysis run does what CI can't: cross-cut every doc, every primer, every config, every dependency — for an analysis horizon that the per-PR gates can't span.

## Consequences

**Adopting the cadence:**
- One ~6 hour autonomous session per quarter per project.
- Three new documents per cycle (`gap-analysis-*`, `…-implementation-plan`, `…-execution-summary`).
- Cleaner ROADMAP, fewer silently-rotten artefacts, better-aligned docs ↔ code.
- The execution summary becomes a public artefact under `/process` — visible proof of the discipline.

**Not adopting it:**
- Drift accumulates. The 2026-05-19 audit caught 28 findings over a 2-month window. A 6-month window plausibly yields ~80 findings, half of which compound into one larger problem (e.g., the CI-broken-for-4-weeks + axe-armed-but-failing chain that would have cost a half-day to undo if it had run another quarter).

## Open questions

- **Q1.** Should the gap-analysis run be invoked by a Trellis-level scheduled task (cron MCP) or by the operator typing `/gap-analysis`? Recommendation: operator-invoked. The execution is intensive; scheduling it without context risks running over real work.
- **Q2.** Does the cadence apply to every Trellis-registered project, or only to "active" ones? Recommendation: every active project; dormant projects auto-skip if no commits in the prior quarter.
- **Q3.** Should the four-explorer pattern be a Skill? It's reusable. Recommendation: yes — codify as `core-rules/skills/gap-analysis/SKILL.md` once two more projects run the cycle and the steps stabilise.

## References

- This RFC was authored as part of the autonomous execution of `docs/gap-analysis-2026-05-19-implementation-plan.md`.
- The exemplar artefacts are the three matched documents from the 2026-05-19 cycle:
  - `docs/gap-analysis-2026-05-19.md` (28 findings)
  - `docs/gap-analysis-2026-05-19-implementation-plan.md` (PR-by-PR contract)
  - `docs/gap-analysis-2026-05-19-execution-summary.md` (receipts)
