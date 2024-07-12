import z from "zod";
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
  file: z
    .any()
    .refine((v) => v instanceof Blob, "Please select a file")
    .transform((v) => v as File)
    .refine((v) => v.size <= 5_000_000, "File exceeded size limit")
    .refine(
      (v) =>
        ["image/jpg", "image/jpeg", "image/webp", "image/png"].includes(v.type),
      "Invalid file type",
    ),
});

export const NewUserSchema = UserWithoutPasswordSchema.and(
  z.object({ password: password }),
);
