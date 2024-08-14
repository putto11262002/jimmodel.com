import { drizzle, PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import dotenv from "dotenv";
import postgres from "postgres";
import * as schema from "./schemas";
import { PgTransaction } from "drizzle-orm/pg-core";
import { ExtractTablesWithRelations } from "drizzle-orm";

dotenv.config({ path: ".env" });

export type PostgresClient = postgres.Sql;

export type DB = ReturnType<typeof drizzle<typeof schema>>;

export type TX = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

export const getPgClient = (opts: postgres.Options<{}>): PostgresClient => {
  return postgres(opts);
};

export const getDrizzleDB = (postgresClient: postgres.Sql): DB => {
  return drizzle(postgresClient, {
    schema,
    logger: process.env.NODE_ENV === "development",
  });
};
