'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// ─── Static data ───────────────────────────────────────────────────────────

interface EVOption {
  make: string;
  model: string;
  year: number;
  msrp: number; // full price
  federal_credit: number;
  range_mi: number;
  efficiency_kwh_per_100mi: number;
  vehicle_class: 'sedan' | 'suv' | 'truck' | 'sports';
  slug: string;
}

const EVS: EVOption[] = [
  { make: 'Chevrolet', model: 'Equinox EV', year: 2024, msrp: 34995, federal_credit: 7500, range_mi: 319, efficiency_kwh_per_100mi: 28, vehicle_class: 'suv', slug: 'chevrolet-equinox-ev-2024' },
  { make: 'Hyundai', model: 'Ioniq 6', year: 2024, msrp: 38615, federal_credit: 7500, range_mi: 361, efficiency_kwh_per_100mi: 26, vehicle_class: 'sedan', slug: 'hyundai-ioniq-6-2024' },
  { make: 'Tesla', model: 'Model 3', year: 2024, msrp: 38990, federal_credit: 0, range_mi: 272, efficiency_kwh_per_100mi: 25, vehicle_class: 'sedan', slug: 'tesla-model-3-2024' },
  { make: 'Nissan', model: 'Leaf', year: 2024, msrp: 28040, federal_credit: 7500, range_mi: 212, efficiency_kwh_per_100mi: 31, vehicle_class: 'sedan', slug: 'nissan-leaf-2024' },
  { make: 'Volkswagen', model: 'ID.4', year: 2024, msrp: 38995, federal_credit: 7500, range_mi: 291, efficiency_kwh_per_100mi: 29, vehicle_class: 'suv', slug: 'volkswagen-id4-2024' },
  { make: 'Tesla', model: 'Model Y', year: 2024, msrp: 42990, federal_credit: 7500, range_mi: 320, efficiency_kwh_per_100mi: 27, vehicle_class: 'suv', slug: 'tesla-model-y-2024' },
  { make: 'Ford', model: 'Mustang Mach-E', year: 2024, msrp: 42995, federal_credit: 3750, range_mi: 312, efficiency_kwh_per_100mi: 29, vehicle_class: 'suv', slug: 'ford-mustang-mach-e-2024' },
  { make: 'Hyundai', model: 'Ioniq 5', year: 2024, msrp: 41450, federal_credit: 7500, range_mi: 303, efficiency_kwh_per_100mi: 28, vehicle_class: 'suv', slug: 'hyundai-ioniq-5-2024' },
  { make: 'Kia', model: 'EV6', year: 2024, msrp: 42600, federal_credit: 7500, range_mi: 310, efficiency_kwh_per_100mi: 26, vehicle_class: 'suv', slug: 'kia-ev6-2024' },
  { make: 'Tesla', model: 'Model 3 Long Range', year: 2024, msrp: 45990, federal_credit: 0, range_mi: 341, efficiency_kwh_per_100mi: 24, vehicle_class: 'sedan', slug: 'tesla-model-3-long-range-2024' },
  { make: 'Tesla', model: 'Model Y Long Range', year: 2024, msrp: 48490, federal_credit: 7500, range_mi: 330, efficiency_kwh_per_100mi: 27, vehicle_class: 'suv', slug: 'tesla-model-y-long-range-2024' },
  { make: 'BMW', model: 'i4 eDrive40', year: 2024, msrp: 56395, federal_credit: 0, range_mi: 301, efficiency_kwh_per_100mi: 28, vehicle_class: 'sedan', slug: 'bmw-i4-edrive40-2024' },
  { make: 'Rivian', model: 'R1S Dual', year: 2024, msrp: 75900, federal_credit: 3750, range_mi: 410, efficiency_kwh_per_100mi: 38, vehicle_class: 'suv', slug: 'rivian-r1s-2024' },
  { make: 'Ford', model: 'F-150 Lightning Pro', year: 2024, msrp: 49995, federal_credit: 7500, range_mi: 240, efficiency_kwh_per_100mi: 46, vehicle_class: 'truck', slug: 'ford-f-150-lightning-pro-2024' },
  { make: 'Chevrolet', model: 'Blazer EV', year: 2024, msrp: 44995, federal_credit: 7500, range_mi: 320, efficiency_kwh_per_100mi: 29, vehicle_class: 'suv', slug: 'chevrolet-blazer-ev-2024' },
];

// Static insurance estimates (annual, by class)
const INSURANCE_ANNUAL: Record<string, number> = {
  sedan: 1800,
  suv: 2100,
  truck: 2400,
  sports: 2600,
};

// Monthly maintenance savings vs gas (oil, brakes, etc.)
const MAINTENANCE_MONTHLY = 50;

