export const convertToCents = (amount: number, decimalPlace: number) => {
  return Math.round(amount * Math.pow(10, decimalPlace));
};
