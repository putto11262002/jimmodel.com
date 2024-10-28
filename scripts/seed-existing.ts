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
import models from "./models_updated.json";
import { z } from "zod";
import {
  BOOKING_STATUS,
  BOOKING_STATUSES,
  GENDERS,
  MODEL_CATEGORIES,
} from "@/db/constants";
import { Model } from "@/lib/domains";
import { readFile } from "fs/promises";
import assert from "assert";

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

  for (const model of models) {
    const gender: z.ZodType<Model["gender"], z.ZodTypeDef, any> = z
      .enum(GENDERS)
      .or(z.any().transform(() => "male" as const));
    const bookingsStatus: z.ZodType<Model["bookingStatus"], z.ZodTypeDef, any> =
      z
        .enum(BOOKING_STATUSES)
        .or(z.any().transform(() => BOOKING_STATUS.DIRECT_BOOKING));
    const createdModel = await usecases.modelUseCase.createModel({
      name: model.name,
      gender: gender.parse(model.gender),
      bookingStatus: bookingsStatus.parse(model.bookingStatus),
      height: model.height,
      weight: model.weight,
      bust: model.bust,
      hips: model.hips,
    });
    assert(process.env.MODEL_IMAGE_PATH, "MODEL_IMAGE_PATH is not defined");
    const profileFile = await readFile(
      path.resolve(process.env.MODEL_IMAGE_PATH, model.profileImage)
    );
    const blob = new Blob([profileFile], {
      type: `image/${model.profileImage.split(".").pop()}`,
    });

    await usecases.modelUseCase.updateProfileImage(createdModel, {
      file: blob,
    });

    for (const image of model.portfolios) {
      const imageBuff = await readFile(
        path.resolve(__dirname, process.env.MODEL_IMAGE_PATH, image)
      );
      const file = new Blob([imageBuff], {
        type: `image/${model.profileImage.split(".").pop()}`,
      });

      await usecases.modelUseCase.addModelImage(createdModel, {
        file,
        type: "book",
      });
    }

    await usecases.modelUseCase.updateModelSettings(createdModel, {
      published: true,
    });
    console.log(`Model ${model.name} created`);
  }

  process.exit(0);
};

main();
