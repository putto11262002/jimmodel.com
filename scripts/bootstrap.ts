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

const parseFlagWithValue = (name: string): string | undefined => {
  const flag = process.argv.find((arg) => arg.startsWith(`--${name}`));
  if (!flag) return undefined;
  const splitFlag = flag?.split("=");
  if (splitFlag.length !== 2) return undefined;
  return splitFlag[1];
};

const flagExist = (name: string): boolean => {
  return process.argv.includes(`--${name}`);
};

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

  await migrate(drizzleClient, {
    migrationsFolder: path.resolve(__dirname, "../db/migrations"),
  });

  await seed(usecases);

  // --fake-data is set seed fake data
  if (flagExist("seed-fake")) {
    const nModel = parseFlagWithValue("nModel");
    const nJob = parseFlagWithValue("nJob");
    const nUser = parseFlagWithValue("nUser");
    await seedFakeData({
      usecases,
      nModel: nModel ? stringToIntOrUndefined(nModel) : undefined,
      nJob: nJob ? stringToIntOrUndefined(nJob) : undefined,
      nUser: nUser ? stringToIntOrUndefined(nUser) : undefined,
    });
  }

  process.exit(0);
};

main();
