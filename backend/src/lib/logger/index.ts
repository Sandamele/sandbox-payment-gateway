import type {
  LogDataType,
  LoggerLevelType,
  SelectedLoggerType,
} from "../../types/logger.type";
import { apiKeysLogger } from "./apiKeys.logger";
import { paymentsLogger } from "./payments.logger";

export { globalErrorHandlerLogger } from "./globalErrorHandler.logger";
export { merchantsLogger } from "./merchants.logger";
export const logger = (
  selectedLogger: SelectedLoggerType,
  level: LoggerLevelType,
  logData: LogDataType,
  message: string,
) => {
  const loggers = {
    paymentsLogger: paymentsLogger,
    apiKeysLogger: apiKeysLogger,
  };

  loggers[selectedLogger][level](logData, message);
};
