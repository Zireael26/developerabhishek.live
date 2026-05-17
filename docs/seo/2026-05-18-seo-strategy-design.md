# SEO + AIO Strategy — akaushik.org

**Status:** Draft v0.1 (approved scope; ready for execution)
**Author:** Claude (drafting partner) — owner is Abhishek
**Date:** 2026-05-18
**Pinned HEAD:** 000ca08ce8ef7b13437a4b57e3d57b53a22b5ff1

> **This is the static plan.** Live progress, metrics, alerts, and drift logs are in [`STATUS.md`](./STATUS.md). The two are intentionally separate: plan = WHY and WHAT, status = WHERE WE ARE.

---

## 1. Goals

Three goals, prioritized:

| # | Goal | Realistic success metric | Timeline |
|---|------|--------------------------|----------|
| G1 | Rank for **client-acquisition topics** (highest priority) | Top 10 for 15+ problem-shaped queries (e.g., "automate whatsapp order textile", "ai for indian distributor"); ≥5 inbound leads/month attributed to organic search | 9–12 months |
| G2 | Identity disambiguation | Google Knowledge Panel shows Abhishek Kaushik (AI engineer) as a distinct entity with akaushik.org as official site; top result for `"abhishek kaushik" ai engineer bluehost` (qualified query, not bare name) | 6–9 months |
| G3 | AIO / generative-engine citation (downgraded — on-site signals only) | When ChatGPT/Perplexity/AIO answer questions matching case-study scope (e.g., "Fastembed → TEI migration with bge-reranker-v2-m3"), akaushik.org is cited | 12+ months, lower confidence than G1/G2 without off-site community signals |

### 1.1 Out of scope (locked)

- Outranking the @_AKKaushik politician (65K X followers), the Mahindra Uni Assistant Professor, the Sherlock LinkedIn entry, or any other established "Abhishek Kaushik" entity for the bare `abhishek kaushik` query. Identity SEO targets **disambiguation**, not displacement.
- Sustained community presence (HN, Lobsters, Reddit r/MachineLearning, r/IndianDevs). Trade-off was made knowingly — it lowers the G3 ceiling. See §5.
- Guest posts, podcast circuit, conference talks.
- Paid acquisition (Google Ads, sponsored posts).

## 2. Phase 0 — Canonical hygiene (BLOCKING, Week 1)

The single most important task. The site was renamed from `developerabhishek.live` to `akaushik.org` on 2026-04-20 per `docs/adr/0003-domain-and-canonical-url.md`. Verification on 2026-05-18 found that **none of the redirects are in place**:

```
curl -sIL https://developerabhishek.live/   →  HTTP/2 200  (serving site directly)
curl -sIL https://akaushik.dev/             →  HTTP/2 200  (serving same site)
curl -sIL https://akaushik.org/             →  HTTP/2 200  (canonical — correct)
```

Three hostnames serving identical content with no 301 chain. Six years of `developerabhishek.live` backlink equity is stranded. Google sees duplicates. Until this is fixed, every other phase is pouring water into a leaky bucket.

### 2.1 Tasks

| # | Task | Mechanism | Owner |
|---|------|-----------|-------|
| 2.1 | Set `akaushik.org` as primary domain in Vercel project; mark `akaushik.dev` and `developerabhishek.live` as **Redirect to primary domain, status code 301** | Vercel Dashboard → project → Settings → Domains | **Abhishek (manual)** |
| 2.2 | Verify 301 chain on both legacy hosts (homepage + a deep path) | `curl -sIL https://developerabhishek.live/writing/fastembed-to-tei \| head -5` — expect `301 Moved Permanently` → `Location: https://akaushik.org/writing/fastembed-to-tei` | Verified automatically by `seo-redirect-health` scheduled task (see §6) |
| 2.3 | Add `alternates: { canonical: ... }` to per-page Next metadata (root + every dynamic page) | Code change — `app/layout.tsx`, `app/work/[slug]/page.tsx`, `app/writing/[slug]/page.tsx`, etc. Helper: `lib/canonical.ts` exporting `canonical(path: string)` | Claude (code) |
| 2.4 | Verify all three properties in Google Search Console + Bing Webmaster Tools | GSC console | **Abhishek** |
| 2.5 | Submit GSC **Change of Address** from `developerabhishek.live` → `akaushik.org` | GSC → Settings → Change of Address | **Abhishek** |
| 2.6 | Submit `sitemap.xml` for `akaushik.org` to GSC + Bing | GSC | **Abhishek** |
| 2.7 | Confirm `app/sitemap.ts` emits only canonical-host URLs | Already verified — `SITE_URL = 'https://akaushik.org'` constant | ✓ |

