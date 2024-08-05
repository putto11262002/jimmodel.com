import { ConfigSchema } from "@/config/global";
import ConstraintViolationError from "@/lib/errors/contrain-violation-error";
import userUsecase from "@/lib/usecases/user";
import { upperFirst } from "lodash";

export default async function createRootUser() {
  const root = ConfigSchema.shape.root.parse({});
  try {
    await userUsecase.createUser({
      name: upperFirst(root.user),
      email: root.email,
      username: root.user,
      password: root.password,
      roles: ["admin"],
    });
  } catch (e) {
    if (e instanceof ConstraintViolationError) {
      return;
    }
    throw e;
  }
}
