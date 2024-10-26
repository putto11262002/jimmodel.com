import { z } from "zod";

export type SignInInput = {
  username: string;
  password: string;
};

export const SignInInputSchema: z.ZodSchema<SignInInput> = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
