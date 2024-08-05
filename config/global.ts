import { z } from "zod";

export const ConfigSchema = z.object({
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

const config = ConfigSchema.parse({
  root: {
    user: process.env.ROOT_USER,
    email: process.env.ROOT_EMAIL,
    password: process.env.ROOT_PASSWORD,
  },
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
  },
  s3: {
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    endpoint: process.env.S3_ENDPOINT,
    port: process.env.S3_PORT,
    bucketName: process.env.S3_BUCKET_NAME,
  },
});

export default config;
