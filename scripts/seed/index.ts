import seedRootUser from "./root-user";
import { AppUseCase } from "@/config/usecase";

export const seed = async (usecases: AppUseCase) => {
  await seedRootUser({ userUseCase: usecases.userUseCase });
};
