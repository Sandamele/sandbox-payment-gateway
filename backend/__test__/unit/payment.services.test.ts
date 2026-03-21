import { afterEach, describe, expect, it, mock } from "bun:test";
import {
  mockCapturedPayment,
  mockCreatedPendingPayment,
  mockCurrencies,
  mockPayments,
} from "../__mock__/payments.mock";
import type { LedgerType } from "../../generated/prisma/enums";
import type {
  PaymentRepositoryType,
  StatusType,
} from "../../src/features/payments/payments.types";

mock.module("../../src/features/payments/payments.repository.ts", () => ({
  findPaymentRepository: mock(async (id, merchantId) => {
    const payment = mockPayments.find(
      (mockPayment) =>
        mockPayment.id === id && mockPayment.merchantId === merchantId,
    );
    return payment ? Promise.resolve(payment) : Promise.resolve(null);
  }),
  createPaymentRepository: mock(
    async ({
      amountInCents,
      currencyCode,
      merchantId,
      status = "PENDING",
    }: PaymentRepositoryType) => {
      return Promise.resolve(
        mockCreatedPendingPayment(amountInCents, status, currencyCode),
      );
    },
  ),
  processPaymentTransactionRepository: mock(async () => [
    {
      id: "payment-1",
      amount: 1000,
      status: "CAPTURED",
      currencyCode: "ZAR",
    },
  ]),
  processRefundPaymentRepository: mock(
    async (
      id: string,
      amountInCents: number,
      status: "REFUNDED" | "CAPTURED",
      ledgerDebit: LedgerType,
      ledgerCredit: LedgerType,
    ) =>
      Promise.resolve([
        {
          id,
          refundedAmount: amountInCents,
          status,
        },
        "ledgerDebit",
        "ledgeCredit",
      ]),
  ),
  updateFailedPaymentRepository: mock(async (id) => ({
    id,
    amount: 1000,
    status: "FAILED",
    currencyCode: "ZAR",
  })),
}));

mock.module("../../src/lib/logger/payments.logger.ts", () => ({
  paymentsLogger: {
    info: mock(),
    warn: mock(),
  },
}));

mock.module("../../src/features/currency/currency.repository.ts", () => ({
  findCurrencyRepository: mock(async (currencyCode) => {
    const currency = mockCurrencies.find(
      (currency) => currency.code === currencyCode,
    );
    return currency ? Promise.resolve(currency) : Promise.resolve(null);
  }),
}));

afterEach(() => {
  mock.clearAllMocks();
});

const { findPaymentService, refundPaymentService, createPaymentService } =
  await import("../../src/features/payments/payments.services");

describe("findPaymentService", () => {
  it("returns payment when is found", async () => {
    const payment = await findPaymentService(
      "01KM0RT79D6E7X2TJ2012ZAE6C",
      "01KKWH51SG30NVKTCYM8EV33G6",
    );
    expect(payment).toMatchObject(mockCapturedPayment);
  });
  it("throws payment not found when either paymentId and merchantId are incorrect", async () => {
    await expect(
      findPaymentService(
        "01KM0RT79D6E7X2TJ2012ZAE6C",
        "01KKZZZ12345NVKTCYM8EV9999",
      ),
    ).rejects.toMatchObject({
      message: "Payment not found",
      code: "PAYMENT_NOT_FOUND",
      statusCode: 404,
    });
  });
});

