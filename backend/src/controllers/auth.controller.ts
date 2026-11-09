import type { Context } from 'hono';
import { sign } from 'hono/jwt';
import { UserModel, verifyPassword } from '../models/user.model.js';
import { registerSchema, loginSchema, type UserRole } from '../schemas/auth.schema.js';
import { JWT_SECRET } from '../middlewares/auth.middleware.js';
import { AppError } from '../utils/errors.js';
import { successResponse } from '../utils/responses.js';

export class AuthController {
  static async register(c: Context) {
    const body = await c.req.json();
    const validated = registerSchema.parse(body);

    const user = await UserModel.create({
      name: validated.name,
      email: validated.email,
      password: validated.password,
      role: validated.role
    });

    const token = await sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
      },
      JWT_SECRET,
      'HS256'
    );

    return c.json(
      {
        success: true,
        message: 'Pendaftaran akun berhasil.',
        token,
        user
      },
      201
    );
  }

  static async login(c: Context) {
    const body = await c.req.json();
    const validated = loginSchema.parse(body);

    const user = await UserModel.findByEmail(validated.email);
    if (!user) {
      throw new AppError('UNAUTHORIZED' as any, 'Email atau kata sandi tidak sesuai.', 401);
    }

    const isMatch = verifyPassword(validated.password, user.password_hash);
    if (!isMatch) {
      throw new AppError('UNAUTHORIZED' as any, 'Email atau kata sandi tidak sesuai.', 401);
    }

    const token = await sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
      },
      JWT_SECRET,
      'HS256'
    );

    return c.json({
      success: true,
      message: 'Otentikasi berhasil.',
      token,
      user: UserModel.toPublic(user)
    });
  }

  static async me(c: Context) {
    const user = c.get('user');
    return c.json(successResponse(user));
  }

  static async getDemoAccounts(c: Context) {
    const isEnabled = process.env.ENABLE_DEMO_ACCOUNTS === 'true';
    if (!isEnabled) {
      return c.json(
        {
          success: false,
          error: 'Mode demonstrasi akun dinonaktifkan di lingkungan produksi.'
        },
        403
      );
    }

    const wargaEmail = process.env.DEMO_WARGA_EMAIL;
    const wargaPassword = process.env.DEMO_WARGA_PASSWORD;
    const modEmail = process.env.DEMO_MODERATOR_EMAIL;
    const modPassword = process.env.DEMO_MODERATOR_PASSWORD;

    if (!wargaEmail || !modEmail) {
      return c.json(
        {
          success: false,
          error: 'Konfigurasi akun demo belum diatur pada berkas lingkungan (.env).'
        },
        500
      );
    }

    return c.json({
      success: true,
      description: 'Akun demonstrasi terkonfigurasi dari environment variables (mode evaluasi)',
      accounts: [
        {
          role: 'warga',
          email: wargaEmail,
          password: wargaPassword,
          capability: 'Mengajukan laporan partisipatif dengan bukti foto dokumen & tracking status tiket'
        },
        {
          role: 'moderator',
          email: modEmail,
          password: modPassword,
          capability: 'Verifikasi anomali, memberikan catatan audit trail, mengubah status tiket'
        }
      ]
    });
  }
}
