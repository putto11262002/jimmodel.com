import { AppError } from "./app-error";

export class InvalidArgumentError extends AppError {
  constructor(message: string) {
    super(message, 400, "InvalidArgumentError");
  }
}
