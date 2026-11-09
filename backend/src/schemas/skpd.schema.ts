import { z } from 'zod';

export const skpdQuerySchema = z.object({
  q: z.string().trim().optional(),
  komisi: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10)
});
export type SkpdQueryParams = z.infer<typeof skpdQuerySchema>;

export const skpdSlugParamSchema = z.object({
  id: z.string().trim().min(1, 'Slug atau ID SKPD wajib disertakan.')
});
