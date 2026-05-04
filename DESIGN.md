# akaushik.org Design System

Distilled source of truth for HyperFrames authoring and visual identity checks.
The long-form rationale lives in `docs/DESIGN_DIRECTION.md`; this file carries
the tokens, rules, and anti-patterns that composition authors should apply.

## North Star

A quiet, confident craft object that happens to be a portfolio.

The site should feel editorial, deliberate, and built in the open. Motion and
systems diagrams are part of the design language, but they earn their place by
clarifying the work rather than decorating it.

## Palette

Lead with the warm light theme. Dark mode is supported, but the visual identity
is not a dark neon AI portfolio.

| Token          | Value                  | Use                                             |
| -------------- | ---------------------- | ----------------------------------------------- |
| Parchment base | `#F5F1E8`              | Default background                              |
| Raised base    | `#EEE8D9`              | Subtle panels and surfaces                      |
| Ink            | `#1A1A1E`              | Primary text and linework                       |
| Dark base      | `#121417`              | Dark-mode background                            |
| Primary accent | `#13423D`              | Brand signal, calls to action, major nodes      |
| Motion node    | `oklch(0.78 0.11 150)` | Moving packets, highlights, active trace points |

Opacity ramps are preferred over extra hues:

- Ink ramps: `rgba(26, 26, 30, 0.72)`, `0.55`, `0.38`, `0.22`, `0.13`, `0.08`, `0.045`.
- Accent ramps: use `color-mix(in oklab, var(--accent) 60%, transparent)`,
  `40%`, `15%`, and `5%`.

Use one accent at a time. The forest accent is the default; terracotta or ochre
are alternate site presets, not extra colors to mix into one composition.

## Typography

- Serif/display/editorial: `Newsreader`.
- UI/body: `Plus Jakarta Sans`.
- Code and technical labels: `JetBrains Mono`.

Use no more than two families inside a HyperFrames composition: Newsreader for
editorial titles and JetBrains Mono for labels/data is usually enough. Keep
monospace functional; do not use terminal chrome, fake logs, or decorative code.

## Motif

The visual motif is nodes, edges, and flowing information. It appears in:

- the live hero scene,
- case-study and writing motion reels,
- small section-divider graphics.

Everything else should be type, layout, and evidence. If a graph appears, it
should map to a real system: scalar graph, retrieval path, WhatsApp order flow,
inventory state, invoice generation, or citation chain.

## Motion Rules

- Every animation has an end state. No infinite GSAP repeats in HyperFrames.
- For loops, calculate finite repeats from the composition duration or author
  the timeline so it lands cleanly at `data-duration`.
- Prefer information motion: packets moving along edges, traces resolving,
  evidence being selected, or state moving through a workflow.
- Keep section and layout motion under 600ms when used on the live site.
- HyperFrames output ships as muted video with WebP posters; reduced-motion
  users see the SVG poster/floor only.
- No random, date, async, timer, or network-driven timeline construction.

## HyperFrames Gate

Before rendering a composition, check:

- Root element has `data-composition-id`, `data-start`, `data-duration`,
  `data-track-index`, `data-width`, and `data-height`.
- Timed clips have `id`, `data-start`, `data-duration`, and `data-track-index`.
- GSAP timeline is created with `{ paused: true }`.
- Timeline is registered on `window.__timelines["root"]`.
- No `repeat: -1`, `Math.random`, `Date.now`, `setTimeout`, Promises, or async
  timeline construction.
- The first frame reads as a valid static poster.

## Anti-Patterns

- No glowing orbs, bokeh blobs, particle fields, chrome sci-fi panels, or neon
  blue-purple gradients.
- No Awwwards-style scroll hijacking, curtain transitions, or motion that
  delays reading.
- No AI-agency template language: next-gen, future-proof, magic, autonomous
  everything.
- No developer-brag UI: terminal overlays, fake activity feeds, WakaTime bars,
  or monospace everywhere.
- No stock imagery or second illustration vocabulary. The graph language is
  the illustration system.
