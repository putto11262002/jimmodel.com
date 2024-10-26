import { AppError } from "./app-error";

export class GenericError extends AppError {
  constructor(message?: string) {
    super("An error occurred", 500, "GenericError");
  }
}
