import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  rateLimit: {
    enabled: true,
    window: 30,
    max: 100,
  },
  session: {
    expiresIn: 60 * 60 * 12,
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
});
