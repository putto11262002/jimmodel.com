import { AppError } from "./app-error";

export class ActionNotAllowedError extends AppError {
  constructor(message?: string) {
    super(message || "Action not allowed", 400, "ActionNotAllowedError");
  }
}
