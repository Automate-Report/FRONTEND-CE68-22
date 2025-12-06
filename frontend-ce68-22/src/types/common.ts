export interface PaginatedResult<T> {
  total: number;
  page: number;
  size: number;
  total_pages: number;
  items: T[];
}