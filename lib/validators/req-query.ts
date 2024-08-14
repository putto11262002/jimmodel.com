import { z } from "zod";

export const stringToNumber = z.number().or(
  z
    .string()
    .regex(/^\d*\.?\d*$/, { message: "Invalid number" })
    .transform((v) => parseInt(v)),
);

export const stringToBoolean = z
  .boolean()
  .or(z.string().transform((v) => v === "true"));

export const stringArray = z
  .string()
  .transform((v) => [v])
  .or(z.array(z.string()));

export const stringToDate = z
  .string()
  .datetime()
  .transform((s) => new Date(s));
