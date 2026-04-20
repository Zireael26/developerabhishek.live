import Hero from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Process } from '@/components/sections/Process';

/**
 * Home — single-page scroll with eight sections (PRD §5).
 *
 * Sections with a dedicated component render themselves (including their own
 * <section> element with id / data-screen-label / data-companion-pose).
 * Sections still awaiting implementation fall back to the placeholder
 * scaffold so the Wanderer's IntersectionObserver still has live anchors
 * (HANDOFF §5, EPIC-01 §2).
 */

function Placeholder({
  id,
  label,
  pose,
  className,
}: {
  id: string;
  label: string;
  pose: string;
  className: string;
}) {
  return (
    <section
      id={id}
      className={className}
      data-screen-label={label}
      data-companion-pose={pose}
      data-section-placeholder="true"
      aria-label={label}
    >
      {label} — section scaffold · body lands in its slice PR
    </section>
  );
}

export default function Home() {
  return (
    <main id="top">
      <Hero />
      <About />
      <Placeholder id="work" label="03 Work" pose="work" className="work" />
      <Placeholder id="writing" label="04 Writing" pose="writing" className="writing" />
      <Services />
      <Process />
      <Placeholder id="open" label="07 In the open" pose="open" className="opensource" />
      <Placeholder id="contact" label="08 Contact" pose="contact" className="contact" />
    </main>
  );
}
