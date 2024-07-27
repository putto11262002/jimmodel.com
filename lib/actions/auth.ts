"use server";
import { signIn, signOut } from "@/lib/auth";
import { SignInSchema } from "@/lib/validators/auth";
import { AuthError } from "next-auth";
import { FormSubmissinState } from "./common";
import { revalidatePath } from "next/cache";

export const credentialSigninAction = async (
  _: FormSubmissinState,
  credentials: FormData,
): Promise<FormSubmissinState> => {
  const validationResult = SignInSchema.safeParse({
    username: credentials?.get("username"),
    password: credentials?.get("password"),
  });

  if (!validationResult.success) {
    return {
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const { username, password } = validationResult.data;
    await signIn("credentials", {
      username,
      password,
      redirectTo: "/admin",
    });
    revalidatePath("/", "layout");
    return {};
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "NEXT_REDIRECT") {
        throw error;
      }
    }

    if (error instanceof AuthError) {
      return {
        formError: error.cause?.err?.message,
      };
    }

    return {
      formError: "An unexpected error occurred",
    };
  }
};

export const signOutAction = async () => {
  await signOut({ redirectTo: "/" });
  revalidatePath("/", "layout");
};
