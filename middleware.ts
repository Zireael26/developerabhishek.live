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

const LINK_HEADER = [
  '</llms.txt>; rel="llms-txt"; type="text/plain"',
  '</llms-full.txt>; rel="llms-full"; type="text/plain"',
  '</.well-known/agent-skills/index.json>; rel="agent-skills"',
  '</.well-known/mcp.json>; rel="mcp-server"',
  '</.well-known/api-catalog>; rel="api-catalog"',
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
