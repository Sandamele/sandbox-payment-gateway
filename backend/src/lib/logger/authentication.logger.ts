import pino from "pino";
export const authenticationLogger = pino({
  base: { service: "authentication-service" },
  transport:
    process.env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
        }
      : undefined,
});
