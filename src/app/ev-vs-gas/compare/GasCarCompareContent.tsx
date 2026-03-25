'use client';

import { useState, useEffect, useCallback } from 'react';
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

// ─── Static EV dataset ────────────────────────────────────────────────────────
interface EVOption {
  name: string;
  epaRangeMi: number;
  batteryKwh: number;
  efficiencyKwhPer100Mi: number;
  msrpUsd: number;
  federalCredit: number;
}

const EVS: EVOption[] = [
  { name: 'Tesla Model 3 RWD', epaRangeMi: 272, batteryKwh: 57.5, efficiencyKwhPer100Mi: 25, msrpUsd: 40240, federalCredit: 7500 },
  { name: 'Tesla Model 3 Long Range', epaRangeMi: 358, batteryKwh: 82, efficiencyKwhPer100Mi: 24, msrpUsd: 47240, federalCredit: 7500 },
  { name: 'Tesla Model Y RWD', epaRangeMi: 260, batteryKwh: 60, efficiencyKwhPer100Mi: 28, msrpUsd: 43990, federalCredit: 7500 },
  { name: 'Tesla Model Y Long Range', epaRangeMi: 330, batteryKwh: 82, efficiencyKwhPer100Mi: 27, msrpUsd: 50990, federalCredit: 7500 },
  { name: 'Chevrolet Equinox EV', epaRangeMi: 319, batteryKwh: 85, efficiencyKwhPer100Mi: 29, msrpUsd: 34995, federalCredit: 7500 },
  { name: 'Chevrolet Blazer EV', epaRangeMi: 324, batteryKwh: 89, efficiencyKwhPer100Mi: 30, msrpUsd: 44995, federalCredit: 7500 },
  { name: 'Ford Mustang Mach-E RWD', epaRangeMi: 312, batteryKwh: 91, efficiencyKwhPer100Mi: 32, msrpUsd: 42995, federalCredit: 3750 },
  { name: 'Ford F-150 Lightning Pro', epaRangeMi: 240, batteryKwh: 98, efficiencyKwhPer100Mi: 47, msrpUsd: 49995, federalCredit: 7500 },
  { name: 'Hyundai IONIQ 6 SE RWD', epaRangeMi: 361, batteryKwh: 77.4, efficiencyKwhPer100Mi: 25, msrpUsd: 38615, federalCredit: 7500 },
  { name: 'Hyundai IONIQ 5 SE RWD', epaRangeMi: 266, batteryKwh: 77.4, efficiencyKwhPer100Mi: 31, msrpUsd: 41450, federalCredit: 7500 },
  { name: 'Kia EV6 Light RWD', epaRangeMi: 310, batteryKwh: 77.4, efficiencyKwhPer100Mi: 27, msrpUsd: 42600, federalCredit: 7500 },
  { name: 'Kia EV9 Light RWD', epaRangeMi: 304, batteryKwh: 99.8, efficiencyKwhPer100Mi: 36, msrpUsd: 54900, federalCredit: 7500 },
  { name: 'BMW i4 eDrive35', epaRangeMi: 301, batteryKwh: 83.9, efficiencyKwhPer100Mi: 30, msrpUsd: 52200, federalCredit: 0 },
  { name: 'Volkswagen ID.4 Pro', epaRangeMi: 291, batteryKwh: 82, efficiencyKwhPer100Mi: 32, msrpUsd: 38995, federalCredit: 7500 },
  { name: 'Rivian R1S Dual Standard', epaRangeMi: 321, batteryKwh: 135, efficiencyKwhPer100Mi: 46, msrpUsd: 75900, federalCredit: 3750 },
  { name: 'Lucid Air Pure', epaRangeMi: 410, batteryKwh: 88, efficiencyKwhPer100Mi: 24, msrpUsd: 69900, federalCredit: 0 },
];

// ─── Static cost assumptions ───────────────────────────────────────────────────
const DEFAULT_GAS_PRICE = 3.50;       // $/gal
const DEFAULT_ELEC_RATE = 0.16;       // $/kWh
const DEFAULT_ANNUAL_MILES = 12000;
const GAS_MAINTENANCE_PER_MILE = 0.061;  // AAA 2024
const EV_MAINTENANCE_PER_MILE  = 0.031;  // AAA 2024

// ─── Types ─────────────────────────────────────────────────────────────────────
interface GasVehicle {
  id: string;
  year: string;
  make: string;
  model: string;
  trany: string;
  fuelType: string;
  city08: number;
  hwy08: number;
  comb08: number;
  co2TailpipeGpm: number;
}

