import Hero from '@/components/sections/Hero';
import { About } from '@/components/sections/About';

/**
 * Home — single-page scroll with eight sections (PRD §5).
 *
 * Sections with a dedicated component render themselves (including their own
 * <section> element with id / data-screen-label / data-companion-pose).
 * Sections still awaiting implementation fall back to the placeholder
 * scaffold so the Wanderer's IntersectionObserver still has live anchors
 * (HANDOFF §5, EPIC-01 §2).
 */

type SectionPlaceholder = {
  id: string;
  label: string;
  pose: string;
  className: string;
};

const PLACEHOLDER_SECTIONS: ReadonlyArray<SectionPlaceholder> = [
  { id: 'work',     label: '03 Work',        pose: 'work',     className: 'work' },
  { id: 'writing',  label: '04 Writing',     pose: 'writing',  className: 'writing' },
  { id: 'services', label: '05 Services',    pose: 'services', className: 'services' },
  { id: 'process',  label: '06 Process',     pose: 'process',  className: 'process' },
  { id: 'open',     label: '07 In the open', pose: 'open',     className: 'opensource' },
  { id: 'contact',  label: '08 Contact',     pose: 'contact',  className: 'contact' },
];

export default function Home() {
  return (
    <main id="top">
      <Hero />
      <About />
      {PLACEHOLDER_SECTIONS.map((s) => (
        <section
          key={s.id}
          id={s.id}
          className={s.className}
          data-screen-label={s.label}
          data-companion-pose={s.pose}
          data-section-placeholder="true"
          aria-label={s.label}
        >
          {s.label} — section scaffold · body lands in its slice PR
        </section>
      ))}
    </main>
  );
}
