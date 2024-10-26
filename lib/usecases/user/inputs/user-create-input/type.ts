import { NewUser } from "@/db/schemas";
import { z } from "zod";

export type UserCreateInput = Pick<
  NewUser,
  "name" | "username" | "password" | "email"
> & {
  roles?: Exclude<NewUser["roles"][number], "root">[] | undefined;
  confirmPassword: string;
};

export type RootUserCreateInput = Pick<
  UserCreateInput,
  "name" | "username" | "email" | "password" | "confirmPassword"
>;

export const RootUserCreateInputSchema = z
  .object({
    name: z.string(),
    username: z.string(),
    password: z.string(),
    email: z.string().email(),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
    return data;
  });

export const UserCreateInputSchema = z
  .object({
    name: z.string(),
    username: z.string(),
    password: z.string(),
    email: z.string().email(),
    roles: z.array(z.enum(["admin", "staff", "IT"])).optional(),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
    return data;
  });
