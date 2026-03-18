import pino from "pino";
export const apiKeysLogger = pino({
  base: { service: "api-key-service" },
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
        }
      : undefined,
});
