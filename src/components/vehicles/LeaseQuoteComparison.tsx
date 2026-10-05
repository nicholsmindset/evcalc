'use client';

import { useState } from 'react';
import { compareLeaseQuote } from '@/lib/calculations/lease-quote';

const EMPTY = { monthly: '', months: '36', upfront: '', endFees: '', annualAllowance: '10000', annualMiles: '10000', excessRate: '', firstPaymentIncluded: true };
type Form = typeof EMPTY;
const fields: Array<{ key: Exclude<keyof Form, 'firstPaymentIncluded'>; label: string; step: string }> = [
  { key: 'monthly', label: 'Monthly payment including tax ($)', step: '0.01' },
  { key: 'months', label: 'Lease term (months)', step: '1' },
  { key: 'upfront', label: 'Upfront cost including trade-in equity ($)', step: '0.01' },
  { key: 'endFees', label: 'Expected lease-return fees ($)', step: '0.01' },
  { key: 'annualAllowance', label: 'Included annual miles', step: '1' },
  { key: 'annualMiles', label: 'Your expected annual miles', step: '1' },
  { key: 'excessRate', label: 'Excess-mile charge ($/mile)', step: '0.01' },
];
const money = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
function result(form: Form) {
  if (fields.some(f => form[f.key].trim() === '')) return null;
  return compareLeaseQuote({ ...form, monthly: Number(form.monthly), months: Number(form.months), upfront: Number(form.upfront), endFees: Number(form.endFees), annualAllowance: Number(form.annualAllowance), annualMiles: Number(form.annualMiles), excessRate: Number(form.excessRate) });
}

export function LeaseQuoteComparison() {
  const [quotes, setQuotes] = useState<Form[]>([{ ...EMPTY }, { ...EMPTY }]);
  const results = quotes.map(result);
  return <section id="quote-comparison" className="mb-8 rounded-xl border border-border bg-bg-secondary p-5 sm:p-6">
    <h2 className="mb-3 font-display text-2xl font-bold text-text-primary">Compare two written lease quotes</h2>
    <p className="mb-3 text-sm text-text-secondary">Enter USD amounts from each quote. The starting term and mileage are editable examples, not available lease terms. Enter 0 where a fee does not apply. Include taxes in the payment and upfront amounts; this tool does not calculate local tax.</p>
    <p className="mb-6 text-sm text-text-secondary">Upfront cost includes cash and any trade-in equity used, but excludes refundable deposits. If an order deposit is credited at signing, count it only once. Include any fees paid separately at signing; do not add financed fees again.</p>
    <div className="grid gap-6 md:grid-cols-2">{quotes.map((quote, index) => <fieldset key={index} className="rounded-lg border border-border p-4">
      <legend className="px-2 font-semibold text-text-primary">Quote {index === 0 ? 'A' : 'B'}</legend>
      <div className="space-y-3">{fields.map(field => <label key={field.key} className="block text-sm text-text-secondary">
        {field.label}<input type="number" min={field.key === 'months' ? 1 : 0} max={field.key === 'months' ? 120 : undefined} step={field.step} value={quote[field.key]} onChange={e => setQuotes(previous => previous.map((q, i) => i === index ? { ...q, [field.key]: e.target.value } : q))} className="mt-1 block w-full rounded-lg border border-border bg-bg-primary px-3 py-2 text-text-primary" />
      </label>)}
      <label className="flex items-start gap-2 text-sm text-text-secondary"><input type="checkbox" checked={quote.firstPaymentIncluded} onChange={e => setQuotes(previous => previous.map((q, i) => i === index ? { ...q, firstPaymentIncluded: e.target.checked } : q))} className="mt-1" /> First monthly payment is included in upfront cost</label>
      </div>
      <div aria-live="polite" className="mt-5 rounded-lg bg-bg-primary p-4">
        {results[index] ? <><p className="text-sm text-text-secondary">Effective monthly cost</p><p className="font-mono text-2xl font-bold text-accent">{money(results[index]!.effectiveMonthly)}</p><p className="mt-2 text-sm text-text-secondary">Total to return: {money(results[index]!.total)}</p><p className="mt-1 text-xs text-text-tertiary">Includes {results[index]!.remainingPayments} remaining payments, entered return fees and {money(results[index]!.mileageCost)} for estimated excess mileage.</p></> : <p className="text-sm text-text-secondary">Complete every field to calculate. Use a whole-number term from 1–120 months and non-negative costs. Upfront cost must cover the first payment if included.</p>}
      </div>
    </fieldset>)}</div>
    {results[0] && results[1] && <p className="mt-5 text-sm font-semibold text-text-primary">Effective monthly difference: {money(Math.abs(results[0].effectiveMonthly - results[1].effectiveMonthly))}. {quotes[0].months !== quotes[1].months ? 'The terms differ, so total spending covers different periods.' : 'Compare mileage allowances, equipment and contract terms before choosing.'}</p>}
    <details className="mt-5 text-sm text-text-secondary"><summary className="cursor-pointer font-semibold">Calculation and exclusions</summary><p className="mt-3">Total = upfront cost + remaining monthly payments + entered return fees + excess-mile cost. If the first payment is included upfront, one fewer monthly payment is counted. Excess miles = max(0, expected annual miles − annual allowance) × months ÷ 12. Effective monthly cost = total ÷ months.</p><p className="mt-2">Excludes refundable deposits, vehicle purchase at lease end, insurance, energy, maintenance, unentered taxes, excess wear and early termination charges. The result assumes the vehicle is returned at the scheduled end. It is not a lender quote or approval.</p></details>
  </section>;
}
