import type { Context } from 'hono';
import { sign, verify } from 'hono/jwt';
import { UserModel, verifyPassword } from '../models/user.model.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleAuthCallbackSchema
} from '../schemas/auth.schema.js';
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

  static async forgotPassword(c: Context) {
    const body = await c.req.json();
    const validated = forgotPasswordSchema.parse(body);

    const user = await UserModel.findByEmail(validated.email);
    if (!user) {
      // Keamanan: tetap berikan respons sukses agar tidak membocorkan eksistensi akun
      return c.json(
        successResponse(
          null,
          'Jika alamat email terdaftar, instruksi dan token pemulihan kata sandi telah diproses.'
        )
      );
    }

    // Token pemulihan kata sandi berlaku 1 jam
    const resetToken = await sign(
      {
        sub: user.id,
        email: user.email,
        type: 'password_reset',
        exp: Math.floor(Date.now() / 1000) + 60 * 60
      },
      JWT_SECRET,
      'HS256'
    );

    return c.json(
      successResponse(
        {
          email: user.email,
          reset_token: resetToken,
          expires_in: 3600
        },
        'Token pemulihan kata sandi berhasil diterbitkan.'
      )
    );
  }

  static async resetPassword(c: Context) {
    const body = await c.req.json();
    const validated = resetPasswordSchema.parse(body);

    let payload: any;
    try {
      payload = await verify(validated.token, JWT_SECRET, 'HS256');
    } catch {
      throw new AppError(
        'BAD_REQUEST' as any,
        'Token reset kata sandi tidak valid atau telah kedaluwarsa.',
        400
      );
    }

    if (!payload || payload.type !== 'password_reset' || !payload.sub) {
      throw new AppError(
        'BAD_REQUEST' as any,
        'Token reset kata sandi tidak sah.',
        400
      );
    }

    await UserModel.updatePassword(payload.sub as string, validated.new_password);

    return c.json(
      successResponse(
        null,
        'Kata sandi berhasil diperbarui. Silakan masuk kembali menggunakan kata sandi baru.'
      )
    );
  }

  static getGoogleAuthUrl(c: Context) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/v1/auth/google/callback';

    if (!clientId || clientId.includes('placeholder')) {
      throw new AppError(
        'BAD_REQUEST' as any,
        'Google Auth belum dikonfigurasi. Lengkapi GOOGLE_CLIENT_ID di berkas konfigurasi lingkungan.',
        400
      );
    }

    const scope = 'openid email profile';
    const authUrl =
      'https://accounts.google.com/o/oauth2/v2/auth?' +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      'response_type=code&' +
      `scope=${encodeURIComponent(scope)}&` +
      'access_type=offline&' +
      'prompt=consent';

    return c.json(
      successResponse({
        auth_url: authUrl,
        redirect_uri: redirectUri
      })
    );
  }

  static async handleGoogleCallback(c: Context) {
    const code = c.req.query('code');
    const error = c.req.query('error');

    if (error) {
      throw new AppError('UNAUTHORIZED' as any, `Otorisasi Google dibatalkan: ${error}`, 400);
    }

    if (!code) {
      throw new AppError('BAD_REQUEST' as any, 'Kode otorisasi Google tidak ditemukan.', 400);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/v1/auth/google/callback';

    if (!clientId || !clientSecret) {
      throw new AppError('INTERNAL_ERROR' as any, 'Kredensial Google OAuth server belum lengkap.', 500);
    }

    // Tukar kode otorisasi dengan token Google
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenResponse.ok) {
      const errBody = await tokenResponse.text();
      throw new AppError('UNAUTHORIZED' as any, `Gagal memverifikasi token Google: ${errBody}`, 401);
    }

    const tokenData = (await tokenResponse.json()) as any;
    const accessToken = tokenData.access_token;

    // Ambil profil data pengguna dari Google
    const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!userinfoResponse.ok) {
      throw new AppError('UNAUTHORIZED' as any, 'Gagal mengambil data profil Google.', 401);
    }

    const googleProfile = (await userinfoResponse.json()) as any;
    const name = googleProfile.name || googleProfile.given_name || 'Pengguna Google';
    const email = googleProfile.email;

    if (!email) {
      throw new AppError('BAD_REQUEST' as any, 'Email tidak ditemukan dari akun Google.', 400);
    }

    const user = await UserModel.findOrCreateFromGoogle({ name, email });

    const appToken = await sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
      },
      JWT_SECRET,
      'HS256'
    );

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const acceptHeader = c.req.header('Accept') || '';
    if (acceptHeader.includes('text/html')) {
      return c.redirect(`${frontendUrl}/auth/callback?token=${appToken}`);
    }

    return c.json({
      success: true,
      message: 'Otentikasi Google berhasil.',
      token: appToken,
      user
    });
  }

  static async loginWithGoogleToken(c: Context) {
    const body = await c.req.json();
    const validated = googleAuthCallbackSchema.parse(body);

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    let email = '';
    let name = '';

    if (validated.id_token) {
      const verifyRes = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(validated.id_token)}`
      );
      if (!verifyRes.ok) {
        throw new AppError('UNAUTHORIZED' as any, 'ID Token Google tidak valid.', 401);
      }
      const data = (await verifyRes.json()) as any;
      email = data.email;
      name = data.name || data.given_name || 'Pengguna Google';
    } else if (validated.code) {
      if (!clientId || !clientSecret) {
        throw new AppError('INTERNAL_ERROR' as any, 'Kredensial Google OAuth server belum lengkap.', 500);
      }

      const redirectUri =
        validated.redirect_uri ||
        process.env.GOOGLE_REDIRECT_URI ||
        'http://localhost:3000/api/v1/auth/google/callback';

      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code: validated.code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code'
        })
      });

      if (!tokenResponse.ok) {
        throw new AppError('UNAUTHORIZED' as any, 'Otorisasi kode Google gagal.', 401);
      }

      const tokenData = (await tokenResponse.json()) as any;
      const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const data = (await userinfoResponse.json()) as any;
      email = data.email;
      name = data.name || data.given_name || 'Pengguna Google';
    } else {
      throw new AppError('BAD_REQUEST' as any, 'Sertakan id_token atau authorization code.', 400);
    }

    if (!email) {
      throw new AppError('BAD_REQUEST' as any, 'Email Google tidak ditemukan.', 400);
    }

    const user = await UserModel.findOrCreateFromGoogle({ name, email });

    const appToken = await sign(
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
      message: 'Otentikasi Google berhasil.',
      token: appToken,
      user
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
