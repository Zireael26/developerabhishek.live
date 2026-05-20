# ADR 0003 — Canonical domain: `akaushik.org` (with `akaushik.dev` as alias)

**Status:** Accepted · 2026-04-20

## Context

The v1 site shipped under `developerabhishek.live`. Three forces required a domain decision before further build work:

1. **Dictation failure.** 22 characters with a `.live` TLD that reads as "dot live" — fails the voice-and-whiteboard test. The MSME primary audience should be able to type the host from memory after a single pass; `developerabhishek.live` does not clear that bar.
2. **Canonical URL is ship-blocking.** `metadataBase`, `robots.txt`, `llms.txt`, every `/.well-known/*` manifest, and the RFC 8288 `Link` headers in `middleware.ts` bake the canonical host into the agent-readiness surface. Changing it after a public deploy forces a full crawl-retry cycle and breaks any agent that cached the manifest hashes.
3. **Cloudflare + Vercel wiring is happening this session.** DNS records and SSL go in once; flipping a canonical after the records are live and indexed is meaningfully more painful than picking it up front.

This ADR settles open questions Q1 and Q5 in `docs/PRD.md`.

## Decision

- **Register both** `akaushik.org` and `akaushik.dev`. Two-year terms, Cloudflare DNS, Full (strict) SSL, proxy on (orange cloud) for Cloudflare bot-management of AI crawlers.
- **Canonical: `akaushik.org`.** All `metadataBase`, `Link` headers, `llms.txt`, `mcp.json`, `agent-skills/index.json`, OG URLs, sitemap entries, and `mailto:` addresses point here.
- **`akaushik.dev` 308-redirects to `akaushik.org`** at the Vercel domain level (not `next.config.ts` redirects — redirect at the edge so requests never reach origin). Held defensively + as a future developer-audience sub-brand if the writing surface ever splits.
- **Sunset `developerabhishek.live`.** Do not renew. Before the renewal date, deploy a catch-all `308` to `https://akaushik.org/$1` from the existing project's `vercel.json`. Keep the redirect live for the remainder of the registration window so backlinks degrade gracefully.

## Consequences

**Positive**

- `akaushik.org` matches the "quiet craft object" north star — `.org` reads as personal site / independent practice, not storefront. 8-char host passes the dictation test. The bare name doubles as identity reinforcement (lead asks "what's your domain?" → "akaushik dot org" maps cleanly to LinkedIn `abhishek26k`).
- Dual registration means `.dev` is in hand if a developer-audience sub-brand emerges (writing on agents, micrograd-style teardowns).
- Cloudflare in front unlocks the bot-management dashboard our `robots.txt` Content Signals declarations want to be backed by.

**Negative**

- Existing backlinks (GitHub README, LinkedIn About, prior posts referencing `developerabhishek.live`) will redirect for ~12 months, then 404. Manual cleanup of the high-traffic ones is on the migration checklist.
- Social bios (LinkedIn, GitHub profile site link, X bio) need a synchronized update before any public announcement so the canonical host appears everywhere at once.
- One-time content edit pass across `app/`, `public/`, and `docs/` to scrub `developerabhishek.live` references. Tracked in CHANGELOG.

**Neutral**

- Annual cost: ~$25/yr combined (`.org` ~$12, `.dev` ~$13). Cloudflare Universal SSL is free.

## Alternatives considered

- **Renew `developerabhishek.live`.** Rejected on length + dictation grounds (the originating issue).
- **Handle-based domain (`zireael.dev` / `zireael.ai`).** Rejected: Abhishek's public surfaces (LinkedIn `abhishek26k`, GitHub `Zireael26`, X `@abhi2601k`, Neev commits signed under his legal name) are name-anchored. A handle splits identity across two namespaces and costs the Neev-as-anchor legibility for MSME lead attribution.
- **`akaushik.com`.** Unavailable (registered).
- **`a-kaushik.com`.** Available but rejected: hyphen fails the dictation test ("a dash kaushik dot com") and silently leaks traffic to whoever owns the un-hyphenated `.com` typosquat.
- **`akau.sh` / `byak.dev`.** Both rejected: require explanation. The MSME primary audience does not parse `.sh` as a TLD joke or `byak` as a "by AK" contraction.

## Follow-ups (tracked outside this ADR)

- **Cloudflare Email Routing** for `hello@akaushik.org` → `abhishek.nexus26@gmail.com`. Must be live before the site goes public — the contact section's CTA links to `mailto:hello@akaushik.org` and the mailbox needs to actually receive.
- **Vercel project domains:** add both `akaushik.org` and `akaushik.dev`; mark `.org` as production primary; configure `.dev` as a permanent (308) redirect to `.org` via Vercel's domain panel.
- **Social bio sync:** LinkedIn, GitHub profile site URL, and X bio all updated to `https://akaushik.org` in a single coordinated pass before announcement.
- **Repo rename** from `developerabhishek.live` → `akaushik.org` (matches canonical + `personal/` directory convention). Covered in `docs/CHANGELOG.md` under the cutover entry.
- **`vercel.json` redirect** on the legacy project pointing `developerabhishek.live/*` → `https://akaushik.org/$1` (308) before the registration lapses.

## Outcome (2026-05-19)

The sunset planned in §15.D played out as expected, plus one un-planned escalation:

- **`developerabhishek.live` registration was not renewed and has now lapsed.** The owner no longer holds the domain. Per Cloudflare DNS the zone is gone; `curl` against the host returns no response on 2026-05-19.
- **The `vercel.json` catch-all 308 plan is moot.** Without ownership there is no project to deploy it on. Backlinks to legacy paths (high-traffic items were manually cleaned during the 2026-04-20 → 2026-05-19 window per the Consequences section above) will now 404 directly rather than redirect.
- **Equity-recovery falls back to the two paths that don't depend on the legacy domain:** (a) Wikidata `Person` entry with `sameAs: akaushik.org` and references to LinkedIn / GitHub / Bluehost (tracked as STATUS.md H5), (b) GSC sitemap submission for the new canonical (STATUS.md H4). These were already planned as belt-and-braces; they're now load-bearing on their own.
- **GSC Change of Address (was Phase 0 §2.5) is dropped.** A CoA requires both source and destination properties verified in GSC for ≥180 days; the source no longer exists, so the option is closed. The on-site signals already shipped (`Person` + `Organization` JSON-LD, canonical link tags, sitemap, llms.txt, agent-readiness Link headers) are the recovery surface.
- **No new ADR.** The lapse is the outcome of this ADR's decision, not a new architectural choice. The CHANGELOG entry for 2026-05-19 records the scrub PR that flushed operational doc references.

`akaushik.dev` 308 → `akaushik.org` remains the lone live redirect on the Vercel project. Phase 0 of the SEO program (`docs/seo/2026-05-18-seo-strategy-design.md §2`) is updated accordingly.
