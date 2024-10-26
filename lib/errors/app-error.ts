export class AppError extends Error {
  code: number;
  constructor(message: string, code: number, name: string) {
    super(message);
    this.code = code;
    this.name = `AppError:${name}`;
    console.log(this.name);
  }
}

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof Error && error.name.startsWith("AppError:");
};
