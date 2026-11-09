import { z } from 'zod';

export const userRoleSchema = z.enum(['warga', 'moderator']);
export type UserRole = z.infer<typeof userRoleSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Nama lengkap wajib diisi minimal 2 karakter.').max(100),
  email: z.string().trim().email('Format email tidak valid.').max(120),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter.').max(100),
  role: userRoleSchema.optional().default('warga')
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email('Format email tidak valid.'),
  password: z.string().min(1, 'Kata sandi wajib diisi.')
});
export type LoginInput = z.infer<typeof loginSchema>;

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}
