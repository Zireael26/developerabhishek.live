import { WandererCraneClient } from './WandererCraneClient';

/**
 * The Wanderer — paper-crane companion.
 *
 * Server component: renders the `#companion` host + the SVG fallback
 * (byte-for-byte from `_reference/portfolio/companion.js:211–219`), then
 * mounts `<WandererCraneClient />` which lazy-imports the Three.js scene
 * and hides the SVG once WebGL is live. The SVG stays visible for
 * `prefers-reduced-motion` users, `[data-motion="off"]`, and any
 * WebGL-unavailable environment (the client component's first-frame
 * bail-out at 80ms removes itself and re-shows the SVG).
 */
export function Wanderer() {
  return (
    <div id="companion" className="companion" aria-hidden="true">
      <svg className="companion-svg" viewBox="0 0 120 80" aria-hidden="true">
        <polygon
          points="10,50 60,15 55,45 100,30 70,55 80,70 55,60 30,72"
          fill="#f5ece0"
          stroke="#2a2a2a"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <polygon points="55,45 100,30 70,55" fill="#e8dcc8" />
        <polygon points="55,60 80,70 70,55" fill="#e8dcc8" />
        <circle cx="60" cy="20" r="2" fill="#2a2a2a" />
      </svg>
      <WandererCraneClient />
    </div>
  );
}
