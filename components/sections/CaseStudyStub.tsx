import Link from 'next/link';
import { CASE_STUDIES } from './Work';

type CaseStudyStubProps = {
  slug: (typeof CASE_STUDIES)[number]['slug'];
};

export function CaseStudyStub({ slug }: CaseStudyStubProps) {
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
        email <a href="mailto:hello@developerabhishek.live">hello@developerabhishek.live</a>{' '}
        if you want the full story today.
      </div>
    </main>
  );
}
