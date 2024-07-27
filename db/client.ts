import { drizzle, PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import dotenv from "dotenv";
import postgres from "postgres";
import * as schema from "./schemas";
import { PgTransaction } from "drizzle-orm/pg-core";
import { ExtractTablesWithRelations } from "drizzle-orm";

dotenv.config({ path: ".env" });

declare module globalThis {
  let db: DB | undefined;
}

const connectDB = () => {
  const client = postgres({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  return drizzle(client, {
    schema,
    logger: process.env.NODE_ENV === "development",
  });
};

export type DB = ReturnType<typeof connectDB>;

export type TX = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

const db = globalThis.db ?? connectDB();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.db = db;