interface CostComparison {
  annualFuelGas: number;
  annualFuelEv: number;
  annualMaintGas: number;
  annualMaintEv: number;
  annualTotalGas: number;
  annualTotalEv: number;
  annualSavings: number;
  paybackYears: number;
  fiveYearSavings: number;
  co2GasLbs: number;
  co2EvLbs: number; // using avg US grid 0.386 lbs/kWh
  chartData: Array<{ year: string; gasCumulative: number; evCumulative: number; savings: number }>;
}

function computeCosts(
  gasMpg: number,
  ev: EVOption,
  gasPrice: number,
  elecRate: number,
  annualMiles: number,
  upfrontDiff: number, // ev price - gas price (could be negative)
): CostComparison {
  const annualFuelGas  = (annualMiles / gasMpg) * gasPrice;
  const annualFuelEv   = (annualMiles / 100) * ev.efficiencyKwhPer100Mi * elecRate;
  const annualMaintGas = annualMiles * GAS_MAINTENANCE_PER_MILE;
  const annualMaintEv  = annualMiles * EV_MAINTENANCE_PER_MILE;
  const annualTotalGas = annualFuelGas + annualMaintGas;
  const annualTotalEv  = annualFuelEv  + annualMaintEv;
  const annualSavings  = annualTotalGas - annualTotalEv;
  const paybackYears   = annualSavings > 0 ? upfrontDiff / annualSavings : Infinity;

  // CO2: gas = gal/yr * 19.6 lbs/gal; EV = kWh/yr * 0.386 lbs/kWh (avg US grid)
  const co2GasLbs = (annualMiles / gasMpg) * 19.6;
  const co2EvLbs  = (annualMiles / 100) * ev.efficiencyKwhPer100Mi * 0.386;

  const chartData = Array.from({ length: 10 }, (_, i) => {
    const yr = i + 1;
    return {
      year: `Year ${yr}`,
      gasCumulative: Math.round(annualTotalGas * yr),
      evCumulative:  Math.round(annualTotalEv  * yr + upfrontDiff),
      savings:       Math.round(annualSavings  * yr - upfrontDiff),
    };
  });

  return {
    annualFuelGas, annualFuelEv,
    annualMaintGas, annualMaintEv,
    annualTotalGas, annualTotalEv,
    annualSavings,
    paybackYears,
    fiveYearSavings: annualSavings * 5 - upfrontDiff,
    co2GasLbs, co2EvLbs,
    chartData,
  };
}

