import { AppError } from "./app-error";

export class ConstraintViolationError extends AppError {
  constructor(message: string) {
    super(message, 409, "ConstraintViolationError");
  }
}
