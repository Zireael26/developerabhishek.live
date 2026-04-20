import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'First-principles notes on agent systems and AI for traditional businesses.',
};

export default function WritingIndex() {
  const posts = getAllPosts('writing');

  return (
    <main id="top" className="writing-index">
      <div className="writing-index-inner">
        <Link href="/" className="work-stub-back">
          ← Back to home
        </Link>
        <h1 className="writing-index-title">Writing</h1>
        <p className="writing-index-lede">
          First-principles notes on agent systems and AI for traditional
          businesses. New posts land here without a redesign.
        </p>
        {posts.length === 0 ? (
          <p className="writing-index-empty">
            Drafting in the open. First posts land alongside the Phase-2
            content push.
          </p>
        ) : (
          <ul className="writing-index-list" role="list">
            {posts.map((p) => (
              <li key={p.slug} className="writing-index-item">
                <span className="writing-index-date">{p.frontmatter.date}</span>
                <h2 className="writing-index-item-title">
                  <Link href={`/writing/${p.slug}`}>{p.frontmatter.title}</Link>
                </h2>
                <p className="writing-index-item-dek">{p.frontmatter.dek}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
