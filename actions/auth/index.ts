"use server";

import { SignInInputSchema } from "./inputs/sign-in-input";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BaseActionResult } from "../common/action-result";
import { signIn, signOut } from "@/config";
import { validateOrThrowValidationError } from "../common";
import { AuthenticationError } from "@/lib/errors";

export const signInAction = async (
  _: any,
  formData: FormData
): Promise<BaseActionResult> => {
  const result = validateOrThrowValidationError(formData, SignInInputSchema);
  try {
    await signIn("credentials", {
      username: result.username,
      password: result.password,
      redirect: false,
    });

    revalidatePath("/admin", "layout");
  } catch (e) {
    if (e instanceof Error && e.name === AuthenticationError.name) {
      return {
        status: "error",
        message: "Invalid credentials",
        data: undefined,
      };
    }
    return {
      status: "error",
      message: "Something went wrong",
      data: undefined,
    };
  }

  redirect("/admin");
};

export const signOutAction = async () => {
  await signOut({ redirect: false });
  redirect("/auth/sign-in");
};
