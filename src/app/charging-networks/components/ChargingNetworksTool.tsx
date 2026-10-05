'use client';

import { useState } from 'react';
import { compareChargingQuotes, type ChargingQuote } from '@/lib/calculations/public-charging';

const inputClass = 'mt-1 w-full rounded border border-border bg-bg-tertiary px-3 py-2 text-text-primary';
const money = (value: number) => `$${value.toFixed(2)}`;
const numberValue = (value: string, max: number) => Math.max(0, Math.min(max, Number(value) || 0));

export default function ChargingNetworksTool() {
  const [energy, setEnergy] = useState(50);
  const [sessions, setSessions] = useState(4);
  const [quotes, setQuotes] = useState<ChargingQuote[]>([
    { ratePerKwh: 0.50, sessionFee: 0, monthlyFee: 0 },
    { ratePerKwh: 0.40, sessionFee: 0, monthlyFee: 6 },
  ]);
  const result = compareChargingQuotes(energy, sessions, quotes[0], quotes[1]);
  const updateQuote = (index: number, field: keyof ChargingQuote, value: number) => {
    setQuotes(current => current.map((quote, i) => i === index ? { ...quote, [field]: value } : quote));
  };

  return (
    <section className="my-8 rounded-xl border border-border bg-bg-secondary p-5">
      <h2 className="text-xl font-display font-bold text-text-primary">Compare two charging prices or membership plans</h2>
      <p className="mt-2 text-sm text-text-secondary">The starting values are hypothetical examples. Enter the prices shown for your station and payment method. All amounts are in US dollars.</p>
      <div className="my-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-text-secondary">Billed energy per session (kWh)
          <input type="number" min="0" max="500" step="1" value={energy} onChange={e => setEnergy(numberValue(e.target.value, 500))} className={inputClass} />
        </label>
        <label className="text-sm text-text-secondary">Sessions per month
          <input type="number" min="0" max="100" step="1" value={sessions} onChange={e => setSessions(Math.floor(numberValue(e.target.value, 100)))} className={inputClass} />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {quotes.map((quote, index) => <fieldset key={index} className="space-y-3 rounded-lg border border-border p-4">
          <legend className="px-2 font-semibold text-text-primary">Option {index === 0 ? 'A' : 'B'}</legend>
          {([
            ['ratePerKwh', 'Energy price ($/kWh)', 10],
            ['sessionFee', 'Fee per session ($)', 100],
            ['monthlyFee', 'Membership per month ($)', 500],
          ] as const).map(([field, label, max]) => <label key={field} className="block text-sm text-text-secondary">{label}
            <input aria-label={`Option ${index === 0 ? 'A' : 'B'} ${label}`} type="number" min="0" max={max} step="0.01" value={quote[field]} onChange={e => updateQuote(index, field, numberValue(e.target.value, max))} className={inputClass} />
          </label>)}
        </fieldset>)}
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-sm text-text-secondary"><thead><tr><th className="p-2 text-left">Estimated cost</th><th className="p-2 text-right">Option A</th><th className="p-2 text-right">Option B</th></tr></thead><tbody>
          <tr className="border-t border-border"><th className="p-2 text-left font-normal">One session, excluding membership</th><td className="p-2 text-right">{money(result.optionA.session)}</td><td className="p-2 text-right">{money(result.optionB.session)}</td></tr>
          <tr className="border-t border-border"><th className="p-2 text-left font-normal">Month, including membership</th><td className="p-2 text-right">{money(result.optionA.month)}</td><td className="p-2 text-right">{money(result.optionB.month)}</td></tr>
        </tbody></table>
      </div>
      <p className="mt-3 font-medium text-accent" role="status">{Math.abs(result.monthlyDifference) < 0.005 ? 'Both options have the same estimated monthly cost.' : `Option ${result.monthlyDifference > 0 ? 'B' : 'A'} costs ${money(Math.abs(result.monthlyDifference))} less per month with these inputs.`}</p>
      <p className="mt-3 text-xs text-text-tertiary">Month = (billed kWh × price per kWh + session fee) × sessions + monthly membership. Add taxes, parking, idle/congestion fees and any other charges separately. This comparison assumes energy-based billing, a constant rate and identical sessions; it does not model per-minute or tiered pricing.</p>
    </section>
  );
}
