export class AppError extends Error {
  statusCode: number;
  code: string;

  /**
   * This constructor creates a new AppError instance.
   * @param message - A descriptive message for the error.
   * @param statusCode - HTTP status code (default is 404).
   * @param code - Application-specific error code.
   */
  constructor(message: string, statusCode = 404, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}
