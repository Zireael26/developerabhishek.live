import { SectionHeader } from './SectionHeader';

type Post = {
  date: string;
  title: string;
  dek: React.ReactNode;
  readingTime: string;
  href: string;
};

/**
 * Empty-state-first Writing list. Phase 1 ships the three reference posts
 * as placeholders (hrefs #); Phase 2 Slice 2.7 replaces this array with a
 * server-side `getAllPosts('writing')` call into `content/writing/*.mdx`.
 */
const PLACEHOLDER_POSTS: ReadonlyArray<Post> = [
  {
    date: 'Apr 2026',
    title: 'What I learned building micrograd and makemore from scratch',
    dek: (
      <>
        A foundations-first reading of Karpathy&apos;s <em>Zero to Hero</em> —
        why re-implementing the thing is the only way to understand the thing.
      </>
    ),
    readingTime: '12 min read',
    href: '#',
  },
  {
    date: 'Mar 2026',
    title: 'Notes on bringing AI to an MSME',
    dek: 'WhatsApp, paper ledgers, Tally, and a few spreadsheets. What actually moves the needle, and what doesn\u2019t.',
    readingTime: '9 min read',
    href: '#',
  },
  {
    date: 'Feb 2026',
    title: 'Migrating from Fastembed ONNX to Hugging Face TEI',
    dek: 'The specific trade-offs, the retrieval quality delta on an institutional corpus, and why the infra complexity was worth it.',
    readingTime: '14 min read',
    href: '#',
  },
];

export function Writing() {
  return (
    <section
      className="writing"
      id="writing"
      data-screen-label="04 Writing"
      data-companion-pose="writing"
      aria-label="04 Writing"
    >
      <SectionHeader
        num="04"
        title="Writing"
        kicker="First-principles notes on agent systems and AI for traditional businesses. New posts land here without a redesign."
      />
      <ul className="post-list" role="list">
        {PLACEHOLDER_POSTS.map((p) => (
          <li className="post" key={p.title}>
            <span className="post-date">{p.date}</span>
            <h3 className="post-title">
              <a href={p.href}>{p.title}</a>
            </h3>
            <p className="post-dek">{p.dek}</p>
            <span className="post-read">{p.readingTime}</span>
          </li>
        ))}
      </ul>
      <a className="more-link" href="#">
        All writing
        <span className="arrow" aria-hidden="true">
          →
        </span>
      </a>
    </section>
  );
}
