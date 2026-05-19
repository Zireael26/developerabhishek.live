type Artifact = {
  code: string;
  description: string;
  href: string;
};

const REPO = 'https://github.com/Zireael26/akaushik.org/blob/main';

const ARTIFACTS: ReadonlyArray<Artifact> = [
  { code: 'PRD.md', description: 'Product requirements, v0.1 → live', href: `${REPO}/docs/PRD.md` },
  { code: 'ADR-0001-stack.md', description: 'Stack decision · Next.js 16 · pinned', href: `${REPO}/docs/adr/0001-nextjs-over-sveltekit.md` },
  { code: 'ROADMAP.md', description: 'Phased delivery plan', href: `${REPO}/docs/ROADMAP.md` },
  { code: 'AGENT_READINESS.md', description: 'Cloudflare isitagentready checks', href: `${REPO}/docs/AGENT_READINESS.md` },
  { code: 'CHANGELOG.md', description: 'Every shipped change', href: `${REPO}/docs/CHANGELOG.md` },
  { code: '/llms-full.txt', description: 'Whole site, one Markdown file', href: '/llms-full.txt' },
];

export function Process() {
  return (
    <section
      className="process"
      id="process"
      data-screen-label="06 Process"
      data-companion-pose="process"
      aria-label="06 Process"
    >
      <div className="process-inner">
        <div className="process-copy">
          <span className="section-num process-eyebrow">06 · feature wall</span>
          <h2 className="process-title">Built in the open.</h2>
          <p className="process-lede">
            This site uses the same process I&apos;d bring to a client engagement —
            PRD, ADR, ROADMAP, EPM progress log, CHANGELOG, process-gate scripts.
            Public on the repo; linked from here.
          </p>
          <p className="process-sub">
            The portfolio is itself a case study in what I build.
          </p>
        </div>
        <ul className="process-artifacts">
          {ARTIFACTS.map((a) => (
            <li key={a.code}>
              <a
                href={a.href}
                target={a.href.startsWith('http') ? '_blank' : undefined}
                rel={a.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                <code>{a.code}</code>
                <span>{a.description}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
