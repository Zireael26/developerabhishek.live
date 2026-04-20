import Link from 'next/link';
import { SectionHeader } from './SectionHeader';
import { getAllPostsWithReadingTime } from '@/lib/content';

const MONTH_YEAR = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
});

function formatMonthYear(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return MONTH_YEAR.format(d);
}

export function Writing() {
  const posts = getAllPostsWithReadingTime('writing')
    .slice()
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1))
    .slice(0, 3);

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
      {posts.length === 0 ? (
        <p className="writing-index-empty">
          Drafting in the open. First posts land alongside the Phase-2 content
          push.
        </p>
      ) : (
        <ul className="post-list" role="list">
          {posts.map((p) => (
            <li className="post" key={p.slug}>
              <span className="post-date">{formatMonthYear(p.frontmatter.date)}</span>
              <h3 className="post-title">
                <Link href={`/writing/${p.slug}`}>{p.frontmatter.title}</Link>
              </h3>
              <p className="post-dek">{p.frontmatter.dek}</p>
              <span className="post-read">{p.readingTime}</span>
            </li>
          ))}
        </ul>
      )}
      <Link className="more-link" href="/writing">
        All writing
        <span className="arrow" aria-hidden="true">
          →
        </span>
      </Link>
    </section>
  );
}
