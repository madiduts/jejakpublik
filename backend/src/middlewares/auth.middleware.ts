import type { MiddlewareHandler } from 'hono';
import { verify } from 'hono/jwt';
import { UserModel, type UserPublic } from '../models/user.model.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'jejakpublik-secret-token-mia2026-secure-key';

declare module 'hono' {
  interface ContextVariableMap {
    user: UserPublic;
  }
}

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json(
      {
        success: false,
        error: 'Otorisasi ditolak. Token akses tidak ditemukan.',
        code: 'UNAUTHORIZED'
      },
      401
    );
  }

  const token = authHeader.substring(7).trim();

  try {
    const payload = await verify(token, JWT_SECRET, 'HS256');
    if (!payload || !payload.id) {
      return c.json(
        {
          success: false,
          error: 'Token akses tidak valid.',
          code: 'INVALID_TOKEN'
        },
        401
      );
    }

    const user = await UserModel.findById(payload.id as string);
    if (!user) {
      return c.json(
        {
          success: false,
          error: 'Pengguna terhubung dengan token tidak ditemukan.',
          code: 'USER_NOT_FOUND'
        },
        401
      );
    }

    c.set('user', UserModel.toPublic(user));
    await next();
  } catch (err: any) {
    return c.json(
      {
        success: false,
        error: 'Token akses telah kedaluwarsa atau tidak valid.',
        code: 'EXPIRED_OR_INVALID_TOKEN',
        details: err.message
      },
      401
    );
  }
};

export const requireModerator: MiddlewareHandler = async (c, next) => {
  const user = c.get('user');
  if (!user || user.role !== 'moderator') {
    return c.json(
      {
        success: false,
        error: 'Akses terbatas hanya untuk Tim Auditor & Verifikator JejakPublik.',
        code: 'FORBIDDEN_MODERATOR_ONLY'
      },
      403
    );
  }
  await next();
};

export const optionalAuth: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    try {
      const payload = await verify(token, JWT_SECRET, 'HS256');
      if (payload && payload.id) {
        const user = await UserModel.findById(payload.id as string);
        if (user) {
          c.set('user', UserModel.toPublic(user));
        }
      }
    } catch {
      // Abaikan jika token rusak pada optionalAuth
    }
  }
  await next();
};
