import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPost, getPostSlugs, type WritingFrontmatter } from '@/lib/content';
import { getReadingTime } from '@/lib/reading-time';
import { MDX_OPTIONS } from '@/lib/mdx-options';
import { formatMonthYear } from '@/lib/dates';
import { HyperframesLoop, type WritingLoopSlug } from '@/components/media/hyperframes-loop';
import { articleJsonLd, breadcrumbJsonLd, jsonLdString } from '@/lib/seo/jsonld';

const WRITING_LOOPS: Partial<Record<string, WritingLoopSlug>> = {
  'building-this-portfolio': 'building-this-portfolio',
  'micrograd-makemore': 'micrograd-makemore',
  'ai-for-msme': 'ai-for-msme',
  'fastembed-to-tei': 'fastembed-to-tei',
};

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
  return {
    title: fm.title,
    description: fm.dek,
    alternates: { canonical: `/writing/${slug}` },
  };
}

export default async function WritingPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost('writing', slug);
  if (!post) notFound();
  const fm = post.frontmatter as WritingFrontmatter;
  const readingTime = fm.readingTime ?? getReadingTime(post.content);
  const loopSlug = WRITING_LOOPS[slug];

  const jsonLd = jsonLdString([
    articleJsonLd({
      headline: fm.title,
      description: fm.dek,
      path: `/writing/${slug}`,
      datePublished: fm.date,
      section: 'Writing',
      ogImagePath: `/writing/${slug}/opengraph-image`,
    }),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Writing', path: '/writing' },
      { name: fm.title, path: `/writing/${slug}` },
    ]),
  ]);

  return (
    <main id="top" className="writing-detail">
      <Script
        id={`ld-writing-${slug}`}
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {jsonLd}
      </Script>
      <Link href="/writing" className="work-stub-back">
        ← All writing
      </Link>
      <header className="writing-detail-head">
        <div className="writing-detail-meta">
          {fm.date ? <time dateTime={fm.date}>{formatMonthYear(fm.date)}</time> : null}
          <span className="writing-detail-sep">·</span>
          <span>{readingTime}</span>
        </div>
      </header>
      {loopSlug ? (
        <HyperframesLoop kind="writing" slug={loopSlug} className="writing-detail-loop" />
      ) : null}
      <article className="writing-detail-body">
        <MDXRemote source={post.content} options={MDX_OPTIONS} />
      </article>
    </main>
  );
}
