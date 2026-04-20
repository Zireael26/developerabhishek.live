import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPost, getPostSlugs, type CaseStudyFrontmatter } from '@/lib/content';
import { CASE_STUDIES } from '@/components/sections/Work';
import { CaseStudyStub } from '@/components/sections/CaseStudyStub';
import { CaseStudyPage } from '@/components/work/CaseStudyPage';
import type { ReelSlug } from '@/components/work/reels';

const CARD_SLUGS = CASE_STUDIES.map((c) => c.slug) as ReelSlug[];

function isCardSlug(s: string): s is ReelSlug {
  return (CARD_SLUGS as string[]).includes(s);
}

export function generateStaticParams() {
  const mdxSlugs = getPostSlugs('case-studies');
  const allSlugs = Array.from(new Set<string>([...CARD_SLUGS, ...mdxSlugs]));
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mdx = getPost('case-studies', slug);
  if (mdx) {
    const fm = mdx.frontmatter as CaseStudyFrontmatter;
    return { title: `${fm.title} · Case study`, description: fm.dek };
  }
  const card = CASE_STUDIES.find((c) => c.slug === slug);
  if (card) {
    return { title: `${card.title} · Case study`, description: card.dek };
  }
  return {};
}

export default async function WorkDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const mdx = getPost('case-studies', slug);
  if (mdx && isCardSlug(slug)) {
    return <CaseStudyPage post={mdx} slug={slug} />;
  }
  if (isCardSlug(slug)) {
    return <CaseStudyStub slug={slug} />;
  }
  notFound();
}
