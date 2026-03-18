import pino from "pino";
export const globalErrorHandlerLogger = pino({
  base: { service: "errors-service" },
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
        }
      : undefined,
});
