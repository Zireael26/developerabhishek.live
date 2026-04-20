# ADR 0001 — Next.js 16.2 over SvelteKit for the v2 rewrite

**Status:** Accepted · 2026-04-20

## Context

The v1 portfolio at `developerabhishek.live` was a SvelteKit application. It was pleasant to work on, but the broader stack we rely on for adjacent projects (notably `tgsc`) is standardized on Next.js App Router with React Server Components. Recurrent friction points:

1. **Ecosystem gravity.** shadcn/ui v4, the react-three-fiber / drei universe, and the MDX tooling we want for case studies all have first-class React support. SvelteKit ports exist but always lag.
2. **Cross-project portability.** Components, hooks, and process conventions I write for `tgsc` should be copy-paste compatible. Two frameworks in the portfolio means maintaining two sets of conventions.
3. **Agent-readiness primitives.** Next.js middleware + App Router route handlers map cleanly to the RFC 8288 Link headers, `/.well-known/*` endpoints, and MCP server card we need to pass `isitagentready.com`.
4. **Hiring signal.** The portfolio's primary audience (MSMEs + technical buyers) expects a React/Next.js stack; the secondary audience (potential collaborators) uses it as a baseline read on my stack familiarity.

## Decision

Migrate to **Next.js 16.2 LTS** with App Router, React 19.2, TypeScript 6.0, Tailwind 4.2 CSS-first, shadcn/ui v4, pnpm 10, Node 22 LTS.

The SvelteKit source is preserved at git tag `legacy-v1-final` for reference. The v1 domain `developerabhishek.live` was retained at the time of this ADR; the canonical host moved to `akaushik.org` on 2026-04-20 — see ADR-0003.

## Consequences

- **Positive:** Stack parity with `tgsc` unlocks shared tooling (process-gate script, ADR template, CHANGELOG conventions). The react-three-fiber implementation of The Wanderer companion is near-drop-in from the Claude Design reference. MDX-first content pipeline is native.
- **Negative:** Initial bundle is larger than Svelte's compiled output; we'll need a bundle-budget ADR during Phase 3 to stay honest. Lose the elegance of Svelte's compiler-free runtime — the trade is worth it for ecosystem reach.
- **Neutral:** Vercel deployment story is identical.

## Alternatives considered

- **Stay on SvelteKit and port components.** Rejected: does not address ecosystem gravity or cross-project portability.
- **Astro + islands.** Rejected: weaker story for stateful, animated surfaces (The Wanderer, tweak mode) and no shared convention pool with `tgsc`.
- **Remix / React Router 7.** Rejected: smaller ecosystem for MDX-first content and less mature static-output story.