// Financing helpers
function monthlyPayment(principal: number, annualRatePct: number, months: number): number {
  if (annualRatePct === 0) return principal / months;
  const r = annualRatePct / 100 / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

const CREDIT_SCORE_RATES: Record<string, number> = {
  excellent: 5.5,
  good: 7.0,
  fair: 9.5,
  poor: 13.0,
};

// ─── Component ─────────────────────────────────────────────────────────────

export default function AffordabilityContent() {
  const [monthlyBudget, setMonthlyBudget] = useState(800);
  const [downPayment, setDownPayment] = useState(5000);
  const [creditScore, setCreditScore] = useState<keyof typeof CREDIT_SCORE_RATES>('good');
  const [vehicleClass, setVehicleClass] = useState<'all' | 'sedan' | 'suv' | 'truck' | 'sports'>('all');
  const [monthlyMiles, setMonthlyMiles] = useState(1000);
  const [electricityRate, setElectricityRate] = useState(0.14);
  const [gasMpg, setGasMpg] = useState(28);
  const [gasPrice, setGasPrice] = useState(3.50);
  const [loanTermMonths, setLoanTermMonths] = useState(60);

  const results = useMemo(() => {
    const rate = CREDIT_SCORE_RATES[creditScore];

    return EVS
      .filter((ev) => vehicleClass === 'all' || ev.vehicle_class === vehicleClass)
      .map((ev) => {
        const netPrice = ev.msrp - ev.federal_credit;
        const principal = Math.max(0, netPrice - downPayment);
        const payment = monthlyPayment(principal, rate, loanTermMonths);
        const insurance = INSURANCE_ANNUAL[ev.vehicle_class] / 12;

        // Monthly electricity cost
        const chargingCost = (monthlyMiles / 100) * ev.efficiency_kwh_per_100mi * electricityRate;

        // Monthly gas equivalent
        const gasCost = (monthlyMiles / gasMpg) * gasPrice;
        const fuelSavings = gasCost - chargingCost;

        const totalMonthly = payment + insurance + chargingCost - MAINTENANCE_MONTHLY;
        const fits = totalMonthly <= monthlyBudget;

        return {
          ev,
          netPrice,
          payment,
          insurance,
          chargingCost,
          fuelSavings,
          totalMonthly,
          fits,
          annualSavings: (fuelSavings + MAINTENANCE_MONTHLY) * 12,
        };
      })
      .sort((a, b) => {
        if (a.fits !== b.fits) return a.fits ? -1 : 1;
        return a.totalMonthly - b.totalMonthly;
      });
  }, [monthlyBudget, downPayment, creditScore, vehicleClass, monthlyMiles, electricityRate, gasMpg, gasPrice, loanTermMonths]);

  const fittingCount = results.filter((r) => r.fits).length;

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="rounded-2xl border border-border bg-bg-secondary p-6">
        <h2 className="mb-5 font-display text-lg font-bold text-text-primary">Your Budget & Profile</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Monthly budget */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Monthly Budget: <span className="text-accent">${monthlyBudget.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min={300}
              max={2000}
              step={50}
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="mt-1 flex justify-between text-xs text-text-tertiary">
              <span>$300</span><span>$2,000</span>
            </div>
          </div>

          {/* Down payment */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Down Payment: <span className="text-accent">${downPayment.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min={0}
              max={20000}
              step={500}
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="mt-1 flex justify-between text-xs text-text-tertiary">
              <span>$0</span><span>$20k</span>
            </div>
          </div>

          {/* Credit score */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Credit Score</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(CREDIT_SCORE_RATES) as [keyof typeof CREDIT_SCORE_RATES, number][]).map(([key, r]) => (
                <button
                  key={key}
                  onClick={() => setCreditScore(key)}
                  className={`rounded-lg border px-3 py-2 text-xs capitalize transition-all ${
                    creditScore === key
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-text-secondary hover:border-accent/40'
                  }`}
                >
                  {key} ({r}%)
                </button>
              ))}
            </div>
          </div>

          {/* Monthly miles */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Monthly Miles: <span className="text-accent">{monthlyMiles.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min={300}
              max={3000}
              step={100}
              value={monthlyMiles}
              onChange={(e) => setMonthlyMiles(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="mt-1 flex justify-between text-xs text-text-tertiary">
              <span>300</span><span>3,000 mi</span>
            </div>
          </div>

          {/* Gas car MPG */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Current Car MPG: <span className="text-accent">{gasMpg} mpg</span>
            </label>
            <input
              type="range"
              min={15}
              max={50}
              step={1}
              value={gasMpg}
              onChange={(e) => setGasMpg(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="mt-1 flex justify-between text-xs text-text-tertiary">
              <span>15</span><span>50 mpg</span>
            </div>
          </div>

          {/* Loan term */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Loan Term</label>
            <div className="grid grid-cols-3 gap-2">
              {[48, 60, 72].map((months) => (
                <button
                  key={months}
                  onClick={() => setLoanTermMonths(months)}
                  className={`rounded-lg border px-2 py-2 text-xs transition-all ${
                    loanTermMonths === months
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-text-secondary hover:border-accent/40'
                  }`}
                >
                  {months} mo
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vehicle class filter */}
        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-text-primary">Vehicle Type</label>
          <div className="flex flex-wrap gap-2">
            {(['all', 'sedan', 'suv', 'truck', 'sports'] as const).map((cls) => (
              <button
                key={cls}
                onClick={() => setVehicleClass(cls)}
                className={`rounded-full px-4 py-1.5 text-xs capitalize transition-all ${
                  vehicleClass === cls
                    ? 'bg-accent text-bg-primary'
                    : 'border border-border text-text-secondary hover:border-accent/40'
                }`}
              >
                {cls === 'all' ? 'All Types' : cls}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between">
        <div>
          {fittingCount > 0 ? (
            <div>
              <span className="font-display text-2xl font-bold text-accent">{fittingCount}</span>
              <span className="ml-2 text-text-secondary">
                EV{fittingCount !== 1 ? 's' : ''} fit{fittingCount === 1 ? 's' : ''} your budget
              </span>
            </div>
          ) : (
            <div className="font-display text-lg font-bold text-orange-400">
              No EVs fit the current budget — try adjusting down payment or loan term
            </div>
          )}
        </div>
      </div>

      {/* Results list */}
      <div className="space-y-3">
        {results.map(({ ev, netPrice, payment, insurance, chargingCost, fuelSavings, totalMonthly, fits, annualSavings }) => (
          <div
            key={ev.slug}
            className={`rounded-xl border p-5 transition-all ${
              fits
                ? 'border-accent/30 bg-bg-secondary hover:shadow-lg hover:shadow-accent/5'
                : 'border-border bg-bg-secondary opacity-60'
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Vehicle info */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {fits && (
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                      Fits Budget
                    </span>
                  )}
                  {ev.federal_credit > 0 && (
                    <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
                      ${ev.federal_credit.toLocaleString()} Credit
                    </span>
                  )}
                </div>
                <Link
                  href={`/vehicles/${ev.slug}`}
                  className="mt-1 block font-display text-lg font-semibold text-text-primary hover:text-accent transition-colors"
                >
                  {ev.year} {ev.make} {ev.model}
                </Link>
                <div className="text-sm text-text-secondary">
                  MSRP ${ev.msrp.toLocaleString()}
                  {ev.federal_credit > 0 && (
                    <span className="text-green-400"> → ${netPrice.toLocaleString()} after credit</span>
                  )}
                  {' · '}{ev.range_mi} mi range
                </div>
              </div>

              {/* Cost breakdown */}
              <div className="grid grid-cols-4 gap-4 sm:flex sm:gap-6">
                <div className="text-center">
                  <div className="font-mono text-sm font-bold text-text-primary">${Math.round(payment)}</div>
                  <div className="text-xs text-text-tertiary">payment/mo</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-sm font-bold text-text-primary">${Math.round(insurance)}</div>
                  <div className="text-xs text-text-tertiary">insurance/mo</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-sm font-bold text-text-primary">${Math.round(chargingCost)}</div>
                  <div className="text-xs text-text-tertiary">charging/mo</div>
                </div>
                <div className="text-center">
                  <div className={`font-display text-lg font-bold ${fits ? 'text-accent' : 'text-text-primary'}`}>
                    ${Math.round(totalMonthly)}
                  </div>
                  <div className="text-xs text-text-tertiary">total/mo</div>
                </div>
              </div>
            </div>

            {/* Savings bar */}
            {fits && annualSavings > 0 && (
              <div className="mt-3 flex items-center gap-3 text-sm">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-tertiary">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${Math.min(100, (annualSavings / 3000) * 100)}%` }}
                  />
                </div>
                <span className="shrink-0 text-green-400">
                  ~${Math.round(annualSavings).toLocaleString()}/yr saved vs gas
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Methodology note */}
      <div className="rounded-xl border border-border bg-bg-secondary p-4 text-xs text-text-tertiary">
        <strong className="text-text-secondary">Methodology:</strong> Monthly total = loan payment + estimated insurance + charging cost − maintenance savings ($50/mo).
        Electricity at ${electricityRate}/kWh. Gas at ${gasPrice}/gal with {gasMpg} mpg. Federal tax credit applied to purchase price where eligible.
        Insurance estimates from national averages by vehicle class. Individual rates vary.
        <Link href="/tax-credit-checker" className="ml-1 text-accent hover:underline">
          Verify your tax credit eligibility →
        </Link>
      </div>
    </div>
  );
}
