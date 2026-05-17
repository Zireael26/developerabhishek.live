# SEO + AIO Status — akaushik.org

> Live status doc. **Plan lives in [`2026-05-18-seo-strategy-design.md`](./2026-05-18-seo-strategy-design.md).** Scheduled tasks append to this file; humans hand-edit. Order of sections is load-bearing — automation reads + writes by anchor.

**Last updated:** 2026-05-18T00:00:00+05:30 (seed)
**Active phase:** Phase 0 — canonical hygiene

---

## 1. Phase progress

### Phase 0 — Canonical hygiene (BLOCKING)
- [ ] 2.1 Vercel: set `akaushik.org` as primary; mark `akaushik.dev` + `developerabhishek.live` as 301-redirect-to-primary **(Abhishek)**
- [ ] 2.2 Verify 301 chain on both legacy hosts via `seo-redirect-health` for 7 consecutive days
- [x] 2.3 Add `alternates.canonical` to per-page Next metadata (helper + per-page wiring) — landed in spec PR
- [ ] 2.4 Verify all three properties in GSC + Bing Webmaster Tools **(Abhishek)**
- [ ] 2.5 Submit GSC Change of Address: `developerabhishek.live` → `akaushik.org` **(Abhishek)**
- [ ] 2.6 Submit `sitemap.xml` for `akaushik.org` to GSC + Bing **(Abhishek)**
- [x] 2.7 `app/sitemap.ts` emits canonical-host URLs only (verified)

### Phase 1 — Topic SEO foundation
- [ ] 3.1 Buyer-intent keyword discovery → `docs/seo/keywords.json` (≥50 queries)
- [ ] 3.2 Editorial calendar seeded → `docs/seo/editorial-calendar.md` (50 slots)
- [ ] 3.2 Pillar page: `/writing/ai-for-indian-msme-guide`
- [ ] 3.2 Pillar page: `/writing/agent-systems-production-guide`
- [ ] 3.2 Pillar page: `/writing/rag-in-practice-guide`
- [ ] 3.3 Flagship 2026-Q3: Neev architecture deep-dive
- [ ] 3.3 Flagship 2026-Q4: Fastembed → TEI extended
- [ ] Cluster posts: 0/30+ published

### Phase 2 — Identity SEO
- [x] 4.1 `Person` JSON-LD on root + `/about` (landed in spec PR)
- [x] 4.2 `Article` JSON-LD on every `/writing/*` and `/work/*` (landed in spec PR)
- [x] 4.3 `BreadcrumbList` schema site-wide (landed in spec PR)
- [ ] 4.4 Wikidata entry created + survived first deletion review **(Abhishek)**
- [ ] 4.5 Profile NAP sync across all 6 platforms **(Abhishek)**
- [ ] 4.6 GitHub profile: pin top 6 repos + README cross-link akaushik.org **(Abhishek)**
- [ ] 4.7 OG image per page extended to `/work/[slug]` + `/writing/[slug]`

### Phase 3 — AIO on-site
- [x] llms.txt + llms-full.txt (already shipped per `agent-readiness-contract`)
- [x] .well-known/agent-skills + mcp.json (shipped)
- [x] .md alternates (shipped)
- [ ] OSS repo: `msme-agent-starter` (target 2026-Q3)
- [ ] OSS repo: `tei-bge-reranker-migration` (target 2026-Q4)

---

## 2. Canonical NAP (drift-monitor reads this block)

```yaml
name: Abhishek Kaushik
tagline: AI systems for businesses that haven't met AI yet
photo_url: https://akaushik.org/images/abhishek.jpg     # TODO: confirm asset exists at this path
canonical_url: https://akaushik.org
sameAs:
  - https://github.com/<handle>                         # TODO: fill from current profile
  - https://www.linkedin.com/in/<handle>                # TODO: fill
  - https://x.com/abhi2601k
  - https://bsky.app/profile/<handle>                   # TODO: fill or remove
  - https://hashnode.com/@<handle>                      # TODO: fill or remove
  - https://dev.to/<handle>                             # TODO: fill or remove
  - https://www.wikidata.org/wiki/Q<id>                 # TODO: fill after entry approved
```

---

## 3. Metrics

Refreshed monthly by `seo-monthly-health` scheduled task.

| Metric | 2026-05 | 2026-06 | 2026-07 | Target (12mo) |
|--------|---------|---------|---------|----------------|
| Pages indexed (akaushik.org, GSC) | — | — | — | ≥ sitemap count |
| Pages indexed (developerabhishek.live remnant) | — | — | — | 0 (all 301'd) |
| Top-10 ranking queries (problem-shaped) | — | — | — | ≥15 |
| Top-10 ranking queries (identity-qualified) | — | — | — | ≥3 |
| Wikidata entry status | not-created | — | — | live + cited |
| Schema validation errors (validator.schema.org) | — | — | — | 0 |
| Broken internal links | — | — | — | 0 |
| Lighthouse mobile (home, p95) | — | — | — | ≥90 |
| `llms-full.txt` byte size | — | — | — | grows with content |
| Inbound organic leads attributed (manual log) | 0 | — | — | ≥5/month |

---

## 4. Alerts

`seo-redirect-health` appends ONLY on failure. Empty section = healthy.

_(none)_

---

## 5. Drift log

`seo-monthly-profile-drift` appends ONLY on drift. Empty section = NAP consistent.

_(none)_

---

## 6. Editorial calendar

→ [`editorial-calendar.md`](./editorial-calendar.md)

_(not yet seeded — first `seo-weekly-draft` run will fail gracefully and update Automation health below)_

---

## 7. Automation health

| Task ID | Cadence | Last run | Status | Notes |
|---------|---------|----------|--------|-------|
| `seo-redirect-health` | Daily 07:00 | — | not-yet-fired | seeded |
| `seo-weekly-draft` | Mon 06:00 | — | not-yet-fired | seeded; awaits editorial-calendar.md |
| `seo-monthly-health` | 1st 07:00 | — | not-yet-fired | seeded |
| `seo-monthly-profile-drift` | 1st 08:00 | — | not-yet-fired | seeded; awaits NAP fill-in |
| `seo-quarterly-flagship` | Quarterly 06:00 | — | not-yet-fired | seeded |

---

## 8. Leads attributed

Manual log. Append `[YYYY-MM-DD] <source query or page> → <outcome>` per inbound lead traced to organic search.

_(none)_

---

## 9. Human handoff queue

Outstanding manual-only tasks. Roll items into Phase progress checkboxes (§1) when complete.

| # | Task | Where | Status |
|---|------|-------|--------|
| H1 | Vercel: set primary domain + 301 redirects | Vercel dashboard | pending |
| H2 | GSC + Bing Webmaster: verify all three properties | GSC console | pending |
| H3 | GSC: submit Change of Address | GSC | pending |
| H4 | GSC + Bing: submit sitemap.xml | GSC | pending |
| H5 | Wikidata: create entry "Abhishek Kaushik (AI engineer)" with references | wikidata.org | pending |
| H6 | Profile NAP sync (LinkedIn, GitHub, X, Bluesky, dev.to, Hashnode) | each platform | pending |
| H7 | GitHub profile: pin 6 repos + README cross-link | github.com | pending |
| H8 | Fill canonical-NAP block (§2) with real handles + Wikidata Q-id once H5 done | this file | pending |
| H9 | Editorial review of weekly draft PRs | GitHub | recurring |
| H10 | Register the 5 Cowork scheduled tasks (each prompts an approval dialog) — see `docs/seo/scheduled-tasks/REGISTER.md` | Cowork session | pending |
