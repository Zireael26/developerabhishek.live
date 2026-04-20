import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Post, CaseStudyFrontmatter } from '@/lib/content';
import { MDX_OPTIONS } from '@/lib/mdx-options';
import { Reel, type ReelSlug } from './reels';

export function CaseStudyPage({
  post,
  slug,
}: {
  post: Post<'case-studies'>;
  slug: ReelSlug | null;
}) {
  const fm = post.frontmatter as CaseStudyFrontmatter;
  return (
    <main id="top" className="work-detail">
      <Link href="/#work" className="work-stub-back">
        ← Back to selected work
      </Link>
      <header className="work-detail-head">
        <div className="work-stub-meta">
          {fm.index ? <span className="case-index">{fm.index}</span> : null}
          {fm.tag ? <span className="case-tag">{fm.tag}</span> : null}
          {fm.year ? <span className="case-year">{fm.year}</span> : null}
        </div>
        {fm.role || fm.stack || fm.evidenceOf ? (
          <dl className="case-spec">
            {fm.role ? (
              <div>
                <dt>Role</dt>
                <dd>{fm.role}</dd>
              </div>
            ) : null}
            {fm.stack?.length ? (
              <div>
                <dt>Stack</dt>
                <dd>{fm.stack.join(' · ')}</dd>
              </div>
            ) : null}
            {fm.evidenceOf ? (
              <div>
                <dt>Evidence of</dt>
                <dd>{fm.evidenceOf}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}
      </header>
      {slug ? (
        <figure className="work-detail-reel" aria-hidden="true">
          <Reel slug={slug} />
        </figure>
      ) : null}
      <article className="work-detail-body">
        <MDXRemote source={post.content} options={MDX_OPTIONS} />
      </article>
    </main>
  );
}
