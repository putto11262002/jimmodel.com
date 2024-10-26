import { getOffset } from "@/lib/utils/pagination";
import { PgSelect } from "drizzle-orm/pg-core";

export const withPagination = <T extends PgSelect>(
  qb: T,
  {
    pagination,
    page,
    pageSize,
    hardLimit = 100,
  }: { pagination: boolean; page: number; pageSize: number; hardLimit?: number }
) => {
  if (pagination === false) {
    return qb.limit(hardLimit);
  }
  return qb.limit(pageSize).offset(getOffset(page, pageSize));
};
