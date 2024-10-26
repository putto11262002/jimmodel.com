import {
  NotFoundError,
  ConstraintViolationError,
  ForbiddenError,
  InvalidArgumentError,
  AuthenticationError,
  ActionNotAllowedError,
  GenericError,
  AppError,
} from "@/lib/errors";
import { objToFieldValidationError, ValidationError } from "./validation-error";

export function errorToObj(error: Error) {
  return {
    name: error.name,
    message: error.message,
    code: error instanceof AppError ? error.code : 500,
    data: error instanceof ValidationError ? error.data : undefined,
  };
}

export function ObjToError(obj: object) {
  if (
    obj &&
    typeof obj === "object" &&
    obj != null &&
    "name" in obj &&
    typeof obj.name === "string" &&
    "message" in obj &&
    typeof obj.message === "string" &&
    "code" in obj &&
    typeof obj.code === "number"
  ) {
    switch (obj.name) {
      case ConstraintViolationError.name:
        return new ConstraintViolationError(obj.message);
      case AuthenticationError.name:
        return new AuthenticationError(obj.message);
      case ForbiddenError.name:
        return new ForbiddenError(obj.message);
      case NotFoundError.name:
        return new NotFoundError(obj.message);
      case InvalidArgumentError.name:
        return new InvalidArgumentError(obj.message);
      case GenericError.name:
        return new GenericError(obj.message);
      case ActionNotAllowedError.name:
        return new ActionNotAllowedError(obj.message);
      case ValidationError.name:
        let validation = {};
        if ("data" in obj && typeof obj.data && obj.data != null) {
          validation = objToFieldValidationError(obj?.data);
        }
        return new ValidationError(validation, obj.message);
      default:
        return new GenericError(obj.message);
    }
  }
  return null;
}
