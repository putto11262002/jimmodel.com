import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schemas/*",
  out: "./db/migrations",
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    ssl: process.env.NODE_ENV === "production" ? "prefer" : false,
  },
});
