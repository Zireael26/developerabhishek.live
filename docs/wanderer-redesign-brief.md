# Wanderer redesign brief

**Status:** open — formal capture of the redesign intent implied by PR #58 (2026-05-11).
**Owner:** Abhishek Kaushik.
**Last updated:** 2026-05-19.

## Current state

- Three.js paper-crane companion. `#companion` host div + inline SVG fallback in `components/scene/Wanderer.tsx`; client crane in `components/scene/WandererCrane.tsx`; client gate in `components/scene/WandererCraneClient.tsx`.
- Eight named POSES driven by `data-companion-pose` attributes on every home section. IntersectionObserver thresholds `[0.2, 0.45, 0.7]` pick the highest-intersecting section as the active pose.
- Per-frame: `damp = 1 - exp(-dt * 3.2)` lerp on 8 channels, scroll-velocity rotation on Y + Z, wing-flap from `Math.sin(t * flapSpeed) * flapAmt`.
- SVG fallback rendered server-side and hidden on first canvas frame; restored on unmount + on `prefers-reduced-motion`.

Full primer: `.claude/primers/wanderer-crane-scene.md`.

## Why it is disabled (PR #58 body, 2026-05-11)

> Comment out `<Wanderer />` import + JSX in `app/layout.tsx` so the Three.js paper crane and its SVG fallback are both hidden site-wide. `components/scene/Wanderer*` untouched; reinstating is one uncomment.

The PR body does not name the trigger explicitly. Inferred from CHANGELOG + the surrounding commits: the crane was visually distracting at certain scroll positions on small viewports, and the redesign decision was deferred rather than rushed.

## Open redesign questions

1. **Does it stay a paper crane?** Or does the motif move to something tied more directly to the agent/graph language used in the Hero (`components/scene/AgentGraph.tsx`)?
2. **Pose anchoring vs. cursor parallax.** Today the crane only re-poses on scroll. Adding cursor parallax (idle drift toward the cursor when no scroll motion) would make it feel more responsive without changing the pose set.
3. **Does the SVG fallback get retained?** Useful for reduced-motion / no-WebGL, but the SVG and the canvas have to stay byte-faithful to each other or the swap reads as a glitch.
4. **Mobile policy.** The crane is currently always-on at mobile widths. Should it ship desktop-only (`@media (min-width: 900px)`) to avoid the small-viewport visual noise that motivated the disable?
5. **Theme + accent sync.** Currently a MutationObserver on `<html data-accent>` retints the crane material live. Confirm that survives the redesign.
6. **Bundle cost.** Three.js + drei adds measurable JS. If the redesign keeps a 3D scene, budget the chunk against `docs/BUNDLE_BUDGET.md` before reinstating.

## Reinstatement checklist

When the redesign brief above is answered and the crane (or its replacement) is ready to land:

- [ ] Uncomment the `import { Wanderer }` line in `app/layout.tsx`.
- [ ] Uncomment the `<Wanderer />` JSX in `app/layout.tsx`.
- [ ] Remove `test.skip(true, …)` wrappers in `e2e/canvas.spec.ts` for the `#companion` + `.companion-svg` + `#companion canvas` assertions.
- [ ] Refresh `.claude/primers/wanderer-crane-scene.md` — drop the STATUS banner, bump `last_refreshed`.
- [ ] Update `.claude/primers/INDEX.md` — drop the "Currently disabled" tag.
- [ ] Tick the post-launch ROADMAP entry "Wanderer crane redesign + reinstate" `[x]`.
- [ ] If the redesign changed any per-frame channels or pose semantics, update the primer's Data flow + Gotchas sections.
- [ ] Add a `docs/CHANGELOG.md` entry under `[Unreleased]` summarising the reinstatement.

## What does **not** need to change to reinstate

- `app/sitemap.ts` / agent-readiness surfaces.
- The OG image pipeline.
- The HyperFrames reels.
- The R3F hero `AgentGraph` (separate scene, separate file, separate decisions).

## Out of scope for the brief

- Replacing R3F with something else for the hero. That is a separate decision tracked by ADR-0007.
- Removing the SVG fallback entirely. The accessibility surface that path covers is non-negotiable per PRD §7.
