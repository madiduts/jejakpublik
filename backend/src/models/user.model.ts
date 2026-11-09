import crypto from 'node:crypto';
import { query } from '../db/neon.js';

export type UserRole = 'warga' | 'moderator';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type UserPublic = Omit<User, 'password_hash'>;

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(':');
  if (!salt || !key) return false;
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return key === hash;
}

// In-memory store fallback & default seed accounts
const inMemoryUsers: Map<string, User> = new Map();

// Seed initial demo users
const seededWarga: User = {
  id: 'usr-warga-001',
  name: 'Warga Peduli Jakarta',
  email: 'warga@jejakpublik.id',
  password_hash: hashPassword('warga123'),
  role: 'warga',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const seededModerator: User = {
  id: 'usr-mod-001',
  name: 'Tim Auditor JejakPublik',
  email: 'moderator@jejakpublik.id',
  password_hash: hashPassword('admin123'),
  role: 'moderator',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

inMemoryUsers.set(seededWarga.email.toLowerCase(), seededWarga);
inMemoryUsers.set(seededModerator.email.toLowerCase(), seededModerator);

export class UserModel {
  static toPublic(user: User): UserPublic {
    const { password_hash, ...publicUser } = user;
    return publicUser;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Coba query ke Neon DB jika ada koneksi
    try {
      const res = await query<User>(
        'SELECT id, name, email, password_hash, role, created_at, updated_at FROM users WHERE LOWER(email) = $1 LIMIT 1',
        [cleanEmail]
      );
      if (res.rows && res.rows.length > 0) {
        return res.rows[0];
      }
    } catch {
      // Fallback ke in-memory jika Neon DB offline/tabel belum dibuat
    }

    // 2. Fallback memory
    return inMemoryUsers.get(cleanEmail) || null;
  }

  static async findById(id: string): Promise<User | null> {
    try {
      const res = await query<User>(
        'SELECT id, name, email, password_hash, role, created_at, updated_at FROM users WHERE id = $1 LIMIT 1',
        [id]
      );
      if (res.rows && res.rows.length > 0) {
        return res.rows[0];
      }
    } catch {
      // Fallback
    }

    for (const u of inMemoryUsers.values()) {
      if (u.id === id) return u;
    }
    return null;
  }

  static async create(params: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<UserPublic> {
    const cleanEmail = params.email.trim().toLowerCase();
    const existing = await this.findByEmail(cleanEmail);
    if (existing) {
      throw new Error('Email sudah terdaftar dalam sistem.');
    }

    const id = crypto.randomUUID();
    const passwordHash = hashPassword(params.password);
    const role: UserRole = params.role || 'warga';
    const now = new Date().toISOString();

    const newUser: User = {
      id,
      name: params.name.trim(),
      email: cleanEmail,
      password_hash: passwordHash,
      role,
      created_at: now,
      updated_at: now
    };

    // 1. Simpan ke Neon DB jika aktif
    try {
      await query(
        `INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [id, newUser.name, newUser.email, passwordHash, role, now, now]
      );
    } catch {
      // Fallback keep in memory
    }

    // 2. Simpan ke in-memory cache
    inMemoryUsers.set(cleanEmail, newUser);

    return this.toPublic(newUser);
  }
}
