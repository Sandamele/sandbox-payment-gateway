export type ApiResponse = {
  success: boolean;
  error: { code: string; message: string };
  data: unknown;
  meta: {
    requestId: string;
    timeStamp: string;
  };
};
