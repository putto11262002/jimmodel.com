import { ConstraintViolationError } from "@/lib/errors";
import { RootUserCreateInputSchema, UserUseCase } from "@/lib/usecases";
import _ from "lodash";
import { loadEnv } from "@/lib/utils/env";
import { printZodError } from "@/lib/utils/zod";
import { errorSign, successSign, warningSign } from "@/lib/utils/console";

export default async function seedRootUser({
  userUseCase,
}: {
  userUseCase: UserUseCase;
}) {
  await loadEnv();
  // Use as placeholder for the file use case.
  const validation = RootUserCreateInputSchema.safeParse({
    name: process.env.ROOT_NAME,
    email: process.env.ROOT_EMAIL,
    username: process.env.ROOT_USERNAME || process.env.ROOT_EMAIL,
    password: process.env.ROOT_PASSWORD,
    confirmPassword: process.env.ROOT_PASSWORD,
  });

  if (!validation.success) {
    console.log(errorSign, "Failed to load root user config");
    printZodError(validation.error);
    process.exit(1);
  }

  const rootUser = validation.data;

  try {
    await userUseCase.createRootUser(rootUser);
  } catch (e) {
    if (e instanceof ConstraintViolationError) {
      console.error(warningSign, e.message);
      return;
    }
    throw e;
  }

  console.log(successSign, "Seed root user");
  console.log(`\t- email: ${rootUser.email}`);
  console.log(`\t- username: ${rootUser.username}`);
  console.log(`\t- password: ${rootUser.password}`);
  return rootUser;
}
