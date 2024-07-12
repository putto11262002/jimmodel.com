"use server";

import { UserCreateInput, UserRole } from "@/db/schemas/users";
import { revalidatePath } from "next/cache";
import { resetPassword, updateUserRole } from "../usecases/user";

export const updateUserRoleAction = async (
  userId: string,
  roles: UserRole[],
) => {
  await updateUserRole(userId, roles);
  revalidatePath("/admin/users", "layout");
};

export const resetPasswordAction = async (
  userId: string,
  newPassword: string,
) => {
  await resetPassword(userId, newPassword);
};
