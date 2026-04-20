import type { Metadata } from 'next';
import { CaseStudyStub } from '@/components/sections/CaseStudyStub';

export const metadata: Metadata = {
  title: 'Neev · Case study',
  description:
    'Bringing AI to an industry that still runs on WhatsApp — modular operations platform for Indian textile distributors.',
};

export default function NeevCaseStudy() {
  return <CaseStudyStub slug="neev" />;
}
