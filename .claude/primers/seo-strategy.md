---
slug: seo-strategy
purpose: SEO + AIO program for akaushik.org — three-goal plan, per-page canonical + JSON-LD wiring, five Cowork scheduled tasks, live status doc, human-required handoff queue.
pinned_to: 000ca08ce8ef7b13437a4b57e3d57b53a22b5ff1
created: 2026-05-18
last_refreshed: 2026-05-18
related_primers: [agent-readiness-contract, mdx-content-pipeline, og-image-generation]
---

# SEO Strategy

## Purpose

Build search + AIO discovery for `akaushik.org` against three prioritized goals: (G1) rank for client-acquisition queries that bring MSME buyers, (G2) win identity disambiguation via Knowledge Panel + Wikidata + schema, (G3) get cited in AI Overviews / ChatGPT / Perplexity for case-study-shaped engineering questions. G3 ceiling is acknowledged-lower because the community-presence lever (Reddit/HN) was kept off the table; on-site signals only.

Plan written 2026-05-18 after the canonical-host rename (`developerabhishek.live` → `akaushik.org`, ADR-0003) revealed that legacy 301 redirects were never wired — six years of backlink equity was stranded. Phase 0 fixes that; everything else is downstream.

## Entry points

- `docs/seo/2026-05-18-seo-strategy-design.md` — the static plan. Goals, phases, success metrics, risks. Read this before changing program direction.
- `docs/seo/STATUS.md` — **live status doc**. Phase progress, canonical NAP block, metrics, alerts, drift log, automation health, leads attributed, human handoff queue. Read this every session to know current state without re-exploration.
- `docs/seo/editorial-calendar.md` — 50-slot publishing calendar (seeded by `seo-weekly-draft` first run).
- `docs/seo/scheduled-tasks/*.md` — self-contained prompts for the five Cowork scheduled tasks. Edit these files + call `mcp__scheduled-tasks__update_scheduled_task` to change task behavior.
- `lib/canonical.ts` — helper exporting `canonical(path)` for per-page `alternates.canonical` metadata.
- `lib/seo/jsonld.ts` — Schema.org JSON-LD builders for `Person`, `Article`, `BreadcrumbList`.
- `app/layout.tsx` — `Person` + `BreadcrumbList` JSON-LD injection point (root-only).
- `app/writing/[slug]/page.tsx` + `app/work/[slug]/page.tsx` — `Article` JSON-LD per-page injection.

## Data flow

How discovery + automation thread together:

1. Crawler hits `akaushik.org/<any-page>`. Receives canonical link (per-page via `alternates.canonical`), `Person` JSON-LD (root), `Article` JSON-LD (on content pages), `BreadcrumbList` JSON-LD. `Link:` headers advertise `llms.txt`, `llms-full.txt`, sitemap, agent-skills, `.md` alternates (per `agent-readiness-contract` primer).
2. Legacy hosts (`developerabhishek.live`, `akaushik.dev`) **must** 301-redirect to canonical at the Vercel layer. Daily verification by `seo-redirect-health` scheduled task; on failure appends to `STATUS.md > Alerts` and opens a PR with the failure transcript.
3. Editorial calendar drives content. `seo-weekly-draft` runs Monday 06:00, picks next `status: pending` slot, drafts MDX, opens draft PR labeled `seo:draft`. Abhishek edits + merges.
4. Monthly: `seo-monthly-health` runs validator.schema.org + lighthouse + sitemap checks, refreshes `STATUS.md > Metrics` row for the current month. `seo-monthly-profile-drift` reads canonical NAP block from `STATUS.md`, fetches public profile data from each `sameAs` URL, diffs, appends to `STATUS.md > Drift log` on mismatch.
5. Quarterly: `seo-quarterly-flagship` proposes a flagship-post topic and opens an issue / PR with the brief.
6. Every scheduled task commits to branch `seo-bot/<task-id>/<YYYY-MM-DD>` and opens a PR. **Never push to main.**

## Dependencies

