import Hero from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Work } from '@/components/sections/Work';
import { Writing } from '@/components/sections/Writing';
import { Services } from '@/components/sections/Services';
import { Process } from '@/components/sections/Process';
import { OpenSource } from '@/components/sections/OpenSource';
import { Contact } from '@/components/sections/Contact';

/**
 * Home — single-page scroll with all eight sections (PRD §5).
 * Each section component owns its own <section> element with the
 * data-companion-pose / data-screen-label attrs that Wanderer keys off.
 */
export default function Home() {
  return (
    <main id="top">
      <Hero />
      <About />
      <Work />
      <Writing />
      <Services />
      <Process />
      <OpenSource />
      <Contact />
    </main>
  );
}