function fmt(n: number, decimals = 0) {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function fmtUsd(n: number) {
  return '$' + fmt(Math.abs(n));
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function GasCarCompareContent() {
  // Gas car cascade
  const [years,   setYears]   = useState<number[]>([]);
  const [makes,   setMakes]   = useState<string[]>([]);
  const [models,  setModels]  = useState<string[]>([]);
  const [options, setOptions] = useState<Array<{ text: string; value: string }>>([]);

  const [selYear,   setSelYear]   = useState('');
  const [selMake,   setSelMake]   = useState('');
  const [selModel,  setSelModel]  = useState('');
  const [selOption, setSelOption] = useState('');

  const [gasVehicle, setGasVehicle] = useState<GasVehicle | null>(null);
  const [loadingGas, setLoadingGas] = useState(false);

  // EV selection
  const [selEV, setSelEV] = useState<EVOption>(EVS[0]);

  // Assumptions
  const [gasPrice,    setGasPrice]    = useState(DEFAULT_GAS_PRICE);
  const [elecRate,    setElecRate]    = useState(DEFAULT_ELEC_RATE);
  const [annualMiles, setAnnualMiles] = useState(DEFAULT_ANNUAL_MILES);
  const [gasMsrp,     setGasMsrp]    = useState(0);

  // ── Fetch years on mount
  useEffect(() => {
    fetch('/api/gas-car-lookup?action=years')
      .then(r => r.json())
      .then(d => setYears(d.years ?? []));
  }, []);

  // ── Cascade: year → makes
  useEffect(() => {
    if (!selYear) return;
    setMakes([]); setSelMake('');
    setModels([]); setSelModel('');
    setOptions([]); setSelOption('');
    setGasVehicle(null);
    fetch(`/api/gas-car-lookup?action=makes&year=${selYear}`)
      .then(r => r.json())
      .then(d => setMakes(d.makes ?? []));
  }, [selYear]);

  // ── Cascade: make → models
  useEffect(() => {
    if (!selYear || !selMake) return;
    setModels([]); setSelModel('');
    setOptions([]); setSelOption('');
    setGasVehicle(null);
    fetch(`/api/gas-car-lookup?action=models&year=${selYear}&make=${encodeURIComponent(selMake)}`)
      .then(r => r.json())
      .then(d => setModels(d.models ?? []));
  }, [selYear, selMake]);

  // ── Cascade: model → trim options
  useEffect(() => {
    if (!selYear || !selMake || !selModel) return;
    setOptions([]); setSelOption('');
    setGasVehicle(null);
    fetch(
      `/api/gas-car-lookup?action=options&year=${selYear}&make=${encodeURIComponent(selMake)}&model=${encodeURIComponent(selModel)}`,
    )
      .then(r => r.json())
      .then(d => setOptions(d.options ?? []));
  }, [selYear, selMake, selModel]);

  // ── Fetch vehicle details when option selected
  const fetchVehicle = useCallback(async (id: string) => {
    setLoadingGas(true);
    try {
      const res = await fetch(`/api/gas-car-lookup?action=vehicle&id=${id}`);
      const data = await res.json();
      if (data.vehicle) setGasVehicle(data.vehicle);
    } finally {
      setLoadingGas(false);
    }
  }, []);

  useEffect(() => {
    if (selOption) fetchVehicle(selOption);
  }, [selOption, fetchVehicle]);

  // ── Compute
  const comparison = gasVehicle
    ? computeCosts(
        gasVehicle.comb08,
        selEV,
        gasPrice,
        elecRate,
        annualMiles,
        selEV.msrpUsd - selEV.federalCredit - gasMsrp,
      )
    : null;

  const evColor   = 'var(--accent)';
  const gasColor  = '#ff5252';

  return (
    <div className="space-y-8">
      {/* ─── Two-column car selectors ──────────────────────────────────────────── */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Gas car */}
        <div className="rounded-lg border border-border bg-bg-secondary p-5">
          <h2 className="mb-4 font-display text-base font-bold text-text-primary">
            Gas Vehicle
          </h2>
          <div className="space-y-3">
            <select
              value={selYear}
              onChange={e => setSelYear(e.target.value)}
              className="w-full rounded border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="">Select year…</option>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <select
              value={selMake}
              onChange={e => setSelMake(e.target.value)}
              disabled={!makes.length}
              className="w-full rounded border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-40"
            >
              <option value="">Select make…</option>
              {makes.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <select
              value={selModel}
              onChange={e => setSelModel(e.target.value)}
              disabled={!models.length}
              className="w-full rounded border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-40"
            >
              <option value="">Select model…</option>
              {models.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <select
              value={selOption}
              onChange={e => setSelOption(e.target.value)}
              disabled={!options.length}
              className="w-full rounded border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-40"
            >
              <option value="">Select trim…</option>
              {options.map(o => (
                <option key={o.value} value={o.value}>{o.text}</option>
              ))}
            </select>

            {gasVehicle && (
              <div className="rounded bg-bg-tertiary px-3 py-2 text-xs text-text-secondary">
                <div className="font-semibold text-text-primary">
                  {gasVehicle.year} {gasVehicle.make} {gasVehicle.model}
                </div>
                <div>{gasVehicle.trany} · {gasVehicle.fuelType}</div>
                <div className="mt-1">
                  <span className="font-mono text-accent">{gasVehicle.comb08} MPG</span>
                  {' '}combined ({gasVehicle.city08} city / {gasVehicle.hwy08} hwy)
                </div>
              </div>
            )}
            {loadingGas && (
              <p className="text-xs text-text-tertiary">Loading vehicle data…</p>
            )}

            <div>
              <label className="mb-1 block text-xs text-text-secondary">
                Gas car purchase price ($)
              </label>
              <input
                type="number"
                min={0}
                step={500}
                value={gasMsrp}
                onChange={e => setGasMsrp(Number(e.target.value))}
                className="w-full rounded border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="e.g. 28000"
              />
            </div>
          </div>
        </div>

        {/* EV */}
        <div className="rounded-lg border border-accent/30 bg-bg-secondary p-5">
          <h2 className="mb-4 font-display text-base font-bold text-text-primary">
            Electric Vehicle
          </h2>
          <div className="space-y-3">
            <select
              value={selEV.name}
              onChange={e => {
                const found = EVS.find(ev => ev.name === e.target.value);
                if (found) setSelEV(found);
              }}
              className="w-full rounded border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {EVS.map(ev => (
                <option key={ev.name} value={ev.name}>{ev.name}</option>
              ))}
            </select>

            <div className="rounded bg-bg-tertiary px-3 py-2 text-xs text-text-secondary">
              <div className="font-semibold text-text-primary">{selEV.name}</div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                <span>
                  <span className="font-mono text-accent">{selEV.epaRangeMi} mi</span> EPA range
                </span>
                <span>
                  <span className="font-mono text-accent">{selEV.efficiencyKwhPer100Mi} kWh</span>/100mi
                </span>
              </div>
              <div className="mt-1">
                MSRP: ${fmt(selEV.msrpUsd)}
                {selEV.federalCredit > 0 && (
                  <span className="ml-2 text-green-400">
                    − ${fmt(selEV.federalCredit)} tax credit
                  </span>
                )}
              </div>
              {selEV.federalCredit > 0 && (
                <div className="mt-0.5 font-semibold text-text-primary">
                  Effective: ${fmt(selEV.msrpUsd - selEV.federalCredit)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Assumptions ───────────────────────────────────────────────────────── */}
      <div className="rounded-lg border border-border bg-bg-secondary p-5">
        <h2 className="mb-4 font-display text-base font-bold text-text-primary">Assumptions</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-text-secondary">
              Gas price ($/gal)
            </label>
            <input
              type="number"
              min={1}
              max={10}
              step={0.05}
              value={gasPrice}
              onChange={e => setGasPrice(Number(e.target.value))}
              className="w-full rounded border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-secondary">
              Electricity rate ($/kWh)
            </label>
            <input
              type="number"
              min={0.05}
              max={0.60}
              step={0.01}
              value={elecRate}
              onChange={e => setElecRate(Number(e.target.value))}
              className="w-full rounded border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-secondary">
              Annual miles driven
            </label>
            <input
              type="number"
              min={1000}
              max={50000}
              step={1000}
              value={annualMiles}
              onChange={e => setAnnualMiles(Number(e.target.value))}
              className="w-full rounded border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>
        <p className="mt-3 text-xs text-text-tertiary">
          Maintenance costs based on AAA 2024: gas {(GAS_MAINTENANCE_PER_MILE * 100).toFixed(1)}¢/mi,
          EV {(EV_MAINTENANCE_PER_MILE * 100).toFixed(1)}¢/mi. CO₂ uses avg US grid intensity (0.386 lbs/kWh).
        </p>
      </div>

      {/* ─── Results ───────────────────────────────────────────────────────────── */}
      {!gasVehicle && (
        <div className="rounded-lg border border-dashed border-border bg-bg-secondary p-8 text-center text-text-tertiary">
          Select a gas vehicle above to see the comparison.
        </div>
      )}

      {comparison && gasVehicle && (
        <>
          {/* Summary verdict */}
          <div className={`rounded-lg border p-5 ${comparison.annualSavings > 0 ? 'border-accent/40 bg-accent/5' : 'border-border bg-bg-secondary'}`}>
            <div className="text-center">
              {comparison.annualSavings > 0 ? (
                <>
                  <div className="font-display text-2xl font-bold text-accent">
                    Save {fmtUsd(comparison.annualSavings)}/year
                  </div>
                  <div className="mt-1 text-sm text-text-secondary">
                    by switching to the {selEV.name}
                    {comparison.paybackYears < 20
                      ? ` · Breaks even in ${comparison.paybackYears.toFixed(1)} years`
                      : ''}
                  </div>
                  {comparison.fiveYearSavings > 0 && (
                    <div className="mt-2 text-sm font-semibold text-text-primary">
                      5-year net savings: {fmtUsd(comparison.fiveYearSavings)}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="font-display text-2xl font-bold text-warning">
                    Gas costs {fmtUsd(Math.abs(comparison.annualSavings))}/year less
                  </div>
                  <div className="mt-1 text-sm text-text-secondary">
                    Consider a more affordable EV, or check if gas prices rise.
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Side-by-side annual cost table */}
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-tertiary text-xs text-text-secondary">
                  <th className="px-4 py-3 text-left">Cost Category</th>
                  <th className="px-4 py-3 text-right" style={{ color: gasColor }}>
                    {gasVehicle.year} {gasVehicle.make} {gasVehicle.model}
                  </th>
                  <th className="px-4 py-3 text-right" style={{ color: evColor }}>
                    {selEV.name}
                  </th>
                  <th className="px-4 py-3 text-right text-text-secondary">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-text-primary">
                <tr>
                  <td className="px-4 py-3">Annual fuel / electricity</td>
                  <td className="px-4 py-3 text-right font-mono" style={{ color: gasColor }}>
                    {fmtUsd(comparison.annualFuelGas)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono" style={{ color: evColor }}>
                    {fmtUsd(comparison.annualFuelEv)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-green-400">
                    {fmtUsd(comparison.annualFuelGas - comparison.annualFuelEv)} saved
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Annual maintenance</td>
                  <td className="px-4 py-3 text-right font-mono" style={{ color: gasColor }}>
                    {fmtUsd(comparison.annualMaintGas)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono" style={{ color: evColor }}>
                    {fmtUsd(comparison.annualMaintEv)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-green-400">
                    {fmtUsd(comparison.annualMaintGas - comparison.annualMaintEv)} saved
                  </td>
                </tr>
                <tr className="font-semibold">
                  <td className="px-4 py-3">Total annual running cost</td>
                  <td className="px-4 py-3 text-right font-mono" style={{ color: gasColor }}>
                    {fmtUsd(comparison.annualTotalGas)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono" style={{ color: evColor }}>
                    {fmtUsd(comparison.annualTotalEv)}
                  </td>
                  <td className={`px-4 py-3 text-right font-mono ${comparison.annualSavings > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {comparison.annualSavings > 0
                      ? `${fmtUsd(comparison.annualSavings)} saved`
                      : `${fmtUsd(Math.abs(comparison.annualSavings))} more`}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-text-secondary">Annual CO₂ emissions</td>
                  <td className="px-4 py-3 text-right font-mono text-text-secondary">
                    {fmt(comparison.co2GasLbs)} lbs
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-text-secondary">
                    {fmt(comparison.co2EvLbs)} lbs
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-green-400">
                    {fmt(comparison.co2GasLbs - comparison.co2EvLbs)} lbs less
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 10-year area chart */}
          <div>
            <h2 className="mb-4 font-display text-lg font-bold text-text-primary">
              10-Year Cumulative Cost (including purchase price difference)
            </h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={comparison.chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gasGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={gasColor} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={gasColor} stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="evGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={evColor} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={evColor} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="year" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} />
                  <YAxis
                    tickFormatter={v => '$' + (v >= 1000 ? Math.round(v / 1000) + 'k' : v)}
                    tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
                    width={52}
                  />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 6 }}
                    labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                    formatter={(value, name) => [
                      '$' + fmt(Number(value ?? 0)),
                      name === 'gasCumulative'
                        ? `Gas (${gasVehicle.year} ${gasVehicle.make} ${gasVehicle.model})`
                        : `EV (${selEV.name})`,
                    ]}
                  />
                  <Legend
                    formatter={(v) =>
                      v === 'gasCumulative'
                        ? `${gasVehicle.year} ${gasVehicle.make} ${gasVehicle.model}`
                        : selEV.name
                    }
                  />
                  <Area type="monotone" dataKey="gasCumulative" stroke={gasColor} fill="url(#gasGrad)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="evCumulative"  stroke={evColor}  fill="url(#evGrad)"  strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-text-tertiary">
              EV cumulative cost includes the upfront price difference vs. gas car. Chart assumes constant gas/electricity prices and does not include insurance or depreciation.
            </p>
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Gas MPG', value: `${gasVehicle.comb08} MPG` },
              { label: 'EV Efficiency', value: `${selEV.efficiencyKwhPer100Mi} kWh/100mi` },
              {
                label: 'Cost per mile (gas)',
                value: `${((gasPrice / gasVehicle.comb08) * 100).toFixed(1)}¢`,
              },
              {
                label: 'Cost per mile (EV)',
                value: `${((elecRate * selEV.efficiencyKwhPer100Mi / 100) * 100).toFixed(1)}¢`,
              },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg border border-border bg-bg-secondary p-3 text-center">
                <div className="text-xs text-text-tertiary">{label}</div>
                <div className="mt-1 font-mono text-base font-bold text-text-primary">{value}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ─── Data source note ──────────────────────────────────────────────────── */}
      <p className="text-xs text-text-tertiary">
        Gas vehicle MPG from{' '}
        <a
          href="https://www.fueleconomy.gov"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          EPA FuelEconomy.gov
        </a>
        . Maintenance estimates from AAA&apos;s 2024 Your Driving Costs study.
        Federal EV tax credit eligibility varies — verify at{' '}
        <a
          href="https://fueleconomy.gov/feg/taxevb.shtml"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          fueleconomy.gov
        </a>
        .
      </p>
    </div>
  );
}
