// Static SVG version of the agent-graph. Reference: index.html:1493–1548.
// Ships as the initial paint + the fallback for:
//   - reduced-motion users
//   - [data-motion="off"] toggle (TweakBridge)
//   - WebGL-unavailable environments
//   - the pre-hydration paint before <AgentGraph /> loads
//
// Kept pure server-render-friendly (no hooks) so it's usable inside a
// <Suspense fallback> without client-boundary gymnastics.

export function StaticSVGScene() {
  return (
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
  );
}
