import { sql } from "drizzle-orm";
import { timestamp as _timestamp, uuid } from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: _timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: _timestamp("updated_at", { mode: "string", withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
} as const;

export const id = uuid("id")
  .primaryKey()
  .default(sql`gen_random_uuid()`);

const idTimestamp = {
  id,
  ...timestamps,
} as const;

export default idTimestamp;
