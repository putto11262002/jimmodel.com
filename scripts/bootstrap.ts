import { loadConfig } from "@/config/global";
import { minioClientFactory } from "@/config/minio";
import { AppUseCaseFactory } from "@/config/usecase";
import { getDrizzleDB, getPgClient } from "@/db/config";
import { seed } from "./seed";
import { seedFakeData } from "./fake-data/seed";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { stringToIntOrUndefined } from "@/lib/utils/text";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const main = async () => {
  const config = await loadConfig();
  const minioClient = minioClientFactory(config.s3);
  const pgClient = getPgClient({
    db: config.db.name,
    host: config.db.host,
    password: config.db.password,
    port: config.db.port,
    user: config.db.user,
    ssl: config.db.ssl,
  });
  const drizzleClient = getDrizzleDB(pgClient);
  const usecases = await AppUseCaseFactory({
    db: drizzleClient,
    minio: minioClient,
    config,
  });

  process.exit(0);
};

main();
