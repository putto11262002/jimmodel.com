import {
  FileUseCase,
  ImageUseCase,
  JobUsecase,
  ModelUseCase,
  S3FileStorageStrategy,
  UserUseCase,
  ApplicationUseCase,
  ShowcaseUseCase,
} from "@/lib/usecases";
import { WebAssetUseCase } from "@/lib/usecases/web-asset";
import { ContactMessageUseCase } from "@/lib/usecases/contact-message/usecase";
import { DB } from "@/db/config";
import * as Minio from "minio";
import { AppConfig } from "./global";
import { AppEventHub } from "./event-hub";

export type AppUseCase = {
  fileUseCase: FileUseCase;
  imageUseCase: ImageUseCase;
  userUseCase: UserUseCase;
  modelUseCase: ModelUseCase;
  jobUseCase: JobUsecase;
  applicationUseCase: ApplicationUseCase;
  webAssetUseCase: WebAssetUseCase;
  contactMessageUseCase: ContactMessageUseCase;
  showcaseUseCase: ShowcaseUseCase;
};

export const AppUseCaseFactory = async ({
  db,
  minio,
  config,
  appEventHub,
}: {
  db: DB;
  minio: Minio.Client;
  config: AppConfig;
  appEventHub?: AppEventHub;
}): Promise<AppUseCase> => {
  const fileUseCase = new FileUseCase({
    storages: [
      new S3FileStorageStrategy({
        identifier: "minio" as const,
        bucketName: config.s3.bucketName,
        client: minio,
      }),
    ],
    defaultStorage: "minio",
    db,
  });
  const imageUseCase = new ImageUseCase({ db, fileUseCase });
  const userUseCase = new UserUseCase({
    db,
    imageUseCase,
    fileUseCase,
    userEventHub: appEventHub?.globalEventHub,
  });
  const modelUseCase = new ModelUseCase({
    db,
    imageUseCase,
    fileUseCase,
    eventHub: appEventHub?.globalEventHub,
  });

  return {
    fileUseCase,
    imageUseCase,
    userUseCase,
    modelUseCase,
    jobUseCase: new JobUsecase({
      db,
      modelUseCase,
      userUseCase,
      modelEventHub: appEventHub?.globalEventHub,
      jobEventHub: appEventHub?.globalEventHub,
      userEventHub: appEventHub?.globalEventHub,
    }),
    applicationUseCase: new ApplicationUseCase({
      modelUseCase,
      fileUseCase,
      imageUseCase,
      db,
      config,
    }),
    webAssetUseCase: new WebAssetUseCase({
      imageUseCase,
      fileUseCase,
      db,
    }),
    contactMessageUseCase: new ContactMessageUseCase({ db }),
    showcaseUseCase: new ShowcaseUseCase({
      db,
      fileUseCase,
      imageUseCase,
      modelUseCase,
    }),
  };
};
