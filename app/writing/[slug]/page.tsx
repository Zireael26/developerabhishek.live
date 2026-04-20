import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import {
  getPost,
  getPostSlugs,
  type WritingFrontmatter,
} from '@/lib/content';
import { getReadingTime } from '@/lib/reading-time';

const MDX_OPTIONS = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: { light: 'github-light', dark: 'github-dark-dimmed' },
          keepBackground: false,
        },
      ],
    ] as never,
  },
};

export function generateStaticParams() {
  return getPostSlugs('writing').map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost('writing', slug);
  if (!post) return {};
  const fm = post.frontmatter as WritingFrontmatter;
  return { title: fm.title, description: fm.dek };
}

export default async function WritingPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost('writing', slug);
  if (!post) notFound();
  const fm = post.frontmatter as WritingFrontmatter;
  const readingTime = fm.readingTime ?? getReadingTime(post.content);

  return (
    <main id="top" className="writing-detail">
      <Link href="/writing" className="work-stub-back">
        ← All writing
      </Link>
      <header className="writing-detail-head">
        <div className="writing-detail-meta">
          {fm.date ? <time dateTime={fm.date}>{fm.date}</time> : null}
          <span className="writing-detail-sep">·</span>
          <span>{readingTime}</span>
        </div>
        <h1 className="writing-detail-title">{fm.title}</h1>
        {fm.dek ? <p className="writing-detail-dek">{fm.dek}</p> : null}
      </header>
      <article className="writing-detail-body">
        <MDXRemote source={post.content} options={MDX_OPTIONS} />
      </article>
    </main>
  );
}
