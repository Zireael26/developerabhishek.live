import { OPENAPI_SPEC } from '@/lib/openapi-spec';

// Source of truth: lib/openapi-spec.ts (shared with the human-readable page
// at /api/docs). Keep this file thin — just the HTTP shape + cache.

export const dynamic = 'force-static';
export const revalidate = 3600;

export function GET() {
  return Response.json(OPENAPI_SPEC, {
    headers: {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
