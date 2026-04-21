import Link from 'next/link';
import { CASE_STUDIES } from './Work';
import { Reel, type ReelSlug } from '@/components/work/reels';

/**
 * Fallback rendered by `app/work/[slug]/page.tsx` when no MDX body exists
 * yet for a known card slug. Keeps the "Read the case study →" link from
 * ever 404-ing during the Phase-2 content gap. Phase 2 case-study slices
 * ship MDX bodies that replace this view; Bluehost keeps it permanently.
 */
export function CaseStudyStub({ slug }: { slug: ReelSlug }) {
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  if (!study) {
    return (
      <main id="top" className="work-stub">
        <p className="work-stub-lede">Case study not found.</p>
      </main>
    );
  }

  return (
    <main id="top" className="work-stub">
      <Link href="/#work" className="work-stub-back">
        ← Back to selected work
      </Link>
      <div className="work-stub-meta">
        <span className="case-index">{study.index}</span>
        <span className="case-tag">{study.tag}</span>
        <span className="case-year">{study.year}</span>
      </div>
      <h1 className="work-stub-title">{study.title}</h1>
      <p className="work-stub-dek">{study.dek}</p>
      <p className="work-stub-lede">{study.lede}</p>
      <figure className="work-stub-reel" aria-hidden="true">
        <Reel slug={slug} variant="hero" />
      </figure>
      <dl className="case-spec">
        {study.spec.map((s) => (
          <div key={s.term}>
            <dt>{s.term}</dt>
            <dd>{s.def}</dd>
          </div>
        ))}
      </dl>
      <div className="work-stub-notice">
        Case study in preparation. Full write-up lands in Phase 2 via the MDX
        pipeline. Meanwhile: the home-page card above is the honest headline —
        email <a href="mailto:hello@akaushik.org">hello@akaushik.org</a>{' '}
        if you want the full story today.
      </div>
    </main>
  );
}
