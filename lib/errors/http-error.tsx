import { AppError } from "./app-error";

export default class HttpError extends AppError {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}
