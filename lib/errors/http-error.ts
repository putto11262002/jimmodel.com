import { AppError } from "./app-error";

export class HttpError extends AppError {
  constructor(message: string, code: number) {
    super(message, code, "HttpError");
  }
}
