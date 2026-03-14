import crypto from "crypto";
export const hashApiKey = (key: string) => {
  return crypto
    .createHash("sha256")
    .update(key)
    .digest("hex");
}