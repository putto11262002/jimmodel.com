class ContraintViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContraintViolationError";
  }
}

export default ContraintViolationError;
