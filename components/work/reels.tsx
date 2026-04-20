import type { ReactNode } from 'react';

/**
 * SVG reel placeholders — ported verbatim from `_reference/portfolio/index.html`
 * lines 1261–1376. One per case study. Swapped for real HyperFrames video when
 * Abhishek provides the assets (post-launch).
 */

function NeevReel() {
  return (
    <svg viewBox="0 0 600 400" className="placeholder placeholder-reel">
      <defs>
        <pattern
          id="stripes-neev"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="10" stroke="var(--accent-15)" strokeWidth="4" />
        </pattern>
      </defs>
      <rect width="600" height="400" fill="var(--accent-05)" />
      <rect width="600" height="400" fill="url(#stripes-neev)" />
      <g className="reel-overlay">
        <circle cx="180" cy="200" r="38" className="node-core node-primary" />
        <circle cx="360" cy="130" r="22" className="node-core" />
        <circle cx="420" cy="280" r="26" className="node-core" />
        <path
          d="M180 200 L360 130 M180 200 L420 280 M360 130 L420 280"
          stroke="var(--accent-60)"
          strokeWidth="1.2"
          fill="none"
        />
      </g>
      <text x="300" y="370" textAnchor="middle" className="placeholder-label">
        neev/reel.mp4 · hyperframes
      </text>
    </svg>
  );
}

function VeriCiteReel() {
  return (
    <svg viewBox="0 0 600 400" className="placeholder placeholder-reel">
      <rect width="600" height="400" fill="var(--ink-05)" />
      <g stroke="var(--ink-25)" strokeWidth="0.8" fill="none">
        <path d="M0 120 H600 M0 200 H600 M0 280 H600" />
      </g>
      <g>
        <rect x="60" y="80" width="140" height="80" fill="var(--ink-15)" />
        <rect x="230" y="160" width="140" height="80" fill="var(--accent-40)" />
        <rect x="400" y="240" width="140" height="80" fill="var(--ink-15)" />
      </g>
      <text x="300" y="370" textAnchor="middle" className="placeholder-label">
        vericite/retrieval-trace.mp4
      </text>
    </svg>
  );
}

function BluehostReel() {
  return (
    <svg viewBox="0 0 600 400" className="placeholder placeholder-reel">
      <rect width="600" height="400" fill="var(--ink-05)" />
      <g>
        <path
          d="M40 340 C 120 220, 200 260, 280 180 S 440 140, 560 100"
          stroke="var(--accent)"
          strokeWidth="2.4"
          fill="none"
        />
        <path
          d="M40 360 C 120 320, 200 330, 280 280 S 440 260, 560 220"
          stroke="var(--ink-40)"
          strokeWidth="1.2"
          fill="none"
          strokeDasharray="3 4"
        />
      </g>
      <g fill="var(--accent)">
        <circle cx="40" cy="340" r="4" />
        <circle cx="280" cy="180" r="4" />
        <circle cx="560" cy="100" r="4" />
      </g>
      <text x="300" y="380" textAnchor="middle" className="placeholder-label">
        bluehost/latency-budget.mp4
      </text>
    </svg>
  );
}

function CuratReel() {
  return (
    <svg viewBox="0 0 600 400" className="placeholder placeholder-reel">
      <rect width="600" height="400" fill="var(--ink-05)" />
      <g>
        <rect x="40" y="60" width="520" height="40" fill="var(--ink-15)" />
        <rect x="40" y="120" width="360" height="28" fill="var(--ink-10)" />
        <rect x="40" y="160" width="420" height="28" fill="var(--ink-10)" />
        <rect x="40" y="200" width="300" height="28" fill="var(--ink-10)" />
        <rect x="40" y="240" width="480" height="28" fill="var(--ink-10)" />
        <rect x="40" y="280" width="380" height="28" fill="var(--ink-10)" />
      </g>
      <text x="300" y="370" textAnchor="middle" className="placeholder-label">
        curat.money/compare-table.mp4
      </text>
    </svg>
  );
}

export type ReelSlug = 'neev' | 'vericite' | 'bluehost-agents' | 'curat-money';

export const REELS: Record<ReelSlug, () => ReactNode> = {
  neev: NeevReel,
  vericite: VeriCiteReel,
  'bluehost-agents': BluehostReel,
  'curat-money': CuratReel,
};

export function Reel({ slug }: { slug: ReelSlug }) {
  const Component = REELS[slug];
  return <Component />;
}
