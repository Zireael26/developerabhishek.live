import type { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { getPost, getPostSlugs, type CaseStudyFrontmatter } from '@/lib/content';
import { CASE_STUDIES } from '@/components/sections/Work';
import { CaseStudyStub } from '@/components/sections/CaseStudyStub';
import { CaseStudyPage } from '@/components/work/CaseStudyPage';
import type { ReelSlug } from '@/components/work/reels';
import { articleJsonLd, breadcrumbJsonLd, jsonLdString } from '@/lib/seo/jsonld';

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
    return {
      title: `${fm.title} · Case study`,
      description: fm.dek,
      alternates: { canonical: `/work/${slug}` },
    };
  }
  const card = CASE_STUDIES.find((c) => c.slug === slug);
  if (card) {
    return {
      title: `${card.title} · Case study`,
      description: card.dek,
      alternates: { canonical: `/work/${slug}` },
    };
  }
  return {};
}

function caseStudyLdPayload(slug: string): string | null {
  const mdx = getPost('case-studies', slug);
  if (mdx) {
    const fm = mdx.frontmatter as CaseStudyFrontmatter;
    return jsonLdString([
      articleJsonLd({
        headline: fm.title,
        description: fm.dek,
        path: `/work/${slug}`,
        section: 'Case study',
        ogImagePath: `/work/${slug}/opengraph-image`,
      }),
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Work', path: '/work' },
        { name: fm.title, path: `/work/${slug}` },
      ]),
    ]);
  }
  const card = CASE_STUDIES.find((c) => c.slug === slug);
  if (card) {
    return jsonLdString([
      articleJsonLd({
        headline: card.title,
        description: card.dek,
        path: `/work/${slug}`,
        section: 'Case study',
      }),
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Work', path: '/work' },
        { name: card.title, path: `/work/${slug}` },
      ]),
    ]);
  }
  return null;
}

export default async function WorkDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const jsonLd = caseStudyLdPayload(slug);

  const mdx = getPost('case-studies', slug);
  if (mdx) {
    // An MDX file drives the render. Reuse the CaseStudyPage layout for any
    // slug that also exists as a home-page Work card (so the Reel placeholder
    // is wired up); fall back to a headerless layout for MDX-only entries so
    // `generateStaticParams` doesn't pre-render a route that 404s at request.
    return (
      <>
        {jsonLd ? (
          <Script
            id={`ld-work-${slug}`}
            type="application/ld+json"
            strategy="beforeInteractive"
          >
            {jsonLd}
          </Script>
        ) : null}
        {isCardSlug(slug) ? (
          <CaseStudyPage post={mdx} slug={slug} />
        ) : (
          <CaseStudyPage post={mdx} slug={null} />
        )}
      </>
    );
  }
  if (isCardSlug(slug)) {
    return (
      <>
        {jsonLd ? (
          <Script
            id={`ld-work-${slug}`}
            type="application/ld+json"
            strategy="beforeInteractive"
          >
            {jsonLd}
          </Script>
        ) : null}
        <CaseStudyStub slug={slug} />
      </>
    );
  }
  notFound();
}
