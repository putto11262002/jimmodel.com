import { UserUseCase } from "@/lib/usecases";
import { generateStaffUserCreateInput } from "../generator/user";
import { ConstraintViolationError } from "@/lib/errors";
import { successSign } from "@/lib/utils/console";

const MAX_RETRIES = 3; // Maximum number of retries for user creation

export const seedFakeUser = async ({
  n = 10,
  password,
  userUseCase,
}: {
  userUseCase: UserUseCase;
  n?: number;
  password?: string;
}) => {
  const userIdsPromise: Promise<string>[] = [];

  for (let i = 0; i < n; i++) {
    const createUserWithRetry = async () => {
      let attempts = 0;
      while (attempts < MAX_RETRIES) {
        try {
          const userInput = generateStaffUserCreateInput({ password });
          return await userUseCase.createUser(userInput);
        } catch (error) {
          if (error instanceof ConstraintViolationError) {
            attempts++;
            // Optionally, you can log the error or the attempt count here
            console.warn(`Attempt ${attempts} failed: ${error.message}`);
          } else {
            throw error; // Rethrow if it's not a ConstraintViolationError
          }
        }
      }
      throw new Error("Max retries reached for user creation.");
    };

    userIdsPromise.push(createUserWithRetry());
  }

  const userIds = await Promise.all(userIdsPromise);
  console.log(successSign, `Seeded ${n} fake users`);
  userIds.forEach((id) => console.log(`\t- ${id}`));
  return userIds;
};
