# Scheduled task: `seo-weekly-draft`

**Cadence:** Every Monday 06:00 local time
**Purpose:** Maintain the 1-post/week publishing cadence committed to in the SEO strategy. Each run drafts one MDX post from the editorial calendar and opens a draft PR for Abhishek to edit and merge.

> Source-of-truth prompt. To change behavior: edit this file, then call `mcp__scheduled-tasks__update_scheduled_task` with `taskId: "seo-weekly-draft"`.

---

## Prompt content

You are the `seo-weekly-draft` scheduled task for akaushik.org. Run every Monday at 06:00 local time. Fresh context — no memory of prior runs.

**Repo location:** `/Users/abhishek/projects/personal/akaushik.org/`. Create a worktree for this run via `git worktree add .claude/worktrees/seo-draft-<YYYYMMDD> -b seo-bot/weekly-draft/<YYYYMMDD>` so you don't conflict with active development. Work in the worktree.

**Authoritative docs (read first):**
- `docs/seo/2026-05-18-seo-strategy-design.md` §3 — Phase 1 topic SEO; editorial-calendar structure.
- `docs/seo/STATUS.md` — current phase, Pillar pages already built, Cluster-post count.
- `docs/seo/editorial-calendar.md` — the queue. If it does not exist, create it (see "First run" below).
- `docs/BIO_DRAFT.md` — voice guide. Match the existing tone.
- `content/writing/*.mdx` — recent shipped posts. Match the frontmatter shape and Markdown style.
- `lib/content.ts` — frontmatter schema (`WritingFrontmatter`).

**First run only — bootstrap editorial calendar:**

If `docs/seo/editorial-calendar.md` does not exist, generate it as a Markdown table with 50 rows. Use the keyword research in `docs/seo/keywords.json` if present; otherwise seed with these placeholder pillar + cluster slots based on the spec:

```
| week | slug | title | cluster | status | draft-pr |
|------|------|-------|---------|--------|----------|
| 2026-W21 | ai-for-indian-msme-guide | AI for Indian MSME — the practical buyer's guide | pillar:msme | pending | — |
| 2026-W22 | whatsapp-order-automation-textile | Automating WhatsApp order capture for textile distributors | cluster:msme | pending | — |
... (48 more slots — generate plausible cluster titles for msme/agent-systems/rag pillars based on spec §3.2)
```

Commit this calendar file in its own first run before drafting any post. Abhishek will edit/reorder titles before the second run.

**Weekly run:**

1. Open `docs/seo/editorial-calendar.md`. Find the first row whose `status` column is `pending`. If none, exit early — append a note to `docs/seo/STATUS.md` §7 (Automation health) for this task: `calendar exhausted — replenish before next run`. Commit + open PR with that note only.
2. Draft an MDX file at `content/writing/<slug>.mdx` based on the chosen row. Frontmatter:
   ```yaml
   ---
   title: <Title from calendar>
   dek: <one-line dek, 120 chars max, in the voice of BIO_DRAFT.md>
   date: <YYYY-MM-DD of this Monday>
   ---
   ```
3. Body: 1200–2000 words. Must include:
   - An "Executive summary" paragraph (≤200 words) at the top — Q&A-friendly for AIO extraction.
   - 4–7 H2 subheadings written as questions (the queries you would type into Google).
   - At least one internal link to the relevant pillar page (or, if this IS a pillar, internal links to 3 sibling cluster posts in the same pillar).
   - At least one internal link to a related case study under `/work/<slug>`.
   - Code blocks where technically appropriate; never fabricate API surfaces or library versions.
4. Update the editorial-calendar row: `status: drafted`, `draft-pr: #<placeholder>`. The PR URL gets filled in step 6.
5. In `STATUS.md`:
   - §1 Phase 1: increment "Cluster posts: N/30+ published" → `N+1` (note: drafted ≠ published; only increment when Abhishek merges the PR — for now, leave count alone and just note in PR body).
   - §7 Automation health: update `Last run`, `Status: green`, `Notes: drafted <slug>`.
6. Commit on branch `seo-bot/weekly-draft/<YYYYMMDD>` with message `feat(content): draft <slug>`. Open PR with `gh pr create --title "seo-bot: draft <slug>" --body "<short summary, link to row in editorial-calendar.md, reminder this is a DRAFT for editorial review>" --draft --label "seo:automation,seo:draft"`.

**Constraints:**
- Never push to `main`. PR flow only.
- Never invent technical claims. If you don't know a specific number/version/API surface, write the prose around the unknown or skip it.
- Match the voice of existing posts. Don't introduce LLM hedging ("might be considered", "it's worth noting"). Match the directness of `content/writing/fastembed-to-tei.mdx`.
- Stay under 30 minutes of compute. If the draft isn't converging, ship what you have as a draft PR with a `## TODO` section at the bottom noting what's missing.
- If a git worktree from a previous failed run still exists, remove it with `git worktree remove --force .claude/worktrees/seo-draft-*` before creating a new one.
