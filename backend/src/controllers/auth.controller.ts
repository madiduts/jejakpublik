import type { Context } from 'hono';
import { sign } from 'hono/jwt';
import { UserModel, verifyPassword, type UserRole } from '../models/user.model.js';
import { JWT_SECRET } from '../middlewares/auth.middleware.js';

export class AuthController {
  static async register(c: Context) {
    try {
      const body = await c.req.json();
      const { name, email, password, role } = body;

      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return c.json(
          {
            success: false,
            error: 'Nama lengkap wajib diisi minimal 2 karakter.'
          },
          400
        );
      }

      if (!email || typeof email !== 'string' || !email.includes('@')) {
        return c.json(
          {
            success: false,
            error: 'Alamat email tidak valid.'
          },
          400
        );
      }

      if (!password || typeof password !== 'string' || password.length < 6) {
        return c.json(
          {
            success: false,
            error: 'Kata sandi wajib diisi minimal 6 karakter.'
          },
          400
        );
      }

      const assignedRole: UserRole = role === 'moderator' ? 'moderator' : 'warga';

      const user = await UserModel.create({
        name,
        email,
        password,
        role: assignedRole
      });

      // Buat JWT Token (Aktif 7 hari)
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
    } catch (err: any) {
      return c.json(
        {
          success: false,
          error: err.message || 'Gagal mendaftarkan pengguna baru.'
        },
        400
      );
    }
  }

  static async login(c: Context) {
    try {
      const body = await c.req.json();
      const { email, password } = body;

      if (!email || !password) {
        return c.json(
          {
            success: false,
            error: 'Email dan kata sandi wajib diisi.'
          },
          400
        );
      }

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return c.json(
          {
            success: false,
            error: 'Email atau kata sandi tidak sesuai.'
          },
          401
        );
      }

      const isMatch = verifyPassword(password, user.password_hash);
      if (!isMatch) {
        return c.json(
          {
            success: false,
            error: 'Email atau kata sandi tidak sesuai.'
          },
          401
        );
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
    } catch (err: any) {
      return c.json(
        {
          success: false,
          error: err.message || 'Terjadi kesalahan saat otentikasi.'
        },
        500
      );
    }
  }

  static async me(c: Context) {
    const user = c.get('user');
    return c.json({
      success: true,
      user
    });
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
