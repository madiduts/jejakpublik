import { z } from 'zod';

export const glossaryQuerySchema = z.object({
  category: z.string().trim().optional()
});
export type GlossaryQueryParams = z.infer<typeof glossaryQuerySchema>;

export interface GlossaryTerm {
  slug: string;
  term: string;
  category: 'Anggaran & Akuntansi' | 'Integritas Data' | 'Kinerja & Evaluasi';
  definition: string;
  legal_reference?: string;
}

export interface AboutSection {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
}

export interface GuideSection {
  id: string;
  step: number;
  title: string;
  summary: string;
  points: string[];
}
