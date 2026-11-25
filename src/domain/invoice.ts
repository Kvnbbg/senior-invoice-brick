/**
 * Isolated functional brick: Invoice calculation service.
 * 
 * Pure, deterministic, fully typed, no side effects.
 * Invariants enforced at the boundary.
 */

import { Currency, Money, addMoney, createMoney } from "./money";

export interface LineItem {
  readonly description: string;
  readonly quantity: number;
  readonly unitPrice: Money;
}

export interface Invoice {
  readonly id: string;
  readonly currency: Currency;
  readonly items: readonly LineItem[];
  readonly taxRate: number; // 0 to 1
}

export interface InvoiceTotals {
  readonly subtotal: Money;
  readonly tax: Money;
  readonly total: Money;
}

export function calculateTotals(invoice: Invoice): InvoiceTotals {
  if (invoice.taxRate < 0 || invoice.taxRate > 1) {
    throw new Error("Tax rate must be between 0 and 1");
  }

  const zero = createMoney(0, invoice.currency);

  const subtotal = invoice.items.reduce((acc, item) => {
    if (item.unitPrice.currency !== invoice.currency) {
      throw new Error("Line item currency mismatch");
    }
    if (item.quantity <= 0 || !Number.isInteger(item.quantity)) {
      throw new Error("Quantity must be a positive integer");
    }
    const lineTotal = createMoney(
      item.unitPrice.amount * item.quantity,
      invoice.currency
    );
    return addMoney(acc, lineTotal);
  }, zero);

  const taxAmount = Math.round(subtotal.amount * invoice.taxRate);
  const tax = createMoney(taxAmount, invoice.currency);
  const total = addMoney(subtotal, tax);

  return { subtotal, tax, total };
}