### 2.2 Exit criteria

- 7 consecutive days of green status from `seo-redirect-health` scheduled task.
- GSC Change of Address submitted (Abhishek attests in `STATUS.md`).
- `site:akaushik.org` returns ≥ sitemap-entry-count URLs within 14 days of submission.

No other phase begins until exit met.

## 3. Phase 1 — Topic SEO foundation (Week 2 →)

### 3.1 Buyer-intent keyword discovery (Week 2)

Sources, scraped or read-only-mined:

- Google autocomplete for seeds: `whatsapp order`, `tally automation`, `textile distributor software`, `gst billing`, `inventory msme`, `ai for small business india`, `agent system production`, `rag bge reranker`, `modular monolith multi-tenant`
- Google "People Also Ask" for top 10 seed-driven SERPs
- Ahrefs free keyword generator (free tier)
- LinkedIn search auto-suggest for `MSME AI`, `textile distributor`
- Reddit thread titles in r/IndianBusinessOwners, r/SmallBusinessIndia (read-only — no posting, per Out-of-scope)

**Output:** `docs/seo/keywords.json` — array of `{query, intent, monthlyVolume, competition, buyerFit}` rows; ≥50 queries.

### 3.2 Editorial calendar

Three pillar pages (long, evergreen, internally linked from every cluster post):

| Pillar URL | Cluster theme | Cluster size |
|------------|---------------|--------------|
| `/writing/ai-for-indian-msme-guide` | MSME AI buyer education | 12–15 posts |
| `/writing/agent-systems-production-guide` | Agent engineering for senior buyers | 10–12 posts |
| `/writing/rag-in-practice-guide` | Retrieval/RAG technical depth | 8–10 posts |

50-post calendar at 1/week = ≈ 3 fully-built clusters in 12 months + room for case-study follow-ups and flagship pieces.

**Calendar file:** `docs/seo/editorial-calendar.md` — table with columns `[week, slug, title, cluster, status, draft-pr-link]`. Maintained by `seo-weekly-draft` scheduled task; hand-editable.

### 3.3 Flagship cadence

One flagship per quarter, ≥3000 words, original data or case-study depth. Candidates:

