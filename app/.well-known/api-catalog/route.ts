// RFC 9727 API Catalog — advertises the portfolio's machine-readable
// surfaces in a single JSON document. Agents fetch this at the well-known
// location to discover the OpenAPI spec, the JSON listings, and the
// Markdown corpus endpoints without parsing HTML.

export const dynamic = 'force-static';
export const revalidate = 3600;

const SITE = 'https://akaushik.org';

export function GET() {
  const linkset = {
    linkset: [
      {
        anchor: SITE,
        href: `${SITE}/api/openapi.json`,
        rel: 'service-desc',
        type: 'application/json',
        title: 'OpenAPI 3.1 specification',
      },
      {
        anchor: SITE,
        href: `${SITE}/api/writing`,
        rel: 'item',
        type: 'application/json',
        title: 'Writing — JSON listing',
      },
      {
        anchor: SITE,
        href: `${SITE}/api/case-studies`,
        rel: 'item',
        type: 'application/json',
        title: 'Case studies — JSON listing',
      },
      {
        anchor: SITE,
        href: `${SITE}/llms.txt`,
        rel: 'describedby',
        type: 'text/markdown',
        title: 'Short-form site digest (llms.txt)',
      },
      {
        anchor: SITE,
        href: `${SITE}/llms-full.txt`,
        rel: 'describedby',
        type: 'text/markdown',
        title: 'Full portfolio corpus (llms-full.txt)',
      },
      {
        anchor: SITE,
        href: `${SITE}/sitemap.xml`,
        rel: 'sitemap',
        type: 'application/xml',
        title: 'Sitemap',
      },
      {
        anchor: SITE,
        href: `${SITE}/.well-known/agent-skills/index.json`,
        rel: 'https://schema.org/agent-skills',
        type: 'application/json',
        title: 'Agent Skills discovery index',
      },
    ],
  };

  return new Response(JSON.stringify(linkset, null, 2) + '\n', {
    headers: {
      'Content-Type': 'application/linkset+json',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
