# Bundle budget

**Aspirational target:** < 150 KiB gzipped initial JS. **Ceiling currently enforced in CI:** 200 KiB (204 800 bytes), at `warn` severity, via `lighthouserc.yml` + `lighthouserc.mobile.yml`. The ceiling was 160 KiB (`error` severity) through Phase 3–4; Phase 5.1b (hero R3F canvas) bumped it to 200 KiB because the Next.js preloader pulls in the code-split three.js + R3F chunks alongside the main bundle even though they are `ssr: false` dynamically imported. Phase 6 (post-launch) audits exactly which dependency is hitting initial JS (via `pnpm analyze`) and pulls the ceiling back toward the aspirational 150 KiB target. Unused deps (framer-motion, gsap) are not currently imported — they live in `package.json` for Phase 5 motion work and are tree-shaken out of every bundle today.

**Snapshot:** 2026-04-20, Phase 3.3.

## Method

```
pnpm analyze                 # (.next/analyze/{client,nodejs,edge}.html)
ls -lS .next/static/chunks   # top chunks by raw size
gzip -c <chunk> | wc -c      # gzipped byte count per chunk
```

## Top client chunks (gzipped)

| Chunk | Raw | Gzip |
|---|---|---|
| `00mq6p~atcgh9.js` | 223 KiB | **69.4 KiB** |
| `11xh2ni8_9bul.js` | 146 KiB | 39.3 KiB |
| `03~yq9q893hmn.js` | 110 KiB | 38.6 KiB |
| `0tf~my75d1mgi.js`  | 54 KiB  | 12.6 KiB |
| `16quxkjjb6k~y.js`  | 50 KiB  | 10.3 KiB |
| `1178j8k33qcak.js`  | 17 KiB  | 6.0 KiB |
| `turbopack-…`       | 10 KiB  | 4.1 KiB |

Per-route initial JS (what the landing page actually loads on first paint) is the figure Lighthouse CI asserts on; the Vercel preview report is the source of truth on each PR. Local approximation suggests the landing page sits in the **~150 KiB gzipped** band — at budget edge.

## Server isolation (ADR-0004)

```
$ for f in client.html nodejs.html edge.html; do
    printf '%s: ' "$f"; grep -c shiki ".next/analyze/$f"
  done
client.html: 0
nodejs.html: 1
edge.html:   0
```

Shiki stays in the Node server bundle only. MDX compilation + syntax highlighting never reach the browser.

## Phase 5 pressure

The bundle budget is defensive against phase 5's additions:

- `components/scene/AgentGraph.tsx` (R3F + Three.js) lands via `next/dynamic({ ssr: false })` + Suspense; does not count toward landing-page initial JS.
- `components/scene/Wanderer.tsx` (R3F crane full port) — same code-split + Suspense pattern.
- `@vercel/analytics` — tiny (~3 KiB gz), ships on landing.
- `framer-motion` — if adopted, import from `motion/react` sub-path (smaller) or keep unused.

If any of the above breaches the 150 KiB budget at launch, Lighthouse CI will fail the PR before merge.
