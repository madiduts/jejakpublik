import { type PaginationMeta } from './pagination.js';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  meta: PaginationMeta;
  data: T[];
}

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    ...(message ? { message } : {}),
    data
  };
}

export function paginatedResponse<T>(items: T[], meta: PaginationMeta): PaginatedResponse<T> {
  return {
    success: true,
    meta,
    data: items
  };
}
