export interface LeaseQuote {
  monthly: number;
  months: number;
  upfront: number;
  firstPaymentIncluded: boolean;
  endFees: number;
  annualAllowance: number;
  annualMiles: number;
  excessRate: number;
}

/** Compare disclosed quotes, not hypothetical money factors or residuals. */
export function compareLeaseQuote(q: LeaseQuote) {
  const amounts = [q.monthly, q.upfront, q.endFees, q.annualAllowance, q.annualMiles, q.excessRate];
  if (amounts.some(v => !Number.isFinite(v) || v < 0) || !Number.isInteger(q.months) || q.months < 1 || q.months > 120 || q.monthly <= 0) return null;
  if (q.firstPaymentIncluded && q.upfront < q.monthly) return null;
  const remainingPayments = q.months - (q.firstPaymentIncluded ? 1 : 0);
  const excessMiles = Math.max(0, (q.annualMiles - q.annualAllowance) * q.months / 12);
  const mileageCost = excessMiles * q.excessRate;
  const total = q.upfront + remainingPayments * q.monthly + q.endFees + mileageCost;
  return { remainingPayments, excessMiles, mileageCost, total, effectiveMonthly: total / q.months };
}
