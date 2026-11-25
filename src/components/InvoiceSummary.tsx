/**
 * React component (client) — pure presentation of the invoice totals.
 * 
 * - Fully typed props
 * - Tailwind classes for styling (production would use the design system)
 * - No business logic inside the component
 */

import React from "react";
import { InvoiceTotals } from "../domain/invoice";
import { formatMoney } from "../domain/money";

interface InvoiceSummaryProps {
  readonly totals: InvoiceTotals;
  readonly className?: string;
}

export const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({
  totals,
  className = "",
}) => {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm ${className}`}
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Invoice Summary
      </h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-600">Subtotal</dt>
          <dd className="font-medium">{formatMoney(totals.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-600">Tax</dt>
          <dd className="font-medium">{formatMoney(totals.tax)}</dd>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatMoney(totals.total)}</dd>
        </div>
      </dl>
    </div>
  );
};
