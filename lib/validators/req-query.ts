import { z } from "zod";

export const stringToNumberOrError = z.number().or(
  z
    .string()
    .regex(/^\d*\.?\d*$/, { message: "Invalid number" })
    .transform((v) => parseInt(v)),
);

export const stringToNumberOrUndefined = z
  .number()
  .or(
    z
      .string()
      .regex(/^\d*\.?\d*$/, { message: "Invalid number" })
      .transform((v) => parseInt(v)),
  )
  .or(z.any().transform((v) => undefined));

export const stringToNumberOrDefault = (def: string) =>
  z
    .number()
    .or(
      z
        .string()
        .regex(/^\d*\.?\d*$/, { message: "Invalid number" })
        .transform((v) => parseInt(v)),
    )
    .or(z.any().transform(() => def));

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

export const stringToEnumArrayOrUndefined = <
  T extends readonly [string, ...string[]],
>(
  values: T,
) =>
  z
    .enum(values)
    .transform((v) => [v] as (typeof values)[number][])
    .or(
      z.array(z.enum(values)).transform((v) => v as (typeof values)[number][]),
    )
    .or(
      z
        .any()
        .transform(() => undefined as (typeof values)[number][] | undefined),
    );

export const stringToEnumOrUndefined = <
  T extends readonly [string, ...string[]],
>(
  values: T,
) =>
  z
    .enum(values)
    .transform((v) => v as (typeof values)[number])
    .or(
      z.any().transform(() => undefined as (typeof values)[number] | undefined),
    );
