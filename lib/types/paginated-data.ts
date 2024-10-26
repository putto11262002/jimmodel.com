export type PaginatedData<T> = {
  data: T[];
} & Pagination;

export type Pagination = {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  pageSize: number;
};
