export interface ApiResponseType<T = null> {
  success: boolean;
  data: T | null;
  error: T | null;
  meta?: MetaType;
}
export interface MetaType {
  requestId: string;
  timeStamp: string;
}
