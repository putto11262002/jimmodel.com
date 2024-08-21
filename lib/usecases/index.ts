import config from "@/config/global";
import { ApplictionUseCase } from "./application";
import { db } from "@/db/client";
import * as Minio from "minio";
import { S3FileUseCase } from "./file";
import { JobUsecase } from "./job";
import { ModelUseCase } from "./model";
import { UserUsecase } from "./user";
import { EditableImageFactory, ImageUseCase } from "./image";

const minioClient = new Minio.Client({
  accessKey: config.s3.accessKey,
  secretKey: config.s3.secretKey,
  endPoint: config.s3.endpoint,
  useSSL: false,
  ...(process.env.S3_PORT ? { port: config.s3.port } : {}),
});

export const fileUseCase = new S3FileUseCase(minioClient, db, {
  defaultBucketName: config.s3.bucketName,
});

export const jobUsecase = new JobUsecase(db);

export const imageUseCase = new ImageUseCase({
  fileUseCase,
  editableImageFactory: new EditableImageFactory(),
});

export const modelUseCase = new ModelUseCase({ db, fileUseCase, imageUseCase });

export const userUsecase = new UserUsecase(db, fileUseCase);

export const applicationUseCase = new ApplictionUseCase({
  db,
  modelUseCase,
  fileUseCase,
});
