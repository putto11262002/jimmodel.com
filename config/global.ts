import { PostgresConfig } from "@/db/config";
import { flattenObject } from "@/lib/utils/object";
import { printZodError } from "@/lib/utils/zod";
import { z } from "zod";
import { successSign, errorSign } from "@/lib/utils/console";
import { loadEnv } from "@/lib/utils/env";
// Placeholder config for build time

export type AppConfig = {
  country?: string;
  url: string;
  db: DBConfig;
  s3: S3Config;
  redis: RedisConfig;
  googleAnalytics?: GoogleAnalyticsConfig;
};

export type GoogleAnalyticsConfig = {
  gtmId?: string;
};

export const GoogleAnalyticsConfigSchema: z.ZodSchema<
  GoogleAnalyticsConfig,
  z.ZodTypeDef,
  any
> = z.object({
  gtmId: z.string().optional(),
});

export type RedisConfig = {
  host: string;
  port?: number;
  password?: string;
};

export const RedisConfigSchema: z.ZodSchema<RedisConfig, z.ZodTypeDef, any> =
  z.object({
    host: z.string(),
    port: z
      .number()
      .or(
        z
          .string()
          .regex(/^\d{4}$/)
          .transform(Number)
      )
      .optional()
      .default(6379),
    password: z.string().optional(),
  });

export type S3Config = {
  accessKey: string;
  secretKey: string;
  endpoint: string;
  port?: number;
  bucketName: string;
};

export const S3ConfigSchema: z.ZodSchema<S3Config, z.ZodTypeDef, any> =
  z.object({
    accessKey: z.string(),
    secretKey: z.string(),
    endpoint: z.string(),
    port: z
      .number()
      .or(
        z
          .string()
          .regex(/^\d{4}$/)
          .transform(Number)
      )
      .optional(),
    bucketName: z.string(),
  });

export type DBConfig = {
  user: string;
  password: string;
  host: string;
  name: string;
  port?: number;
  ssl?: PostgresConfig["ssl"];
};

export const DBConfigSchema: z.ZodSchema<DBConfig, z.ZodTypeDef, any> =
  z.object({
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
          .transform(Number)
      )
      .optional()
      .default(5432),
    ssl: z
      .enum(["require", "allow", "prefer", "verify-full"])
      .or(z.boolean())
      .optional(),
  });

export const ConfigSchema: z.ZodSchema<AppConfig, z.ZodTypeDef, any> = z.object(
  {
    country: z.string().optional(),
    url: z.string().url(),
    db: DBConfigSchema,
    s3: S3ConfigSchema,
    redis: RedisConfigSchema,
  }
);

export const loadConfig = async () => {
  await loadEnv();
  const validation = ConfigSchema.safeParse({
    country: process.env.COUNTRY,
    url: process.env.URL || "http://localhost:3000",
    db: {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      name: process.env.DB_NAME,
      ssl: process.env.NODE_ENV === "production" ? "prefer" : false,
    },
    s3: {
      accessKey: process.env.S3_ACCESS_KEY,
      secretKey: process.env.S3_SECRET_KEY,
      endpoint: process.env.S3_ENDPOINT,
      port: process.env.S3_PORT,
      bucketName: process.env.S3_BUCKET_NAME,
    },
    redis: {
      host: process.env.REDIS_HOST || "localhost",
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
    },
  });
  if (!validation.success) {
    console.log(errorSign, "Error loading configurations:");
    printZodError(validation.error);
    process.exit(1);
  }

  console.log(successSign, "Loaded Configurations:");
  const secretsRegex = /(password|secret|email)/i;
  const flattenData = flattenObject(validation.data);
  Object.entries(flattenData).forEach(([field, value]) => {
    console.log(
      "\t-",
      `${field}:`,
      secretsRegex.test(value)
        ? String(value).replace(/./g, "*")
        : String(value)
    );
  });

  return validation.data;
};
