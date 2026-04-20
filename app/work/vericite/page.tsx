import type { Metadata } from 'next';
import { CaseStudyStub } from '@/components/sections/CaseStudyStub';

export const metadata: Metadata = {
  title: 'VeriCite · Case study',
  description:
    'A retrieval stack an institution can actually trust with its own words — multi-tenant institutional RAG on HF TEI + Qdrant + Ory.',
};

export default function VeriCiteCaseStudy() {
  return <CaseStudyStub slug="vericite" />;
}
