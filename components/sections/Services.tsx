import { SectionHeader } from './SectionHeader';

type Service = {
  num: string;
  title: string;
  duration: string;
  lede: string;
  list: ReadonlyArray<{ label: string; value: string }>;
};

const SERVICES: ReadonlyArray<Service> = [
  {
    num: 'S/01',
    title: 'Agent MVP',
    duration: '4 — 6 weeks',
    lede: 'A working agent system, in production, doing one thing your business needs done. Tool-use, memory, observability from day one.',
    list: [
      { label: 'In', value: 'Problem framing, agent design, production deploy, handoff docs' },
      { label: 'Out', value: 'Brand work, non-AI product surface area' },
      { label: 'Fit', value: 'Teams with a clear repeated workflow and real data' },
    ],
  },
  {
    num: 'S/02',
    title: 'AI enablement for an MSME operation',
    duration: '8 — 12 weeks',
    lede: 'For businesses that run on WhatsApp and spreadsheets. A layer that removes typing and memory load — not one that replaces judgment.',
    list: [
      { label: 'In', value: 'Operator interviews, a narrow AI surface, training & rollout' },
      { label: 'Out', value: 'Full ERP replacement, ledger migration' },
      { label: 'Fit', value: 'Owner-operators who want software that survives the day' },
    ],
  },
  {
    num: 'S/03',
    title: 'Production-hardening a POC',
    duration: '3 — 6 weeks',
    lede: 'You have a prototype that works in a demo. It needs to work on a Tuesday at 3pm with 200 users. I take it the rest of the way.',
    list: [
      { label: 'In', value: 'Observability, eval harness, rate limits, error budgets, on-call runbook' },
      { label: 'Out', value: 'New features during hardening' },
      { label: 'Fit', value: "Teams who've shipped a POC and lost a night's sleep to it" },
    ],
  },
];

export function Services() {
  return (
    <section
      className="services"
      id="services"
      data-screen-label="05 Services"
      data-companion-pose="services"
      aria-label="05 Services"
    >
      <SectionHeader
        num="05"
        title="What I can build for you"
        kicker={
          <>
            Three engagement shapes. Each with what&apos;s in scope, what&apos;s
            not, and a realistic timeline. If something sounds close but not
            quite, <a href="#contact">tell me what you&apos;re actually trying to do</a>.
          </>
        }
      />
      <div className="service-grid">
        {SERVICES.map((s) => (
          <article className="service" key={s.num}>
            <header>
              <span className="service-num">{s.num}</span>
              <h3>{s.title}</h3>
              <span className="service-dur">{s.duration}</span>
            </header>
            <p className="service-lede">{s.lede}</p>
            <ul className="service-list">
              {s.list.map((row) => (
                <li key={row.label}>
                  <span>{row.label}</span>
                  {row.value}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
