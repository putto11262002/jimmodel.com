import z from "zod";

export const UserPassworSchema = z
  .object({
    password: z.string().min(6, "password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    "passwords do not match",
  );

export const UserWithoutPasswordSchema = z.object({
  firstName: z.string().min(1, "first name is required"),
  lastName: z.string().min(1, "last name is required"),
  username: z
    .string()
    .min(3, "username must be at least 3 cahracters")
    .max(6, "username must be at most 6 characters"),
  email: z.string().email("invalid email"),
});

export const NewUserSchema = UserWithoutPasswordSchema.and(UserPassworSchema);
