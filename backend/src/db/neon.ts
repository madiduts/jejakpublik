import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

export const isDbConfigured = Boolean(
  connectionString &&
    !connectionString.includes('username:password') &&
    connectionString.includes('neon.tech')
);

export const sql = isDbConfigured ? neon(connectionString as string) : null;

export async function query<T = any>(text: string, params: any[] = []): Promise<{ rows: T[] }> {
  if (!sql) return { rows: [] };
  try {
    const rows = (await (sql as any).query(text, params)) as T[];
    return { rows: Array.isArray(rows) ? rows : [] };
  } catch (err) {
    console.warn('Neon query fallback:', err);
    return { rows: [] };
  }
}
