'use client';

import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const VEHICLE_TYPES = [
  { id: 'sedan', label: 'Sedan / Car', mpg: 32, evMilesPerKwh: 4.0, evMsrp: 42000, gasMsrp: 28000, maintenanceSavingsPct: 0.40, evModel: 'Tesla Model 3 / Chevy Bolt' },
  { id: 'suv', label: 'SUV / Crossover', mpg: 27, evMilesPerKwh: 3.4, evMsrp: 50000, gasMsrp: 35000, maintenanceSavingsPct: 0.38, evModel: 'Hyundai IONIQ 5 / VW ID.4' },
  { id: 'pickup', label: 'Pickup Truck', mpg: 20, evMilesPerKwh: 2.4, evMsrp: 65000, gasMsrp: 42000, maintenanceSavingsPct: 0.35, evModel: 'Ford F-150 Lightning / Rivian R1T' },
  { id: 'cargo_van', label: 'Cargo Van', mpg: 18, evMilesPerKwh: 2.8, evMsrp: 55000, gasMsrp: 38000, maintenanceSavingsPct: 0.42, evModel: 'Ford E-Transit / Rivian EDV' },
  { id: 'delivery_van', label: 'Delivery / Step Van', mpg: 10, evMilesPerKwh: 1.8, evMsrp: 85000, gasMsrp: 55000, maintenanceSavingsPct: 0.45, evModel: 'Amazon EDV / BrightDrop Zevo' },
  { id: 'bus', label: 'Shuttle / Bus', mpg: 8, evMilesPerKwh: 1.4, evMsrp: 350000, gasMsrp: 180000, maintenanceSavingsPct: 0.50, evModel: 'Proterra / BYD Electric Bus' },
];

const FUEL_TYPES = [
  { id: 'gasoline', label: 'Gasoline', defaultPricePerGallon: 3.60, co2LbsPerGallon: 19.6 },
  { id: 'diesel', label: 'Diesel', defaultPricePerGallon: 4.10, co2LbsPerGallon: 22.4 },
];

const US_AVG_ELEC_RATE = 0.13; // $/kWh commercial rate

function fmt(n: number): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}
function fmtD(n: number, d = 1): string {
  return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
}

