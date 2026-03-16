export const convertToCents = (amount: number, decimalPlace: number) => {
  return amount * Math.pow(10, decimalPlace);
};
