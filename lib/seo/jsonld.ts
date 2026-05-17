import { CANONICAL_ORIGIN, canonical } from '@/lib/canonical';

// Schema.org JSON-LD builders for SEO + identity disambiguation.
//
// Phase 2 SEO requirement: see docs/seo/2026-05-18-seo-strategy-design.md §4.
// Person JSON-LD is the entity anchor — Google uses sameAs[] to associate
// social-graph identities and Wikidata Q-id. Keep sameAs[] in sync with
// the canonical NAP block in docs/seo/STATUS.md §2.

type JsonLd = Record<string, unknown>;

// Update these `sameAs` entries as profiles get verified. The list ends up
// in <script type="application/ld+json"> on every page; broken URLs are
// fine syntactically but hurt the entity-graph signal.
const SAME_AS: string[] = [
  'https://x.com/abhi2601k',
  // TODO: confirm + add LinkedIn, GitHub, Bluesky, dev.to, Hashnode, Wikidata
  // Cross-reference docs/seo/STATUS.md §2 Canonical NAP block.
];

export function personJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Abhishek Kaushik',
    url: CANONICAL_ORIGIN,
    image: canonical('/images/abhishek.jpg'),
    jobTitle: 'AI Engineer',
    description:
      "Independent AI engineer building agent-native software and operational AI for teams that care about how things feel. Currently building agent systems at Bluehost; on the side, Neev for Indian MSMEs.",
    worksFor: {
      '@type': 'Organization',
      name: 'Bluehost',
    },
    sameAs: SAME_AS,
  };
}

export type ArticleInput = {
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  section?: string;
  ogImagePath?: string;
};

export function articleJsonLd(input: ArticleInput): JsonLd {
  const url = canonical(input.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.section ? { articleSection: input.section } : {}),
    ...(input.ogImagePath ? { image: canonical(input.ogImagePath) } : {}),
    author: {
      '@type': 'Person',
      name: 'Abhishek Kaushik',
      url: CANONICAL_ORIGIN,
    },
    publisher: {
      '@type': 'Person',
      name: 'Abhishek Kaushik',
      url: CANONICAL_ORIGIN,
    },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: Crumb[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: canonical(c.path),
    })),
  };
}

// Compact server component-friendly serializer. JSON.stringify with no
// pretty-print keeps payload minimal; escapes `<` so the literal can't
// terminate the script tag early.
export function jsonLdString(payload: JsonLd | JsonLd[]): string {
  return JSON.stringify(payload).replace(/</g, '\\u003c');
}
