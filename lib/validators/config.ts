import z from "zod";
export const ConfigSchema = z.object({
  url: z.string().optional().default("http://localhost:3000"),
  root: z.object({
    user: z.string().optional().default("root"),
    email: z.string().optional().default("root@jimmodel.com"),
    password: z.string().optional().default("password"),
  }),
  db: z.object({
    user: z.string(),
    password: z.string(),
    host: z.string().optional().default("localhost"),
    name: z.string(),
    port: z
      .number()
      .or(
        z
          .string()
          .regex(/^\d{4}$/)
          .transform(Number),
      )
      .optional()
      .default(5432),
  }),
  s3: z.object({
    accessKey: z.string(),
    secretKey: z.string(),
    endpoint: z.string().optional().default("localhost"),
    port: z
      .number()
      .or(
        z
          .string()
          .regex(/^\d{4}$/)
          .transform(Number),
      )
      .optional(),
    bucketName: z.string(),
  }),
});
