import type { PaymentStatus } from "../../generated/prisma/enums";

interface MockPayment {
  id: string;
  merchantId: string;
  amount: number;
  currencyCode: string;
  status: PaymentStatus;
  refundedAmount: number;
  refundedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  currency: {
    name: string;
    symbol: string;
    country: string;
    decimalPlaces: number;
  };
}

export const mockCapturedPayment: MockPayment = {
  id: "01KM0RT79D6E7X2TJ2012ZAE6C",
  merchantId: "01KKWH51SG30NVKTCYM8EV33G6",
  amount: 80000,
  currencyCode: "ZAR",
  status: "CAPTURED",
  refundedAmount: 0,
  refundedAt: null,
  createdAt: new Date("2026-03-18T15:25:18.509Z"),
  updatedAt: new Date("2026-03-18T15:25:18.528Z"),
  currency: {
    name: "Rand",
    symbol: "R",
    country: "South Africa",
    decimalPlaces: 2,
  },
};

export const mockFailedPayment: MockPayment = {
  id: "01KM1AB2CD3EF4GH5IJ6KL7MN8",
  merchantId: "01KKWH51SG30NVKTCYM8EV33G6",
  amount: 50000,
  currencyCode: "ZAR",
  status: "FAILED",
  refundedAmount: 0,
  refundedAt: null,
  createdAt: new Date("2026-03-18T10:00:00.000Z"),
  updatedAt: new Date("2026-03-18T10:00:00.000Z"),
  currency: {
    name: "Rand",
    symbol: "R",
    country: "South Africa",
    decimalPlaces: 2,
  },
};

export const mockPendingPayment: MockPayment = {
  id: "01KM2BC3DE4FG5HI6JK7LM8NO9",
  merchantId: "01KKWH51SG30NVKTCYM8EV33G6",
  amount: 30000,
  currencyCode: "ZAR",
  status: "PENDING",
  refundedAmount: 0,
  refundedAt: null,
  createdAt: new Date("2026-03-19T08:00:00.000Z"),
  updatedAt: new Date("2026-03-19T08:00:00.000Z"),
  currency: {
    name: "Rand",
    symbol: "R",
    country: "South Africa",
    decimalPlaces: 2,
  },
};

export const mockRefundedPayment: MockPayment = {
  id: "01KMA1Q2W3E4R5T6Y7U8I9O0P1",
  merchantId: "01KKZZZ12345NVKTCYM8EV9999",
  amount: 30000,
  currencyCode: "ZAR",
  status: "REFUNDED",
  refundedAmount: 30000,
  refundedAt: new Date("2026-03-23T14:00:00.000Z"),
  createdAt: new Date("2026-03-22T13:00:00.000Z"),
  updatedAt: new Date("2026-03-23T14:00:00.000Z"),
  currency: {
    name: "Rand",
    symbol: "R",
    country: "South Africa",
    decimalPlaces: 2,
  },
};

export const mockPartiallyRefundedPayment: MockPayment = {
  id: "01KMA1L9K8J7H6G5F4D3S2A1Z0",
  merchantId: "01KKWH51SG30NVKTCYM8EV33G6",
  amount: 150000,
  currencyCode: "ZAR",
  status: "CAPTURED",
  refundedAmount: 75000,
  refundedAt: new Date("2026-03-24T16:20:00.000Z"),
  createdAt: new Date("2026-03-23T11:10:00.000Z"),
  updatedAt: new Date("2026-03-24T16:20:00.000Z"),
  currency: {
    name: "Rand",
    symbol: "R",
    country: "South Africa",
    decimalPlaces: 2,
  },
};

export const mockPayments: MockPayment[] = [
  mockCapturedPayment,
  mockFailedPayment,
  mockPendingPayment,
  mockRefundedPayment,
  mockPartiallyRefundedPayment,
];

export const mockCurrencies = [
  {
    code: "ZAR",
    name: "Rand",
    symbol: "R",
    country: "South Africa",
    isActive: true,
    decimalPlaces: 2,
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    country: "Eurozone Countries",
    isActive: false,
    decimalPlaces: 2,
  },
];

export const mockCreatedPendingPayment = (
  amount: number,
  status: string,
  currencyCode: string,
) => ({
  id: "01KM0RT7A882SY9K7TYY28083S",
  amount,
  status,
  currencyCode,
  createdAt: "2026-03-23T14:00:00.000Z",
  updatedAt: "2026-03-23T14:00:00.000Z",
});
