import ConstraintViolationError from "@/lib/errors/contrain-violation-error";
import userUsecase from "@/lib/usecases/user";

export default async function createRootUser() {
  try {
    await userUsecase.createUser({
      name: process.env.ROOT_NAME || "Root",
      email: process.env.ROOT_EMAIL || "root@example/com",
      username: process.env.ROOT_USERNAME || "root",
      password: process.env.ROOT_PASSWORD || "password",
      roles: ["admin"],
    });
  } catch (e) {
    if (e instanceof ConstraintViolationError) {
      return;
    }
    throw e;
  }
}
