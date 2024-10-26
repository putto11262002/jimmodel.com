import { z } from "zod";

export const UserPasswordResetInputSchema = z
  .object({
    password: z.string().min(6, "password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export type UserPasswordResetInput = z.infer<
  typeof UserPasswordResetInputSchema
>;
