# ADR-0012 — AgentGraph: @react-three/fiber → raw three.js

**Status:** Accepted, 2026-05-19
**Context:** Gap-analysis follow-up to PR-3 (bundle baseline). Post-launch open item: script-bundle overrun 377 KiB > 150 KiB target. ADR-0007 bumped the project to R3F 9; this ADR reverses that direction for the hero scene only.
**Author:** Claude (Code), co-author to Abhishek Kaushik.

## Context

PR-3 (`perf/bundle-baseline-and-lighthouse-tightening`) measured the production bundle at 377 KiB script `transferSize` against a 150 KiB target. The Lighthouse `script-treemap-data` showed an ~820 KiB *uncompressed* chunk holding `three` + `@react-three/fiber` + `@react-three/drei`. The chunk was dynamically imported via `next/dynamic({ ssr: false })` from `components/scene/AgentGraphClient.tsx`, but Lighthouse counted it in the initial-load `transferSize` because Next 16's preloader prefetches `ssr: false` chunks anyway (gotcha logged 2026-05-19).

Two parallel investigations narrowed the problem:

1. **drei was already tree-shaken.** Grepping the codebase for `@react-three/drei` imports returned zero matches. The package was a dev-time scaffold leftover from Phase 5.1a (ADR-0007). Removing it from `package.json` shrank the install graph but did not move the bundle needle — confirming the compiler had already eliminated it.
2. **R3F framework layer was the load-bearing weight.** The Wanderer scene (`components/scene/Wanderer.tsx`) already uses raw `three` with a `useEffect`-based renderer and runs the same animation, ResizeObserver, and theme-sync patterns the AgentGraph needs. The R3F framework layer (reconciler, hooks runtime, JSX→scene-graph diffing) was contributing ~150 KiB compressed without delivering features the AgentGraph couldn't replicate manually.

A third option — making the dynamic import truly lazy (interaction-gated, IntersectionObserver) — was considered. It would have shed the chunk from first paint entirely but at the cost of the canvas not being visible until scroll/hover, defeating the visual purpose of the hero. Rejected on UX grounds.

## Decision

Port `components/scene/AgentGraph.tsx` from `@react-three/fiber` to raw `three.js`, mirroring the Wanderer pattern:

- Top-level `useEffect` owns the `WebGLRenderer`, `PerspectiveCamera`, `Scene` lifecycle.
- A single `requestAnimationFrame` loop drives node bobbing, ring rotation, edge geometry updates, packet interpolation, and pointer-parallax damping.
- `ResizeObserver` handles canvas resize. `MutationObserver` on `<html>` reacts to `data-mode` and `data-accent` flips — same mechanism as Wanderer.
- All geometries, materials, textures, and the renderer are explicitly disposed in the cleanup phase.
- Remove both `@react-three/fiber` and `@react-three/drei` from `package.json`.

The visual contract is unchanged: 4 icosahedron nodes (orchestrator hub + 3 satellites), 6 edges, animated packets, theme-synced colors, JetBrains Mono label sprites, pointer parallax. The `AgentGraphClient.tsx` wrapper, the `prefers-reduced-motion` gate, the `[data-motion]` runtime gate, and the `data-canvas-active` flag for SSR-SVG bleed-through (gotcha 2026-04-21) all stay.

## Consequences

**Measured (production build, `pnpm build` + `pnpm start` + lhci desktop preset, 1 run):**

| Metric | Before (PR-3, 2026-05-19) | After | Δ |
|---|---|---|---|
| Script `transferSize` | 386,439 bytes (377 KiB) | 290,327 bytes (283 KiB) | **−94 KiB (−24.9%)** |
| Total page `transferSize` | 805,976 bytes | 710,786 bytes | −93 KiB (−11.8%) |
| Largest chunk (uncompressed) | 820 KiB (three + R3F + drei) | 503 KiB (three only) | −317 KiB |
| Performance score (desktop) | 1.00 | 1.00 | unchanged |
| A11y score | 0.97 | 0.97 | unchanged |
| Best Practices | 0.96 | 0.96 | unchanged |
| SEO | 0.92 | 0.92 | unchanged |

The 150 KiB target is still not met (283 KiB measured), but the remaining 133 KiB delta is entirely `three`'s own footprint — `three` alone is the load-bearing module now. Further reduction requires either dropping the canvas entirely (rejected: it is the hero centerpiece) or porting to a smaller WebGL primitive (e.g. `regl`, raw WebGL2) — out of scope.

**Good:**
- Single 3D pattern across the project (Wanderer + AgentGraph both raw `three`). Maintenance surface shrinks.
- ~94 KiB compressed shaved off every cold pageload.
- No regressions in any Lighthouse category.
- R3F's React 19 peer-warning concern (ADR-0007's original driver) becomes moot — the package is gone.

**Costs:**
- The new code is ~120 LOC of explicit `three` setup vs ~80 LOC of declarative R3F JSX. Verbosity is the price of not shipping a framework layer.
- Future scenes that *would* benefit from R3F's reconciler (deeply dynamic scene graphs, hot prop swaps) would have to re-introduce the framework, repaying this saving.

**Risks:**
- Manual disposal in cleanup is easy to drift; if a future contributor adds a new mesh/material without disposing it, the WebGL context leaks. Mitigation: the cleanup function follows the same shape as Wanderer's, and Wanderer has been stable since Phase 5; pattern is documented in this ADR + the file header comment.
- `MutationObserver` on `data-accent` re-creates the label sprite every theme change (canvas → texture). This is a paint cost on theme toggle, not a steady-state cost. Acceptable.

## Alternatives considered

**Interaction-gated lazy load.** Reject. Hero is the first thing users see; gating it on scroll/hover would either show the SVG fallback for the entire above-the-fold session (defeating the canvas existence) or require a layout-shifting hand-off. Both regress the design intent more than the bundle cost regresses perf.

**Keep R3F, prune drei only.** Already done as a separate step before this ADR; bundle delta was zero. Confirmed empirically that R3F itself is the framework-layer mass.

**Switch to `motion/react` or another canvas wrapper.** Out of scope. The raw-three path was a strictly cheaper trade given that the Wanderer reference implementation already existed in the codebase.

**Port to `regl` or raw WebGL2.** Defer. The next bundle ceiling is `three`'s own ~500 KiB uncompressed footprint; any further perf work targets that root, not the framework on top.

## Follow-ups

- ROADMAP: tick the "Script-bundle overrun" line with the measured savings; keep the line open since 283 KiB is still > 150 KiB target. A future investigation into a `three`-free alternative (or accepting the 283 KiB ceiling as the new target) is the next decision point.
- CHANGELOG entry recording the bundle delta with the lhci measurement methodology, so the next quarterly gap-analysis (RFC-0001) has a clean baseline.
- gotchas.md: keep the 2026-05-19 entry on `next/dynamic({ ssr: false })` not removing chunks from first paint — the lesson generalizes beyond R3F to any heavy dependency.
- ADR-0007 (R3F 9 bump): mark superseded for the AgentGraph specifically; Wanderer never used R3F, so the bump was effectively a no-op once this lands.
