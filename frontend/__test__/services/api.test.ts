import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "../../src/shared/services/api";
import { AppError } from "../../src/shared/lib/appError";
import { API_BASE_URL } from "../../src/config";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

vi.mock("../../src/config", () => ({
  API_BASE_URL: "https://mock-api.com",
}));

const mockJsonResponse = (body: object, ok: boolean, status = 200) =>
  Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("api", () => {
  const meta = { requestId: "req-123", timeStamp: "2026-03-29T12:00:00Z" };

  it("should call fetch with correct URL and default headers", async () => {
    mockFetch.mockReturnValueOnce(
      mockJsonResponse({ success: true, error: null, data: {}, meta }, true)
    );

    await api("api/v1/resource", { method: "GET" });

    expect(mockFetch).toHaveBeenCalledWith(`${API_BASE_URL}/api/v1/resource`, {
      credentials: "include",
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  });

  it("should merge custom headers with default headers", async () => {
    mockFetch.mockReturnValueOnce(
      mockJsonResponse({ success: true, error: null, data: {}, meta }, true)
    );

    await api("api/v1/resource", {
      method: "GET",
      headers: { "X-Custom-Header": "value" },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          "Content-Type": "application/json",
          "X-Custom-Header": "value",
        },
      }),
    );
  });

  it("should return parsed JSON on success", async () => {
    const mockData = { id: 1, name: "Test Item" };
    const mockResponse = { success: true, error: null, data: mockData, meta };
    mockFetch.mockReturnValueOnce(mockJsonResponse(mockResponse, true));

    const result = await api("api/v1/resource", { method: "GET" });
    expect(result).toEqual(mockResponse);
  });

  it("should throw AppError when response is not ok", async () => {
    const errorResponse = {
      success: false,
      error: { code: "UNAUTHORIZED", message: "Unauthorized" },
      data: null,
      meta,
    };
    mockFetch.mockReturnValueOnce(mockJsonResponse(errorResponse, false, 401));

    await expect(
      api("api/v1/resource", { method: "GET" }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should pass correct error and meta to AppError", async () => {
    const errorResponse = {
      success: false,
      error: { code: "NOT_FOUND", message: "Unexpected error" },
      data: null,
      meta,
    };
    mockFetch.mockReturnValueOnce(mockJsonResponse(errorResponse, false, 404));

    try {
      await api("api/v1/resource", { method: "GET" });
    } catch (error: any) {
      expect(error).toBeInstanceOf(AppError);
      expect(error.meta).toEqual(meta);
      expect(error.message).toBe(errorResponse.error.message);
    }
  });

  it("should always include credentials: include", async () => {
    mockFetch.mockReturnValueOnce(
      mockJsonResponse({ success: true, error: null, data: {}, meta }, true)
    );

    await api("api/v1/resource", { method: "POST" });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("should throw on fetch rejection", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network down"));

    await expect(api("api/v1/resource", { method: "GET" })).rejects.toThrow(
      "Network down",
    );
  });
});