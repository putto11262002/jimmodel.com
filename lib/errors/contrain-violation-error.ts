class ConstraintViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContraintViolationError";
  }
}

export default ConstraintViolationError;
