import type { ErrorHandler } from 'hono';
import { ZodError } from 'zod';
import { AppError, errorResponse } from '../utils/errors.js';

export const errorHandler: ErrorHandler = (err, c) => {
  // 1. Tangani AppError kustom
  if (err instanceof AppError) {
    return c.json(errorResponse(err.code, err.message, err.details), err.statusCode as any);
  }

  // 2. Tangani Zod Validation Error
  if (err instanceof ZodError) {
    const details = err.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message
    }));
    return c.json(errorResponse('validation_error', 'Validasi input gagal.', details), 400);
  }

  // 3. Tangani Error Internal Tak Terduga
  console.error('Unhandled Server Error:', err);
  const message = process.env.NODE_ENV === 'production' ? 'Terjadi kesalahan internal pada server.' : err.message;
  return c.json(errorResponse('internal_error', message), 500);
};
