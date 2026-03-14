export interface ApiResponseType<T = null> {
  success: boolean;
  data: T | null;
  error: ApiErrorType | null;
  meta?: MetaType;
}
export interface MetaType {
  requestId: string;
  timeStamp: string;
}
export interface ApiErrorType {
  message: string;
  path: string;
  method: string;
}
