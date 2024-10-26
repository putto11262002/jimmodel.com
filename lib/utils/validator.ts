import { z } from "zod";
import { filesize } from "filesize";
import { ValidationResult } from "../types/validation";

export const stringToNumber = z.number().or(
  z
    .string()
    .regex(/^\d*\.?\d*$/, { message: "Invalid number" })
    .transform((v) => parseInt(v))
);

export const validate = <
  TIn extends Record<string, any>,
  TOut,
  TDataIn extends Record<string, any> = TIn,
  TZodTypeDef extends z.ZodTypeDef = z.ZodTypeDef
>(
  data: TDataIn,
  schema: z.ZodSchema<TOut, TZodTypeDef, TIn>
): ValidationResult<TIn, TOut> => {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      ok: false,
      fieldErrors: result.error.flatten().fieldErrors,
      formErrors: result.error.flatten().formErrors,
    };
  }
  return { ok: true, data: result.data };
};

export const fileValidator = ({
  size,
  mimetypes = [],
}: {
  size?: number;
  mimetypes?: string[];
}) =>
  z.instanceof(File, { message: "Invalid file" }).transform((v, ctx) => {
    if (size && v.size > size) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `file size ${filesize(v.size)} exceeds limit of ${filesize(
          size
        )}`,
      });
      return z.NEVER;
    }

    if (mimetypes && mimetypes.length > 0 && !mimetypes.includes(v.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid file type. Sopported file types are: ${mimetypes
          .map((mimetype) => mimetype.split("/").pop())
          .join(", ")}`,
      });
      return z.NEVER;
    }

    return v;
  });

export const imageValidator = () =>
  fileValidator({
    size: 5_000_000,
    mimetypes: ["image/jpg", "image/jpeg", "image/webp", "image/png"],
  });

/**
 * If the data does not match the schema, it will be transformed to undefined
 */
export const ignoreError = <T extends z.ZodTypeAny>(schema: T) =>
  schema.or(z.any().transform(() => undefined));
