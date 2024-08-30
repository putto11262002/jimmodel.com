import { AppError } from "./app-error";

export default class AuthorisationError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = "AuthorisationError";
  }
}
