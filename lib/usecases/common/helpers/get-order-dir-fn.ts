import { asc, desc } from "drizzle-orm";
import { OrderDir } from "../order-dir";

export const getOrderDirFn = (orderDir: OrderDir) => {
  return orderDir === "asc" ? asc : desc;
};
