import { SERVICES } from '@/lib/services';
import { SectionHeader } from './SectionHeader';

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
