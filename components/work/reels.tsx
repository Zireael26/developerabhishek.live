import type { ReactNode } from 'react';

/**
 * Case-study reels — one per work slug, two variants:
 *   - `variant="card"`: 600×400, 5s loop, used by the home Work cards.
 *   - `variant="hero"`: 1600×900, 10s loop, used by the case-study hero band.
 *
 * Each reel renders the original SVG as the static floor AND a <video> of the
 * HyperFrames render on top. The `<video>` is hidden when either:
 *   - `prefers-reduced-motion: reduce`, or
 *   - `[data-motion="off"]` (set by the tweaks panel)
 * …so motion-disabled users never see (or pay bytes for) the animated clip.
 * Server-only, no client JS — the gate is pure CSS (see `app/globals.css`).
 *
 * The MP4s live at `public/video/work/<slug>[-hero].mp4` and are authored
 * under `scripts/hyperframes/`. See `docs/adr/0008-hyperframes-rendering-pipeline.md`.
 */

type ReelVariant = 'card' | 'hero';

function NeevReel() {
  return (
    <svg viewBox="0 0 600 400" className="placeholder placeholder-reel reel-fallback">
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
    </svg>
  );
}

function VeriCiteReel() {
  return (
    <svg viewBox="0 0 600 400" className="placeholder placeholder-reel reel-fallback">
      <rect width="600" height="400" fill="var(--ink-05)" />
      <g stroke="var(--ink-25)" strokeWidth="0.8" fill="none">
        <path d="M0 120 H600 M0 200 H600 M0 280 H600" />
      </g>
      <g>
        <rect x="60" y="80" width="140" height="80" fill="var(--ink-15)" />
        <rect x="230" y="160" width="140" height="80" fill="var(--accent-40)" />
        <rect x="400" y="240" width="140" height="80" fill="var(--ink-15)" />
      </g>
    </svg>
  );
}

function BluehostReel() {
  return (
    <svg viewBox="0 0 600 400" className="placeholder placeholder-reel reel-fallback">
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
    </svg>
  );
}

function CuratReel() {
  return (
    <svg viewBox="0 0 600 400" className="placeholder placeholder-reel reel-fallback">
      <rect width="600" height="400" fill="var(--ink-05)" />
      <g>
        <rect x="40" y="60" width="520" height="40" fill="var(--ink-15)" />
        <rect x="40" y="120" width="360" height="28" fill="var(--ink-10)" />
        <rect x="40" y="160" width="420" height="28" fill="var(--ink-10)" />
        <rect x="40" y="200" width="300" height="28" fill="var(--ink-10)" />
        <rect x="40" y="240" width="480" height="28" fill="var(--ink-10)" />
        <rect x="40" y="280" width="380" height="28" fill="var(--ink-10)" />
      </g>
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

/**
 * Resolve the MP4 + poster path for a slug/variant. Hero variants append
 * `-hero`; paths are relative to `/public`.
 */
function reelAssetPath(slug: ReelSlug, variant: ReelVariant): { mp4: string; poster: string } {
  const base = variant === 'hero' ? `${slug}-hero` : slug;
  return {
    mp4: `/video/work/${base}.mp4`,
    poster: `/video/work/${base}.webp`,
  };
}

/**
 * Reel — renders the SVG floor + (when motion is allowed) the HyperFrames
 * video on top. The video lives behind a `.reel-video` class that `globals.css`
 * hides under `prefers-reduced-motion: reduce` and `[data-motion="off"]`.
 */
export function Reel({
  slug,
  variant = 'card',
}: {
  slug: ReelSlug;
  variant?: ReelVariant;
}) {
  const Fallback = REELS[slug];
  const { mp4, poster } = reelAssetPath(slug, variant);
  // width/height are the intrinsic aspect — the parent figure sizes it via CSS.
  const w = variant === 'hero' ? 1600 : 600;
  const h = variant === 'hero' ? 900 : 400;

  return (
    <>
      <Fallback />
      <video
        className="reel-video"
        data-variant={variant}
        data-slug={slug}
        width={w}
        height={h}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        aria-hidden="true"
      >
        <source src={mp4} type="video/mp4" />
      </video>
    </>
  );
}
