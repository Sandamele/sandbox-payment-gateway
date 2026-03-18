export interface LogDataType {
  requestId: string;
  event: string;
  data?: unknown | Record<string, unknown> | Record<string, unknown>[];
}

export type LoggerLevelType = "info" | "warn" | "error";
export type SelectedLoggerType = "paymentsLogger" | "apiKeysLogger";
