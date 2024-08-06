import ConstraintViolationError from "@/lib/errors/contrain-violation-error";
import userUsecase from "@/lib/usecases/user";
import { ConfigSchema } from "@/lib/validators/config";
import _ from "lodash";
import dotenv from "dotenv";

dotenv.config({
  path: [
    ".env",
    ...(process.env.NODE_ENV === "production"
      ? [".env.production"]
      : [".env.development"]),
  ],
});

export default async function createRootUser() {
  const root = ConfigSchema.shape.root.parse({
    user: process.env.ROOT_USER,
    email: process.env.ROOT_EMAIL,
    password: process.env.ROOT_PASSWORD,
  });
  try {
    await userUsecase.createUser({
      name: _.upperFirst(root.user),
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
