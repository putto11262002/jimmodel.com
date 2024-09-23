import { z } from "zod";

export const fileValidator = ({
  size = 5_000_000,
  types = [],
}: {
  size?: number;
  types?: string[];
}) =>
  z.any().transform((v, ctx) => {
    if (!(v instanceof Blob)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "No file provided",
      });
      return z.NEVER;
    }
    if (v.size > size) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "File exceeded size limit",
      });
      return z.NEVER;
    }

    if (types && types.length > 0 && !types.includes(v.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid file type",
      });
      return z.NEVER;
    }

    return v;
  });

export const imageValidator = () =>
  fileValidator({
    size: 5_000_000,
    types: ["image/jpg", "image/jpeg", "image/webp", "image/png"],
  });
