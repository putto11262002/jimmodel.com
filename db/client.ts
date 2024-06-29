import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

declare module globalThis {
  let db: PostgresJsDatabase | undefined;
}

const connectDB = () => {
  const client = postgres({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  return drizzle(client, { logger: process.env.NODE_ENV === "development" });
};

const db = globalThis.db ?? connectDB();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.db = db;

