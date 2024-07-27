import { z } from "zod";

export const stringToNumber = z.number().or(
  z
    .string()
    .regex(/^\d*\.?\d*$/, { message: "Invalid number" })
    .transform((v) => parseInt(v)),
);
