import { z } from "zod";

export const fileValidator = ({
  sizeLimit,
  mimetypes,
}: {
  sizeLimit: number;
  mimetypes: string[];
}) =>
  z
    .any()
    .transform((v, ctx) => {
      if (v instanceof Blob) {
        return v;
      }
      ctx.addIssue({
        code: "custom",
        message: "expected File",
        path: ["file"],
      });
      return z.NEVER;
    })
    .refine((v) => v.size <= sizeLimit, "File exceeded size limit")
    .refine((v) => mimetypes.includes(v.type), "Invalid file type");
