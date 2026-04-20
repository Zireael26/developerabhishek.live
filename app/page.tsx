/**
 * Home — single-page scroll with eight sections (PRD §5).
 *
 * This file is the section-anchor scaffold. Each <section> carries the
 * `id`, `data-screen-label`, and `data-companion-pose` attributes the
 * reference expects — the Wanderer's IntersectionObserver keys off them
 * (see HANDOFF §5, EPIC-01 §2). Section bodies arrive in per-slice PRs:
 * Hero → About → Services/Process → Work → In the open → Writing → Contact.
 */

type SectionPlaceholder = {
  id: string;
  label: string;
  pose: string;
  className: string;
};

const SECTIONS: ReadonlyArray<SectionPlaceholder> = [
  { id: 'hero',     label: '01 Hero',        pose: 'hero',     className: 'hero' },
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
      {SECTIONS.map((s) => (
        <section
          key={s.id}
          id={s.id === 'hero' ? undefined : s.id}
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
