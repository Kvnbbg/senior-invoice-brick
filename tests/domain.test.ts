import { createMoney, addMoney, formatMoney } from "../src/domain/money";
import { calculateTotals } from "../src/domain/invoice";

describe("Money value object", () => {
  it("creates valid money", () => {
    const money = createMoney(1000, "EUR");
    expect(money.amount).toBe(1000);
    expect(money.currency).toBe("EUR");
  });

  it("rejects negative amounts", () => {
    expect(() => createMoney(-1, "EUR")).toThrow();
  });

  it("adds same currency", () => {
    const a = createMoney(100, "USD");
    const b = createMoney(250, "USD");
    expect(addMoney(a, b).amount).toBe(350);
  });

  it("throws on currency mismatch", () => {
    const a = createMoney(100, "EUR");
    const b = createMoney(100, "USD");
    expect(() => addMoney(a, b)).toThrow(/Currency mismatch/);
  });

  it("formats correctly", () => {
    expect(formatMoney(createMoney(1234, "GBP"))).toBe("12.34 GBP");
  });
});

describe("Invoice calculation service", () => {
  it("calculates totals correctly", () => {
    const invoice = {
      id: "inv-1",
      currency: "EUR" as const,
      taxRate: 0.2,
      items: [
        {
          description: "Consulting",
          quantity: 2,
          unitPrice: createMoney(5000, "EUR"),
        },
      ],
    };

    const totals = calculateTotals(invoice);
    expect(totals.subtotal.amount).toBe(10000);
    expect(totals.tax.amount).toBe(2000);
    expect(totals.total.amount).toBe(12000);
  });

  it("rejects invalid tax rate", () => {
    const invoice = {
      id: "inv-2",
      currency: "EUR" as const,
      taxRate: 1.5,
      items: [],
    };
    expect(() => calculateTotals(invoice)).toThrow(/Tax rate/);
  });

  it("rejects mismatched line currency", () => {
    const invoice = {
      id: "inv-3",
      currency: "EUR" as const,
      taxRate: 0.2,
      items: [
        {
          description: "Item",
          quantity: 1,
          unitPrice: createMoney(100, "USD"),
        },
      ],
    };
    expect(() => calculateTotals(invoice)).toThrow(/currency mismatch/);
  });
});
