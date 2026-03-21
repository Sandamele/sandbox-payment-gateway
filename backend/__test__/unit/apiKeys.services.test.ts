import { afterEach, describe, expect, it, mock } from "bun:test";
import { AppError } from "../../src/errors/appError";

const VALID_MERCHANT_ID = "01KKWH51SG30NVKTCYM8EV33G6";
const INVALID_MERCHANT_ID = "01KKXVPE4TCBTAKQV5HDFP9A1M";
const REQUEST_ID = "eab6ccd1-eafb-4d60-85ca-78bb37525fa4";
const VALID_API_KEY_ID = "01KKXVZHAZAKKJGTC1KG96G813";
const INVALID_API_KEY_ID = "01KM0RT7A5BQDAWESADASQEDD2";
// mock functions
const mockCreateApiKeyRepository = mock(
  async (merchantId: string, hashedApiKey: string) =>
    Promise.resolve({
      id: "01KKXVPE4TCBTAKQV5HDFP9A1M",
      apiKey:
        "883485291caf31f3ccf63b5886e99d72934d0e4990737c932d78232a361d3562",
      isActive: true,
      createdAt: "2026-03-19T08:00:00.000Z",
    }),
);
const mockHashApiKey = mock(
  () => "883485291caf31f3ccf63b5886e99d72934d0e4990737c932d78232a361d3562",
);
const mockFindMerchantByIdRepository = mock(async (id: string) => {
  return id === "01KKWH51SG30NVKTCYM8EV33G6"
    ? Promise.resolve({ id })
    : Promise.resolve(null);
});
const mockRevokeApiKeyRepository = mock(async (id: string) =>
  Promise.resolve({
    id,
    isActive: false,
    revokedAt: "2026-03-17 12:22:19.301",
  }),
);
const mockFindMerchantApiKeyRepository = mock(
  async (merchantId: string, id: string) => {
    return merchantId === "01KKWH51SG30NVKTCYM8EV33G6" &&
      id === "01KKXVZHAZAKKJGTC1KG96G813"
      ? Promise.resolve({
          id,
          isActive: true,
        })
      : Promise.resolve(null);
  },
);
mock.module("../../src/features/apiKeys/apiKeys.repository.ts", () => ({
  createApiKeysRepository: mockCreateApiKeyRepository,
  findMerchantByIdRepository: mockFindMerchantByIdRepository,
  revokeApiKeyRepository: mockRevokeApiKeyRepository,
  findMerchantApiKeyRepository: mockFindMerchantApiKeyRepository,
}));

mock.module("../../src/lib/logger/apiKeys.logger.ts", () => ({
  apiKeysLogger: {
    info: mock(),
    warn: mock(),
  },
}));

mock.module("../../src/lib/generateApiKey.ts", () => ({
  generateApiKey: mock(
    () => "44b653e3f0f66e138b17ee513ec21992e4fb304c0fac5fdfc257d1a64a380713",
  ),
}));
mock.module("../../src/lib/hashApiKey.ts", () => ({
  hashApiKey: mockHashApiKey,
}));
afterEach(() => {
  mock.clearAllMocks();
});

const { createApiKeysService, revokeApiKeyService } =
  await import("../../src/features/apiKeys/apiKeys.services");

describe("createApiKeysService", () => {
  describe("merchant validation", () => {
    it("throws an error 'Merchant not found' if the merchant does not exist", async () => {
      await expect(
        createApiKeysService(INVALID_MERCHANT_ID, "development", REQUEST_ID),
      ).rejects.toMatchObject({
        message: "Merchant not found",
        statusCode: 404,
        code: "NOT_FOUND",
      });
    });
  });
  describe("key creation", () => {
    it("creates an API key and returns id, key and createdAt", async () => {
      const apiKey = await createApiKeysService(
        VALID_MERCHANT_ID,
        "development",
        REQUEST_ID,
      );
      expect(apiKey).toMatchObject({
        id: "01KKXVPE4TCBTAKQV5HDFP9A1M",
        key: "sk_dev_44b653e3f0f66e138b17ee513ec21992e4fb304c0fac5fdfc257d1a64a380713",
        createdAt: "2026-03-19T08:00:00.000Z",
      });
    });
    it("uses the dev prefix when environment is development", async () => {
      const apiKey = await createApiKeysService(
        VALID_MERCHANT_ID,
        "development",
        REQUEST_ID,
      );
      expect(apiKey.key).toStartWith("sk_dev_");
    });
    it("uses the prod prefix when environment is production", async () => {
      const apiKey = await createApiKeysService(
        VALID_MERCHANT_ID,
        "production",
        REQUEST_ID,
      );
      expect(apiKey.key).toStartWith("sk_prod_");
    });
    it("returns the raw key, not the hashed value", async () => {
      const apiKey = await createApiKeysService(
        VALID_MERCHANT_ID,
        "production",
        REQUEST_ID,
      );
      expect(apiKey.key).not.toBe(mockHashApiKey());
    });
  });
});

describe("revokeApiKeyService", () => {
  describe("when key exists and is active", () => {
    it("revokes the key and returns the result", async () => {
      const apiKey = await revokeApiKeyService(
        VALID_MERCHANT_ID,
        VALID_API_KEY_ID,
        REQUEST_ID,
      );
      expect(apiKey).toMatchObject({
        id: "01KKXVZHAZAKKJGTC1KG96G813",
        revoked: true,
        revokedAt: "2026-03-17 12:22:19.301",
      });
    });
    it("marks the key as revoked", async () => {
      const apiKey = await revokeApiKeyService(
        VALID_MERCHANT_ID,
        VALID_API_KEY_ID,
        REQUEST_ID,
      );
      expect(apiKey.revoked).toBeTrue();
    });
  });
  describe("when the key is invalid or already revoked", () => {
    it("throws an error if the key does not exist", async () => {
      await expect(
        revokeApiKeyService(VALID_MERCHANT_ID, INVALID_API_KEY_ID, REQUEST_ID),
      ).rejects.toThrowError("Invalid API key");
    });
    it("throws an error if the key has already been revoked", async () => {
      // override findMerchantApiKeyRepository
      mockFindMerchantApiKeyRepository.mockImplementation(
        (merchantId: string, id: string) =>
          Promise.resolve({
            id,
            isActive: false,
          }),
      );
      await expect(
        revokeApiKeyService(VALID_MERCHANT_ID, VALID_API_KEY_ID, REQUEST_ID),
      ).rejects.toThrowError("Invalid API key");
    });
  });
});
