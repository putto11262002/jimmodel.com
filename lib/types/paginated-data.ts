export type PaginatedData<T> = {
  data: T[];
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  pageSize: number;
};
