import z from "zod";
import { imageValidator } from "./file";
const password = z.string().min(6, "password must be at least 6 characters");
export const UserPassworSchema = z
  .object({
    password: password,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password does not match",
    path: ["confirmPassword"],
  });

export const UserWithoutPasswordSchema = z.object({
  name: z.string().min(1, "name is required"),
  username: z
    .string()
    .min(3, "username must be at least 3 cahracters")
    .max(6, "username must be at most 6 characters"),
  email: z.string().email("invalid email"),
});

export const NewUserImageSchema = z.object({
  file: imageValidator(),
});

export const NewUserSchema = UserWithoutPasswordSchema.merge(
  z.object({ password: password }),
);
