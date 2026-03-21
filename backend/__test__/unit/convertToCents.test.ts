import { describe, it, expect } from "bun:test";
import { convertToCents } from "../../src/lib/convertToCents";

describe("convertAmountToCents", () => {
  it("converts 100 to 10000 cents for 2 decimal places", () => {
    const amount = convertToCents(100, 2);
    expect(amount).toBe(10000);
  });
  it("converts 999999.99 to 99999999 cents for 2 decimal places", () => {
    const amount = convertToCents(999999.99, 2);
    expect(amount).toBe(99999999);
  });
  it("converts 0.01 USD to 1 cent for 2 decimal places", () => {
    const amount = convertToCents(0.01, 2);
    expect(amount).toBe(1);
  });
  it("convert 2000 to 2000 cents for 0 decimal places", () => {
    const amount = convertToCents(2000, 0);
    expect(amount).toBe(2000);
  });
  it("convert 1000.83 to 1000830 for 3 decimal places", () => {
    const amount = convertToCents(1000.83, 3);
    expect(amount).toBe(1000830);
  });
});
