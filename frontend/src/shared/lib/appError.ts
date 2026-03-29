export class AppError extends Error {
  error: { code: string; message: string };
  meta: { requestId: string; timeStamp: string };

  constructor(
    error: { code: string; message: string },
    meta: { requestId: string; timeStamp: string },
  ) {
    super("Unexpected error");
    this.name = "AppError";
    this.error = error;
    this.meta = meta;
  }
}
