import * as Minio from "minio";
import { AppConfig } from "./global";

export const minioClientFactory = (config: AppConfig["s3"]) => {
  return new Minio.Client({
    accessKey: config.accessKey,
    secretKey: config.secretKey,
    endPoint: config.endpoint,
    useSSL: false,
    ...(config.port ? { port: config.port } : {}),
  });
};
