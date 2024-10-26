import { RedisConfig } from "./global";
import { AppUseCase } from "./usecase";
import { Queue, Worker } from "bullmq";
export const InitializeCronJobs = ({
  redisConfig,
  usecases,
}: {
  usecases: AppUseCase;
  redisConfig: RedisConfig;
}) => {
  const deleteFileQueue = new Queue("delete-file", {
    connection: {
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password,
    },
  });
  deleteFileQueue.upsertJobScheduler("repeat-every-5mins", {
    every: 60 * 60 * 1000,
  });

  const deleteFileWorker = new Worker(
    "delete-file",
    async () => {
      await usecases.fileUseCase.flushDelete();
    },
    {
      connection: {
        host: redisConfig.host,
        port: redisConfig.port,
        password: redisConfig.password,
      },
    }
  );
};
