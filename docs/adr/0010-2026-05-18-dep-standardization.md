# ADR 0010 — 2026-05-18 cross-project dependency standardization

## Status

Accepted — 2026-05-18

## Context

Personal-projects fleet (vericite, neev, tgsc, akaushik.org, curat.money, clusterbid-console) had drifted on patch versions of Next, React, TypeScript, Tailwind, and supporting packages. A cross-project audit on 2026-05-18 picked a single baseline (latest stable, older than 7 days) and aligned every project on it.

## Decision

For akaushik.org specifically:

- next: 16.2.4 → 16.2.6
- react / react-dom: 19.2.0 → 19.2.6
- @types/react: 19.2.0 → 19.2.14
- @types/react-dom: 19.2.0 → 19.2.3
- @next/bundle-analyzer: 16.2.4 → 16.2.6
- eslint-config-next: 16.2.4 → 16.2.6
- tailwindcss / @tailwindcss/postcss: 4.2.4 → 4.3.0
- pnpm packageManager: 11.1.2 (unchanged; exempted from 7-day rule because pnpm 11 is the only package manager immune to recent supply-chain attacks)

Full BEFORE/AFTER matrix and rationale: `~/projects/personal/2026-05-18-dep-standardization-report.md`.

## Consequences

- Patch-only moves; no API breakage expected.
- `pnpm install` resolves cleanly; `pnpm build` passes (verified 2026-05-18).
- Future patch-bumps follow the same 7-day-old-stable rule; bump every project together.
