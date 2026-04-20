/**
 * The Wanderer — paper-crane companion.
 *
 * Phase-1 state (this file): renders the SVG fallback from
 * `_reference/portfolio/companion.js:211–219` into the `#companion` host.
 * This gives every `[data-companion-pose]` anchor a live visual target
 * without pulling Three.js into the Phase-1 bundle.
 *
 * Phase-5 Slice 5.1c upgrades this to a client component that mounts the
 * Three.js crane on top of the same host. The SVG you see here stays as
 * the `prefers-reduced-motion` / `[data-motion="off"]` / WebGL-bail-out
 * fallback. Keep the SVG geometry byte-for-byte synchronised with the
 * reference so future R3F work doesn't have to re-derive it.
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
    </div>
  );
}
