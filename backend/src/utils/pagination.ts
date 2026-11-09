export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export function parsePagination(pageQuery?: string | number, limitQuery?: string | number, defaultLimit: number = 10): { page: number; limit: number } {
  const page = Math.max(1, Number(pageQuery) || 1);
  const limit = Math.min(100, Math.max(1, Number(limitQuery) || defaultLimit));
  return { page, limit };
}

export function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  return {
    total,
    page,
    limit,
    total_pages: Math.ceil(total / limit)
  };
}
