import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "../../../shared/services/api";
import { loginService, registerService } from "../services/auth";

vi.mock("../../../shared/services/api");
const mockedApi = vi.mocked(api);

describe("Auth Services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("registerService", () => {
    const registerBody = {
      email: "johndoe@example.com",
      password: "Password",
      name: "johndoe",
      role: "MERCHANT",
    };

    const registerResponse = {
      id: 1,
      email: registerBody.email,
      name: registerBody.name,
      createdAt: "2026-03-29T12:00:00Z",
    };

    it("should return data on successful registration", async () => {
      mockedApi.mockResolvedValueOnce({
        data: registerResponse,
        success: false,
        error: {
          code: "",
          message: "",
        },
        meta: {
          requestId: "",
          timeStamp: "",
        },
      });

      const result = await registerService(registerBody);

      expect(result).toEqual(registerResponse);
    });

    it("should call api with correct arguments", async () => {
      mockedApi.mockResolvedValueOnce({
        data: registerResponse,
        success: false,
        error: {
          code: "",
          message: "",
        },
        meta: {
          requestId: "",
          timeStamp: "",
        },
      });

      await registerService(registerBody);

      expect(mockedApi).toHaveBeenCalledWith("api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify(registerBody),
      });
    });

    it("should throw when api fails", async () => {
      mockedApi.mockRejectedValueOnce(new Error("Network error"));

      await expect(registerService(registerBody)).rejects.toThrow(
        "Network error",
      );
    });
  });

  describe("loginService", () => {
    const loginBody = {
      email: "johndoe@example.com",
      password: "Password",
    };

    const loginResponse = {
      token: "jwt-token-abc123",
      user: {
        id: 1,
        email: loginBody.email,
        name: "johndoe",
      },
      expiresIn: 86400,
    };

    it("should return data on successful login", async () => {
      mockedApi.mockResolvedValueOnce({
        data: loginResponse,
        success: false,
        error: {
          code: "",
          message: "",
        },
        meta: {
          requestId: "",
          timeStamp: "",
        },
      });

      const result = await loginService(loginBody);

      expect(result).toEqual(loginResponse);
    });

    it("should call api with correct arguments", async () => {
      mockedApi.mockResolvedValueOnce({
        data: loginResponse,
        success: false,
        error: {
          code: "",
          message: "",
        },
        meta: {
          requestId: "",
          timeStamp: "",
        },
      });

      await loginService(loginBody);

      expect(mockedApi).toHaveBeenCalledWith("api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(loginBody),
      });
    });

    it("should throw when api fails", async () => {
      mockedApi.mockRejectedValueOnce(new Error("Invalid credentials"));

      await expect(
        loginService({ email: loginBody.email, password: "password" }),
      ).rejects.toThrow("Invalid credentials");
    });
  });
});
