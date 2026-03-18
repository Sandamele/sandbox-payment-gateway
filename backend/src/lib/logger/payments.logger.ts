import pino from "pino";
export const paymentsLogger = pino({
  base: { service: "payment-service" },
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
        }
      : undefined,
});
