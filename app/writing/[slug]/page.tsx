import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import {
  getPost,
  getPostSlugs,
  type WritingFrontmatter,
} from '@/lib/content';
import { getReadingTime } from '@/lib/reading-time';
import { MDX_OPTIONS } from '@/lib/mdx-options';
import { formatMonthYear } from '@/lib/dates';

export function generateStaticParams() {
  return getPostSlugs('writing').map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost('writing', slug);
  if (!post) return {};
  const fm = post.frontmatter as WritingFrontmatter;
  return { title: fm.title, description: fm.dek };
}

export default async function WritingPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost('writing', slug);
  if (!post) notFound();
  const fm = post.frontmatter as WritingFrontmatter;
  const readingTime = fm.readingTime ?? getReadingTime(post.content);

  return (
    <main id="top" className="writing-detail">
      <Link href="/writing" className="work-stub-back">
        ← All writing
      </Link>
      <header className="writing-detail-head">
        <div className="writing-detail-meta">
          {fm.date ? (
            <time dateTime={fm.date}>{formatMonthYear(fm.date)}</time>
          ) : null}
          <span className="writing-detail-sep">·</span>
          <span>{readingTime}</span>
        </div>
      </header>
      <article className="writing-detail-body">
        <MDXRemote source={post.content} options={MDX_OPTIONS} />
      </article>
    </main>
  );
}
