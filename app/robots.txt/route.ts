// Served as a Route Handler (not MetadataRoute.Robots) because Cloudflare's
// Content-Signal directive is not expressible through the metadata API.
// Spec: contentsignals.org. Plan default: ai-train=yes (AGENT_READINESS §11 Q1).

export function GET() {
  const body = [
    '# Crawlers and agents are welcome.',
    '# Training on this content is opt-in — see Content Signals below.',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    '# Cloudflare Content Signals (contentsignals.org) — opt-in model.',
    '# search      — indexing for search results',
    '# ai-input    — use as retrieval/RAG context at inference time',
    '# ai-train    — use as model training data',
    'Content-Signal: search=yes, ai-input=yes, ai-train=yes',
    '',
    'Sitemap: https://akaushik.org/sitemap.xml',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
