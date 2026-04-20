# developerabhishek.live

Abhishek Kaushik's personal portfolio — a sales-artifact-grade site that reads as a quiet, confident craft object. AI systems for businesses that haven't met AI yet.

**Live:** https://developerabhishek.live

> This repository is mid-rewrite. The prior SvelteKit build is archived at the `legacy-v1-final` tag. The current branch is a Next.js 16.2 scaffold that Claude Code will flesh out against the Claude Design reference.

## Stack

| Layer | Choice | Reason |
| --- | --- | --- |
| Framework | Next.js 16.2 LTS (App Router) | Matches `tgsc`; stable server/client boundary; edge-ready |
| Language | TypeScript 6.0 (strict) | `noUncheckedIndexedAccess`, `verbatimModuleSyntax`-ready |
| UI | React 19.2 | Actions, `use`, server components |
| Styling | Tailwind 4.2 (CSS-first, no `tailwind.config.ts`) | Tokens live in `app/globals.css` under `@theme` |
| Components | shadcn/ui v4 | Re-skinned with forest-on-parchment tokens |
| 3D | react-three-fiber + drei | The Wanderer (low-poly paper crane companion) |
| Motion | Framer Motion + GSAP | Micro-interactions + scroll timeline |
| Content | MDX (App Router `mdx-rs`) | Case studies, writing, skill cards |
| Package manager | pnpm 10 | Same as `tgsc` |
| Runtime | Node 22 LTS | See `.nvmrc` |
| Host | Vercel | Git-driven deploys, edge middleware |

## Local development

```bash
# one-time
corepack enable
pnpm install

# run
pnpm dev          # http://localhost:3000
pnpm typecheck
pnpm lint
pnpm build && pnpm start
```

## How the build is organized

```
/app                     App Router (layout, page, routes)
/components              Presentational components (section/, scene/, ui/)
/content                 MDX case studies + writing
/lib                     Utilities, server actions, token helpers
/public                  Static assets (/.well-known/* served from here)
/scripts                 fetch-github-stats.mjs, process-gate.mjs, etc.
/docs
  PRD.md                 Product requirements (ship-blocking)
  DESIGN_DIRECTION.md    North-star aesthetic brief
  AGENT_READINESS.md     Cloudflare isitagentready.com compliance contract
  CASE_STUDIES_OUTLINE.md  4 hero case studies, five-beat structure
  BIO_DRAFT.md           Tagline + About copy candidates
  ROADMAP.md             Phased plan (to be written during scaffold phase)
  CHANGELOG.md           Human-readable release notes
  adr/                   ADRs for substantive decisions
  epm/                   Epic plans
/_reference              Frozen Claude Design prototype (visual source of truth — do not edit)
HANDOFF.md               Self-contained Claude Code prompt (v0 → v1)
```

## Process gates (match `tgsc`)

Every non-trivial change must ship with:

1. An **ADR** if the decision is architectural
2. An updated **ROADMAP.md** if the scope shifts
3. An **EPM** for anything that touches more than one sub-system
4. A **CHANGELOG.md** entry
5. A passing **process-gate** run: `pnpm process:check`

`pnpm process:check` validates the presence of the required sibling docs for any staged code change. It is wired into pre-commit locally and into CI as a blocking check.

## Agent-readiness contract

See `docs/AGENT_READINESS.md`. In short, every deploy must satisfy Cloudflare's [isitagentready.com](https://isitagentready.com/) scan across all four dimensions: Discoverability, Content, Bot Access Control, and Capabilities. Regressions are release-blocking.

## Links

- LinkedIn · [abhishek26k](https://linkedin.com/in/abhishek26k)
- GitHub · [Zireael26](https://github.com/Zireael26)
- X · [@abhi2601k](https://x.com/abhi2601k)
- Email · `abhishek.nexus26@gmail.com`

## License

Source code: MIT. Written content and case studies: CC BY-NC 4.0 (the words and diagrams are mine, feel free to learn from them, not to republish as your own).
