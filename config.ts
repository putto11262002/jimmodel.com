import { AppConfig, loadConfig } from "@/config/global";
import { minioClientFactory } from "@/config/minio";
import { AppUseCase, AppUseCaseFactory } from "@/config/usecase";
import { getDrizzleDB, getPgClient, DB, PostgresClient } from "@/db/config";
import { initAuth } from "@/lib/auth";
import { AppEventHub, eventHubFactory } from "./config/event-hub";
import { InitializeCronJobs } from "./config/cron-jobs";
import * as minio from "minio";

declare module globalThis {
  let db: { db: DB; pgClient: PostgresClient } | undefined;
  let usecases: AppUseCase | undefined;
  let config: AppConfig | undefined;
  let InitializeCronJobs: boolean | undefined;
  let appEventHub: AppEventHub | undefined;
  let minio: minio.Client | undefined;
}

const config = globalThis.config ?? (globalThis.config = await loadConfig());

globalThis.config = config;

const connect = () => {
  const pgClient = getPgClient({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
    ssl: "prefer",
  });
  const db = getDrizzleDB(pgClient);
  return { pgClient, db };
};

const { db, pgClient } = globalThis.db ?? connect();

globalThis.db = { db, pgClient };

const appEventHub = globalThis.appEventHub ?? (await eventHubFactory());

globalThis.appEventHub = appEventHub;

const minioClient = globalThis.minio ?? minioClientFactory(config.s3);

globalThis.minio = minioClient;

const usecases =
  globalThis.usecases ??
  (await AppUseCaseFactory({
    config,
    db,
    minio: minioClient,
    appEventHub,
  }));

globalThis.usecases = usecases;

export const {
  userUseCase,
  modelUseCase,
  jobUseCase,
  imageUseCase,
  fileUseCase,
  showcaseUseCase,
  contactMessageUseCase,
  webAssetUseCase,
  applicationUseCase,
} = usecases;

export const {
  signIn,
  signOut,
  auth,
  authWithoutRedirect,
  handlers,
  unstable_update,
} = initAuth({
  userUseCase,
});

if (!globalThis.InitializeCronJobs) {
  InitializeCronJobs({ usecases, redisConfig: config.redis });
  if (process.env.NODE_ENV !== "production") {
    globalThis.InitializeCronJobs = true;
  }
}

export { db, pgClient, config };
