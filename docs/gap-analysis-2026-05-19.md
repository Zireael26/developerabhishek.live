# Gap analysis — akaushik.org — 2026-05-19

**Author:** Claude Code (multi-agent scan)
**Scope:** all docs, plans, PRDs, primers, code, configs, CI, tests
**Method:** four parallel explorers — code-marker scan, doc-vs-code audit, code-surface inventory, build/lint/test ground-truth — then synthesis.

---

## 1 · Executive summary

The portfolio shipped through Phase 5. The PRD and ROADMAP describe an honest set of post-launch open items, and most of that list is still open. Beyond those known items, the audit surfaces a smaller but more important class of drift: **artifacts that claim or imply a feature is live when the code disagrees** (the Wanderer crane is checked-in but commented out; `mcp.json` advertises an endpoint that 404s; the editorial calendar primer points at a file that doesn't exist; `BUNDLE_BUDGET.md` is pre-Phase-5). The quality gates that should catch regressions are largely declared but not enforced — Lighthouse thresholds are `warn`, the axe-core a11y test is `test.fixme`, and the entire unit-test suite is `expect(1+1).toBe(2)`.

None of this is shipping-broken. All of it is the kind of slow rot that turns a "process as proof" site into a "process as theatre" site, which is precisely the failure mode the PRD's G3 ("be a live proof point") is supposed to prevent.

There are 28 distinct findings below, grouped into 6 categories and prioritised P0–P2 in §4.

---

## 2 · Scope and methodology

### 2.1 Inputs read
- `docs/PRD.md`, `docs/ROADMAP.md`, `docs/HANDOFF_HYPERFRAMES.md`, `docs/AGENT_READINESS.md`, `docs/CASE_STUDIES_OUTLINE.md`, `docs/BIO_DRAFT.md`, `docs/DESIGN_DIRECTION.md`, `docs/BUNDLE_BUDGET.md`, `docs/CHANGELOG.md`, `HANDOFF.md`, `README.md`, `gotchas.md`, `context-log.md`
- All 10 ADRs in `docs/adr/`
- `docs/epm/EPIC-01-pixel-parity.md`
- All files in `docs/seo/`
- All 7 primers in `.claude/primers/`
- Every TypeScript file under `app/`, `components/`, `lib/`, `scripts/`
- Every MDX file under `content/`
- All configs: `next.config.ts`, `middleware.ts`, `tsconfig.json`, `eslint.config.js`, `lighthouserc{,mobile}.yml`, `vercel.json`, `vitest.config.ts`, `playwright.config.ts`, `package.json`
- Every test file in `e2e/` + `smoke.test.ts`
- All workflows in `.github/workflows/`

### 2.2 Commands run
- `pnpm typecheck` — PASS (zero type errors)
- `pnpm lint` — FAIL (772 problems — **all** from stale `.next/` build artefacts inside `.claude/worktrees/`; zero from source)
- `pnpm process:check` — PASS (no staged changes)
- `pnpm test` — PASS (7 tests, all 7 are copies of `smoke.test.ts`'s `expect(1+1).toBe(2)`)

### 2.3 Not run
`pnpm build` (slow), `pnpm dev` (manual visual verify), `pnpm test:e2e` (needs running server / Vercel preview), `pnpm analyze` (slow + the ROADMAP-open item itself).

---

## 3 · Findings

### 3.1 Critical — artifacts that misrepresent reality

These are the highest-signal gaps: external readers (agents, crawlers, future-you) act on these surfaces and get misled.

| # | Finding | Evidence |
|---|---|---|
| **C1** | `public/.well-known/mcp.json` advertises `"endpoint": "https://akaushik.org/api/mcp"` with `"tools": []` and `"version": "0.0.0"`. No `app/api/mcp/` route exists. Any MCP-aware agent that discovers this file gets a 404. | `public/.well-known/mcp.json:*` + absence of `app/api/mcp/route.ts`; ROADMAP line 81 marks `/api/mcp` deferred |
| **C2** | The Wanderer crane was disabled in PR #58 (merged 2026-05-11): `<Wanderer />` is commented out at `app/layout.tsx:120` behind a `TODO: temporarily disabled` comment, and the import at line 6 is similarly commented out. The `#companion` host div + SVG fallback no longer render on the live site. **But `e2e/canvas.spec.ts` was not updated to match.** Lines 47–48 unconditionally assert `await expect(page.locator('#companion')).toBeAttached()` and `await expect(page.locator('#companion .companion-svg')).toBeAttached()` — these would **fail** against the live build. The reason CI has not caught it is C2-b below: Vercel GitHub auto-deploy has been broken since 2026-04-24 (per PR #58 description), so the `e2e.yml` workflow that waits on `*.vercel.app` for a preview URL has not been getting one — tests time out or do not run. ROADMAP Phase 5 still marks the Wanderer port `[x]`; the `wanderer-crane-scene` primer describes the scene as live. | `app/layout.tsx:6,119–120`; `docs/ROADMAP.md:64`; `.claude/primers/wanderer-crane-scene.md`; `e2e/canvas.spec.ts:47–48`; PR #58 body |
| **C2-b** | Vercel GitHub auto-deploy is broken (per PR #58 body, since cd559de on 2026-04-24, fixed only by `vercel deploy --prod` from the maintainer). Consequence: `.github/workflows/e2e.yml` polls for a preview URL for up to 10 minutes and then either fails or silently no-ops; `lighthouse.yml` (same preview dependency) is in the same state. No agent-readiness / e2e / lighthouse signal has been gating PRs for ~4 weeks. | PR #58 body; `.github/workflows/e2e.yml` (relies on `*.vercel.app` URL in PR comments) |
| **C3** | `docs/seo/STATUS.md §2` canonical NAP block has TODO placeholders in every `sameAs` URL (`<handle>`, `Q<id>`) and lists `photo_url: https://akaushik.org/images/abhishek.jpg` — the actual portrait is at `/images/about/abhishek.webp`. The scheduled `seo-drift-monitor` task will compare prod against a broken record and either misreport drift or pass vacuously. | `docs/seo/STATUS.md:54–63` |
| **C4** | `gotchas.md` is effectively empty (one stale line from 2026-04-24). CLAUDE.md requires lessons logged as they happen. Six months of build work — including the Wanderer disable, the 80ms WebGL bail-out removal, the hero SVG bleed-through, the mobile reorder bug, and the `stats.json` null-widening — are all captured in CHANGELOG but not promoted to `gotchas.md`, where the next session's primer-load will see them. | `gotchas.md` (3 lines); `docs/CHANGELOG.md` 2026-04-22 → 2026-05-11 entries |
| **C5** | `smoke.test.ts` is the entire vitest unit suite: `expect(1 + 1).toBe(2)`. CLAUDE.md notes the `test-health` audit will flag this as `no-test-configured`. The site has hand-rolled YAML frontmatter parsing, reading-time calculation, JSON-LD graph builders, MDX option assembly, and a content-negotiation middleware — none have a unit test. | `smoke.test.ts:3–5`; `lib/content.ts` + `lib/reading-time.ts` + `lib/structured-data.ts` + `middleware.ts` (no companion `.test.ts`) |

### 3.2 Untracked debt in the shipped surface

| # | Finding | Evidence |
|---|---|---|
| **D1** | `lib/about-copy.ts` claims to be the source of truth for About prose ("Phase 2.2 will replace bodyMarkdown with Abhishek's edited version once that lands"). It is consumed by `/llms-full.txt` only. `components/sections/About.tsx` renders its prose as literal JSX, so the human-facing About and the agent-facing About have **already drifted**, and any future edit to one will not propagate to the other. | `lib/about-copy.ts:5` + `app/llms-full.txt/route.ts` + `components/sections/About.tsx` |
| **D2** | `components/ui/ArrowLink.tsx` is exported and styled but never imported anywhere outside its own file. Dead module. | `components/ui/ArrowLink.tsx` + grep returns one self-hit |
| **D3** | Three production dependencies declared in `package.json` are not imported in any source file: `lucide-react` (^0.460.0), `gsap` (^3.13.0), `framer-motion` (^12.18.1). All three sit in `dependencies` (not `devDependencies`) and contribute to install/audit surface. | `package.json:25–40` |
| **D4** | `public/video/writing/` holds 4 writing-post loops. There is no spec doc, no composition source in `scripts/hyperframes/`, and no ADR for them. They exist solely by virtue of a 2026-05-11 CHANGELOG restore entry. `trellis.mdx` and `best-practices-into-trellis.mdx` have no loop in `WRITING_LOOPS` or in `public/video/writing/`. | `public/video/writing/`; `components/media/hyperframes-loop.tsx`; `docs/CHANGELOG.md` 2026-05-11 |
| **D5** | `components/sections/Process.tsx` lists six process artefacts with `href="#"` — every link is a placeholder. The Process section is a credibility surface aimed at the senior-buyer audience (PRD §4.2). | `components/sections/Process.tsx` |
| **D6** | `app/writing/page.tsx:30–33` empty-state copy reads "Drafting in the open. First posts land alongside the Phase-2 content push." Six posts exist; the branch is unreachable in practice. The text reads as a Phase-1 carry-over; the empty-state will not be hit again unless every post is removed. | `app/writing/page.tsx:30–33` |
| **D7** | `components/sections/CaseStudyStub.tsx:46–49` body text references Phase 2 as the place the missing content will arrive. Phase 2 shipped four months ago; for the slug where this stub is permanent (`bluehost-agents` — and only this slug renders the stub today), the framing should drop the phase reference. | `components/sections/CaseStudyStub.tsx:46–49` |

### 3.3 ROADMAP open items still open

These are documented honestly in `docs/ROADMAP.md` "Post-launch (honest open items)" — listed here so the implementation plan in §4 has them in one place.

| # | Finding | Evidence |
|---|---|---|
| **R1** | Calendly / Cal.com URL for the Contact "Book a 20-minute call" button is `href="#"`. | `components/sections/Contact.tsx:61`; `docs/ROADMAP.md:74` |
| **R2** | Portrait photo swap — the photo is on disk at `public/images/about/abhishek.webp` (768×960), but **the path in `docs/ROADMAP.md:75` says `/images/abhishek.webp`** (wrong directory). Same drift pattern as C3 (`docs/seo/STATUS.md §2` `photo_url`). Code is correct; both docs cite the wrong location. Fix: tick the ROADMAP line `[x]`, correct the path to `/images/about/abhishek.webp`, and align `STATUS.md §2 photo_url` to the same value. | `public/images/about/abhishek.webp`; `docs/ROADMAP.md:75`; `docs/seo/STATUS.md:54` |
| **R3** | `isitagentready.com` scan against prod + dated PNG into `docs/agent-readiness-snapshots/` — directory does not exist. | `docs/ROADMAP.md:77`; absence of `docs/agent-readiness-snapshots/` |
| **R4** | `pnpm analyze` Phase-5 bundle audit + `docs/BUNDLE_BUDGET.md` update. The doc is dated 2026-04-20 (pre-R3F-canvas, pre-Wanderer); the audit has not been re-run. | `docs/BUNDLE_BUDGET.md:1`; `docs/ROADMAP.md:78` |
| **R5** | Lighthouse category thresholds — both `lighthouserc.yml` and `lighthouserc.mobile.yml` are `warn` for every category. PRD §7 implies hard gates (0.95 / 1.0 / 0.95 / 1.0). | `lighthouserc.yml:18–21`; `lighthouserc.mobile.yml:18–21`; `docs/ROADMAP.md:79` |
| **R6** | `/api/docs` human-readable OpenAPI page deferred. No `app/api/docs/` route. | `docs/ROADMAP.md:80`; absence of `app/api/docs/` |
| **R7** | MCP server `/api/mcp` deferred — see C1 above. The deferral is acceptable; the misleading `mcp.json` is not. | `docs/ROADMAP.md:81` |
| **R8** | Abhishek's edit pass on `About.tsx` prose + case-study honest-scope paragraphs + curat.money framing — see D1 above for the structural part. | `docs/ROADMAP.md:82`; `lib/about-copy.ts:5` |

### 3.4 Doc-vs-code drift (not load-bearing, but rotting)

| # | Finding | Evidence |
|---|---|---|
| **S1** | `README.md` still says "This repository is mid-rewrite. The prior SvelteKit build is archived…" The rewrite shipped. README should describe the live site. | `README.md` |
| **S2** | `HANDOFF.md` line 3 + `docs/HANDOFF_HYPERFRAMES.md` line 1 reference `~/projects/personal/developerabhishek.live/` as "today's" repo path. The rename to `akaushik.org` shipped 2026-04-24 per CHANGELOG. Acceptable for historical handoff docs but worth a one-line "superseded by directory rename" note. | `HANDOFF.md:3`; `docs/HANDOFF_HYPERFRAMES.md:1`; `docs/CHANGELOG.md` 2026-04-24 |
| **S3** | `docs/AGENT_READINESS.md §7` implementation map lists `app/robots.ts` as the robots route. Reality: `app/robots.txt/route.ts` (Route Handler form). The implementation works; the doc cite is wrong. | `docs/AGENT_READINESS.md §7`; `app/robots.txt/route.ts` |
| **S4** | `docs/adr/0002-process-gate-policy.md` says simple-git-hooks; reality is husky per ADR-0009. ADR-0009 cross-references 0002 correctly; ADR-0002 was never updated with a "Superseded-by" note. | `docs/adr/0002-process-gate-policy.md`; `docs/adr/0009-se-core-onboarding-husky-vitest.md` |
| **S5** | `lighthouserc.yml:27` comment references "(Phase 6) the target pulls back to 160 KiB." No Phase 6 exists in ROADMAP. Either define Phase 6 or drop the comment. | `lighthouserc.yml:27`; `docs/ROADMAP.md` |
| **S6** | `.claude/primers/seo-strategy.md` references `docs/seo/editorial-calendar.md` ("seeded by `seo-weekly-draft` first run"). The file does not exist. Either ship the calendar or update the primer to clarify it appears once the cron-task runs. | `.claude/primers/seo-strategy.md`; absence of `docs/seo/editorial-calendar.md` |
| **S7** | `docs/seo/STATUS.md` Phase 0 human handoff steps are all unchecked: Vercel 301 for `developerabhishek.live` and `akaushik.dev`, GSC Change of Address, Wikidata creation, profile NAP sync. Either action them or de-scope. | `docs/seo/STATUS.md` Phase 0 |

### 3.5 Quality gates that don't gate

| # | Finding | Evidence |
|---|---|---|
| **Q1** | `eslint.config.js` has no `ignores:` entry for `.claude/worktrees/*/.next/`. `pnpm lint` from the repo root currently reports 676 errors + 96 warnings, **all** from stale worktree build artefacts. Day-to-day this silences real signal — anyone seeing 772 noise problems will stop reading lint output. | `eslint.config.js`; lint run output |
| **Q2** | Both Lighthouse configs use `warn` severity for every assertion (see R5). | `lighthouserc.yml`; `lighthouserc.mobile.yml` |
| **Q3** | `e2e/home.spec.ts` line ~52: `test.fixme` on the axe-core WCAG violations test. The a11y regression gate is silently off. PRD §7 calls accessibility "a gate." | `e2e/home.spec.ts:~52` |
| **Q4** | `vitest.config.ts` declares no coverage thresholds. Coverage is unmeasured. The single test that exists asserts nothing about the application. | `vitest.config.ts`; `smoke.test.ts` |
| **Q5** | `lighthouserc.mobile.yml` performance floor is 0.8 vs. desktop 0.9. PRD §7 sets one perf bar; the mobile loosening is undocumented. | `lighthouserc.mobile.yml:19` |
| **Q6** | E2E coverage gaps: no spec hits API routes (`/api/case-studies`, `/api/writing`, `/api/openapi.json`), `/.well-known/api-catalog`, `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, `/robots.txt`, or any OG image route. The agent-readiness surface is the most-tested-by-readers part of the site and has the least test coverage. | `e2e/*.spec.ts` (6 files) |

### 3.6 Process / inheritance hygiene

| # | Finding | Evidence |
|---|---|---|
| **P1** | `gotchas.md` empty — see C4. | `gotchas.md` |
| **P2** | No `EPIC-02` / `EPIC-03` despite Phases 2–5 each spanning multiple subsystems. CLAUDE.md says EPM artefact "for anything spanning more than one sub-system." Either the project diverged from the rule or the artefacts were skipped. CHANGELOG carried the narrative instead; if that's the intended pattern, document it. | `docs/epm/` (one file); `docs/CHANGELOG.md` |
| **P3** | No tests directory beyond the `smoke.test.ts` placeholder for `lib/`. CLAUDE.md's parent rule frames each task with a verifiable goal — the project depends on Playwright + lint + typecheck for that, but those don't catch unit-level bugs in `content.ts` frontmatter parsing or `structured-data.ts` JSON-LD assembly. | `lib/*.ts` without `lib/*.test.ts` |

---

## 4 · Prioritised implementation plan

Sized in roughly increasing order. P0 = the misleading-reality fixes (cheap, high signal); P1 = the named ROADMAP-open items; P2 = process / hygiene cleanup. Each item carries an estimate band — XS (under 30 min), S (under 2 hours), M (half-day), L (full day).

### P0 — fix misleading artefacts (1 PR, half-day)

Recommend bundling into a single PR `chore: gap-analysis cleanup`.

| Item | Fix | Size |
|---|---|---|
| **C1** | Edit `public/.well-known/mcp.json` to either (a) remove the `endpoint` field and replace with a `"status": "planned"` placeholder, or (b) gate the file behind the actual `/api/mcp` route. Recommend (a) — the discovery file should not advertise a 404. | XS |
| **C2** | Decide Wanderer's fate. Either (a) reinstate `<Wanderer />` in `app/layout.tsx` and confirm e2e/canvas.spec passes meaningfully, or (b) mark Phase 5 Wanderer line `[~]` in ROADMAP, add a post-launch open item, soften the primer description, and remove the now-vacuous `e2e/canvas.spec.ts` companion assertions until reinstated. | S |
| **C3** | Fill `docs/seo/STATUS.md §2` canonical NAP. Real `sameAs` URLs. Correct `photo_url` to `https://akaushik.org/images/about/abhishek.webp`. | XS |
| **C4** | Promote the load-bearing CHANGELOG findings into `gotchas.md` as one-line entries — Wanderer-disable rationale, 80ms WebGL bail-out removal, `stats.json` null-widening, hero SVG bleed-through, mobile reorder bug. | S |
| **D1** | Rewire `components/sections/About.tsx` to consume `lib/about-copy.ts` (or delete `lib/about-copy.ts` if the canonical copy is in JSX). One copy, one source. | S |
| **D5** | Audit `Process.tsx` `href="#"` links — either point them at the live process artefacts (PRD, ROADMAP, ADRs, CHANGELOG, process-gate, primers all have URLs) or remove the link wrapper. | XS |
| **D6** | Delete or rewrite the unreachable empty-state copy in `app/writing/page.tsx`. | XS |
| **D7** | Rewrite `CaseStudyStub.tsx` body to drop the Phase-2 reference since the only slug that hits it is the permanent Bluehost stub. | XS |
| **R2** | Correct `/images/abhishek.webp` → `/images/about/abhishek.webp` in `docs/ROADMAP.md:75` and tick the line `[x]`. Align with C3 in one edit. | XS |
| **C2-b** | Fix Vercel GitHub auto-deploy (or replace e2e/lighthouse with a direct workflow that builds + serves locally inside the runner). Until this is fixed, no e2e or Lighthouse signal is gating PRs. **This is the highest-leverage fix in P0** because every other test improvement (Q3, Q6) is moot until preview URLs come back. | M |
| **Q1** | Add `ignores: ['.claude/worktrees/**']` to `eslint.config.js`. Verify `pnpm lint` returns to zero. | XS |

### P1 — close the named ROADMAP-open items (sequenceable)

| Item | Fix | Size |
|---|---|---|
| **R1** | Acquire Calendly / Cal.com URL and wire into `components/sections/Contact.tsx:61`. Add an e2e assertion that the href is non-`#`. | XS (after URL exists) |
| **R3** | Run `isitagentready.com` against `https://akaushik.org`. Save screenshot to `docs/agent-readiness-snapshots/2026-MM-DD.png`. Establishes the baseline and creates the directory referenced elsewhere. | XS |
| **R4** | `pnpm analyze`; rewrite `docs/BUNDLE_BUDGET.md` with a 2026-05-19 snapshot including the post-R3F-hero numbers. If under 200 KiB, tighten `lighthouserc.yml` JS-budget ceiling toward 150 KiB. | M |
| **R5** | Promote Lighthouse category assertions in both `lighthouserc.yml` and `lighthouserc.mobile.yml` from `warn` to `error` at PRD §7 targets, **after** one prod CI run confirms current numbers clear those bars. If they don't, file the deltas as separate perf-work items. | S–M |
| **R6** | Implement `app/api/docs/page.tsx` (HTML page) and `app/api/docs/route.ts` (or use static MDX). Should render `lib/openapi-spec.ts` (or fetch from `/api/openapi.json`) as a readable spec. RFC 9727 implies humans should be able to read this. | M |
| **R7** | Defer `/api/mcp` per current decision. **But:** clean up `mcp.json` first (C1). | n/a (deferred) |
| **R8** | Abhishek's edit pass — out of scope for an agent. Capture as a tasks.md item against the owner. | n/a |
| **S6** | Either ship `docs/seo/editorial-calendar.md` (likely as a one-time hand-seeded list, since the cron will append) or update the primer to mark it as auto-generated on first cron run and add a stub file so the path is not dangling. | XS |
| **S7** | Run the SEO Phase 0 human handoffs. Most are 5-minute Vercel / GSC / Wikidata clicks. Mark STATUS.md as you go. | S–M |

### P2 — process hygiene / observable health

| Item | Fix | Size |
|---|---|---|
| **C5 / P3** | Add real unit tests for `lib/content.ts` (frontmatter parser edge cases), `lib/reading-time.ts` (markdown stripping), `lib/structured-data.ts` (JSON-LD graph shape), `lib/dates.ts` (UTC handling). Each is ≤10 cases; together ~half-day. Delete `smoke.test.ts` once at least one real test exists in the suite. | M |
| **Q3** | Un-fixme the axe-core test in `e2e/home.spec.ts`. Fix any violations it surfaces. | S |
| **Q6** | Add a single `e2e/agent-readiness.spec.ts` that hits `/llms.txt`, `/llms-full.txt`, `/.well-known/api-catalog`, `/.well-known/mcp.json`, `/api/openapi.json`, `/api/case-studies`, `/api/writing`, `/sitemap.xml`, `/robots.txt`. Assert: 200 status, correct content-type, non-empty body. Cheap and load-bearing. | S |
| **D2** | Delete `components/ui/ArrowLink.tsx` (dead). | XS |
| **D3** | Decide on `lucide-react`, `gsap`, `framer-motion`. Either land a use case (motion language consolidation might justify one) or `pnpm remove` all three. | S |
| **D4** | Backfill an ADR (ADR-0011?) covering the writing-post HyperFrames loops — composition source, render path, retention policy. Optionally add the two missing loops (`trellis`, `best-practices-into-trellis`) so the surface is uniform. | S–M |
| **S1** | Rewrite `README.md` to describe the live site, link to PRD / ROADMAP / `/process` (the public artefact page if/when it exists). | XS |
| **S2** | Add a one-line "Superseded by the 2026-04-24 rename" note at the top of `HANDOFF.md` and `docs/HANDOFF_HYPERFRAMES.md`. | XS |
| **S3** | Fix `docs/AGENT_READINESS.md §7` implementation-map cite from `app/robots.ts` to `app/robots.txt/route.ts`. | XS |
| **S4** | Add a "Superseded by ADR-0009" line at the top of `docs/adr/0002-process-gate-policy.md`. | XS |
| **S5** | Drop the "Phase 6" comment from `lighthouserc.yml:27` or, if there is a real Phase 6 plan, draft `docs/ROADMAP.md` Phase 6. | XS |
| **Q4** | Add coverage thresholds to `vitest.config.ts` once real tests land. | XS |
| **Q5** | Document the desktop/mobile perf-floor delta as an ADR-noted intentional choice, or align them. | XS |
| **P2** | Decide EPM policy. If EPM is reserved for Phase-0-style scaffolding, codify that in CLAUDE.md. If it's required per phase, backfill stubs for Phases 2–5. | S |

### Suggested PR sequencing

1. **PR-1** `chore: gap-analysis P0 cleanup` — all P0 items as one bundle (under 200 LOC of edits).
2. **PR-2** `chore(seo): close Phase 0 handoffs + canonical NAP` — S7 + C3 + S6 follow-up.
3. **PR-3** `perf: re-baseline bundle budget + tighten Lighthouse` — R4 + R5.
4. **PR-4** `test: unit + agent-readiness e2e` — C5 + Q3 + Q6.
5. **PR-5** `feat(api): public OpenAPI docs page at /api/docs` — R6.
6. **PR-6** `chore: dep + docs cleanup` — D2/D3/D4/S1–S5/Q4/Q5/P2.

PR-1 unblocks everything else by making the rest of the audit's signal trustworthy. PR-2/3 are independent and can land in parallel. PR-4 onwards is sequenceable.

---

## 5 · Out of scope

- The owner-only items: Abhishek's prose edit pass (R8), Calendly URL acquisition (R1 depends on it), Vercel / GSC / Wikidata / social-bio human actions (S7 — partial), Bluehost case-study confidentiality call.
- `/api/mcp` server itself (R7). The deferral stands; C1 only addresses the misleading discovery file.
- Anything in `_reference/` — read-only scratchpad per CLAUDE.md.

---

## 6 · Appendix — raw counts

- **Routes:** 8 pages + 10 route handlers. Of these, the only promised-but-absent surface is `/api/mcp` and `/api/docs`.
- **Components:** 22 components across 6 subdirectories. 1 dead (`ArrowLink`), 1 disabled (`Wanderer`), 6 with `href="#"` placeholders (`Process.tsx`), 1 with stale empty-state copy (`Writing.tsx`).
- **Lib modules:** 9. All live; one (`about-copy.ts`) has drifted from its consumer.
- **Content:** 4 case studies + 6 writing posts. Zero `draft:true`. Two writing posts lack HyperFrames loops.
- **Scripts:** 5. All wired into `package.json`. `process-gate.mjs` lives; `smoke.test.ts` is a placeholder.
- **Tests:** 6 e2e specs (covering layout / canvas / theme / content-negotiation / reduced-motion / work) + 1 vitest no-op. Axe-core test is `test.fixme`. Zero coverage of API routes or agent-readiness surfaces.
- **CI workflows:** 4 — verify, e2e, lighthouse, stats. Lighthouse runs but doesn't gate.
- **ADRs:** 10. ADR-0002 not annotated as superseded.
- **Primers:** 7. SHA pins all reachable. 1 primer (`wanderer-crane-scene`) describes a disabled feature as live. 1 primer (`seo-strategy`) references a non-existent file.
- **Open ROADMAP items:** 9 listed; R2 is silently done; R5 is partially done (config exists, severity wrong); the rest are open.

*End of report.*
