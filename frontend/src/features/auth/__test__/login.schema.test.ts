import { describe, expect, it } from "vitest";
import { LoginSchema } from "../schemas/login.schema";

describe("LoginSchema", () => {
  describe("Email validation", () => {
    it("throws 'email is required' when email is not entered", async () => {
      await expect(
        LoginSchema.validateAt("email", { email: "" }),
      ).rejects.toThrow("Email is required");
    });
    it("rejects email when the @ sign is missing", async () => {
      await expect(
        LoginSchema.validateAt("email", { email: "email.com" }),
      ).rejects.toThrow("Invalid email");
    });
  });
  it("throws password is required", async () => {
    await expect(
      LoginSchema.validateAt("passwords", { passwords: "" }),
    ).rejects.toThrow("Password is required");
  });
});
