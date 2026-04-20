import { notFound } from 'next/navigation';
import { getPost, getPostSlugs } from '@/lib/content';

// Pattern B (suffix route) for AGENT_READINESS §4.1 content negotiation.
// Externally reachable as `/writing/<slug>.md` via the middleware rewrite;
// canonical internal path is `/writing/<slug>/md`. Mirror of the case-study
// handler — keep the two in sync.

export const dynamic = 'force-static';
export const revalidate = 300;

export function generateStaticParams() {
  return getPostSlugs('writing').map((slug) => ({ slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = getPost('writing', slug);
  if (!post) notFound();

  const fm = post.frontmatter;
  const body = [
    post.content.trim(),
    '',
    '---',
    '',
    `- **Date** — ${fm.date}`,
    `- **Canonical** — https://akaushik.org/writing/${slug}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
      'X-Robots-Tag': 'index, follow',
      'Link': `<https://akaushik.org/writing/${slug}>; rel="canonical"`,
    },
  });
}
