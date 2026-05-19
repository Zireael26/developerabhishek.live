# Implementation plan — gap analysis 2026-05-19

**Source report:** `docs/gap-analysis-2026-05-19.md` (PR #69, merged 67434c0)
**Audience:** the autonomous session that will execute this plan
**Goal:** close every finding in §3 of the report, in the §4 sequencing, in 6 PRs.

> This plan is the contract for autonomous execution. Each PR section names the branch, the files to touch, the per-file intent, the verification commands, the acceptance criteria, and the risks. Do not deviate without surfacing the deviation in the PR body.

---

## 0 · Decisions locked

| Topic | Decision | Source |
|---|---|---|
| **C2 Wanderer** | Defer with formal post-launch slot. Code preserved. Add `[ ] Wanderer redesign + reinstate` to ROADMAP. Write `docs/wanderer-redesign-brief.md` capturing the redesign intent. Update `e2e/canvas.spec.ts` so the `#companion` assertions skip until reinstated. Soften the primer. | Operator answer 2026-05-19 |
| **C2-b Vercel CI** | Switch CI to runner-local serve. Rewrite `e2e.yml` + `lighthouse.yml` to `pnpm build` + `pnpm start` + wait-on + run against `http://localhost:3000`. Drop the `*.vercel.app` polling. | Operator answer 2026-05-19 |
| **D1 About copy** | Rewire `components/sections/About.tsx` to consume `lib/about-copy.ts`. The lib module becomes the single source of truth, mirrored by the `Services.tsx` ↔ `lib/services.ts` pattern. About prose stays in TypeScript (not promoted to MDX) until R8 (owner edit pass) is ready. Body is split into `paragraphs: string[]` and rendered as `<p>` elements server-side via a small token-array renderer (no `dangerouslySetInnerHTML`). | Operator delegated; plan decision |
| **PR cadence** | Six PRs as per `docs/gap-analysis-2026-05-19.md` §4. Each PR merges into `main` after `verify` is green before the next opens. | Operator answer 2026-05-19 |

## 1 · Owner-only items (capture, do not execute)

These cannot complete autonomously. Each PR that touches a related surface adds a `// TODO(owner)` or appends to `docs/seo/STATUS.md`'s human-handoff queue.

| # | Item | Where surfaced |
|---|---|---|
| R1 | Calendly / Cal.com URL for Contact button | PR-1 leaves `Contact.tsx:61` `href="#"` but adds a `data-pending-owner="calendly-url"` attribute + queue entry |
| R8 | Abhishek's edit pass on About + case-study honest-scope paragraphs + curat.money framing | PR-1 wires the single-source About; copy itself stays as-is |
| S7 | Vercel 301 for `developerabhishek.live` + `akaushik.dev`, GSC Change of Address, Wikidata entry creation, profile NAP sync | PR-2 verifies the redirect via `curl` and reports status; opens an `STATUS.md` queue update; cannot click the dashboards |
| Q3 (axe-core fixes) | A11y violations surfaced when `test.fixme` is removed | PR-4 un-fixmes the test and lands the test green; **if violations are surfaced, PR-4 fixes them inline**. If violations exceed 30 minutes of work, PR-4 hands the residue to a follow-up `fix(a11y)` PR |

## 2 · Conventions for every PR

- **Branch naming:** `chore/gap-<id>-<slug>` for cleanup, `feat/<slug>` for new surfaces, `test/<slug>` for test work, `perf/<slug>` for budget work.
- **Commits:** Conventional Commits. Bundle related edits into one commit per logical change. No mass-rebase / amend after push.
- **Pre-commit:** husky runs `pnpm process:check`. Add the matching `docs/CHANGELOG.md` `[Unreleased]` entry **before** committing or the gate fails for any code change.
- **Pre-push:** husky runs `pnpm test` (the smoke + any new vitest tests). Direct push to `main` is blocked.
- **PR body:** Summary (1–3 bullets) + Test plan (checkbox list) + reference to the relevant gap finding IDs.
- **CI:** `verify` (typecheck + lint + build + process-gate) must be green. `test` and `audit` (Lighthouse) start as runner-local after PR-1; **PR-1's branch keeps them on the broken preview path because the rewrite is the PR-1 deliverable itself** (see PR-1 §6 acceptance).
- **Merge:** squash + delete branch. No force-push. No `--no-verify`.
- **No `dangerouslySetInnerHTML`** anywhere new. Any markdown-to-React rendering uses an inline token-array approach (parse to `(string | { tag: 'strong' | 'em' | 'a', text, href? })[]`, then map to elements). DOMPurify or similar sanitisers are not needed because we never set raw HTML strings into the DOM.

---

## PR-1 · `chore/gap-p0-cleanup` — fix misleading artefacts + restore lint signal

**Goal:** every artefact that misrepresents reality is corrected. Lint output returns to zero so day-to-day signal is trustworthy. Wanderer's deferral is formalised.

**Findings closed:** C1, C2 (deferral path), C3, C4, D1, D5, D6, D7, R2, Q1, S1, S2, S3, S4, S5, plus the `mcp.json` ↔ ROADMAP alignment.

### 1.1 Files to create

| Path | Purpose |
|---|---|
| `docs/wanderer-redesign-brief.md` | Captures the redesign intent that PR #58 implied but never wrote down. Includes: current behaviour (link to wanderer-crane-scene primer), reasons for the disable (cite PR #58 body), open redesign questions (does it stay a paper crane? does it follow the cursor in addition to scroll? does the SVG fallback get retained?), reinstatement checklist (uncomment in layout.tsx, restore e2e assertions, refresh primer last_refreshed, mark ROADMAP `[x]`). One page, ≤80 lines. |
| *(none else; this PR is mostly edits)* | |

### 1.2 Files to edit — per-file intent

**`public/.well-known/mcp.json`** (C1)
- Replace `"endpoint": "https://akaushik.org/api/mcp"` with `"status": "planned"`.
- Remove the `"tools"` and `"resources"` arrays (they are empty); replace with a single `"$comment": "MCP server deferred to v1.1 per docs/ROADMAP.md; this file will gain endpoint + tools when the route lands."` field.
- Keep `"version": "0.0.0"` (signals not yet live).
- **Acceptance:** `curl https://akaushik.org/.well-known/mcp.json` returns valid JSON, no `endpoint` field, agents do not chase a 404.

**`app/layout.tsx`** (C2)
- Leave the existing comment-out alone. Do **not** reinstate yet.
- Add a one-line comment above the commented-out `<Wanderer />` referencing `docs/wanderer-redesign-brief.md` so future-you finds the brief by scrolling layout.tsx.

**`docs/ROADMAP.md`** (C2 deferral, R2)
- Under "Post-launch (honest open items)", add: `- [ ] Wanderer crane redesign + reinstate — see docs/wanderer-redesign-brief.md`.
- Under Phase 5, change the Wanderer line from `[x]` to `[~]` and append `(disabled 2026-05-11 per PR #58; reinstate tracked post-launch)`.
- For the portrait photo line: change `Portrait photo swap (\`/images/abhishek.webp\`, 4:5) — SVG placeholder today` to `[x]` and fix path to `/images/about/abhishek.webp`.

**`e2e/canvas.spec.ts`** (C2)
- Wrap the `#companion` + `.companion-svg` assertions (currently lines 47–48) and the `#companion canvas` count assertion (line 71–72) in a `test.skip(true, 'Wanderer disabled since PR #58; reinstate when companion returns. See docs/wanderer-redesign-brief.md.')`.
- Keep the scene-frame + AgentGraph assertions (the other tests in the file) live — those exercise the hero canvas which is unaffected.

**`docs/seo/STATUS.md`** (C3, R2)
- Replace the seven `sameAs` placeholder tokens with real URLs:
  - GitHub: `https://github.com/Zireael26`
  - LinkedIn: `https://www.linkedin.com/in/abhishekkaushik26/` *(verify via `gh` profile fetch; fall back to the URL in `Contact.tsx`)*
  - X / Twitter: `https://x.com/abhi2601k`
  - Bluesky: leave as `<TODO: owner to create>` if not yet present, append to handoff queue.
  - Hashnode, dev.to, Wikidata: same — placeholder if absent, queue entry if so.
- Correct `photo_url` to `https://akaushik.org/images/about/abhishek.webp`.
- Append to "Human handoff queue": (a) `developerabhishek.live` Vercel 301 verification, (b) `akaushik.dev` Vercel 301 verification, (c) GSC Change of Address, (d) Wikidata entry, (e) any missing profile creates.

**`gotchas.md`** (C4)
- Promote the load-bearing CHANGELOG findings to one-line entries (one per line). At minimum:
  - `2026-05-11 — Wanderer disable: both crane and SVG fallback share #companion mount in app/layout.tsx; commenting <Wanderer /> hides both. Revert path is uncomment-only.`
  - `2026-05-11 — Restore writing-post HyperFrames loops via components/media/{hyperframes-loop,MotionVideo}.tsx; assets in public/video/{work,writing}/*.{mp4,webp}; render path uses scripts/hyperframes/.`
  - `2026-05-02 — lib/stats.ts: stats.json may emit null for commits12mo + lastCommit when scripts/fetch-github-stats.mjs hits a private-repo 404 or empty branch. Type widened to number|null/string|null; OpenSource.tsx coalesces via "?? 0".`
  - `2026-04-22 — Hero SVG bleed-through: .scene-frame[data-canvas-active="true"] .scene-svg { display: none } prevents the SSR SVG from composing through the transparent R3F canvas.`
  - `2026-04-22 — Mobile reorder: home section order on mobile follows source order; do not reorder via CSS or screen readers lose the narrative.`
  - `2026-04-24 — Theme-toggle flicker: public/init-theme.js must run synchronously before first paint; deferring it causes a visible flash.`
  - `2026-05-19 — Vercel GitHub auto-deploy broken since 2026-04-24 (cd559de). CI workflows that wait on *.vercel.app preview URL stall forever. PR-2 of the gap-analysis plan switches to runner-local serve.`

**`lib/about-copy.ts` + `components/sections/About.tsx`** (D1)
- Audit `lib/about-copy.ts` for shape. Current shape (`kicker`, `lede`, `bodyMarkdown`, `meta[]`).
- Update `lib/about-copy.ts`: split `bodyMarkdown` into `paragraphs: string[]` (markdown-light per paragraph — bold/italic only, no headings or lists since About is short prose). Drop the `bodyMarkdown` field. Keep `kicker`, `lede`, `meta` unchanged. Update the comment at line 5 ("Phase 2.2 will replace…") — replace it with: `Single source for About prose. Consumed by components/sections/About.tsx and app/llms-full.txt/route.ts. Edit here and both surfaces update.`
- Add a tiny **safe** renderer at the bottom of `About.tsx`: `function renderInline(text: string): React.ReactNode[]` that uses a regex to split on `**...**` (bold) and `*...*` (italic) and returns an array of plain strings + `<strong>` / `<em>` React elements. No raw HTML, no `dangerouslySetInnerHTML`. Under 30 LOC.
- Update `app/llms-full.txt/route.ts` consumer: render `paragraphs.join('\n\n')` (the stars are valid markdown for the .txt endpoint).
- Rewrite the About prose region as `<p className="about-lede">{ABOUT_COPY.lede}</p>` followed by `{ABOUT_COPY.paragraphs.map((p, i) => <p key={i}>{renderInline(p)}</p>)}`.
- Verify human-facing About on `/` and agent-facing About in `/llms-full.txt` render the same prose. Diff before/after via `pnpm dev` + `curl -s http://localhost:3000/llms-full.txt | sed -n '/About/,/^---/p'`.

**`components/sections/Process.tsx`** (D5)
- Replace every `href="#"` with the live URL of its artefact. The Process artefacts referenced are: PRD → `https://github.com/Zireael26/akaushik.org/blob/main/docs/PRD.md`; ROADMAP → `…/docs/ROADMAP.md`; ADRs → `…/docs/adr/`; CHANGELOG → `…/docs/CHANGELOG.md`; process-gate → `…/docs/adr/0002-process-gate-policy.md`; primers → `…/.claude/primers/INDEX.md`.
- Where multiple artefacts map to one step (e.g. all ADRs), point at the directory listing on GitHub. External links open in new tabs (`target="_blank" rel="noopener noreferrer"`).

**`app/writing/page.tsx`** (D6)
- The `posts.length === 0` branch is unreachable. Delete the empty-state JSX. Leave a defensive `posts.length === 0` guard that returns `null` to satisfy TypeScript narrowing if it survives in any code path; otherwise remove the conditional.

**`components/sections/CaseStudyStub.tsx`** (D7)
- Replace the "Full write-up lands in Phase 2" copy with: "Case study available on request — scope is under client review. Reach me at hello@akaushik.org." (or equivalent that does not reference a delivery phase that has already shipped). Coordinate with the existing Bluehost-confidentiality framing in `content/case-studies/bluehost-agents.mdx` to avoid contradicting the published page.

**`eslint.config.js`** (Q1)
- Add an `ignores` entry at the top of the config covering `.claude/worktrees/**`, `_reference/**`, and `.next/**` (defensive — the next config covers `.next/**` but not worktree copies).
- **Acceptance:** `pnpm lint` returns `0 problems` from the repo root.

**`README.md`** (S1)
- Replace the "mid-rewrite" framing with a live-site description: one-paragraph summary, links to `docs/PRD.md` + `docs/ROADMAP.md` + `https://akaushik.org`, the stack table, and the local-dev commands. ≤80 lines.

**`HANDOFF.md` + `docs/HANDOFF_HYPERFRAMES.md`** (S2)
- Add a single `> **Superseded.** Directory rename to akaushik.org landed 2026-04-24 per ADR-0003. This handoff is retained as historical context.` line at the very top of each file (immediately after the H1).

**`docs/AGENT_READINESS.md`** (S3)
- §7 implementation map: change the robots entry from `app/robots.ts` to `app/robots.txt/route.ts (Route Handler)`. One-line fix.

**`docs/adr/0002-process-gate-policy.md`** (S4)
- Insert a `> **Superseded-by:** ADR-0009 (husky migration). The policy in this ADR is unchanged; the git-hook manager is now husky, not simple-git-hooks.` line near the top, immediately after the title.

**`lighthouserc.yml`** (S5)
- Delete the `(Phase 6) the target pulls back to 160 KiB` comment. If a Phase 6 budget tightening is real, it belongs in `docs/BUNDLE_BUDGET.md` Future section, not as a code comment.

**`docs/CHANGELOG.md`** (process-gate requirement)
- One `[Unreleased]` entry summarising the PR-1 cleanup. Reference the gap-analysis report.

### 1.3 Files to delete

None in PR-1. `components/ui/ArrowLink.tsx` (D2) and the three unused deps (D3) move to PR-6 because their removal is orthogonal to the misleading-artefact fixes.

### 1.4 Test additions

None — PR-1 is repair. New tests land in PR-4.

### 1.5 Verification commands

```bash
pnpm typecheck       # must be clean
pnpm lint            # MUST return 0 problems (was 772) — this is the Q1 gate
pnpm process:check   # must pass
pnpm test            # smoke still green
pnpm dev             # smoke the /, /llms-full.txt, /process step URLs
curl -s http://localhost:3000/.well-known/mcp.json | jq .
curl -s http://localhost:3000/llms-full.txt | head -40   # About paragraphs render
```

### 1.6 Acceptance criteria

- [ ] `pnpm lint` returns zero problems from repo root.
- [ ] `public/.well-known/mcp.json` does not advertise a 404 endpoint.
- [ ] `components/sections/Process.tsx` has no `href="#"`.
- [ ] `app/writing/page.tsx` has no Phase-2 reference.
- [ ] `components/sections/About.tsx` and `/llms-full.txt` source the same prose from `lib/about-copy.ts`.
- [ ] `docs/wanderer-redesign-brief.md` exists; ROADMAP has the post-launch line; `e2e/canvas.spec.ts` companion assertions are skipped with the brief cited.
- [ ] `gotchas.md` carries ≥7 entries summarising the load-bearing 2026-04-21 → 2026-05-19 lessons.
- [ ] `docs/seo/STATUS.md §2` canonical NAP has no `<TODO>` tokens left except those captured in the human-handoff queue.
- [ ] `README.md` reads as live-site documentation, not mid-rewrite.

### 1.7 Risks

- **About.tsx prose drift.** If the existing JSX includes inline links or fragments that the `renderInline` regex does not support, the rewire breaks the live About visually. Mitigation: read About.tsx before edit; if inline anchors exist, extend the renderer to support `[text](url)` tokens (still returning React elements, never raw HTML); test in `pnpm dev` before committing.
- **`gotchas.md` cannibalisation.** Restating CHANGELOG entries verbatim is low-value. The PR-1 entries should be one-sentence rule-of-thumb per gotcha, not narrative.
- **Process.tsx URL rot.** Linking to GitHub blob URLs is stable as long as the file paths do not move. Safer alternative: link to the repo root (`…/akaushik.org`) and let visitors navigate. Trade-off — direct links are more legible. Take the direct-link path; PR-6 can swap to a `/process` page if Abhishek decides to surface one.

---

## PR-2 · `chore/ci-runner-local` — switch CI to runner-local serve + SEO Phase 0 mechanical work

**Goal:** unblock all downstream test/perf work by removing the Vercel preview dependency from `e2e.yml` and `lighthouse.yml`. Complete the SEO Phase 0 mechanical items that do not require dashboard access.

**Findings closed:** C2-b, R3 (snapshot), S6, partial S7 (verification only — dashboards remain owner-only).

### 2.1 Files to create

| Path | Purpose |
|---|---|
| `docs/agent-readiness-snapshots/2026-05-19.md` | Records the result of `curl -s https://isitagentready.com/?url=https://akaushik.org` (or, if the service has a JSON API, the structured response). Captures the four dimension scores + the response body, dated. Future snapshots land alongside as date-stamped siblings. |
| `docs/seo/editorial-calendar.md` | Seed file. 50-slot placeholder with frontmatter `--- generated_by: human-seed; status: pending --- `. First `seo-weekly-draft` cron run will overwrite. **Skipped if** the cron has run between plan-write and execution; check `docs/seo/STATUS.md > Automation health` first. |

### 2.2 Files to edit

**`.github/workflows/e2e.yml`** (C2-b)
- Rewrite the `test` job to drop the Vercel preview poll. New shape:
  ```yaml
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v4
    - uses: actions/setup-node@v4
      with: { node-version: '22', cache: 'pnpm' }
    - run: pnpm install --frozen-lockfile
    - run: pnpm exec playwright install --with-deps chromium
    - run: pnpm build
    - run: pnpm start &
      env: { PORT: 3000 }
    - run: pnpm exec wait-on http://localhost:3000 --timeout 60000
    - run: pnpm test:e2e
      env: { PLAYWRIGHT_BASE_URL: http://localhost:3000 }
    - uses: actions/upload-artifact@v4
      if: always()
      with: { name: playwright-report, path: playwright-report/, retention-days: 7 }
  ```
- Remove every block that references `*.vercel.app`, Vercel bot comments, or preview polling.
- Trigger stays `pull_request`. No need to wait for deploy.

**`.github/workflows/lighthouse.yml`** (C2-b)
- Same pattern: build + start locally, wait-on, run `lhci autorun` against `http://localhost:3000/{,work/neev,writing}`.
- Update the `lhci` URL list to localhost.
- The axe-core CLI block keeps `continue-on-error: true` until PR-4 lands.

**`package.json`** (C2-b infra)
- Add `wait-on` to `devDependencies` (`^7.x`). It is small and pure-JS.
- Add a convenience script: `"ci:e2e": "pnpm build && pnpm start"` — not actually used by CI directly but convenient for local repro.

**`.claude/primers/seo-strategy.md`** (S6)
- Once `docs/seo/editorial-calendar.md` exists with the seed, drop the "does not exist on disk yet" note from PR #69 and replace with `Calendar shape is a 50-slot list with status: pending|drafted|published; first row populated 2026-05-19.`

**`docs/seo/STATUS.md`** (R3, S7 verification)
- Tick `seo-redirect-health` Phase 0 row if `curl -sIL https://developerabhishek.live/` shows a 301 to akaushik.org **and** `curl -sIL https://akaushik.dev/` does too. If either fails, append the failure transcript to the Alerts section and leave the row unchecked.
- Append a "2026-05-19 isitagentready snapshot" row pointing at the new `docs/agent-readiness-snapshots/2026-05-19.md` file.
- Update the Human handoff queue: keep open items only (GSC CoA, Wikidata, etc).

**`docs/ROADMAP.md`**
- Tick `isitagentready.com` snapshot line `[x]`. (R3)
- Tick the "Vercel + Cloudflare wiring + legacy redirect" line if the curls in §2.2 STATUS.md verification pass.

**`docs/CHANGELOG.md`**
- One Unreleased entry summarising the CI rewire + the SEO mechanical work.

### 2.3 Test additions

- Workflow self-tests: PR-2's own CI run is the smoke test. If `verify` + the new `test` + the new `audit` jobs are all green on the PR-2 branch, the rewrite worked.
- If any e2e spec fails because the assumptions encoded in it depended on a Vercel-deployed URL (e.g., hardcoded host in a header), fix the spec in this PR.

### 2.4 Verification commands

```bash
# Local repro of the new CI shape:
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps chromium
pnpm build
pnpm start &
pnpm exec wait-on http://localhost:3000 --timeout 60000
pnpm test:e2e
kill %1

# SEO verification (each should chain 301 → 200 to akaushik.org):
curl -sIL https://developerabhishek.live/ | head -20
curl -sIL https://developerabhishek.live/writing/fastembed-to-tei | head -20
curl -sIL https://akaushik.dev/ | head -20
curl -sIL https://akaushik.org/ | head -10   # 200, no chain

# isitagentready snapshot (note: service may rate-limit):
curl -s 'https://isitagentready.com/api/check?url=https://akaushik.org' | tee docs/agent-readiness-snapshots/2026-05-19-raw.json
```

### 2.5 Acceptance criteria

- [ ] `e2e.yml` `test` job completes without referencing Vercel preview. Duration under 8 min.
- [ ] `lighthouse.yml` `audit` job completes against localhost. Duration under 10 min.
- [ ] PR-2's own CI passes all three workflows.
- [ ] `docs/agent-readiness-snapshots/2026-05-19.md` exists with the four dimension scores.
- [ ] `docs/seo/STATUS.md` has the 2026-05-19 row + redirect verification result.
- [ ] If `developerabhishek.live` 301 fails: STATUS.md Alerts section carries the transcript; PR-2 body flags it for owner action.

### 2.6 Risks

- **CI duration.** Build + start + wait-on adds ~2 min per workflow. Acceptable; previously the workflows often timed out at the 10-min preview poll anyway.
- **`pnpm start` port conflict.** Background process bleed-over between workflow steps. Mitigation: explicit `kill %1` at the end of the test job, or run `pnpm start` and the test in the same step via `pnpm exec wait-on … && pnpm test:e2e && kill $(lsof -t -i:3000)`.
- **isitagentready API absence.** If the service does not expose a JSON API, the snapshot is a screenshot only. In that case, the autonomous run drops a markdown note describing the four dimensions checked + a `screenshot-pending` line + an entry in the owner-handoff queue.

---

## PR-3 · `perf/bundle-baseline-and-lighthouse-tightening` — re-baseline the bundle + tighten Lighthouse

**Goal:** measure the post-Phase-5 bundle, update `BUNDLE_BUDGET.md`, and flip Lighthouse thresholds from `warn` to `error` at the PRD §7 targets (only after the current measurements clear those bars).

**Findings closed:** R4, R5, Q2, Q5 (intentional desktop/mobile gap documented).

### 3.1 Files to create

| Path | Purpose |
|---|---|
| `docs/bundle-snapshots/2026-05-19-bundle.md` | Result of `pnpm analyze` — initial JS, route-level breakdown, top heavy chunks. Used as the reference for the BUNDLE_BUDGET update. |

### 3.2 Files to edit

**`docs/BUNDLE_BUDGET.md`** (R4)
- Replace the dated 2026-04-20 snapshot with the 2026-05-19 measurement.
- Reference the new `docs/bundle-snapshots/2026-05-19-bundle.md`.
- If the measured initial JS is under 200 KiB but over 150 KiB, set the ceiling to a rounded number ≥ measured (e.g., 175 KiB) and note the path to 150 KiB.
- If the measured initial JS is over 200 KiB, **PR-3 stops** here and opens a follow-up `perf/budget-overrun` PR; do not silently raise the ceiling.

**`lighthouserc.yml`** (R5, Q2)
- Promote category assertions from `warn` to `error` at the PRD §7 targets: performance ≥ 0.95, accessibility ≥ 1.0, best-practices ≥ 0.95, SEO ≥ 1.0. **Only if the PR-3 CI run shows the live numbers already meet those bars.** If one or more bars are short:
  - File the delta as a follow-up perf-work item in ROADMAP.
  - Leave that specific category as `warn` in this PR; promote the rest.
- Update the JS-budget assertion to match the new BUNDLE_BUDGET ceiling. Severity `error`.
- Drop the `(Phase 6)` comment if PR-1 missed it (S5).

**`lighthouserc.mobile.yml`** (R5, Q5)
- Promote the same way. Performance floor:
  - If desktop perf clears 0.95 but mobile is at 0.85, set mobile to the measured number with severity `warn` and add a comment: `Mobile perf intentionally lower than desktop pending image LCP optimisation; tighten after R3F mobile profile audit.`
  - If both bars clear 0.95, align mobile to desktop.
- Document the rationale in `docs/BUNDLE_BUDGET.md` so Q5 is no longer untracked.

**`docs/ROADMAP.md`**
- Tick R4 + R5 if the PR-3 measurements meet the bars.
- If one or more bars are short, leave those specific lines as `[~]` with a one-line "carry remaining perf work in follow-up PR" note.

**`docs/CHANGELOG.md`**
- One Unreleased entry with the measured numbers + threshold flips.

### 3.3 Test additions

- None new. The PR-3 CI run against the new thresholds is the test.

### 3.4 Verification commands

```bash
pnpm analyze       # writes the report under .next/analyze/
# Inspect the generated client.html / nodejs.html / edge.html bundles
# and surface the top chunks into docs/bundle-snapshots/2026-05-19-bundle.md.

pnpm exec lhci autorun --collect.url=http://localhost:3000/ --config=lighthouserc.yml
pnpm exec lhci autorun --collect.url=http://localhost:3000/ --config=lighthouserc.mobile.yml
```

### 3.5 Acceptance criteria

- [ ] `docs/bundle-snapshots/2026-05-19-bundle.md` exists with route-level JS sizes.
- [ ] `docs/BUNDLE_BUDGET.md` reflects the measured numbers, dated 2026-05-19.
- [ ] `lighthouserc.yml` + `lighthouserc.mobile.yml` carry `error` severity on at least the SEO + accessibility categories.
- [ ] PR-3 CI lighthouse job passes against the tightened thresholds.

### 3.6 Risks

- **Severity flip blocks merge.** If thresholds are too aggressive, every subsequent PR fails CI. Mitigation: only promote bars the current measurement clears.
- **Mobile perf surprise.** R3F + Wanderer (still in tree even if disabled) may push mobile perf below 0.9. Mitigation: measure first; only promote what passes.

---

## PR-4 · `test/coverage-and-agent-readiness-e2e` — unit tests + agent-readiness e2e + un-fixme axe-core

**Goal:** add real unit coverage for the four lib modules with non-trivial logic. Add a single e2e spec that hits every agent-readiness surface. Un-fixme the axe-core test in `home.spec.ts` and fix any violations surfaced.

**Findings closed:** C5, Q3, Q4, Q6, P3.

### 4.1 Files to create

| Path | Purpose |
|---|---|
| `lib/content.test.ts` | Frontmatter parser edge cases. Cover: required field missing, extra unexpected fields, multiline strings, escaped quotes, empty body, missing `--- ` fence, second `--- ` fence absent (truncated file). Each case: expected throw or expected parsed object. ≥10 cases. |
| `lib/reading-time.test.ts` | Markdown stripping. Cover: ``` code fences, inline `code`, headings (`#`, `##`, `###`), bullet lists, numbered lists, blockquotes, HTML tags (`<aside>`, `<img>`), images, links — content stripped, link text preserved. ≥10 cases. |
| `lib/structured-data.test.ts` | JSON-LD graph shape. Cover: `personNode` `@id` stability, `organizationNode` brand fields, `websiteNode` URL canonical, `siteGraph` linkage between Person + Organization + WebSite via `@id`, `articleGraph` + `caseStudyGraph` author/publisher references, `jsonLdString` round-trip to JSON. ≥8 cases. |
| `lib/dates.test.ts` | UTC handling for `formatMonthYear`. Cover: cross-month boundaries in IST timezone, single-digit months, leap-year February, invalid input. ≥6 cases. |
| `lib/canonical.test.ts` | `canonical(pathOrUrl)` helper. Cover: absolute URL passthrough, relative path joining, trailing-slash normalisation, query-string preservation, hash fragment preservation. ≥6 cases. |
| `e2e/agent-readiness.spec.ts` | Single spec hitting `/llms.txt`, `/llms-full.txt`, `/.well-known/api-catalog`, `/.well-known/mcp.json`, `/.well-known/agent-skills/index.json`, `/.well-known/agent-skills/hire-me/SKILL.md`, `/api/openapi.json`, `/api/case-studies`, `/api/writing`, `/sitemap.xml`, `/robots.txt`. Each: 200, correct content-type, non-empty body, basic shape check (JSON parse where applicable, presence of expected substring elsewhere). |

### 4.2 Files to edit

**`smoke.test.ts`** (C5)
- Delete after the new lib tests land.

**`vitest.config.ts`** (Q4)
- Add coverage configuration:
  ```ts
  test: {
    coverage: {
      provider: 'v8',
      include: ['lib/**/*.ts'],
      exclude: ['lib/**/*.test.ts', 'lib/about-copy.ts', 'lib/services.ts'],
      thresholds: { lines: 80, branches: 75, functions: 80 },
    },
  }
  ```
- Acceptable to gate coverage thresholds in CI **only after** the four test files exist and produce sufficient coverage; otherwise the gate fails immediately.

**`package.json`**
- Add `@vitest/coverage-v8` to devDependencies.
- Add `"test:coverage": "vitest run --coverage"` script.
- Ensure `"test": "vitest run"` still works.

**`e2e/home.spec.ts`** (Q3)
- Change `test.fixme(...)` to `test(...)` on the axe-core block.
- Run locally. If violations surface and fit in ≤30 min of work, fix them inline (likely candidates: missing `lang` on a fragment, contrast-fail on the muted footer, missing `aria-label` on icon-only links).
- If violations exceed the time budget, restore `test.fixme` with a `// TODO(a11y): see fix(a11y) PR` comment + open a follow-up.

**`docs/CHANGELOG.md`**
- One Unreleased entry summarising the test push.

### 4.3 Test additions

Already enumerated above. Acceptance: total assertions go from 1 (`expect(1+1).toBe(2)`) to ≥40 across the new test files.

### 4.4 Verification commands

```bash
pnpm test                # all unit tests pass
pnpm test:coverage       # generates coverage report; thresholds met
pnpm test:e2e            # includes the new agent-readiness spec
```

### 4.5 Acceptance criteria

- [ ] `smoke.test.ts` deleted.
- [ ] Five new `lib/*.test.ts` files exist, ≥40 assertions total.
- [ ] `e2e/agent-readiness.spec.ts` exists, asserts every well-known surface.
- [ ] `pnpm test:coverage` passes the thresholds in `vitest.config.ts`.
- [ ] `home.spec.ts` axe-core block is live (or, if temporarily restored to fixme, an `a11y` follow-up PR is open with the surfaced violations).

### 4.6 Risks

- **Coverage threshold over-fit.** Setting 80% lines on `lib/` may force test additions for low-value paths. Mitigation: exclude obvious data modules (`about-copy.ts`, `services.ts`) — they are constants.
- **Axe violations cascade.** If the live site fails contrast or aria checks broadly, PR-4 may balloon. Mitigation: time-box; defer overflow to a `fix(a11y)` PR.

---

## PR-5 · `feat/api-docs-page` — human-readable OpenAPI docs at /api/docs

**Goal:** ship the `/api/docs` page referenced in `docs/AGENT_READINESS.md` §6.1 and the ROADMAP open list.

**Findings closed:** R6.

### 5.1 Design choice

- **Format:** server-rendered Next.js page (`app/api/docs/page.tsx`). **Not** Redoc / Swagger UI — those are JS bundles ≥150 KiB and would blow the budget for a single content page.
- **Source:** read `app/api/openapi.json/route.ts`'s spec module (extract the spec object into `lib/openapi-spec.ts` if it currently lives inline in the route file). Render sections: `info`, `servers`, every path + method + description, request/response shapes, schemas.
- **Style:** parchment-and-forest tokens, matches the rest of the site. Display-font headings, mono for paths.

### 5.2 Files to create

| Path | Purpose |
|---|---|
| `app/api/docs/page.tsx` | Server component that imports the OpenAPI spec object and renders it as HTML. Includes a sticky table of contents. |
| `lib/openapi-spec.ts` | Lift the spec object out of `app/api/openapi.json/route.ts` so both the JSON route and the page consume the same source. |

### 5.3 Files to edit

**`app/api/openapi.json/route.ts`**
- Import the spec from `lib/openapi-spec.ts` and `JSON.stringify` it. The shape stays identical to today.

**`middleware.ts`**
- Add `/api/docs` as a `describedby` Link header companion to the existing OpenAPI ref. Or simply update the existing `<…openapi.json>; rel="service-desc"; type="application/json"` to also emit `</api/docs>; rel="service-doc"; type="text/html"` per RFC 8631.

**`app/sitemap.ts`**
- Include `/api/docs` as a sitemap entry so crawlers find it.

**`docs/AGENT_READINESS.md`**
- §6.1: change the `/api/docs` row from "deferred" to "shipped" with the path.

**`docs/ROADMAP.md`**
- Tick R6.

**`docs/CHANGELOG.md`**
- One Unreleased entry.

### 5.4 Test additions

- `e2e/agent-readiness.spec.ts` (added in PR-4) extends to assert `/api/docs` returns 200 + `text/html` + contains the OpenAPI title.
- `lib/openapi-spec.test.ts` (new): assert the spec exports validate against a minimal OpenAPI 3.1 schema check (presence of `openapi`, `info.title`, `paths`).

### 5.5 Verification commands

```bash
pnpm dev
curl -s http://localhost:3000/api/docs | head -40
curl -s http://localhost:3000/api/openapi.json | jq '.info.title'
# Visual: load /api/docs in a browser; confirm TOC, paths, schemas render.
```

### 5.6 Acceptance criteria

- [ ] `/api/docs` returns 200 + `text/html`.
- [ ] The page lists every path in `lib/openapi-spec.ts`.
- [ ] `app/api/openapi.json/route.ts` and `app/api/docs/page.tsx` share `lib/openapi-spec.ts`.
- [ ] `docs/AGENT_READINESS.md` no longer marks `/api/docs` as deferred.
- [ ] Lighthouse SEO + perf on `/api/docs` ≥ tightened thresholds.

### 5.7 Risks

- **MDX vs. JSX.** If the page becomes long, MDX might be cleaner. Stay JSX server component; if length grows past ~250 LOC, refactor into `components/docs/*` server components.
- **Spec extraction touches the JSON route.** Mitigation: a single PR-5 commit lifts the spec, updates the route, adds the page — all together — so the JSON shape is byte-equivalent.

---

## PR-6 · `chore/dependency-and-docs-hygiene` — kill dead deps + finish doc cleanup + EPM policy

**Goal:** remove dead modules and unused dependencies, ship the missing ADR for writing-post HyperFrames loops, codify EPM policy, complete the small remaining doc fixes.

**Findings closed:** D2, D3, D4, P2.

### 6.1 Files to delete

| Path | Reason |
|---|---|
| `components/ui/ArrowLink.tsx` | Dead module — D2. Verify zero imports before delete; grep the entire repo. |

### 6.2 Files to edit

**`package.json`** (D3)
- `pnpm remove lucide-react gsap framer-motion`. Triple-check via grep that no `.ts`/`.tsx`/`.mdx`/CSS file imports them. (Trip-wire: if a future PR brings back motion language, add back the chosen lib with an ADR.)
- Run `pnpm install` to refresh the lockfile.

**`docs/adr/0011-writing-post-hyperframes-loops.md`** (D4 — new file)
- ADR documenting: why the writing-post loops exist (visual continuity with case-study reels), composition spec (which writing slugs have loops, dimensions, fallback policy), render command, retention policy. Reference `components/media/hyperframes-loop.tsx`, `components/media/MotionVideo.tsx`, the SVG floor definitions per slug.
- Decide on policy for new posts: "every new writing post gets a HyperFrames loop, **unless** the topic is non-visual (in which case the post lands without)". The two posts currently without loops (`trellis`, `best-practices-into-trellis`) are documented as the latter category.

**`scripts/hyperframes/`** (D4)
- If the policy is "loops for all", add composition source dirs for `trellis` and `best-practices-into-trellis`. If the policy is "non-visual exception", note the exception in the ADR and skip.
- The render pass requires FFmpeg + Chrome locally — capture as an owner-only task if the policy requires new loops.

**`.claude/primers/` — primer-refresh sweep**
- Bump `last_refreshed` to 2026-05-19 on every primer whose subject was touched by PR-1 through PR-5.
- `agent-readiness-contract.md`: update §Entry points to reference `app/api/docs/page.tsx` (new in PR-5) + `lib/openapi-spec.ts`.
- `mdx-content-pipeline.md`: no change expected unless PR-1 modified `lib/content.ts` (it does not).
- `og-image-generation.md`: no change expected.
- `process-gate-policy.md`: no change expected.
- `hyperframes-reels.md`: extend the §Out-of-scope list with a pointer to the new ADR-0011 and the writing-post loops.

**`CLAUDE.md`** (P2)
- Add a one-line clarification to the EPM section: `EPM artefacts cover Phase-0-style scaffolding only; per-phase narrative since Phase 1 lives in CHANGELOG. Backfill not required.`

**`docs/CHANGELOG.md`**
- One Unreleased entry.

### 6.3 Test additions

- None required. Build + typecheck after the dep removals catch any silent regression.

### 6.4 Verification commands

```bash
grep -r 'from .*lucide-react' --include='*.ts' --include='*.tsx' .   # zero hits
grep -r 'from .*gsap' --include='*.ts' --include='*.tsx' .            # zero hits
grep -r 'from .*framer-motion' --include='*.ts' --include='*.tsx' .   # zero hits
grep -r 'ArrowLink' --include='*.ts' --include='*.tsx' .              # zero hits after delete
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm build
```

### 6.5 Acceptance criteria

- [ ] `components/ui/ArrowLink.tsx` removed.
- [ ] `lucide-react`, `gsap`, `framer-motion` absent from `package.json` dependencies.
- [ ] `docs/adr/0011-writing-post-hyperframes-loops.md` exists.
- [ ] Every primer with a `last_refreshed` field touched by earlier PRs is bumped.
- [ ] `CLAUDE.md` carries the EPM policy clarification.

### 6.6 Risks

- **Hidden imports.** A dep removal that breaks the build because of an indirect import. Mitigation: the `grep` + `pnpm build` step catches it.
- **ADR-0011 ambiguity.** If the policy decision is unclear without owner input, ADR-0011 records the question and leaves the policy unsigned, with the owner-handoff queue noting it.

---

## 3 · Cross-PR considerations

### 3.1 Process-gate behaviour

Every PR adds a `[Unreleased]` CHANGELOG entry **before** committing, so the gate's R1 rule passes for any code change. R2 (structural) triggers on PR-2 (CI workflow changes — qualifies as structural; the CHANGELOG entry doubles as the rationale, or write a brief ADR-0012 if the gate insists). R3 (EPM) does not trigger in any PR.

### 3.2 Pre-push smoke

Every PR pushes through `pnpm test`. After PR-4 lands, the smoke covers the lib modules + the new e2e spec — the pre-push runtime grows to ~5–10 sec. Acceptable.

### 3.3 Merge order is load-bearing

- PR-1 must merge before PR-2: PR-1 fixes `gotchas.md` + `eslint.config.js` which would otherwise contaminate every subsequent PR's `verify` step.
- PR-2 must merge before PR-3: without runner-local CI, PR-3's Lighthouse promotion has no signal.
- PR-3 must merge before PR-4: without trustworthy budget + Lighthouse, PR-4's coverage gate is harder to baseline.
- PR-4 must merge before PR-5: the new `e2e/agent-readiness.spec.ts` is extended in PR-5 to cover `/api/docs`.
- PR-5 must merge before PR-6: PR-6 references PR-5's new files in the primer sweep.

### 3.4 Rollback strategy

- PR-1: revert is single commit (squash merge). Affects only docs + a handful of components — low blast radius.
- PR-2: revert restores the broken Vercel preview poll. Safe to revert if runner-local proves brittle; CI returns to broken state, not worse.
- PR-3: revert sets thresholds back to `warn`. Safe.
- PR-4: revert removes the new tests. Safe; surface area shrinks.
- PR-5: revert removes `/api/docs` + restores inline spec in the JSON route. Safe but loses a documented feature.
- PR-6: revert restores dead deps + dead component. Safe; nothing else depends on them.

### 3.5 Telemetry

After each PR merges, the autonomous run reports:
- Files changed, LOC delta.
- `verify` + `test` + `audit` CI status.
- The findings closed (by ID, from this plan's "Findings closed" line).
- Any deviation from this plan + why.

### 3.6 If a PR's `verify` fails

- Read the failure. Diagnose root cause; do not bypass.
- If the failure is caused by something this plan did not anticipate, **stop** and surface to the operator. Do not push fixes blindly across multiple commits.
- If the failure is a known flake (Playwright timeout in CI under heavy load), retry the workflow once. If it fails again, treat as real.

### 3.7 Owner handoff queue at the end

After PR-6 merges, the queue should contain only:
- R1 Calendly URL.
- R8 Abhishek prose edit pass on About + case studies.
- S7 GSC Change of Address + Wikidata entry + missing profile creates (LinkedIn / Bluesky / Hashnode / dev.to NAP sync).
- Any deferred Q3 a11y violations from PR-4.
- Any deferred D4 writing-post loops (sandbox FFmpeg blocker for new renders).

Each surfaces in `docs/seo/STATUS.md > Human handoff queue` and in the final PR-6 body.

---

## 4 · Out-of-plan items the operator may request mid-execution

- **Wanderer reinstatement.** If the operator finalises the redesign brief during execution, PR-7 lands the reinstatement (uncomment in layout.tsx, restore canvas.spec assertions, refresh primer, tick ROADMAP).
- **Calendly URL wiring.** Trivial XS PR — drop into `Contact.tsx:61` + add an e2e assertion.
- **A11y follow-up.** Spin a PR per the residue from PR-4.
- **`/api/mcp` server.** Out of v1; v1.1 candidate.

---

## 5 · Open questions surfaced during planning that need operator confirmation only if hit

The four upfront questions are answered. The following do not block execution but should be flagged in the relevant PR body if they materialise:

1. **PR-3 perf bar misses.** If accessibility is at 0.99 instead of 1.0, the rule says don't promote that category. Confirm in the PR body and continue.
2. **PR-4 axe-core overflow.** If the un-fixme surfaces >5 distinct violations, restore `test.fixme` and open a follow-up. Confirm in PR body.
3. **PR-5 `/api/docs` length.** If the rendered docs page exceeds ~250 LOC of JSX, split into components. Confirm in PR body.
4. **PR-6 dep removal regression.** If `pnpm build` fails after removing a dep, the dep is being imported somewhere grep missed. Stop and surface.

---

*End of plan. Execution begins in a fresh session with this document as the contract.*
