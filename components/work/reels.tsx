import type { ReactNode } from 'react';

import { MotionVideo } from '@/components/media/MotionVideo';

/**
 * Case-study reels — one per work slug, two variants:
 *   - `variant="card"`: 600×400, 5s loop, used by the home Work cards.
 *   - `variant="hero"`: 1600×900, 10s loop, used by the case-study hero band.
 *
 * Each reel renders the original SVG as the static floor AND a <video> of the
 * HyperFrames render on top. The `<video>` is hidden when either:
 *   - `prefers-reduced-motion: reduce`, or
 *   - `[data-motion="off"]` (set by the tweaks panel)
 * …so motion-disabled users never see the animated clip. The video source is
 * client-gated so both OS reduced-motion and `[data-motion="off"]` avoid MP4
 * requests; CSS keeps the static SVG floor visible.
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
      <g className="reel-overlay" fill="none">
        <path
          d="M122 122 H270 C330 122 334 196 386 196 H488"
          stroke="var(--accent-60)"
          strokeWidth="2"
        />
        <path
          d="M270 196 C235 240 178 246 148 294 H422"
          stroke="var(--accent-40)"
          strokeWidth="1.4"
          strokeDasharray="5 7"
        />
        <g fill="var(--bg-2)" stroke="var(--hairline)" strokeWidth="1.2">
          <rect x="58" y="82" width="128" height="80" />
          <rect x="250" y="82" width="128" height="80" />
          <rect x="420" y="156" width="120" height="80" />
          <rect x="86" y="254" width="124" height="72" />
          <rect x="352" y="254" width="124" height="72" />
        </g>
        <g fill="var(--accent)">
          <circle cx="122" cy="122" r="7" />
          <circle cx="314" cy="122" r="7" />
          <circle cx="482" cy="196" r="7" />
          <circle cx="148" cy="294" r="7" />
          <circle cx="414" cy="294" r="7" />
        </g>
        <g fontFamily="var(--mono)" fontSize="13" fill="var(--ink-70)">
          <text x="82" y="126">WhatsApp</text>
          <text x="276" y="126">Order</text>
          <text x="446" y="200">Stock</text>
          <text x="111" y="298">Ledger</text>
          <text x="376" y="298">Invoice</text>
        </g>
      </g>
    </svg>
  );
}

function VeriCiteReel() {
  return (
    <svg viewBox="0 0 600 400" className="placeholder placeholder-reel reel-fallback">
      <rect width="600" height="400" fill="var(--bg)" />
      <g stroke="var(--ink-10)" strokeWidth="1" fill="none">
        <path d="M52 86 H548 M52 314 H548" />
        <path d="M188 86 V314 M412 86 V314" />
      </g>
      <g fill="none" stroke="var(--accent-60)" strokeWidth="1.8">
        <path d="M82 196 H172 C230 196 236 142 294 142 H378" />
        <path d="M82 196 H172 C230 196 236 250 294 250 H378" />
        <path d="M418 142 C470 158 486 188 520 196" />
        <path d="M418 250 C470 234 486 204 520 196" strokeDasharray="4 6" />
      </g>
      <g fill="var(--bg-2)" stroke="var(--hairline)" strokeWidth="1.2">
        <rect x="48" y="158" width="92" height="76" />
        <rect x="230" y="108" width="118" height="68" />
        <rect x="230" y="216" width="118" height="68" />
        <rect x="430" y="158" width="120" height="76" fill="var(--accent-05)" />
      </g>
      <g fill="var(--accent)">
        <circle cx="82" cy="196" r="6" />
        <circle cx="294" cy="142" r="6" />
        <circle cx="294" cy="250" r="6" />
        <circle cx="520" cy="196" r="6" />
      </g>
      <g fontFamily="var(--mono)" fontSize="12.5" fill="var(--ink-70)">
        <text x="72" y="200">query</text>
        <text x="256" y="146">embed</text>
        <text x="256" y="254">rerank</text>
        <text x="458" y="200">citation</text>
      </g>
    </svg>
  );
}

function BluehostReel() {
  return (
    <svg viewBox="0 0 600 400" className="placeholder placeholder-reel reel-fallback">
      <rect width="600" height="400" fill="var(--bg)" />
      <g stroke="var(--ink-10)" strokeWidth="1" fill="none">
        <path d="M56 92 H544 M56 196 H544 M56 300 H544" />
      </g>
      <g fill="none">
        <path
          d="M74 286 C144 176 216 178 288 206 S420 246 520 110"
          stroke="var(--accent)"
          strokeWidth="2.4"
        />
        <path
          d="M74 310 C154 298 238 318 306 286 S430 264 520 270"
          stroke="var(--ink-40)"
          strokeWidth="1.2"
          strokeDasharray="3 4"
        />
      </g>
      <g fill="var(--bg-2)" stroke="var(--hairline)" strokeWidth="1.2">
        <rect x="64" y="246" width="104" height="72" />
        <rect x="236" y="168" width="116" height="72" fill="var(--accent-05)" />
        <rect x="452" y="72" width="96" height="72" />
        <rect x="382" y="244" width="124" height="62" />
      </g>
      <g fill="var(--accent)">
        <circle cx="116" cy="286" r="6" />
        <circle cx="294" cy="206" r="6" />
        <circle cx="500" cy="110" r="6" />
      </g>
      <g fontFamily="var(--mono)" fontSize="12.5" fill="var(--ink-70)">
        <text x="88" y="290">agent</text>
        <text x="266" y="211">tool</text>
        <text x="472" y="114">user</text>
        <text x="405" y="281">trace</text>
      </g>
    </svg>
  );
}

function CuratReel() {
  return (
    <svg viewBox="0 0 600 400" className="placeholder placeholder-reel reel-fallback">
      <rect width="600" height="400" fill="var(--bg)" />
      <g stroke="var(--ink-10)" strokeWidth="1" fill="none">
        <path d="M56 108 H544 M56 156 H544 M56 204 H544 M56 252 H544 M56 300 H544" />
        <path d="M180 74 V326 M310 74 V326 M438 74 V326" />
      </g>
      <g fill="var(--ink-05)">
        <rect x="56" y="74" width="488" height="252" />
      </g>
      <g fill="var(--bg-2)" stroke="var(--hairline)" strokeWidth="1">
        <rect x="76" y="122" width="82" height="18" />
        <rect x="76" y="170" width="82" height="18" />
        <rect x="76" y="218" width="82" height="18" />
        <rect x="202" y="122" width="78" height="18" />
        <rect x="202" y="170" width="78" height="18" />
        <rect x="202" y="218" width="78" height="18" />
        <rect x="330" y="122" width="82" height="18" fill="var(--accent-05)" stroke="var(--accent)" />
        <rect x="330" y="170" width="82" height="18" />
        <rect x="330" y="218" width="82" height="18" fill="var(--accent-05)" stroke="var(--accent)" />
        <rect x="460" y="122" width="54" height="18" />
        <rect x="460" y="170" width="54" height="18" />
        <rect x="460" y="218" width="54" height="18" />
      </g>
      <g fontFamily="var(--mono)" fontSize="12" fill="var(--ink-70)">
        <text x="76" y="96">provider</text>
        <text x="202" y="96">country</text>
        <text x="330" y="96">custody</text>
        <text x="460" y="96">score</text>
        <text x="76" y="284">scrape {'->'} normalize {'->'} verify</text>
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
 * Reel — renders the SVG floor + the HyperFrames video shell on top. The
 * `.reel-video` shell stays sized for layout stability; MotionVideo mounts the
 * MP4 source only when motion is allowed.
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
      <MotionVideo
        className="reel-video"
        variant={variant}
        slug={slug}
        width={w}
        height={h}
        mp4={mp4}
        poster={poster}
      />
    </>
  );
}
