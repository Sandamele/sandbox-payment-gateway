export interface CurrencyType {
  code: string;
  decimalPlaces: number;
}
export type StatusType = "PENDING" | "CAPTURED" | "FAILED" | "REFUNDED";
export interface PaymentRepositoryType {
  amountInCents: number;
  currencyCode: string;
  merchantId: string;
  status: StatusType;
}

export interface LedgerType {
  paymentId: string;
  merchantId: string;
  amount: number;
  currencyCode: string;
  type: "DEBIT" | "CREDIT";
  description: string;
}
