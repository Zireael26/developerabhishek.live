import { Fragment } from 'react';
import statsData from '@/public/data/stats.json';

const MARQUEE_ITEMS = [
  'Next.js 16',
  'TypeScript 6',
  'Hugging Face TEI',
  'Qdrant',
  'MCP',
  'Framer Motion',
  'r3f',
  'Tailwind 4',
  'shadcn/ui v4',
  'Vercel',
  'Kubernetes',
  'Ory',
];

// The track content is duplicated verbatim twice so the CSS `translateX(-50%)`
// loop is seamless. Spans + `<em>` must be *direct* children of `.marquee-track`
// — `.marquee-track { display: inline-flex; gap: 28px }` only spaces direct
// children, so any wrapper breaks both the item spacing and the loop seam.
function MarqueeTrack() {
  return (
    <>
      {[0, 1].map((loopIndex) =>
        MARQUEE_ITEMS.map((item, i) => (
          <Fragment key={`${loopIndex}-${i}`}>
            <span>{item}</span>
            <em>·</em>
          </Fragment>
        )),
      )}
    </>
  );
}

export default function Hero() {
  // Explicit locale so the server-rendered number is deterministic regardless
  // of the build environment's default locale.
  const total = statsData.totalContributions.toLocaleString('en-US');

  return (
    <section
      className="hero"
      data-screen-label="01 Hero"
      data-companion-pose="hero"
    >
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-num">01</span> — AI engineer · six years shipping software
          </p>
          <h1 className="hero-title" data-slot="tagline">
            <span data-tagline-a>
              AI systems for<br />businesses that<br />haven&apos;t met AI yet.
            </span>
            <span data-tagline-b hidden>
              I build agent systems<br />that go to production —<br />and stay there.
            </span>
            <span data-tagline-c hidden>
              I build the systems<br />your business<br />will actually use.
            </span>
          </h1>
          <p className="hero-lede">
            I design and build the agents and back-end systems that quietly do the work — for
            distributors, founders, and teams who&apos;d rather see results than slide decks.
          </p>
          <div className="hero-cta-row">
            <a className="btn btn-primary" href="#contact">
              Let&apos;s talk about your project<span className="arrow" aria-hidden="true">→</span>
            </a>
            <a className="btn btn-ghost" href="#work">
              Read a case study
            </a>
          </div>
          <dl className="hero-facts" aria-label="At a glance">
            <div>
              <dt>Currently</dt>
              <dd>Bluehost · agents framework</dd>
            </div>
            <div>
              <dt>Building</dt>
              <dd>Neev · VeriCite · curat.money</dd>
            </div>
            <div>
              <dt>Shipped</dt>
              <dd>
                <span data-stat="total">{total}</span> commits · last 12mo
              </dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>India · working globally</dd>
            </div>
          </dl>
        </div>

        <figure className="hero-scene" aria-label="Decorative graph of agent nodes exchanging messages">
          <div className="scene-frame">
            <div className="scene-label">
              <span className="scene-label-key">scene.live</span>
              <span className="scene-label-val">agent-graph · svg</span>
            </div>
            {/* Canvas-animated variant of this scene ships in a follow-up slice.
                For now the static SVG carries the hero. Reference markup keeps the
                `scene-svg-fallback` class paired with a `<canvas>` sibling; we omit
                both until the canvas slice lands. */}
            <svg className="scene-svg" viewBox="0 0 520 520" aria-hidden="true">
              <defs>
                <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </radialGradient>
                <pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse">
                  <path d="M26 0H0V26" fill="none" stroke="var(--hairline)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="520" height="520" fill="url(#grid)" />
              <circle cx="260" cy="260" r="210" fill="url(#glow)" />
              <g className="edges" stroke="var(--ink-60)" strokeWidth="1" fill="none">
                <path d="M120 140 Q 260 200 400 130" />
                <path d="M120 140 Q 180 300 260 380" />
                <path d="M400 130 Q 430 280 400 400" />
                <path d="M260 380 Q 330 380 400 400" />
              </g>
              <g className="nodes">
                <g transform="translate(120 140)">
                  <circle r="14" className="node-core" />
                  <circle r="22" className="node-ring" />
                  <text y="40" textAnchor="middle">agent</text>
                </g>
                <g transform="translate(400 130)">
                  <circle r="10" className="node-core" />
                  <circle r="18" className="node-ring" />
                  <text y="36" textAnchor="middle">tool</text>
                </g>
                <g transform="translate(260 380)">
                  <circle r="18" className="node-core node-primary" />
                  <circle r="28" className="node-ring" />
                  <text y="48" textAnchor="middle">orchestrator</text>
                </g>
                <g transform="translate(400 400)">
                  <circle r="10" className="node-core" />
                  <circle r="18" className="node-ring" />
                  <text y="36" textAnchor="middle">memory</text>
                </g>
              </g>
            </svg>
            <div className="scene-foot">
              <span>four agents · cursor-reactive · reduced-motion safe</span>
              <span className="scene-foot-mono">scene/agent-graph.v2</span>
            </div>
          </div>
        </figure>
      </div>

      <div className="hero-marquee" aria-hidden="true">
        <div className="marquee-track">
          <MarqueeTrack />
        </div>
      </div>
    </section>
  );
}
