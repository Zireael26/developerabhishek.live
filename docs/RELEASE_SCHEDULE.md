# Release schedule — drafts batch 1

Planned publication cadence for the four drafts that landed in PR [#TBD] (`feat/drafts-batch-1`). All four ship with `draft: true` frontmatter (writing) or `draft: true` field (case-study row) and are invisible to production today. Releasing each one is a one-line frontmatter flip + commit + push.

This file is disposable — delete it once every row below is shipped.

## Cadence

| Date | Slot | Piece | Action |
|---|---|---|---|
| 2026-05-20 (Wed) | infra | [PR #80](https://github.com/Zireael26/akaushik.org/pull/80) — commits widget fix + draft system | Merge PR A |
| 2026-05-22 (Thu) | writing | `content/writing/process-gate-stack-profiles.mdx` | Flip `draft: true` → `draft: false`, commit, push |
| 2026-05-24 (Sat) | writing | `content/writing/native-git-hooks-for-non-node.mdx` | Same |
| 2026-05-26 (Mon) | writing | `content/writing/renaming-projects.mdx` | Same |
| 2026-05-26 (Mon) | case study | `content/case-studies/clusterbid.mdx` + `components/sections/Work.tsx` | Flip MDX draft; finish prose; **also add the `CASE_STUDIES` row** (currently a TODO comment because `ReelSlug` is closed) and ship the matching reel component under `components/work/reels.tsx` |

## Per-piece flip checklist (writing)

1. `cd content/writing && $EDITOR <slug>.mdx`
2. Change `draft: true` → `draft: false`. Tweak the `date:` to the actual ship date if it has drifted.
3. `pnpm typecheck && pnpm test`
4. `git add content/writing/<slug>.mdx docs/CHANGELOG.md`
5. Add a `### Added` line to `docs/CHANGELOG.md` under `[Unreleased]`.
6. `git commit -m "feat(content): publish '<title>'"`
7. `git push`

The `Refresh GitHub stats` workflow daily cron is on the same calendar; no action needed there.

## ClusterBid case study — extra work to do at flip time

The skeleton in `content/case-studies/clusterbid.mdx` carries section headers + italic prompts only. Before flipping `draft: true` → `draft: false`:

1. Write prose under each section (Context / Problem / Approach / What shipped / Scope).
2. Fill the `role:` frontmatter field with the real role (placeholder today).
3. Extend `ReelSlug` in `components/work/reels.tsx` to include `'clusterbid'` and add a matching reel component + entry in the reels map.
4. Replace the TODO comment in `components/sections/Work.tsx` with the actual `CASE_STUDIES` entry (template in the TODO comment).
5. Optional: produce a HyperFrames reel under `scripts/hyperframes/` for `clusterbid` (ADR-0011 policy — non-visual posts can defer).

## Why drafts in the repo at all

Two reasons. First, every piece passes typecheck/lint/test against the production toolchain — there's no "preview branch" or staging site to keep in sync. Second, the drafts are searchable, diffable, and reviewable by future-me through plain `git log`; an external draft service (Notion, Drafts.app) loses that.

The cost: a `_test-draft.mdx` fixture lives in `content/writing/` to exercise the filter, and the slug `_test-draft` appears in `getAllPosts(..., { includeDrafts: true })` results. Both are intentional.
