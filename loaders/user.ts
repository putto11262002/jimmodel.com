import "server-only";
import { GetUsersFilter } from "@/lib/usecases";
import { cache } from "react";
import { NotFoundError } from "@/lib/errors";
import { userUseCase } from "@/config";
export const getUsers = cache(async (filter: GetUsersFilter) => {
  return userUseCase.getUsers(filter);
});

export const getUserOrThrow = cache(async (id: string) => {
  const user = await userUseCase.getUser(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
});
