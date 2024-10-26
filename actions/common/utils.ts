import { z } from "zod";
import { validateFormData, ValidationOptions } from "@/lib/utils/form-data";
import { ValidationError } from "@/lib/errors/validation-error";
import { InvalidArgumentError } from "@/lib/errors";

export const validateOrThrowValidationError = <TIn, TOut>(
  formData: FormData,
  schema: z.ZodSchema<TOut, z.ZodTypeDef, TIn>,
  options?: ValidationOptions
): TOut => {
  const validation = validateFormData(formData, schema, options);
  if (!validation.ok) {
    throw new ValidationError(validation.fieldErorrs);
  }
  return validation.data;
};

export const validateUUIDOrThrowError = (
  uuid: FormDataEntryValue | null,
  message: string = "Invalid ID"
): string => {
  const idValidation = z.string().uuid().safeParse(uuid);
  if (!idValidation.success) {
    throw new InvalidArgumentError(message);
  }
  return idValidation.data;
};
