import { getDrizzleDB, getPgClient, DB, PostgresClient } from ".";
import config from "@/config/global";

declare module globalThis {
  let db: { db: DB; pgClient: PostgresClient } | undefined;
}
const connect = () => {
  const pgClient = getPgClient({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
  });
  const db = getDrizzleDB(pgClient);
  return { pgClient, db };
};

// db and pgClient with default configuration
export const { db, pgClient } = globalThis.db ?? connect();

// Cache the db and pgClient in development
if (process.env.NODE_ENV !== "production") {
  globalThis.db = { db, pgClient };
}
