export default class AuthorisationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorisationError";
  }
}
