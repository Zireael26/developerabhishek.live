# Changelog

All notable changes to developerabhishek.live are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) for released milestones.

## [Unreleased]

### Added
- Next.js 16.2 scaffold: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `middleware.ts`, `eslint.config.js`.
- Design token foundation in `app/globals.css` mirroring the Claude Design reference (parchment, ink, forest accent, Newsreader + Plus Jakarta Sans + JetBrains Mono).
- Agent-readiness scaffold: `public/robots.txt` with Content Signals, `public/llms.txt`, `public/.well-known/agent-skills/index.json`, `public/.well-known/mcp.json`, Link-header middleware.
- `scripts/fetch-github-stats.mjs` + `.github/workflows/stats.yml` (weekly refresh).
- `scripts/process-gate.mjs` real policy (R1 code→CHANGELOG, R2 structural→ADR/CHANGELOG, R3 EPM→ROADMAP). Bypass via `SKIP_PROCESS_GATE=1`. See ADR-0002.
- ADR-0002 — process-gate policy + git-hook tool (`simple-git-hooks`, wired in Phase 1).
- EPIC-01 — pixel-parity plan for Phase 1 (`docs/epm/EPIC-01-pixel-parity.md`).
- `turbopack.root = process.cwd()` in `next.config.ts` to silence the multi-lockfile warning.
- `app/layout.tsx`: swapped Google Fonts `<link>` for `next/font/google` (Newsreader + Plus Jakarta Sans + JetBrains Mono). Self-hosted, eliminates external handshake, clears the `@next/next/no-page-custom-font` warning. `app/globals.css` resolves `--serif/--sans/--mono` through the next/font CSS variables.

### Changed
- Repository migrated from SvelteKit to Next.js 16.2. Prior state preserved at tag `legacy-v1-final`.
- Renamed `docs/prd.md` → `docs/PRD.md` to match the PascalCase convention used everywhere else in `docs/`.
- `next.config.ts`: moved `typedRoutes` out of `experimental` (stable in Next 16.2).
- `package.json`: `lint` script switched from `next lint` (removed in Next 16) to `eslint .`.
- `package.json`: TypeScript pin corrected `6.0.0 → 6.0.3` — `6.0.0` was never published; `6.0.x` patch drift is the intended pin.
- `eslint.config.js`: named the default export to satisfy `import/no-anonymous-default-export`.
- `tsconfig.json`: Next 16.2 auto-applied `jsx: react-jsx` and added `.next/dev/types/**/*.ts` to `include` on first build; committed as-is.

### Removed
- SvelteKit source: `src/**`, `static/**`, `svelte.config.js`, `vite.config.ts`, the prior `pnpm-lock.yaml`. Reachable at the `legacy-v1-final` tag.
