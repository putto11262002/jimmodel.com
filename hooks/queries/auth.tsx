import { useMutation } from "@tanstack/react-query";
import { signIn, signOut } from "next-auth/react";

export function useSignOut() {
  return useMutation({
    mutationFn: async () => {
      await signOut({ redirect: false });
    },
  });
}

export function useSignIn() {
  return useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const res = await signIn("credentials", {
        username: username,
        password: password,
        redirect: false,
      });
      if (!res || res.error) {
        throw new Error("Invalid username or password");
      }
    },
  });
}
