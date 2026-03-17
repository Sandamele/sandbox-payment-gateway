type PaymentStatus = "CAPTURED" | "FAILED";

export function getRandomPaymentStatus(): PaymentStatus {
  const random = Math.random();
  if (random < 0.8) {
    return "CAPTURED";
  }

  return "FAILED";
}
