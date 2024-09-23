import { JobUsecase } from "@/lib/usecases";
import { generateBookingInput, generateJobCreateInput } from "../generator/job";
import { callNTimes, maybe, pickItem, randomBetween } from "../generator/utils";
import { faker } from "@faker-js/faker";
import { successSign } from "@/lib/utils/console";

export const seedFakeJob = async ({
  modelIds,
  userIds,
  jobUseCase,
  n = 10,
}: {
  modelIds: string[];
  userIds: string[];
  jobUseCase: JobUsecase;
  n?: number;
}) => {
  const jobIds: string[] = [];
  const jobIdUserMap: Record<string, string> = {};
  for (let i = 0; i < n; i++) {
    const fakeJob = generateJobCreateInput();
    const actor = pickItem(userIds);
    const jobId = await jobUseCase.createJob(fakeJob, actor);
    jobIds.push(jobId);
    jobIdUserMap[jobId] = actor;
  }

  const jobIdsWithModel = jobIds.filter((jobIds) => maybe(true, false));

  await Promise.all(
    jobIdsWithModel
      .map((jobId) => {
        const actor = jobIdUserMap[jobId];
        return faker.helpers
          .arrayElements(modelIds, { min: 1, max: 4 })
          .map((modelId) => jobUseCase.addModel(jobId, modelId, actor));
      })
      .flat()
  );

  await Promise.all(
    jobIdsWithModel
      .map((jobId) => {
        const actor = jobIdUserMap[jobId];
        const bookingsNum = randomBetween(1, 4);
        const bookings = callNTimes(bookingsNum, generateBookingInput);
        return bookings.map((booking) =>
          jobUseCase.addBooking(jobId, booking, actor)
        );
      })
      .flat()
  );
  console.log(successSign, `Seeded ${n} fake jobs`);
  jobIds.forEach((id) => console.log(`\t- ${id}`));
  return jobIds;
};
