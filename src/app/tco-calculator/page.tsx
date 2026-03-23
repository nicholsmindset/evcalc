'use client';

import { useState } from 'react';
import Link from 'next/link';
import { calculateTCO } from '@/lib/calculations/tco';
import type { TcoResult } from '@/lib/calculations/tco';

export default function TcoCalculatorPage() {
  // EV inputs
  const [evPrice, setEvPrice] = useState('40000');
  const [evEfficiency, setEvEfficiency] = useState('30');
  const [electricityRate, setElectricityRate] = useState('0.16');
  const [taxCredit, setTaxCredit] = useState('7500');

  // Gas inputs
  const [gasPrice, setGasPrice] = useState('35000');
  const [gasMpg, setGasMpg] = useState('28');
  const [gasPerGallon, setGasPerGallon] = useState('3.50');

  // Shared
  const [annualMiles, setAnnualMiles] = useState('12000');
  const [years, setYears] = useState('5');

  const [result, setResult] = useState<TcoResult | null>(null);

  const handleCalculate = () => {
    const r = calculateTCO({
      evPurchasePrice: parseFloat(evPrice) || 40000,
      gasPurchasePrice: parseFloat(gasPrice) || 35000,
      evTaxCredit: parseFloat(taxCredit) || 0,
      evEfficiencyKwhPer100Mi: parseFloat(evEfficiency) || 30,
      electricityRatePerKwh: parseFloat(electricityRate) || 0.16,
      gasMpg: parseFloat(gasMpg) || 28,
      gasPricePerGallon: parseFloat(gasPerGallon) || 3.50,
      annualMiles: parseInt(annualMiles) || 12000,
      years: parseInt(years) || 5,
    });
    setResult(r);
  };

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          Total Cost of Ownership Calculator
        </h1>
        <p className="mt-2 text-text-secondary">
          Compare the full ownership cost of an EV vs gas car — purchase price, fuel, maintenance, insurance, and depreciation.
        </p>
      </div>

      {/* Input Form */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* EV Side */}
        <div className="rounded-xl border border-accent/20 bg-bg-secondary p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-display font-semibold text-accent">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Electric Vehicle
          </h2>
          <div className="space-y-4">
            <InputField label="Purchase Price ($)" value={evPrice} onChange={setEvPrice} />
            <InputField label="Federal Tax Credit ($)" value={taxCredit} onChange={setTaxCredit} />
            <InputField label="Efficiency (kWh/100mi)" value={evEfficiency} onChange={setEvEfficiency} />
            <InputField label="Electricity Rate ($/kWh)" value={electricityRate} onChange={setElectricityRate} step="0.01" />
          </div>
        </div>

        {/* Gas Side */}
        <div className="rounded-xl border border-border bg-bg-secondary p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-display font-semibold text-text-primary">
            <svg className="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
            </svg>
            Gas Vehicle
          </h2>
          <div className="space-y-4">
            <InputField label="Purchase Price ($)" value={gasPrice} onChange={setGasPrice} />
            <InputField label="Fuel Economy (MPG)" value={gasMpg} onChange={setGasMpg} />
            <InputField label="Gas Price ($/gallon)" value={gasPerGallon} onChange={setGasPerGallon} step="0.01" />
          </div>
        </div>
      </div>

      {/* Shared Inputs */}
      <div className="mb-8 rounded-xl border border-border bg-bg-secondary p-6">
        <h2 className="mb-4 text-lg font-display font-semibold text-text-primary">Driving Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Annual Miles" value={annualMiles} onChange={setAnnualMiles} />
          <div>
            <label className="block text-sm font-medium text-text-secondary">Ownership Period</label>
            <select
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary focus:border-accent/50 focus:outline-none"
            >
              {[3, 5, 7, 10].map((y) => (
                <option key={y} value={y}>{y} years</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="mb-10 w-full rounded-xl bg-accent py-3 text-center font-display font-bold text-bg-primary transition-colors hover:bg-accent-dim sm:w-auto sm:px-12"
      >
        Calculate Total Cost of Ownership
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-accent/20 bg-bg-secondary p-6 text-center">
              <p className="text-xs text-text-tertiary">EV Total Cost ({years} yr)</p>
              <p className="mt-1 font-mono text-2xl font-bold text-accent">{fmt(result.evTotalCost)}</p>
              <p className="text-xs text-text-tertiary">{fmt(result.evCostPerMile)}/mile</p>
            </div>
            <div className="rounded-xl border border-border bg-bg-secondary p-6 text-center">
              <p className="text-xs text-text-tertiary">Gas Total Cost ({years} yr)</p>
              <p className="mt-1 font-mono text-2xl font-bold text-text-primary">{fmt(result.gasTotalCost)}</p>
              <p className="text-xs text-text-tertiary">{fmt(result.gasCostPerMile)}/mile</p>
            </div>
            <div className={`rounded-xl border p-6 text-center ${result.totalSavings > 0 ? 'border-success/30 bg-success/5' : 'border-error/30 bg-error/5'}`}>
              <p className="text-xs text-text-tertiary">{result.totalSavings > 0 ? 'EV Saves' : 'Gas Saves'}</p>
              <p className={`mt-1 font-mono text-2xl font-bold ${result.totalSavings > 0 ? 'text-success' : 'text-error'}`}>
                {fmt(Math.abs(result.totalSavings))}
              </p>
              <p className="text-xs text-text-tertiary">over {years} years</p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="rounded-xl border border-border bg-bg-secondary p-6">
            <h3 className="mb-4 font-display font-semibold text-text-primary">Cost Breakdown by Category</h3>
            <div className="space-y-3">
              {result.categories.map((cat) => {
                const max = Math.max(cat.ev, cat.gas);
                return (
                  <div key={cat.label}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-text-secondary">{cat.label}</span>
                      <div className="flex gap-4 text-xs">
                        <span className="text-accent">EV: {fmt(cat.ev)}</span>
                        <span className="text-text-tertiary">Gas: {fmt(cat.gas)}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div
                        className="h-3 rounded-l bg-accent/40"
                        style={{ width: `${max > 0 ? (cat.ev / max) * 50 : 0}%` }}
                      />
                      <div
                        className="h-3 rounded-r bg-text-tertiary/30"
                        style={{ width: `${max > 0 ? (cat.gas / max) * 50 : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Year-by-Year Table */}
          <div className="rounded-xl border border-border bg-bg-secondary p-6 overflow-x-auto">
            <h3 className="mb-4 font-display font-semibold text-text-primary">Year-by-Year Comparison</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-text-tertiary">
                  <th className="pb-2 pr-4">Year</th>
                  <th className="pb-2 pr-4">EV Fuel</th>
                  <th className="pb-2 pr-4">Gas Fuel</th>
                  <th className="pb-2 pr-4">EV Maintenance</th>
                  <th className="pb-2 pr-4">Gas Maintenance</th>
                  <th className="pb-2 pr-4">EV Residual</th>
                  <th className="pb-2">Gas Residual</th>
                </tr>
              </thead>
              <tbody>
                {result.yearlyBreakdown.map((yr) => (
                  <tr key={yr.year} className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono font-semibold text-text-primary">{yr.year}</td>
                    <td className="py-2 pr-4 font-mono text-accent">{fmt(yr.evFuel)}</td>
                    <td className="py-2 pr-4 font-mono text-text-secondary">{fmt(yr.gasFuel)}</td>
                    <td className="py-2 pr-4 font-mono text-accent">{fmt(yr.evMaintenance)}</td>
                    <td className="py-2 pr-4 font-mono text-text-secondary">{fmt(yr.gasMaintenance)}</td>
                    <td className="py-2 pr-4 font-mono text-accent">{fmt(yr.evResidualValue)}</td>
                    <td className="py-2 font-mono text-text-secondary">{fmt(yr.gasResidualValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-16 border-t border-border pt-12">
        <h2 className="mb-4 text-xl font-display font-bold text-text-primary">
          Understanding Total Cost of Ownership
        </h2>
        <div className="max-w-3xl space-y-3 text-sm text-text-secondary">
          <p>
            The sticker price is only part of the story. Total Cost of Ownership (TCO) includes
            every cost you&apos;ll face over the life of the vehicle: fuel, maintenance, insurance,
            depreciation, and tax incentives.
          </p>
          <p>
            EVs typically cost more upfront but save significantly on fuel and maintenance.
            With federal tax credits up to $7,500 and lower running costs, many EVs reach
            cost parity with gas cars within 2-3 years.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/ev-vs-gas" className="text-sm text-accent hover:underline">EV vs Gas Calculator</Link>
          <Link href="/charging-cost-calculator" className="text-sm text-accent hover:underline">Charging Cost Calculator</Link>
          <Link href="/calculator" className="text-sm text-accent hover:underline">Range Calculator</Link>
          <Link href="/blog/ev-vs-gas-true-cost" className="text-sm text-accent hover:underline">EV vs Gas: True Cost Guide</Link>
        </div>
      </section>
    </div>
  );
}

function InputField({ label, value, onChange, step }: { label: string; value: string; onChange: (v: string) => void; step?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step={step}
        className="mt-1 w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary focus:border-accent/50 focus:outline-none"
      />
    </div>
  );
}
