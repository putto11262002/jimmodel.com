import {
  AppError,
  isAppError,
  isValidationError,
  ValidationError,
} from "@/lib/errors";
import { ActionResult, EmptyActionResult } from "./action-result";
import { FieldsValidationError } from "@/lib/types/validation";
export function handleActionError(
  e: unknown
):
  | EmptyActionResult<"error">
  | ActionResult<"validationError", FieldsValidationError<any>> {
  if (e instanceof Error) {
    if (e.message === "NEXT_REDIRECT") {
      throw e;
    }
  }
  if (isValidationError(e)) {
    return {
      status: "validationError",
      data: e.data,
    };
  }

  if (isAppError(e)) {
    return {
      status: "error",
      message: e.message,
    };
  }
  throw e;
}
export function handleActionErrorWithValidation<T>(
  e: unknown
):
  | EmptyActionResult<"error">
  | ActionResult<"validationError", FieldsValidationError<T>> {
  if (e instanceof AppError) {
    if (e instanceof ValidationError) {
      return {
        status: "validationError",
        data: e.data,
        message: e.message,
      };
    }
    return {
      status: "error",
      message: e.message,
    };
  }
  if (e instanceof Error) {
    if (e.message === "NEXT_REDIRECT") {
      throw e;
    }
  }
  return {
    status: "error",
    message: "Something went wrong",
  };
}
