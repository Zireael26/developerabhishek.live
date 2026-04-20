/**
 * Scaffold landing page.
 *
 * This is a placeholder that proves the design tokens, typography, and
 * Tailwind 4 bridge are wired correctly. Claude Code will replace this file
 * with the full eight-section build described in HANDOFF.md — Hero through
 * Contact, Three.js companion, stats tile, case studies, the works.
 *
 * DO NOT add page content here by hand. The single source of truth for the
 * visual design is "Abhhishek's Portfolio/portfolio/index.html" + styles.css.
 */
export default function Home() {
  return (
    <main className="scaffold-shell">
      <p className="scaffold-eyebrow">Scaffold · v0.0 · pixel parity pending</p>

      <h1 className="scaffold-title">
        AI systems for businesses that haven’t met AI yet.
      </h1>

      <p className="scaffold-body">
        This is the Next.js 16.2 scaffold. Design tokens from the Claude Design reference are
        wired. The full implementation lives behind <code>HANDOFF.md</code> — Claude Code reads
        the reference at <code>Abhhishek&apos;s Portfolio/portfolio/</code> and rebuilds, section
        by section, against the PRD / Design Direction / Agent Readiness contracts.
      </p>

      <p className="scaffold-body" style={{ color: 'var(--ink-60)' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: '12.5px', letterSpacing: '0.08em' }}>
          NEXT ·&nbsp;
        </span>
        Run <code>pnpm install &amp;&amp; pnpm dev</code>, open <code>http://localhost:3000</code>,
        then hand <code>HANDOFF.md</code> to Claude Code.
      </p>
    </main>
  );
}