- **External (account-bound, Abhishek-only):** Vercel project domains config; Google Search Console + Bing Webmaster Tools verification; GSC Change-of-Address; Wikidata entry; LinkedIn / GitHub / X / Bluesky / dev.to / Hashnode profile editing. Status tracked in `STATUS.md > Human handoff queue`.
- **Internal code:** `lib/canonical.ts`, `lib/seo/jsonld.ts`, `app/sitemap.ts` (existing), `middleware.ts` (existing, already emits Link headers).
- **Tooling (used by scheduled tasks):** `gh` CLI for PR creation; `curl` for redirect health; `linkinator` or equivalent for internal-link audit; `validator.schema.org` HTTP API; Lighthouse (npm package or pnpm script).
- **Cowork scheduled-tasks MCP:** `mcp__scheduled-tasks__create_scheduled_task` / `list` / `update`. Task storage at `/Users/abhishek/.claude/scheduled-tasks/<task-id>/SKILL.md`. Tasks fire only while Cowork app is open (or on next launch for deferred runs).
- **Related primers:** `agent-readiness-contract` (LLM/agent surfaces already shipped), `og-image-generation` (per-page OG images; extend per spec §4.7), `mdx-content-pipeline` (drives content + listing endpoints feeding `llms-full.txt`).

## Test commands

```bash
# Redirect health (Phase 0 exit criterion — should chain 301 after Vercel config)
curl -sIL https://developerabhishek.live/                                | head -8
curl -sIL https://developerabhishek.live/writing/fastembed-to-tei        | head -8
curl -sIL https://akaushik.dev/                                          | head -8
curl -sIL https://akaushik.org/                                          | head -8   # should be 200, no chain

# Schema validation (post-Phase-2)
curl -s https://akaushik.org/ | grep -oE '<script type="application/ld\+json">[^<]*' | head -3
# Or against validator.schema.org:
#   POST https://validator.schema.org/validate  body: {url: "https://akaushik.org/"}

# Sitemap freshness
curl -s https://akaushik.org/sitemap.xml | head -20

# llms.txt and llms-full.txt (already shipped per agent-readiness-contract)
curl -s https://akaushik.org/llms.txt | head -20
curl -s https://akaushik.org/llms-full.txt | wc -c    # byte-size growth = content compounding

# List + check scheduled tasks
# (use mcp__scheduled-tasks__list_scheduled_tasks via the MCP tool — no CLI)
```

## Gotchas

- **Cowork-only scheduling.** Scheduled tasks fire only when the Cowork app is open. The daily `seo-redirect-health` task is the most cadence-sensitive — if Cowork is closed for days, redirect drift detection is delayed. Acceptable trade-off; if it becomes load-bearing, mirror to GitHub Actions cron.
- **Fresh-context tasks.** Every scheduled run starts with no memory of any prior conversation, no prior session context, no prior status. Prompts at `docs/seo/scheduled-tasks/<id>.md` MUST be fully self-contained: where the repo is, which branch to work on, which files to read, what to do, where to commit, how to open the PR. Reference `STATUS.md` as the single source of state.
- **Never push to main.** Trellis `pre-push` husky hook blocks direct-to-main anyway, but the task prompts explicitly enforce PR flow via `seo-bot/<task-id>/<date>` branches. Editorial review is the gate.
- **Wikidata deletion risk.** First-pass entries for non-famous individuals get deleted by editors as "non-notable." Cite akaushik.org/about + LinkedIn + Bluehost team page + any external press as references. Re-submit with additional sources if deleted.
- **GSC Change of Address requires both properties verified for ~180 days.** `developerabhishek.live` may not qualify if it was only recently re-verified. Fallback path: 301s + `sameAs` Wikidata + sitemap re-submission still recovers most equity even without CoA.
- **Canonical NAP block.** Lives in `STATUS.md §2`. Editing it changes what the drift monitor compares against — keep deliberately current. Empty fields = "ignore this `sameAs`" (TODO until filled).
- **AIO ceiling.** No community presence (HN/Reddit/Lobsters off the table) caps how often AI Overviews cite this site. If 12-month review shows zero AIO citations, the no-community trade-off should be re-litigated with new evidence — not silently absorbed.
- **Per-page canonical, not site-wide.** Next's `metadataBase` alone does NOT emit `<link rel="canonical">`. Each page (root + every dynamic route's `generateMetadata`) must set `alternates: { canonical: '/<path>' }`. Helper `canonical()` in `lib/canonical.ts` exists to keep this consistent.
