import { FieldsValidationError } from "../types/validation";
import { AppError } from "./app-error";

export const objToFieldValidationError = (
  obj: unknown
): FieldsValidationError<any> => {
  if (typeof obj === "object" && obj !== null) {
    const result: FieldsValidationError<any> = {};
    Object.keys(obj).forEach((key) => {
      const value = (obj as Record<string, unknown>)[key]; // Type casting obj
      const validation = Array.isArray(value)
        ? value.filter((v): v is string => typeof v === "string") // Type predicate
        : typeof value === "string"
        ? [value]
        : [];
      result[key] = validation;
    });
    return result;
  }
  return {};
};

export class ValidationError<T> extends AppError {
  data: FieldsValidationError<T>;
  constructor(data: FieldsValidationError<T>, message?: string) {
    super(message ?? "Validation error", 400, "ValidationError");
    this.data = data;
  }
}

export const isValidationError = (
  error: unknown
): error is ValidationError<any> => {
  return error instanceof AppError && error.name === "AppError:ValidationError";
};
