# ADR-0006 — Content negotiation for Markdown (Patterns A + B)

**Status:** Accepted, 2026-04-21
**Context:** Phase 4.3 (plan §4.3). Implements AGENT_READINESS §4.1.
**Author:** Claude (Code), co-author to Abhishek Kaushik.

## Context

Agent crawlers and retrieval consumers want Markdown, not HTML. `isitagentready.com` checks the site against two industry conventions for exposing Markdown alongside HTML:

1. **Path suffix** — "every HTML page has a `.md` alternate at the same path with `.md` appended" (`/work/neev` → `/work/neev.md`).
2. **Header negotiation** — a request with `Accept: text/markdown` returns the Markdown variant at the canonical path.

Both patterns have real-world traction. The scan accepts either, but shipping both is strictly better: `.md` suffix is cache-friendly and trivially curl-able; header negotiation plays well with agents that don't know about suffixes in advance.

## Decision

Ship both.

### Pattern B (path suffix) — load-bearing

- Route Handlers at `app/work/[slug]/md/route.ts` and `app/writing/[slug]/md/route.ts`, each returning `text/markdown; charset=utf-8`. Canonical internal URL is `/work/<slug>/md`. `generateStaticParams` prerenders all known slugs, matching the HTML `page.tsx` siblings.
- `middleware.ts` rewrites `/work/<slug>.md` → `/work/<slug>/md` and the same for `/writing`. External URL shape is the `.md` suffix the spec calls for; internal routing is a clean subpath.
- Each MDX body already leads with `# <title>` + `> <dek>` per AGENT_READINESS §4.4, so the handler appends only the frontmatter metadata list + canonical URL. Same shape the `/llms-full.txt` corpus uses — keep the two in sync.
- `Link: <https://akaushik.org/.../\<slug\>>; rel="canonical"` attached so agents know the HTML URL is the canonical identity.

### Pattern A (header negotiation) — additive

- Same middleware checks `Accept: text/markdown` (specifically, it must be the **preferred** type — first in the comma-list — so browsers' default `text/html,...` headers don't trigger it).
- When the header matches and the path is one that has a `.md` alternate (`/work/[slug]` or `/writing/[slug]`), middleware rewrites to the `/md` variant.
- HTML responses on those pages advertise the alternate via `Link: </work/neev.md>; rel="alternate"; type="text/markdown"`.

### Scope cut (deferred)

The plan proposed handlers at `app/about/md/route.ts` and `app/services/md/route.ts`. These aren't shipped here because `/about` and `/services` don't exist as standalone pages — both live as sections on the home composite. Adding the pages is Phase 2.2-adjacent scope creep. The `<about>` and `<services>` blocks are in `/llms-full.txt`, which satisfies corpus-completeness for retrieval consumers. Revisit if/when the sections promote to their own pages.

## Consequences

**Good:**
- `isitagentready.com` content-negotiation check passes on both axes.
- `.md` alternates are prerendered + edge-cached (5 minute SWR), so cost is zero at steady state.
- Metadata-list shape is shared with the `/llms-full.txt` corpus — one place to fix if the schema evolves.

**Costs:**
- Eight prerendered `.md` pages (4 case studies + 3 writing posts, + one near-future Bluehost stub growth) in the build output. Trivial.
- Middleware matcher had to be loosened to allow `.md` paths through. The new matcher still excludes Next.js internals and common static assets, but the `.*\..*` exclusion shortcut is gone. Watch for regressions where a newly-added asset type triggers middleware it shouldn't.

**Risks (plan Risk R4):**
- Vercel Edge Runtime has been historically flaky with header-driven rewrites on streaming responses. Pattern A could misbehave in production while Pattern B is unaffected. If the preview smoke shows Pattern A breaking, disable it (single `if` guard) and ship Pattern B alone — isitagentready.com is satisfied.

## Alternatives considered

**Pattern A alone (header-only).** Cleanest in theory — one canonical URL, content-type varies by `Accept`. Rejected because `isitagentready.com` specifically checks for the `.md` suffix shape, and header-driven rewrites are the R4 flaky path; shipping only the risky half is bad hygiene.

**Pattern B alone (suffix-only).** Would satisfy the scan and drop middleware complexity. Rejected because agents that discover the `rel="alternate"` advertisement will try `Accept: text/markdown` first; supporting both is cheap insurance.

**`.md` suffix via filename-in-slug (`app/work/[slug].md/route.ts`).** Next.js App Router treats `.` in segment names inconsistently. A middleware rewrite from public `.md` URL to an internal subpath keeps the routing table uncluttered.

## Follow-ups

- When Phase 2.2 ships `/about` and `/services` pages, add `app/about/md/route.ts` and `app/services/md/route.ts` with the same pattern. Advertise the alternate in the respective page Link headers.
- Phase 5.3 regression: re-run the smoke curl matrix against production. If Pattern A 500s on streaming responses, add a Pattern-A-off flag here and document in Risk R4 status.
