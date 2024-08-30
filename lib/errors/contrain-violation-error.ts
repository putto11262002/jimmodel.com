import { AppError } from "./app-error";

class ConstraintViolationError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = "ContraintViolationError";
  }
}

export default ConstraintViolationError;
