import { getDrizzleDB, getPgClient } from "@/db";
import seed from "../db/seed";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import path from "path";
import { ConfigSchema } from "@/lib/validators/config";

async function init() {
  const opts = ConfigSchema.shape.db.safeParse({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  });
  if (!opts.success) {
    console.log(opts.error.flatten().fieldErrors);
    process.exit(1);
  }
  const pgClient = getPgClient(opts.data);
  const db = getDrizzleDB(pgClient);
  await migrate(db, { migrationsFolder: path.join(__dirname, "./migrations") });
  await seed(db);
  await pgClient.end();
  process.exit(0);
}

init();