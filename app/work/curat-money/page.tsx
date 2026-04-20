import type { Metadata } from 'next';
import { CaseStudyStub } from '@/components/sections/CaseStudyStub';

export const metadata: Metadata = {
  title: 'curat.money · Case study',
  description:
    'A fair-comparison tool for crypto cards, built like a real product — custody checks, provider coverage, multi-environment deploys.',
};

export default function CuratCaseStudy() {
  return <CaseStudyStub slug="curat-money" />;
}
