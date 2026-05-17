// Canonical-URL helper for per-page Next metadata.
//
// `metadataBase` in app/layout.tsx sets the origin for OG-image absolute
// URLs but does NOT cause Next to emit <link rel="canonical">. Each page
// must set `alternates: { canonical }` explicitly. This helper keeps the
// origin authoritative in one place and accepts either a path or a fully
// qualified URL.
//
// Phase 0 SEO requirement: see docs/seo/2026-05-18-seo-strategy-design.md §2.

export const CANONICAL_ORIGIN = 'https://akaushik.org';

export function canonical(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${CANONICAL_ORIGIN}${path}`;
}
