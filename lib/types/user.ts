import { userTable } from "@/db/schemas";
import { FileInfo } from "./file";

export type User = typeof userTable.$inferSelect & {
  image: FileInfo | null;
};

export type UserWithoutSecrets = Omit<User, "password">;

export type UserCreateInput = typeof userTable.$inferInsert;
