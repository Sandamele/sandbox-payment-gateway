import pino from "pino";
export const merchantsLogger = pino({
  base: { service: "merchants-service" },
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
        }
      : undefined,
});
