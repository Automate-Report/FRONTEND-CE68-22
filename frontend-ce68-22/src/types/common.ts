export interface PaginatedResult<T> {
  total: number;
  page: number;
  size: number;
  total_pages: number;
  items: T[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string; // ถ้าเป็นชั้นสุดท้ายอาจจะไม่ต้องใส่ href
}

export interface GenericBreadcrumbsProps {
  items: BreadcrumbItem[];
}