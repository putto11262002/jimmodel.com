import {
  generateModelBlockCreateInput,
  generateModelCreateInput,
  generateModelExperienceCreateInput,
} from "../generator/model";
import { ModelUseCase } from "@/lib/usecases";
import { callNTimes, maybe, randomBetween } from "../generator/utils";
import { successSign } from "@/lib/utils/console";

export const seedFakeModel = async ({
  modelUseCase,
  n = 10,
}: {
  modelUseCase: ModelUseCase;
  n?: number;
}) => {
  const modelIds = [];
  for (let i = 0; i < n; i++) {
    const modelInput = generateModelCreateInput();
    const modelId = await modelUseCase.createModel(modelInput);

    await Promise.all([
      ...callNTimes(
        randomBetween(0, 4),
        generateModelExperienceCreateInput
      ).map((input) => modelUseCase.addExperience(modelId, input)),
      ...maybe(
        [modelUseCase.createBlock(modelId, generateModelBlockCreateInput())],
        []
      ),
    ]);
    modelIds.push(modelId);
  }
  console.log(successSign, `Seeded ${n} fake models`);
  modelIds.forEach((id) => console.log(`\t- ${id}`));
  return modelIds;
};
