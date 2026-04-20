import type { Metadata } from 'next';
import { CaseStudyStub } from '@/components/sections/CaseStudyStub';

export const metadata: Metadata = {
  title: 'Bluehost · agents framework · Case study',
  description:
    "The foundational platform behind Bluehost's agentic AI products — production scale, customer uptime, real users.",
};

export default function BluehostCaseStudy() {
  return <CaseStudyStub slug="bluehost-agents" />;
}
