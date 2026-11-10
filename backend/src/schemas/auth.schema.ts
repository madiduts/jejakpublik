import { z } from 'zod';

export const userRoleSchema = z.enum(['warga', 'moderator']);
export type UserRole = z.infer<typeof userRoleSchema>;

export const registerSchema = z.object({
  name: z.string().trim().max(100).optional(),
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

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Format email tidak valid.')
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token reset kata sandi wajib disertakan.'),
  new_password: z.string().min(6, 'Kata sandi baru minimal 6 karakter.')
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const googleAuthCallbackSchema = z.object({
  code: z.string().optional(),
  id_token: z.string().optional(),
  redirect_uri: z.string().optional()
});
export type GoogleAuthCallbackInput = z.infer<typeof googleAuthCallbackSchema>;

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}
