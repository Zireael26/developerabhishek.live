# Bundle budget

**Aspirational target:** ≤ 150 KiB gzipped initial JS.
**Ceiling enforced in CI today (post-PR-3 of gap-analysis plan):** 400 KiB script-resource transferSize, `warn` severity, in both `lighthouserc.yml` and `lighthouserc.mobile.yml`.
**Measured (2026-05-19, post-Phase-5):** 386,439 bytes (377 KiB) script transferSize per Lighthouse `resource-summary` audit. Within the new `warn` ceiling but well over the 150 KiB aspiration.

> The ceiling moved from 200 KiB → 400 KiB to suppress per-PR noise on a measurement that exceeds the target. **Do not interpret this as ceiling growth.** A follow-up ROADMAP line `[ ] Script-bundle overrun — reduce initial JS from 377 KiB toward 150 KiB target` is open; see `docs/bundle-snapshots/2026-05-19-bundle.md` §"Path back to 150 KiB" for investigation paths.

## Snapshots

- **2026-05-19, post-Phase-5:** `docs/bundle-snapshots/2026-05-19-bundle.md`. 377 KiB script, 786 KiB total transfer. Performance score 1.00 desktop / 0.92 mobile — the bundle is heavy but the audited signals still clear performance thresholds.
- **2026-04-20, Phase 3.3 (historical):** Top chunks were 69.4 KiB / 39.3 KiB / 38.6 KiB gzipped. Landing-page initial JS sat in the ~150 KiB gzipped band. Phase 5.1b (hero R3F canvas) and the writing-post HyperFrames work shipped between snapshots; the 2026-05-19 measurement is the post-Phase-5 baseline.

## Method

```
pnpm build                                  # Turbopack production build
nohup pnpm start > /tmp/server.log 2>&1 &   # serve locally
pnpm exec wait-on http://localhost:3000     # wait for ready
npx --yes @lhci/cli@latest autorun \
  --collect.url=http://localhost:3000/ \
  --config=./lighthouserc.yml               # or .mobile.yml
ls -lSh .next/static/chunks                 # raw disk sizes per chunk
```

Per-route initial JS is what Lighthouse CI's `resource-summary:script:size` asserts on. The script transferSize in the assertion is the gzipped wire-bytes Lighthouse observed during the run — **not** the disk size of the chunks under `.next/static/chunks/`.

## Server isolation (ADR-0004)

```
$ for f in client.html nodejs.html edge.html; do
    printf '%s: ' "$f"; grep -c shiki ".next/analyze/$f"
  done
client.html: 0
nodejs.html: 1
edge.html:   0
```

Shiki stays in the Node server bundle only. MDX compilation + syntax highlighting never reach the browser. This contract is unchanged since Phase 3.3.

## Phase 5 pressure

The 2026-05-19 overrun versus the 2026-04-20 baseline points at three additions since:

1. `components/scene/AgentGraph.tsx` (R3F + Three.js) — `next/dynamic({ ssr: false })` but Next 16's preloader still prefetches the chunk.
2. `components/scene/WandererCrane*` — same pattern, currently dormant via the disable in `app/layout.tsx` but still present in the source tree.
3. HyperFrames writing-post + case-study loops via `components/media/MotionVideo.tsx` — small JS, but the MP4 + webp poster assets bulk the page's media transferSize.

## Path back to 150 KiB

Tracked at `docs/bundle-snapshots/2026-05-19-bundle.md` §"Path back to 150 KiB". The highest-confidence levers:

1. Confirm `next/dynamic` boundaries are truly lazy (the 820 KiB three.js + R3F + drei chunk should not be preloaded for the home page first paint).
2. Re-evaluate `@react-three/fiber` + `@react-three/drei` vs. raw `three` (the Wanderer scene already uses raw three).
3. Continue PR-6 of the gap-analysis plan — `pnpm remove lucide-react gsap framer-motion` (zero in-repo imports) shrinks `node_modules` + downstream tree-shake surface.