export default function FleetCalcContent() {
  const [fleetSize, setFleetSize] = useState(10);
  const [vehicleTypeId, setVehicleTypeId] = useState('sedan');
  const [milesPerVehiclePerDay, setMilesPerVehiclePerDay] = useState(80);
  const [operatingDaysPerYear, setOperatingDaysPerYear] = useState(250);
  const [fuelTypeId, setFuelTypeId] = useState('gasoline');
  const [fuelPrice, setFuelPrice] = useState(3.60);
  const [electricityRate, setElectricityRate] = useState(US_AVG_ELEC_RATE);
  const [stateCode, setStateCode] = useState('US');
  const [showLeadForm, setShowLeadForm] = useState(false);

  const vt = VEHICLE_TYPES.find((v) => v.id === vehicleTypeId) ?? VEHICLE_TYPES[0];
  const fuel = FUEL_TYPES.find((f) => f.id === fuelTypeId) ?? FUEL_TYPES[0];

  const results = useMemo(() => {
    const annualMilesPerVehicle = milesPerVehiclePerDay * operatingDaysPerYear;
    const totalAnnualMiles = annualMilesPerVehicle * fleetSize;

    // Fuel costs
    const gasGallonsPerVehicle = annualMilesPerVehicle / vt.mpg;
    const gasFuelCostPerVehicle = gasGallonsPerVehicle * fuelPrice;
    const gasFuelCostTotal = gasFuelCostPerVehicle * fleetSize;

    // EV electricity costs
    const evKwhPerVehicle = annualMilesPerVehicle / vt.evMilesPerKwh;
    const evElecCostPerVehicle = evKwhPerVehicle * electricityRate;
    const evElecCostTotal = evElecCostPerVehicle * fleetSize;

    // Maintenance (EV saves ~35–50% vs gas)
    const gasMaintenanceCostPerVehicle = annualMilesPerVehicle * 0.09; // ~$0.09/mi for gas fleet
    const evMaintenanceCostPerVehicle = gasMaintenanceCostPerVehicle * (1 - vt.maintenanceSavingsPct);
    const maintenanceSavingsPerVehicle = gasMaintenanceCostPerVehicle - evMaintenanceCostPerVehicle;
    const maintenanceSavingsTotal = maintenanceSavingsPerVehicle * fleetSize;

    // Annual operational savings
    const fuelSavingsPerVehicle = gasFuelCostPerVehicle - evElecCostPerVehicle;
    const fuelSavingsTotal = fuelSavingsPerVehicle * fleetSize;
    const annualOperationalSavings = fuelSavingsTotal + maintenanceSavingsTotal;

    // Capital costs
    const gasFleetCapitalCost = vt.gasMsrp * fleetSize;
    const evFleetCapitalCost = vt.evMsrp * fleetSize;
    // Federal Section 179 + Commercial EV credit (up to $7,500 per vehicle for vehicles < 14,000 lbs)
    const federalCreditPerVehicle = vehicleTypeId === 'bus' ? 40000 : 7500;
    const federalCreditTotal = federalCreditPerVehicle * fleetSize;
    const evNetCapitalCost = evFleetCapitalCost - federalCreditTotal;
    const capitalDifference = evNetCapitalCost - gasFleetCapitalCost;

    // Payback period
    const paybackYears = capitalDifference > 0 ? capitalDifference / annualOperationalSavings : 0;

    // 5 and 10 year total cost of ownership
    const gas5Yr = gasFleetCapitalCost + (gasFuelCostTotal + gasMaintenanceCostPerVehicle * fleetSize) * 5;
    const ev5Yr = evNetCapitalCost + evElecCostTotal * 5 + evMaintenanceCostPerVehicle * fleetSize * 5;
    const savings5Yr = gas5Yr - ev5Yr;

    const gas10Yr = gasFleetCapitalCost + (gasFuelCostTotal + gasMaintenanceCostPerVehicle * fleetSize) * 10;
    const ev10Yr = evNetCapitalCost + evElecCostTotal * 10 + evMaintenanceCostPerVehicle * fleetSize * 10;
    const savings10Yr = gas10Yr - ev10Yr;

    // CO2 savings
    const gasCo2TonsPerYear = (gasGallonsPerVehicle * fuel.co2LbsPerGallon * fleetSize) / 2204.6;
    const evCo2TonsPerYear = (evKwhPerVehicle * 0.386 * fleetSize) / 1000; // avg US grid
    const co2SavingsTonsPerYear = gasCo2TonsPerYear - evCo2TonsPerYear;

    // Chart data
    const chartData = Array.from({ length: 11 }, (_, yr) => ({
      year: yr,
      gas: Math.round(gasFleetCapitalCost + (gasFuelCostTotal + gasMaintenanceCostPerVehicle * fleetSize) * yr),
      ev: Math.round(evNetCapitalCost + (evElecCostTotal + evMaintenanceCostPerVehicle * fleetSize) * yr),
    }));

    return {
      annualMilesPerVehicle,
      totalAnnualMiles,
      gasFuelCostTotal,
      evElecCostTotal,
      fuelSavingsTotal,
      maintenanceSavingsTotal,
      annualOperationalSavings,
      gasFleetCapitalCost,
      evFleetCapitalCost,
      evNetCapitalCost,
      federalCreditTotal,
      capitalDifference,
      paybackYears,
      savings5Yr,
      savings10Yr,
      gas5Yr,
      ev5Yr,
      gas10Yr,
      ev10Yr,
      co2SavingsTonsPerYear,
      chartData,
    };
  }, [fleetSize, vt, milesPerVehiclePerDay, operatingDaysPerYear, fuel, fuelPrice, electricityRate, vehicleTypeId]);

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="rounded-lg border border-border bg-bg-secondary p-6">
        <h2 className="mb-5 font-display text-lg font-bold text-text-primary">Fleet Details</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Fleet size */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Fleet Size: <span className="text-accent">{fleetSize} vehicles</span>
            </label>
            <input
              type="range" min={1} max={500} step={1}
              value={fleetSize}
              onChange={(e) => setFleetSize(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="mt-1 flex justify-between text-xs text-text-tertiary"><span>1</span><span>500</span></div>
          </div>

          {/* Vehicle type */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Vehicle Type</label>
            <select
              value={vehicleTypeId}
              onChange={(e) => setVehicleTypeId(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
            >
              {VEHICLE_TYPES.map((v) => (
                <option key={v.id} value={v.id}>{v.label}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-text-tertiary">e.g. {vt.evModel}</p>
          </div>

          {/* Miles per vehicle per day */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Miles/Vehicle/Day: <span className="text-accent">{milesPerVehiclePerDay} mi</span>
            </label>
            <input
              type="range" min={20} max={300} step={10}
              value={milesPerVehiclePerDay}
              onChange={(e) => setMilesPerVehiclePerDay(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="mt-1 flex justify-between text-xs text-text-tertiary"><span>20</span><span>300</span></div>
          </div>

          {/* Operating days */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Operating Days/Year: <span className="text-accent">{operatingDaysPerYear} days</span>
            </label>
            <input
              type="range" min={100} max={365} step={5}
              value={operatingDaysPerYear}
              onChange={(e) => setOperatingDaysPerYear(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="mt-1 flex justify-between text-xs text-text-tertiary"><span>100</span><span>365</span></div>
          </div>

          {/* Fuel type */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Current Fuel Type</label>
            <select
              value={fuelTypeId}
              onChange={(e) => { setFuelTypeId(e.target.value); const f = FUEL_TYPES.find((ft) => ft.id === e.target.value); if (f) setFuelPrice(f.defaultPricePerGallon); }}
              className="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
            >
              {FUEL_TYPES.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>

          {/* Fuel price */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Fuel Price: <span className="text-accent">${fuelPrice.toFixed(2)}/gal</span>
            </label>
            <input
              type="range" min={2.50} max={6.00} step={0.05}
              value={fuelPrice}
              onChange={(e) => setFuelPrice(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="mt-1 flex justify-between text-xs text-text-tertiary"><span>$2.50</span><span>$6.00</span></div>
          </div>

          {/* Electricity rate */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Commercial Electricity Rate: <span className="text-accent">${electricityRate.toFixed(3)}/kWh</span>
            </label>
            <input
              type="range" min={0.07} max={0.30} step={0.005}
              value={electricityRate}
              onChange={(e) => setElectricityRate(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="mt-1 flex justify-between text-xs text-text-tertiary"><span>$0.07 (cheap)</span><span>$0.30 (expensive)</span></div>
          </div>
        </div>
      </div>

      {/* Summary headline */}
      <div className={`rounded-lg border p-6 ${results.savings10Yr > 0 ? 'border-accent/30 bg-accent/5' : 'border-warning/30 bg-warning/5'}`}>
        <h2 className="mb-1 font-display text-2xl font-bold text-text-primary">
          {results.savings10Yr > 0
            ? `$${fmt(results.savings10Yr)} saved over 10 years`
            : `Review pricing assumptions`}
        </h2>
        <p className="text-text-secondary">
          Fleet of {fleetSize} {vt.label.toLowerCase()}s · {fmt(results.totalAnnualMiles)} total miles/year ·{' '}
          {results.paybackYears > 0 && results.paybackYears < 20
            ? `EV fleet pays back in ${fmtD(results.paybackYears)} years`
            : 'EV savings exceed capital premium from year 1'}
        </p>
      </div>

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Annual Fuel Savings', value: `$${fmt(results.fuelSavingsTotal)}`, sub: 'vs current fuel' },
          { label: 'Annual Maint. Savings', value: `$${fmt(results.maintenanceSavingsTotal)}`, sub: `${Math.round(vt.maintenanceSavingsPct * 100)}% lower` },
          { label: 'Total Annual Savings', value: `$${fmt(results.annualOperationalSavings)}`, sub: 'operational' },
          { label: 'CO₂ Saved', value: `${fmtD(results.co2SavingsTonsPerYear)} t`, sub: 'per year' },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-border bg-bg-secondary p-4 text-center">
            <div className="font-display text-xl font-bold text-accent sm:text-2xl">{m.value}</div>
            <div className="mt-0.5 text-xs font-medium text-text-primary">{m.label}</div>
            <div className="text-xs text-text-tertiary">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Cost Breakdown Table */}
      <div className="rounded-lg border border-border bg-bg-secondary p-5">
        <h2 className="mb-4 font-display text-lg font-bold text-text-primary">Annual Cost Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-text-tertiary">
                <th className="pb-2 pr-4">Cost Category</th>
                <th className="pb-2 pr-4">Gas Fleet</th>
                <th className="pb-2 pr-4">EV Fleet</th>
                <th className="pb-2">Savings</th>
              </tr>
            </thead>
            <tbody className="space-y-1">
              {[
                {
                  label: 'Fuel / Electricity',
                  gas: results.gasFuelCostTotal,
                  ev: results.evElecCostTotal,
                },
                {
                  label: 'Maintenance',
                  gas: 0.09 * results.totalAnnualMiles,
                  ev: 0.09 * (1 - vt.maintenanceSavingsPct) * results.totalAnnualMiles,
                },
              ].map((row) => (
                <tr key={row.label} className="border-b border-border">
                  <td className="py-2.5 pr-4 text-text-primary">{row.label}</td>
                  <td className="py-2.5 pr-4 text-error">${fmt(row.gas)}</td>
                  <td className="py-2.5 pr-4 text-text-primary">${fmt(row.ev)}</td>
                  <td className="py-2.5 text-success">+${fmt(row.gas - row.ev)}</td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="pt-3 pr-4 text-text-primary">Total Annual Operating</td>
                <td className="pt-3 pr-4 text-error">${fmt(results.gasFuelCostTotal + 0.09 * results.totalAnnualMiles)}</td>
                <td className="pt-3 pr-4 text-text-primary">${fmt(results.evElecCostTotal + 0.09 * (1 - vt.maintenanceSavingsPct) * results.totalAnnualMiles)}</td>
                <td className="pt-3 font-bold text-accent">+${fmt(results.annualOperationalSavings)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Capital Cost + Payback */}
      <div className="rounded-lg border border-border bg-bg-secondary p-5">
        <h2 className="mb-4 font-display text-lg font-bold text-text-primary">Capital Investment & Payback</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Gas Fleet Purchase', value: `$${fmt(results.gasFleetCapitalCost)}`, sub: `${fleetSize} × $${fmt(vt.gasMsrp)}` },
            { label: 'EV Fleet (gross)', value: `$${fmt(results.evFleetCapitalCost)}`, sub: `${fleetSize} × $${fmt(vt.evMsrp)}` },
            { label: 'EV Fleet (after credits)', value: `$${fmt(results.evNetCapitalCost)}`, sub: `$${fmt(results.federalCreditTotal)} federal credit` },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-bg-tertiary p-4">
              <div className="font-display text-xl font-bold text-text-primary">{s.value}</div>
              <div className="mt-0.5 text-xs font-medium text-text-secondary">{s.label}</div>
              <div className="text-xs text-text-tertiary">{s.sub}</div>
            </div>
          ))}
        </div>
        {results.paybackYears > 0 && results.paybackYears < 20 && (
          <div className="mt-4 rounded-lg bg-accent/10 p-4">
            <p className="text-sm text-text-primary">
              <strong>Payback period:</strong> The higher EV capital cost is recovered in{' '}
              <strong className="text-accent">{fmtD(results.paybackYears)} years</strong> through operational savings.
              After that, the EV fleet saves <strong className="text-accent">${fmt(results.annualOperationalSavings)}/year</strong> indefinitely.
            </p>
          </div>
        )}
        <p className="mt-3 text-xs text-text-tertiary">
          Federal commercial EV credit: up to $7,500/vehicle (cars &lt;14,000 lbs) or $40,000/vehicle (heavy vehicles) under IRS Section 30D/45W. State incentives not included. Consult a tax advisor.
        </p>
      </div>

      {/* 10-year chart */}
      <div className="rounded-lg border border-border bg-bg-secondary p-5">
        <h2 className="mb-2 font-display text-lg font-bold text-text-primary">
          10-Year Total Fleet Cost of Ownership
        </h2>
        <p className="mb-4 text-xs text-text-tertiary">Cumulative cost including purchase + operational expenses (no residual value)</p>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={results.chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="gasGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff5252" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ff5252" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="evGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00e676" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00e676" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
            <XAxis dataKey="year" tick={{ fill: '#8888a0', fontSize: 11 }} tickFormatter={(v) => `Yr ${v}`} />
            <YAxis tick={{ fill: '#8888a0', fontSize: 11 }} tickFormatter={(v) => `$${(Number(v) / 1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={{ background: '#12121a', border: '1px solid #2a2a3e', borderRadius: '8px' }}
              labelStyle={{ color: '#f0f0f5' }}
              formatter={(value, name) => [`$${fmt(Number(value ?? 0))}`, name === 'gas' ? 'Gas Fleet' : 'EV Fleet']}
              labelFormatter={(v) => `Year ${v}`}
            />
            <Legend formatter={(v) => v === 'gas' ? 'Gas Fleet' : 'EV Fleet'} wrapperStyle={{ fontSize: '12px', color: '#8888a0' }} />
            <Area type="monotone" dataKey="gas" stroke="#ff5252" fill="url(#gasGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="ev" stroke="#00e676" fill="url(#evGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 5 and 10 year summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { years: 5, gasCost: results.gas5Yr, evCost: results.ev5Yr, savings: results.savings5Yr },
          { years: 10, gasCost: results.gas10Yr, evCost: results.ev10Yr, savings: results.savings10Yr },
        ].map((s) => (
          <div key={s.years} className="rounded-lg border border-border bg-bg-secondary p-5">
            <h3 className="mb-3 font-display text-base font-bold text-text-primary">{s.years}-Year Total Cost</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-text-secondary">Gas fleet</span><span className="text-error">${fmt(s.gasCost)}</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">EV fleet</span><span className="text-text-primary">${fmt(s.evCost)}</span></div>
              <div className="flex justify-between border-t border-border pt-2 font-bold">
                <span className="text-text-primary">EV Savings</span>
                <span className={s.savings > 0 ? 'text-accent' : 'text-error'}>
                  {s.savings > 0 ? '+' : ''}{s.savings > 0 ? `$${fmt(s.savings)}` : `-$${fmt(Math.abs(s.savings))}`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lead capture CTA */}
      {!showLeadForm ? (
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-6 text-center">
          <h2 className="mb-2 font-display text-xl font-bold text-text-primary">
            Want a Custom Fleet Analysis?
          </h2>
          <p className="mb-5 text-text-secondary">
            Our fleet electrification experts can model your exact routes, duty cycles, charging infrastructure,
            and total incentive stack — including state, utility, and NEVI funding.
          </p>
          <button
            onClick={() => setShowLeadForm(true)}
            className="rounded-lg bg-accent px-6 py-3 font-semibold text-bg-primary hover:bg-accent-dim transition-colors"
          >
            Get a Free Fleet Analysis
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-6">
          <h2 className="mb-4 font-display text-xl font-bold text-text-primary">Contact Us for a Custom Analysis</h2>
          <form
            className="space-y-4"
            onSubmit={(e) => { e.preventDefault(); setShowLeadForm(false); alert('Thank you! We\'ll be in touch within 1 business day.'); }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-text-primary">Name</label>
                <input type="text" required className="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none" placeholder="Jane Smith" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text-primary">Company</label>
                <input type="text" required className="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none" placeholder="Acme Corp" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text-primary">Email</label>
                <input type="email" required className="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none" placeholder="jane@acme.com" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text-primary">Fleet Size</label>
                <input type="number" min={1} defaultValue={fleetSize} className="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-primary">Notes / Questions</label>
              <textarea rows={3} className="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none" placeholder="Tell us about your fleet, routes, and electrification goals..." />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="rounded-lg bg-accent px-6 py-2.5 font-semibold text-bg-primary hover:bg-accent-dim transition-colors">
                Send Request
              </button>
              <button type="button" onClick={() => setShowLeadForm(false)} className="rounded-lg border border-border px-6 py-2.5 text-text-secondary hover:bg-bg-tertiary transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
