import Link from 'next/link';
import type { ReactNode } from 'react';
import { SectionHeader } from './SectionHeader';

type CaseStudy = {
  index: string;
  slug: 'neev' | 'vericite' | 'bluehost-agents' | 'curat-money';
  tag: string;
  year: string;
  title: string;
  dek: string;
  lede: ReactNode;
  spec: ReadonlyArray<{ term: string; def: ReactNode }>;
  lead?: boolean;
  reel: ReactNode;
};

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

export const CASE_STUDIES: ReadonlyArray<CaseStudy> = [
  {
    index: '01',
    slug: 'neev',
    tag: 'Hero case · MSME thesis',
    year: '2026 — now',
    title: 'Neev',
    dek: 'Bringing AI to an industry that still runs on WhatsApp.',
    lede: 'A modular operations platform for Indian textile distributors — built to be boring where boring matters, and quietly smart where it counts.',
    spec: [
      { term: 'Role', def: 'Co-founder & CTO — product, architecture, build' },
      { term: 'Stack', def: 'Next.js · Postgres · multi-tenant monolith' },
      { term: 'Evidence of', def: 'MSME depth · systems & product discipline' },
    ],
    lead: true,
    reel: <NeevReel />,
  },
  {
    index: '02',
    slug: 'vericite',
    tag: 'AI systems depth',
    year: '2026 — now',
    title: 'VeriCite',
    dek: 'A retrieval stack an institution can actually trust with its own words.',
    lede: (
      <>
        Multi-tenant institutional RAG, migrating from Fastembed ONNX to Hugging
        Face TEI for <code>BAAI/bge-reranker-v2-m3</code>. Qdrant as the
        backbone, Ory for identity.
      </>
    ),
    spec: [
      { term: 'Role', def: 'Co-founder & CTO — retrieval pipeline' },
      { term: 'Stack', def: 'HF TEI · Qdrant · Ory · k8s · Vercel' },
      { term: 'Evidence of', def: 'Institutional AI-systems sophistication' },
    ],
    reel: <VeriCiteReel />,
  },
  {
    index: '03',
    slug: 'bluehost-agents',
    tag: 'Production scale',
    year: '2025 — now',
    title: 'Bluehost · agents framework',
    dek: "The foundational platform behind Bluehost's agentic AI products.",
    lede: 'Where AI agents meet web-hosting reality — customer scale, production uptime, and real users with real bills. A major hand in maintaining and continuously improving the platform.',
    spec: [
      { term: 'Role', def: 'Platform engineer · ongoing' },
      { term: 'Stack', def: 'Agent runtime · tool-calling · observability' },
      { term: 'Evidence of', def: 'Operating at scale · team context' },
    ],
    reel: <BluehostReel />,
  },
  {
    index: '04',
    slug: 'curat-money',
    tag: 'Product breadth',
    year: '2026 — now',
    title: 'curat.money',
    dek: 'A fair-comparison tool for crypto cards, built like a real product.',
    lede: 'Custody checks, provider coverage, multi-environment deploys — the boring-but-important scaffolding most crypto product sites skip.',
    spec: [
      { term: 'Role', def: 'CTO · Tech Lead' },
      { term: 'Stack', def: 'High-throughput data pipeline · K8s · RBAC · CI/CD' },
      { term: 'Evidence of', def: 'Data pipeline to web product' },
    ],
    reel: <CuratReel />,
  },
];

export function Work() {
  return (
    <section
      className="work"
      id="work"
      data-screen-label="03 Work"
      data-companion-pose="work"
      aria-label="03 Work"
    >
      <SectionHeader
        num="03"
        title="Selected work"
        kicker="Four case studies, ordered by strategic weight. Each is a problem in the client's words, an approach, what shipped, and honest scope on what was and wasn't included."
      />
      <ol className="case-list" role="list">
        {CASE_STUDIES.map((c) => (
          <li
            key={c.slug}
            className={`case-item${c.lead ? ' case-item--lead' : ''}`}
            id={`case-${c.slug}`}
          >
            <div className="case-meta">
              <span className="case-index">{c.index}</span>
              <span className="case-tag">{c.tag}</span>
              <span className="case-year">{c.year}</span>
            </div>
            <div className="case-body">
              <h3 className="case-title">{c.title}</h3>
              <p className="case-dek">{c.dek}</p>
              <p className="case-lede">{c.lede}</p>
              <dl className="case-spec">
                {c.spec.map((s) => (
                  <div key={s.term}>
                    <dt>{s.term}</dt>
                    <dd>{s.def}</dd>
                  </div>
                ))}
              </dl>
              <Link className="case-link" href={`/work/${c.slug}`}>
                Read the case study
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
            <div className="case-reel" aria-hidden="true">
              {c.reel}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
