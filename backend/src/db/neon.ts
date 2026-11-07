import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

export const isDbConfigured = Boolean(
  connectionString &&
    !connectionString.includes('username:password') &&
    connectionString.includes('neon.tech')
);

export const sql = isDbConfigured ? neon(connectionString as string) : null;
