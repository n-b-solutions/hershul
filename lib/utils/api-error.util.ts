export class ApiError extends Error {
  public status: number;
  public isOperational: boolean;
  public stack = "";

  constructor(status, message, isOperational = true, stack = "") {
    super(message);
    this.status = status;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
