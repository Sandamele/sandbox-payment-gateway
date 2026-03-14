export const errorService = (
  message: string,
  statusCode: number,
  code: string,
) => {
  return { message, statusCode, code };
};
