import { AppUseCase } from "@/config/usecase";
import { seedFakeModel } from "./model";
import { seedFakeJob } from "./job";
import { seedFakeUser } from "./user";

export const seedFakeData = async ({
  usecases,
  nModel,
  nJob,
  nUser,
}: {
  usecases: AppUseCase;
  nModel?: number;
  nJob?: number;
  nUser?: number;
}) => {
  const userIds = await seedFakeUser({
    userUseCase: usecases.userUseCase,
    n: nUser,
  });

  const modelIds = await seedFakeModel({
    modelUseCase: usecases.modelUseCase,
    n: nModel,
  });

  const jobIds = await seedFakeJob({
    modelIds,
    userIds,
    jobUseCase: usecases.jobUseCase,
    n: nJob,
  });
};