describe("refundPaymentService", () => {
  describe("when payment is CAPTURED", () => {
    it("statuses changes to 'REFUNDED' when refunded in full", async () => {
      const refund = await refundPaymentService(
        "01KMA1L9K8J7H6G5F4D3S2A1Z0",
        750,
        "01KKWH51SG30NVKTCYM8EV33G6",
        "c2c0b6eb-3b77-4836-b45b-61d531a91d49",
      );
      expect(refund).toMatchObject({
        id: "01KMA1L9K8J7H6G5F4D3S2A1Z0",
        refundedAmount: 150000,
        status: "REFUNDED",
      });
    });
    it("statuses remains 'CAPTURED' when refunded partial", async () => {
      const refund = await refundPaymentService(
        "01KM0RT79D6E7X2TJ2012ZAE6C",
        750,
        "01KKWH51SG30NVKTCYM8EV33G6",
        "c2c0b6eb-3b77-4836-b45b-61d531a91d49",
      );
      expect(refund).toMatchObject({
        id: "01KM0RT79D6E7X2TJ2012ZAE6C",
        refundedAmount: 75000,
        status: "CAPTURED",
      });
    });
    it("throws payment not found when either paymentId and merchantId are incorrect", async () => {
      await expect(
        refundPaymentService(
          "01KM0RT79D6E7X2TJ2012ZAE6C",
          300,
          "01KKZZZ12345NVKTCYM8EV9999",
          "c2c0b6eb-3b77-4836-b45b-61d531a91d49",
        ),
      ).rejects.toMatchObject({
        message: "Payment not found",
        code: "PAYMENT_NOT_FOUND",
        statusCode: 404,
      });
    });
    it("throws error when the amount exceeds the original amount", async () => {
      await expect(
        refundPaymentService(
          "01KM0RT79D6E7X2TJ2012ZAE6C",
          1000,
          "01KKWH51SG30NVKTCYM8EV33G6",
          "c2c0b6eb-3b77-4836-b45b-61d531a91d49",
        ),
      ).rejects.toMatchObject({
        message: "Refund cannot exceed amount",
        code: "REFUND_AMOUNT_EXCEED",
        statusCode: 400,
      });
    });
    it("throws error when the refund amount exceeds remaining balance", async () => {
      await expect(
        refundPaymentService(
          "01KMA1L9K8J7H6G5F4D3S2A1Z0",
          2000,
          "01KKWH51SG30NVKTCYM8EV33G6",
          "c2c0b6eb-3b77-4836-b45b-61d531a91d49",
        ),
      ).rejects.toMatchObject({
        message: "Refund cannot exceed amount",
        code: "REFUND_AMOUNT_EXCEED",
        statusCode: 400,
      });
    });
  });
  describe("when payment is not CAPTURED", () => {
    it("throws error when payment status is 'PENDING'", async () => {
      await expect(
        refundPaymentService(
          "01KM2BC3DE4FG5HI6JK7LM8NO9",
          300,
          "01KKWH51SG30NVKTCYM8EV33G6",
          "c2c0b6eb-3b77-4836-b45b-61d531a91d49",
        ),
      ).rejects.toMatchObject({
        message: "Refund invalid: Payment status must be 'CAPTURED'",
        code: "PAYMENT_NOT_CAPTURED",
        statusCode: 400,
      });
    });
    it("throws error when payment status is 'REFUNDED'", async () => {
      await expect(
        refundPaymentService(
          "01KMA1Q2W3E4R5T6Y7U8I9O0P1",
          300,
          "01KKZZZ12345NVKTCYM8EV9999",
          "c2c0b6eb-3b77-4836-b45b-61d531a91d49",
        ),
      ).rejects.toMatchObject({
        message: "Payment already refunded",
        code: "PAYMENT_REFUNDED_ALREADY",
        statusCode: 400,
      });
    });
    it("throws error when payment status is 'FAILED'", async () => {
      await expect(
        refundPaymentService(
          "01KM1AB2CD3EF4GH5IJ6KL7MN8",
          300,
          "01KKWH51SG30NVKTCYM8EV33G6",
          "c2c0b6eb-3b77-4836-b45b-61d531a91d49",
        ),
      ).rejects.toMatchObject({
        message: "Refund invalid: Payment status must be 'CAPTURED'",
        code: "PAYMENT_NOT_CAPTURED",
        statusCode: 400,
      });
    });
  });
});

