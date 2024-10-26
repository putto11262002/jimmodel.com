import { z } from "zod";

export const stringNumber = z
  .string({ invalid_type_error: "Required", required_error: "Required" })
  .regex(/^\d*\.?\d*$/, { message: "Invalid number" })
  .transform((v) => parseInt(v));
