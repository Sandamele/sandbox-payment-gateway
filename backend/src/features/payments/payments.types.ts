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
