export interface LedgerType {
  paymentId: string;
  merchantId: string;
  amount: number;
  currencyCode: string;
  type: "CREDIT" | "DEBIT";
  description: string;
}
