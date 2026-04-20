# `_reference/` — frozen Claude Design prototype

This directory is the visual source of truth for `developerabhishek.live`. It is a snapshot of the Claude Design output that the Next.js build is recreating.

**Do not edit anything in here.** Treat it as read-only. When the live build drifts from these files, the live build is wrong.

## Layout

```
portfolio/
  index.html       8 sections, all markup + inline copy (Hero through Contact)
  styles.css       Design tokens + every component rule
  companion.js     Three.js paper crane "The Wanderer" (8 scroll-tracked POSES)
  tweaks.js        Claude Design iframe edit-mode protocol
  data/stats.json  GitHub stats placeholder

scripts/fetch-github-stats.mjs
.github/workflows/stats.yml
```

## Why it lives in the repo

Keeping the reference inside the repo means:

1. The diff between scaffold and reference is reviewable in a normal PR
2. New contributors (or a future Claude Code session) don't need to track down a Cowork-mounted folder
3. Visual regressions can be caught with screenshot diffs against `_reference/portfolio/index.html` rendered in a browser

## When the design evolves

If Abhishek produces a new Claude Design pass, replace the contents of `_reference/portfolio/` wholesale and write an ADR describing what changed and why. Do not piecewise-edit the reference.
