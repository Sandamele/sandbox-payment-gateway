import { describe, it, expect } from "vitest";
import { SignUpSchema } from "../schemas/signup.schema";
describe("SignUpSchema", () => {
  describe("First Name validation", () => {
    it("throws 'Minimum 3 characters required'", async () => {
      await expect(
        SignUpSchema.validateAt("firstName", { firstName: "La" }),
      ).rejects.toThrow("Minimum 3 characters required");
    });
    it("throws 'Maximum 50 characters required'", async () => {
      await expect(
        SignUpSchema.validateAt("firstName", {
          firstName:
            "kmkvndisondnaodnsodinondopenqwenqwoenmkmoxzczocnxcnxiozcnxzocadqleqklemlqe",
        }),
      ).rejects.toThrow("Maximum 50 characters required");
    });
  });
  describe("Last Name validation", () => {
    it("throws 'Minimum 3 characters required'", async () => {
      await expect(
        SignUpSchema.validateAt("lastName", { lastName: "La" }),
      ).rejects.toThrow("Minimum 3 characters required");
    });
    it("throws 'Maximum 50 characters required'", async () => {
      await expect(
        SignUpSchema.validateAt("lastName", {
          lastName:
            "kmkvndisondnaodnsodinondopenqwenqwoenmkmoxzczocnxcnxiozcnxzocadqleqklemlqe",
        }),
      ).rejects.toThrow("Maximum 50 characters required");
    });
  });
  describe("Email validation", () => {
    it("throws 'email is required' when email is not entered", async () => {
      await expect(
        SignUpSchema.validateAt("email", { email: "" }),
      ).rejects.toThrow("Email is required");
    });
    it("rejects email when the @ sign is missing", async () => {
      await expect(
        SignUpSchema.validateAt("email", { email: "email.com" }),
      ).rejects.toThrow("Invalid email");
    });
  });
  describe("Password Validation", async () => {
    it("throws 'Password must be at least 8 characters'", async () => {
      await expect(
        SignUpSchema.validateAt("newPassword", { newPassword: "Pass" }),
      ).rejects.toThrow("Password must be at least 8 characters");
    });
    it("throws 'Password must contain at least one uppercase letter'", async () => {
      await expect(
        SignUpSchema.validateAt("newPassword", { newPassword: "password" }),
      ).rejects.toThrow("Password must contain at least one uppercase letter");
    });
    it("throws 'Password must contain at least one number'", async () => {
      await expect(
        SignUpSchema.validateAt("newPassword", { newPassword: "Password" }),
      ).rejects.toThrow("Password must contain at least one number");
    });
    it("throws 'Password must contain at least one lowercase letter'", async () => {
      await expect(
        SignUpSchema.validateAt("newPassword", { newPassword: "PASSWORD" }),
      ).rejects.toThrow("Password must contain at least one lowercase letter");
    });
    it("throws 'passwords must match'", async () => {
      await expect(
        SignUpSchema.validateAt("confirmPassword", {
          newPassword: "Password1",
          confirmPassword: "password1",
        }),
      ).rejects.toThrow("Passwords must match");
    });
  });
});
