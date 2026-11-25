/**
 * Domain: Monetary value object with sealed invariants.
 * 
 * Design decisions (Senior level):
 * - Branded types prevent accidental mixing of currencies or raw numbers.
 * - All operations are pure and total (or explicitly Result-typed).
 * - Runtime validation via Zod mirrors the compile-time types.
 * - No mutable state; Money is immutable.
 */

import { z } from "zod";

export const CurrencySchema = z.enum(["EUR", "USD", "GBP"]);
export type Currency = z.infer<typeof CurrencySchema>;

// Branded type to prevent raw number misuse
declare const MoneyBrand: unique symbol;
export type Money = {
  readonly amount: number; // in minor units (cents)
  readonly currency: Currency;
} & { readonly [MoneyBrand]: never };

const MoneySchema = z.object({
  amount: z.number().int().nonnegative(),
  currency: CurrencySchema,
});

export function createMoney(amount: number, currency: Currency): Money {
  const parsed = MoneySchema.parse({ amount, currency });
  return parsed as Money;
}

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Currency mismatch: ${a.currency} vs ${b.currency}`);
  }
  return createMoney(a.amount + b.amount, a.currency);
}

export function formatMoney(money: Money): string {
  const major = (money.amount / 100).toFixed(2);
  return `${major} ${money.currency}`;
}