| Quarter | Candidate flagship | Source material |
|---------|---------------------|-----------------|
| 2026-Q3 | "Migrating Indian MSME ops from WhatsApp + Excel to a modular monolith — the Neev architecture" | Neev case study + ADRs |
| 2026-Q4 | "Why we replaced Fastembed ONNX with Hugging Face TEI for production reranking" (extended) | Existing fastembed-to-tei post → flagship rewrite |
| 2027-Q1 | "The agent framework behind Bluehost's AI products — design notes" | Bluehost case study (only what's publishable) |
| 2027-Q2 | "Karpathy-shaped learning — what micrograd + makemore actually teach an AI engineer" | Micrograd-makemore post → flagship rewrite |

Each flagship gets:
- Executive summary in first 200 words (LLM extraction-friendly)
- Q&A subheadings (LLMs lift these into AIO)
- Schema.org `Article` JSON-LD (already in Phase 2 scope)
- Promoted in `llms-full.txt` ordering

## 4. Phase 2 — Identity SEO infrastructure (Weeks 2–6, parallel)

| # | Task | Mechanism | Owner |
|---|------|-----------|-------|
| 4.1 | `Person` JSON-LD on root + `/about` | `<script type="application/ld+json">` in `app/layout.tsx`. Fields: `@type: Person`, `name`, `url`, `image`, `jobTitle`, `worksFor: {@type: Organization, name: "Bluehost"}`, `sameAs: [github, linkedin, x, wikidata, ...]` | Claude (code) |
| 4.2 | `Article` JSON-LD on every `/writing/*` and `/work/*` | Per-page metadata helper generating from MDX frontmatter | Claude (code) |
| 4.3 | `BreadcrumbList` schema site-wide | Component in layout | Claude (code) |
| 4.4 | **Wikidata entry** for "Abhishek Kaushik (AI engineer)" — disambiguated from politician, professor, doctor, etc. | Manual creation. Fields: `instance of: human (Q5)`, `occupation: software engineer (Q82594)`, `employer: Bluehost`, `official website: akaushik.org`, `educated at:`, `social media accounts`. Cite `akaushik.org/about` + LinkedIn + Bluehost team page as references so entry survives deletion review | **Abhishek (manual)** — see `STATUS.md` for checklist |
| 4.5 | Profile sync: identical NAP across LinkedIn, GitHub, X, Bluesky, Mastodon, dev.to, Hashnode | One-time pass, then drift-monitored monthly by `seo-monthly-profile-drift` scheduled task | **Abhishek (manual)** |
| 4.6 | GitHub: pin top 6 repos on profile, every README opens with same one-liner + akaushik.org link | Manual | **Abhishek (manual)** |
| 4.7 | OG image per page extended to `/work/[slug]` + `/writing/[slug]` | `app/opengraph-image.tsx` template per route (existing primer: `og-image-generation`) | Claude (code) — verify already done; extend if not |

### 4.1 Canonical NAP (recorded for drift monitor)

```yaml
name: Abhishek Kaushik
tagline: AI systems for businesses that haven't met AI yet
photo_url: https://akaushik.org/images/abhishek.jpg     # confirm asset path
canonical_url: https://akaushik.org
sameAs:
  - https://github.com/<handle>                         # fill from current profile
  - https://www.linkedin.com/in/<handle>
  - https://x.com/abhi2601k
  - https://bsky.app/profile/<handle>
  - https://hashnode.com/@<handle>
  - https://dev.to/<handle>
  - https://www.wikidata.org/wiki/Q<id>                 # fill after 4.4
```

The drift-monitor task reads this block from `STATUS.md` and diffs against live profiles monthly.

## 5. Phase 3 — AIO surface (on-site only)

Ceiling lowered by the no-community trade-off. On-site work still meaningful:

| Surface | State | Action |
|---------|-------|--------|
| `/llms.txt` (short digest per llmstxt.org) | Shipped | Quarterly audit by `seo-monthly-health` task (last week of quarter) |
| `/llms-full.txt` (concatenated corpus) | Shipped | Quarterly audit |
| `/.well-known/agent-skills/index.json` | Shipped per `agent-readiness-contract` primer | No action |
| `/.well-known/mcp.json` | Shipped | No action |
| `.md` alternates for content pages | Shipped (middleware Pattern A + B) | No action |
| Executive summary first 200 words on flagship posts | Pending | Editorial convention; codified in `seo-weekly-draft` task prompt |
| Q&A subheadings on flagship posts | Pending | Editorial convention; codified in task prompt |
| Named OSS repos with cross-links to akaushik.org | Pending | See §5.1 |

### 5.1 OSS repos (named, not vague)

Two repos planned, each a SEO + LLM-citation asset:

| Repo | Scope | Cross-link target |
|------|-------|-------------------|
| `msme-agent-starter` | Opinionated starter template for an MSME-focused agent service — Next.js + Bun + Postgres + Drizzle + Anthropic SDK + multi-tenant prelude | Links to `/work/neev` + `/writing/ai-for-indian-msme-guide` |
| `tei-bge-reranker-migration` | Working code + benchmarks reproducing the Fastembed → HF TEI migration with `BAAI/bge-reranker-v2-m3` | Links to `/writing/fastembed-to-tei` (flagship-rewrite version) |

Each repo:
- README opens with one-line description matching canonical NAP tagline frame
- `/docs` folder cross-linking back to akaushik.org case study or post
- LICENSE: MIT
- CONTRIBUTING.md: pointer to akaushik.org/contact

Ship target: `msme-agent-starter` Q3 2026, `tei-bge-reranker-migration` Q4 2026 (alongside flagship rewrites).

## 6. Automation — Cowork scheduled tasks

Five recurring tasks. Each runs as a fresh agent (no memory) — prompts are fully self-contained and committed alongside this spec at `docs/seo/scheduled-tasks/`.

| Task ID | Cadence (local TZ) | Purpose | Output |
|---------|--------------------|---------|--------|
| `seo-redirect-health` | Daily 07:00 | curl all three hosts (`/` + a deep path); assert 301→akaushik.org on legacy hosts, 200 on canonical | Appends to `STATUS.md` Alerts section ONLY on failure; otherwise updates "Last green check" timestamp |
| `seo-weekly-draft` | Monday 06:00 | Open `docs/seo/editorial-calendar.md`, find next `status: pending` slot, draft MDX post to `content/writing/<slug>.mdx`, open draft PR labeled `seo:draft` | PR for Abhishek to edit + merge |
| `seo-monthly-health` | 1st of month 07:00 | Audit: sitemap freshness, broken internal links (`linkinator` or equivalent), schema.org validation (`validator.schema.org` API), GSC error count if `GSC_API_TOKEN` available, Lighthouse on top 5 pages | Updates `STATUS.md` Metrics table |
| `seo-monthly-profile-drift` | 1st of month 08:00 | Fetch LinkedIn / GitHub / X / Bluesky / Wikidata public profile data; diff bio + tagline + photo + sameAs against canonical NAP block in `STATUS.md` | Appends diffs to Drift log ONLY on drift |
| `seo-quarterly-flagship` | 1st of Jan/Apr/Jul/Oct 06:00 | Propose flagship-post topic from current quarter's keyword movement + open conversations | Opens GitHub issue or appends to STATUS.md |

### 6.1 Task contract

Every task:
1. Resolves canonical repo root via `git rev-parse --git-common-dir`.
2. Operates in a fresh worktree (or main checkout if no worktree).
3. Commits changes to a branch named `seo-bot/<task-id>/<YYYY-MM-DD>`.
4. Opens a PR via `gh pr create`. **Never pushes to `main`.**
5. Sets PR title prefix `seo-bot:` so it's easy to filter.
6. Falls back gracefully if a tool is unavailable — logs to `STATUS.md` "Automation health" section, does not break.
7. Always updates `STATUS.md > Automation > Last run` table at the end.

Task prompts live at `docs/seo/scheduled-tasks/<task-id>.md`. Each task's Cowork registration uses `mcp__scheduled-tasks__create_scheduled_task` with the prompt read from these files. Editing the prompt = update the file + run `mcp__scheduled-tasks__update_scheduled_task`.

## 7. Live status doc + primer integration

### 7.1 `docs/seo/STATUS.md`

Single source of truth for current state. Sections (in order):

1. **Last updated** — ISO timestamp, manually or by scheduled task
2. **Phase progress** — checklist per phase
3. **Canonical NAP block** — the YAML in §4.1
4. **Metrics** — table refreshed monthly by `seo-monthly-health`
5. **Alerts** — appended by `seo-redirect-health` on failure
6. **Drift log** — appended by `seo-monthly-profile-drift` on drift
7. **Editorial calendar pointer** — link to `editorial-calendar.md`
8. **Automation health** — last-run timestamp + status per task
9. **Leads attributed** — manual log of inbound that traced to organic search (for G1 measurement)
10. **Human handoff queue** — outstanding manual-only tasks (Vercel config, GSC submission, Wikidata creation, profile sync)

Hand-editable. Scheduled tasks append-only to specific sections.

### 7.2 Primer integration

New primer: `.claude/primers/seo-strategy.md`. Points to:
- This spec doc
- `STATUS.md`
- `editorial-calendar.md`
- Key code locations (`lib/canonical.ts`, `app/layout.tsx` JSON-LD block, schema component)
- Scheduled-task IDs
- Last SHA

Added to `.claude/primers/INDEX.md` one-liner so the agent sees it at session start. When the agent loads the primer, it reads `STATUS.md` and immediately knows current state without re-exploration.

## 8. Measurement / Definition of Done

### 8.1 Per-phase

| Phase | Done when |
|-------|-----------|
| 0 | 7 consecutive days green from `seo-redirect-health`; GSC Change of Address submitted |
| 1 | 3 pillar pages published; 30+ cluster posts published; 12 consecutive weeks of 1-post/week cadence tracked in editorial calendar |
| 2 | Person JSON-LD validated everywhere (monthly health auto-check); Wikidata entry approved + visible; profile drift = 0 for 2 consecutive monthly audits |
| 3 | `llms.txt` + `llms-full.txt` validated quarterly; 2 named OSS repos published with cross-links; 1 flagship per quarter shipped |

### 8.2 Overall snapshots

- **6-month review (2026-11-18):** G2 signal — qualified-query rank improving, all schema valid. G1 cluster ≥ 50% built. Phase 0 fully exited.
- **12-month review (2027-05-18):** G1 inbound — ≥3 leads in `STATUS.md > Leads attributed`. G2 — Knowledge Panel visible OR Wikidata entry stable. G3 — at least 1 documented AIO citation.

## 9. Human handoff queue (cannot be automated)

These require Abhishek personally:

1. Vercel dashboard — set primary domain + redirects (§2.1).
2. Google Search Console — verify all three properties; submit Change of Address; submit sitemap (§2.4–2.6).
3. Bing Webmaster Tools — same as GSC.
4. Wikidata — create entry; provide references (§4.4).
5. Profile sync — LinkedIn, GitHub, X, Bluesky, dev.to, Hashnode bios + photos (§4.5).
6. GitHub profile — pin top 6 repos, update README (§4.6).
7. Editorial review — every `seo-weekly-draft` PR needs human editorial pass before merge.
8. Cowork app: keep open enough hours/week for scheduled tasks to fire (or accept deferred-to-next-launch behavior).

Tracked in `STATUS.md > Human handoff queue`.

## 10. Risks + mitigations

| Risk | Mitigation |
|------|-----------|
| GSC Change of Address requires both properties verified for ≥180 days. `developerabhishek.live` may not qualify if recently verified. | Use 301 + `sameAs` Wikidata + GSC sitemap submission as primary recovery; CoA is bonus |
| 1-post/week cadence slips → topic authority stalls | `seo-weekly-draft` PR creates accountability; missed week visible in editorial-calendar status |
| Scheduled tasks fire only when Cowork is open → drift detection delayed | Acceptable for monthly cadence tasks; for `seo-redirect-health` add a backup: GitHub Actions cron (issue if cron-on-actions becomes desirable later) |
| Wikidata entry deleted by editors as non-notable | Cite akaushik.org/about + LinkedIn + Bluehost team page + any external press as references; re-submit if deleted |
| AI overviews change citation algorithms (likely in 12-month window) | Plan reviewed at 6-month checkpoint; AIO ceiling acknowledged as lower-confidence goal |
| Off-site scope expansion needed for G3 | If 12-month AIO citation = 0, revisit community-presence trade-off with new evidence |

## 11. References

- ADR-0003 — domain + canonical URL decision
- `agent-readiness-contract` primer — already-shipped LLM/agent surfaces
- `og-image-generation` primer — existing OG infrastructure (extend per 4.7)
- `docs/PRD.md` — product context, MSME thesis
- `docs/BIO_DRAFT.md` — tagline + bio variants for NAP
- `docs/AGENT_READINESS.md` — Cloudflare isitagentready.com compliance contract
- Cloudflare Web Analytics — analytics surface (NOT @vercel/analytics — per project conventions)

---

**End of static plan.** All progress, alerts, and metrics live in `STATUS.md`. All scheduled-task prompts live in `docs/seo/scheduled-tasks/`.
