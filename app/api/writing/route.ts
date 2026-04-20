import { getAllPostsWithReadingTime } from '@/lib/content';

// JSON listing of writing posts — frontmatter-only, suitable for agents
// that want to enumerate the content without parsing Markdown. Pair with
// `/writing/<slug>.md` to fetch a specific post.

export const dynamic = 'force-static';
export const revalidate = 300;

export function GET() {
  const posts = getAllPostsWithReadingTime('writing')
    .slice()
    .sort((a, b) =>
      (b.frontmatter.date ?? '').localeCompare(a.frontmatter.date ?? ''),
    )
    .map((p) => ({
      slug: p.slug,
      title: p.frontmatter.title,
      dek: p.frontmatter.dek,
      date: p.frontmatter.date,
      readingTime: p.readingTime,
      url: `https://akaushik.org/writing/${p.slug}`,
      markdown: `https://akaushik.org/writing/${p.slug}.md`,
    }));

  return Response.json(
    { count: posts.length, posts },
    {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
        'Access-Control-Allow-Origin': '*',
      },
    },
  );
}
