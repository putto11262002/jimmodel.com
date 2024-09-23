import { allKeys } from "../utils/type";
import { z } from "zod";

export type FieldsValidationError<T> = {
  [key in allKeys<T>]?: string[] | undefined;
};

export type ValidationResult<TIn, TOut> =
  | { ok: true; data: TOut }
  | {
      ok: false;
      fieldErrors: FieldsValidationError<TIn>;
      formErrors?: string[];
    };

export type ValidationFn<
  TIn,
  TOut,
  TDataIn = TIn,
  TZodTypeDef extends z.ZodTypeDef = z.ZodTypeDef
> = (
  data: TDataIn,
  schema: z.ZodSchema<TOut, TZodTypeDef, TIn>
) => ValidationResult<TIn, TOut>;
