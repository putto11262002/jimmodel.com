import { User as _User } from "@/db/schemas";

export type User = _User;

export type UserWithoutSecrets = Omit<User, "password">;

