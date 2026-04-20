// OpenAPI 3.1 specification for the portfolio's public API surface.
// Kept as a hand-written literal rather than generated from route scans —
// the surface is small and intentional; a generator would add complexity
// without buying type safety (route handlers don't ship Zod schemas here).

export const dynamic = 'force-static';
export const revalidate = 3600;

const SITE = 'https://akaushik.org';

const SPEC = {
  openapi: '3.1.0',
  info: {
    title: 'akaushik.org portfolio API',
    summary: 'Read-only access to portfolio content in Markdown and JSON.',
    description:
      'The portfolio exposes its content for agent consumption via four surfaces: (1) the full-corpus Markdown at /llms-full.txt, (2) per-page Markdown alternates at /work/<slug>.md and /writing/<slug>.md, (3) JSON listings at /api/writing and /api/case-studies, (4) HTTP content negotiation on /work/<slug> and /writing/<slug> via `Accept: text/markdown`.',
    version: '1.0.0',
    contact: {
      name: 'Abhishek Kaushik',
      email: 'hello@akaushik.org',
      url: SITE,
    },
    license: { name: 'All rights reserved' },
  },
  servers: [{ url: SITE }],
  paths: {
    '/llms.txt': {
      get: {
        summary: 'Short-form site digest (llmstxt.org format)',
        responses: {
          '200': {
            description: 'Markdown digest',
            content: { 'text/markdown': { schema: { type: 'string' } } },
          },
        },
      },
    },
    '/llms-full.txt': {
      get: {
        summary: 'Full portfolio corpus, concatenated',
        responses: {
          '200': {
            description: 'Markdown corpus',
            content: { 'text/markdown': { schema: { type: 'string' } } },
          },
        },
      },
    },
    '/api/writing': {
      get: {
        summary: 'List writing posts',
        responses: {
          '200': {
            description: 'Newest-first list of writing posts',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/WritingList' },
              },
            },
          },
        },
      },
    },
    '/api/case-studies': {
      get: {
        summary: 'List case studies',
        responses: {
          '200': {
            description: 'Curated order list of case studies',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CaseStudyList' },
              },
            },
          },
        },
      },
    },
    '/writing/{slug}.md': {
      get: {
        summary: 'Writing post as Markdown',
        description:
          'Pattern B (suffix). Equivalent to GET /writing/{slug} with Accept: text/markdown (Pattern A, RFC 7231 content negotiation).',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Post Markdown',
            content: { 'text/markdown': { schema: { type: 'string' } } },
          },
          '404': { description: 'Slug not found' },
        },
      },
    },
    '/work/{slug}.md': {
      get: {
        summary: 'Case study as Markdown',
        description:
          'Pattern B (suffix). Equivalent to GET /work/{slug} with Accept: text/markdown (Pattern A, RFC 7231 content negotiation).',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Case study Markdown',
            content: { 'text/markdown': { schema: { type: 'string' } } },
          },
          '404': { description: 'Slug not found' },
        },
      },
    },
    '/': {
      get: {
        summary: 'Home page',
        description:
          'HTML by default. With Accept: text/markdown the server rewrites to /llms.txt (short-form digest).',
        responses: {
          '200': {
            description: 'HTML home page or Markdown digest (content-negotiated)',
            content: {
              'text/html': { schema: { type: 'string' } },
              'text/markdown': { schema: { type: 'string' } },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      WritingPost: {
        type: 'object',
        required: ['slug', 'title', 'dek', 'date', 'url', 'markdown'],
        properties: {
          slug: { type: 'string' },
          title: { type: 'string' },
          dek: { type: 'string' },
          date: { type: 'string', format: 'date' },
          readingTime: { type: 'string' },
          url: { type: 'string', format: 'uri' },
          markdown: { type: 'string', format: 'uri' },
        },
      },
      WritingList: {
        type: 'object',
        required: ['count', 'posts'],
        properties: {
          count: { type: 'integer' },
          posts: {
            type: 'array',
            items: { $ref: '#/components/schemas/WritingPost' },
          },
        },
      },
      CaseStudy: {
        type: 'object',
        required: ['slug', 'title', 'dek', 'role', 'year', 'stack', 'url', 'markdown'],
        properties: {
          slug: { type: 'string' },
          title: { type: 'string' },
          dek: { type: 'string' },
          index: { type: 'string' },
          tag: { type: 'string' },
          year: { type: 'string' },
          role: { type: 'string' },
          stack: { type: 'array', items: { type: 'string' } },
          evidenceOf: { type: 'string' },
          url: { type: 'string', format: 'uri' },
          markdown: { type: 'string', format: 'uri' },
        },
      },
      CaseStudyList: {
        type: 'object',
        required: ['count', 'caseStudies'],
        properties: {
          count: { type: 'integer' },
          caseStudies: {
            type: 'array',
            items: { $ref: '#/components/schemas/CaseStudy' },
          },
        },
      },
    },
  },
} as const;

export function GET() {
  return Response.json(SPEC, {
    headers: {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
