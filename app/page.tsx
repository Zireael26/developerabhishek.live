import Hero from '@/components/sections/Hero';

/**
 * Home — single-page scroll with eight sections (PRD §5).
 *
 * Hero (section 01) owns its own markup via `<Hero />`. Sections 02–08 are
 * section-anchor scaffolds carrying the `id`, `data-screen-label`, and
 * `data-companion-pose` attrs the Wanderer's IntersectionObserver keys off
 * (HANDOFF §5, EPIC-01 §2). Their bodies arrive in per-slice PRs.
 */

type SectionPlaceholder = {
  id: string;
  label: string;
  pose: string;
  className: string;
};

const PLACEHOLDER_SECTIONS: ReadonlyArray<SectionPlaceholder> = [
  { id: 'about',    label: '02 About',       pose: 'about',    className: 'about' },
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
