import { NextResponse, type NextRequest } from 'next/server';

/**
 * Agent-readiness Link headers (RFC 8288).
 *
 * The portfolio needs to pass Cloudflare's isitagentready.com scan as a
 * ship-blocking gate — see AGENT_READINESS.md. Link headers are the canonical
 * way for agent crawlers to discover llms.txt, the Agent Skills index, and
 * the MCP server card without parsing the DOM.
 *
 * We also attach a minimal CSP here; the full policy is owned by the
 * security-headers epic and will be tightened during the hardening pass.
 */

// Per AGENT_READINESS §3.3 and RFC 8288. `describedby` is the standard rel
// for machine-readable descriptions; llms.txt / llms-full.txt are served as
// text/markdown. Sitemap uses the IANA-registered `sitemap` rel. Custom
// scheme IRIs are used for agent-specific resources (agent-skills / mcp /
// api-catalog) since no IANA rel exists for these yet.
const LINK_HEADER = [
  '</llms.txt>; rel="describedby"; type="text/markdown"',
  '</llms-full.txt>; rel="describedby"; type="text/markdown"',
  '</sitemap.xml>; rel="sitemap"; type="application/xml"',
  '</.well-known/agent-skills/index.json>; rel="https://schema.org/agent-skills"; type="application/json"',
  '</.well-known/mcp.json>; rel="https://modelcontextprotocol.io/rel/server"; type="application/json"',
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
].join(', ');

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('Link', LINK_HEADER);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Robots-Tag', 'index, follow');

  return response;
}

export const config = {
  // Apply to every page + API route except Next's own internals and static assets.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
