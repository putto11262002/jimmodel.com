import { userTable } from "@/db/schemas";
import { File } from "./file";

export type User = typeof userTable.$inferSelect & {
  image: File | null;
};

export type UserWithoutSecrets = Omit<User, "password">;

export type UserCreateInput = typeof userTable.$inferInsert;