// Create Payments
const createPaymentRepositoryMock = mock(
  (
    amountInCents: number,
    currencyCode: string,
    merchantId: string,
    status = "PENDING",
  ) =>
    Promise.resolve({
      id: "01KKXVZHAZAKKJGTC1KG96G813",
      amount: amountInCents,
      status,
      currencyCode: currencyCode,
    }),
);
describe("createPaymentService", () => {
  describe("currency validation", () => {
    it("throws invalid currency code when currency does not exist", async () => {
      await expect(
        createPaymentService(
          400,
          "USD",
          "01KKXXQK5DMWXJXX3VBARYEC5J",
          "eab6ccd1-eafb-4d60-85ca-78bb37525fa4",
        ),
      ).rejects.toMatchObject({
        message: "Invalid currency code",
        statusCode: 400,
        code: "INVALID_CURRENCY_CODE",
      });
    });
    it("throws not available when currency is inactive", async () => {
      await expect(
        createPaymentService(
          400,
          "EUR",
          "01KKXXQK5DMWXJXX3VBARYEC5J",
          "eab6ccd1-eafb-4d60-85ca-78bb37525fa4",
        ),
      ).rejects.toMatchObject({
        message: "Currency code not available",
        statusCode: 400,
        code: "NOT_AVAILABLE",
      });
    });
  });
  describe("amount conversion", () => {
    it("converts amount to cents correctly before saving", async () => {
      mock.module("../../src/features/payments/payments.repository.ts", () => ({
        createPaymentRepository: createPaymentRepositoryMock,
        processPaymentTransactionRepository: mock(
          async (paymentId: string, status: string) => [
            {
              id: paymentId,
              amount: 100000,
              status: status,
              currencyCode: "ZAR",
            },
          ],
        ),
      }));
      await createPaymentService(
        1000,
        "ZAR",
        "01KKWH51SG30NVKTCYM8EV33G6",
        "eab6ccd1-eafb-4d60-85ca-78bb37525fa4",
      );
      expect(createPaymentRepositoryMock).toHaveBeenCalledWith(
        expect.objectContaining({ amountInCents: 100000 }),
      );
    });
    it("saves payment with PENDING status first", async () => {
      mock.module("../../src/features/payments/payments.repository.ts", () => ({
        createPaymentRepository: createPaymentRepositoryMock,
        processPaymentTransactionRepository: mock(
          async (paymentId: string, status: string) => [
            {
              id: paymentId,
              amount: 100000,
              status: status,
              currencyCode: "ZAR",
            },
          ],
        ),
      }));
      await createPaymentService(
        1000,
        "ZAR",
        "01KKWH51SG30NVKTCYM8EV33G6",
        "eab6ccd1-eafb-4d60-85ca-78bb37525fa4",
      );
      expect(createPaymentRepositoryMock).toHaveBeenCalledWith(
        expect.objectContaining({ status: "PENDING" }),
      );
    });
  });
  describe("payment simulation", () => {
    describe("when simulation returns FAILED", () => {
      it("returns payment with FAILED status", async () => {
        mock.module("../../src/lib/getRandomPaymentStatus.ts", () => ({
          getRandomPaymentStatus: mock(() => "FAILED"),
        }));
        mock.module(
          "../../src/features/payments/payments.repository.ts",
          () => ({
            updateFailedPaymentRepository: mock(async (id) => ({
              id,
              amount: 100000,
              status: "FAILED",
              currencyCode: "ZAR",
            })),
          }),
        );
        const payment = await createPaymentService(
          1000,
          "ZAR",
          "01KKWH51SG30NVKTCYM8EV33G6",
          "eab6ccd1-eafb-4d60-85ca-78bb37525fa4",
        );
        expect(payment).toMatchObject({ status: "FAILED" });
      });
    });
    describe("when simulation returns CAPTURED", () => {
      it("returns payment with CAPTURED status", async () => {
        mock.module("../../src/lib/getRandomPaymentStatus.ts", () => ({
          getRandomPaymentStatus: mock(() => "CAPTURED"),
        }));
        mock.module(
          "../../src/features/payments/payments.repository.ts",
          () => ({
            processPaymentTransactionRepository: mock(async (id) => [
              {
                id,
                amount: 100000,
                status: "CAPTURED",
                currencyCode: "ZAR",
              },
              "ledger debit",
              "ledger credit",
            ]),
          }),
        );
        const payment = await createPaymentService(
          1000,
          "ZAR",
          "01KKWH51SG30NVKTCYM8EV33G6",
          "eab6ccd1-eafb-4d60-85ca-78bb37525fa4",
        );
        expect(payment.status).toBe("CAPTURED");
      });
      it("creates correct ledger entries with amount and currency", async () => {
        const mockPaymentLedgerEntries = mock(
          (
            paymentId: string,
            merchantId: string,
            amountInCents: number,
            currencyCode: string,
          ) => ({
            ledgerDebit: {
              paymentId,
              merchantId,
              amount: amountInCents,
              currencyCode,
              type: "DEBIT",
            },
            ledgerCredit: {
              paymentId,
              merchantId,
              amount: amountInCents,
              currencyCode,
              type: "CREDIT",
            },
          }),
        );
        const mockProcessPaymentTransactionRepository = mock(
          async (
            paymentId: string,
            status: StatusType,
            ledgerDebit: LedgerType,
            ledgerCredit: LedgerType,
          ) =>
            Promise.resolve([
              {
                id: paymentId,
                amount: 100000,
                status,
                currencyCode: "ZAR",
              },
              ledgerDebit,
              ledgerCredit,
            ]),
        );
        mock.module("../../src/features/payments/payments.helper.ts", () => ({
          paymentLedgerEntries: mockPaymentLedgerEntries,
        }));
        mock.module(
          "../../src/features/payments/payments.repository.ts",
          () => ({
            processPaymentTransactionRepository:
              mockProcessPaymentTransactionRepository,
          }),
        );
        await createPaymentService(
          1000,
          "ZAR",
          "01KKWH51SG30NVKTCYM8EV33G6",
          "eab6ccd1-eafb-4d60-85ca-78bb37525fa4",
        );
        expect(mockPaymentLedgerEntries).toHaveBeenCalledWith(
          "01KKXVZHAZAKKJGTC1KG96G813",
          "01KKWH51SG30NVKTCYM8EV33G6",
          100000,
          "ZAR",
        );
        expect(mockProcessPaymentTransactionRepository).toHaveBeenCalledWith(
          "01KKXVZHAZAKKJGTC1KG96G813",
          "CAPTURED",
          {
            amount: 100000,
            currencyCode: "ZAR",
            merchantId: "01KKWH51SG30NVKTCYM8EV33G6",
            paymentId: "01KKXVZHAZAKKJGTC1KG96G813",
            type: "DEBIT",
          },
          {
            amount: 100000,
            currencyCode: "ZAR",
            merchantId: "01KKWH51SG30NVKTCYM8EV33G6",
            paymentId: "01KKXVZHAZAKKJGTC1KG96G813",
            type: "CREDIT",
          },
        );
      });
    });
  });
});
