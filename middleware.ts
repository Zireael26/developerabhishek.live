import { NextResponse, type NextRequest } from 'next/server';

/**
 * Agent-readiness middleware.
 *
 *   1. Attaches RFC 8288 Link headers to every HTML response so crawlers
 *      discover llms.txt / llms-full.txt / sitemap / agent-skills / mcp /
 *      api-catalog without parsing the DOM. (AGENT_READINESS §3.3.)
 *   2. Content negotiation for Markdown (AGENT_READINESS §4.1):
 *      - Pattern B: `/work/<slug>.md` → `/work/<slug>/md`
 *        and `/writing/<slug>.md` → `/writing/<slug>/md`
 *      - Pattern A: if `Accept: text/markdown` is the preferred type on a
 *        content route, rewrite to the `/md` variant.
 *
 * Pattern B is the safety net: it's the shape isitagentready.com expects
 * (`.md` literally appended). Pattern A is additive — Vercel Edge has been
 * flaky with header-based rewrites on streaming responses (Risk R4), so if
 * it misbehaves in prod, Pattern B still satisfies the scan.
 */

const LINK_HEADER = [
  '</llms.txt>; rel="describedby"; type="text/markdown"',
  '</llms-full.txt>; rel="describedby"; type="text/markdown"',
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
  '</.well-known/agent-skills/index.json>; rel="https://schema.org/agent-skills"; type="application/json"',
  '</.well-known/mcp.json>; rel="https://modelcontextprotocol.io/rel/server"; type="application/json"',
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
].join(', ');

// Paths that have a `.md` alternate. The set is small and deliberate — adding
// an entry means the path must also have an `/md/route.ts` handler.
const MD_ALTERNATE_PREFIXES = ['/work/', '/writing/'] as const;

function rewritePatternB(pathname: string): string | null {
  if (!pathname.endsWith('.md')) return null;
  if (!MD_ALTERNATE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;
  const base = pathname.slice(0, -'.md'.length);
  // Guard against `/work/.md`, `/writing/foo/bar.md`, etc. Only one slug
  // segment after the prefix.
  const parts = base.split('/').filter(Boolean);
  if (parts.length !== 2) return null;
  return `${base}/md`;
}

function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  // Cheap and permissive: accept anything that lists text/markdown before
  // text/html. A real browser leads with text/html, so this only triggers
  // on agents that explicitly ask for Markdown.
  const head = accept.split(',')[0]?.trim().toLowerCase() ?? '';
  return head.startsWith('text/markdown');
}

function rewritePatternA(pathname: string): string | null {
  if (!MD_ALTERNATE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length !== 2) return null;
  if (pathname.endsWith('/md')) return null;
  if (pathname.endsWith('.md')) return null;
  return `${pathname}/md`;
}

function addContentNegotiationLink(
  headers: Headers,
  pathname: string,
): void {
  if (!MD_ALTERNATE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return;
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length !== 2) return;
  // Advertise the sibling `.md` alternate for this specific page.
  const existing = headers.get('Link');
  const alternate = `<${pathname}.md>; rel="alternate"; type="text/markdown"`;
  headers.set('Link', existing ? `${existing}, ${alternate}` : alternate);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const patternB = rewritePatternB(pathname);
  if (patternB) {
    return NextResponse.rewrite(new URL(patternB, request.url));
  }

  if (prefersMarkdown(request.headers.get('accept'))) {
    const patternA = rewritePatternA(pathname);
    if (patternA) {
      return NextResponse.rewrite(new URL(patternA, request.url));
    }
  }

  const response = NextResponse.next();
  response.headers.set('Link', LINK_HEADER);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Robots-Tag', 'index, follow');
  addContentNegotiationLink(response.headers, pathname);
  return response;
}

export const config = {
  // Match everything except Next's own internals and favicon. `.md` URLs need
  // to pass through so Pattern B can rewrite them, so we can't use the usual
  // "exclude paths with a dot" shortcut.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|init-theme\\.js|.*\\.(?:png|jpg|jpeg|webp|avif|svg|ico|css|js|woff|woff2|ttf|otf|txt|xml|json)$).*)',
  ],
};
