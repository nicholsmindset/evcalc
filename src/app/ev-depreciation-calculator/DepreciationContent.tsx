'use client';

import { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer,
} from 'recharts';

interface DepCurve {
  make: string;
  model: string;
  trimNote: string;
  yr1: number; yr2: number; yr3: number; yr5: number; yr7: number;
  category: 'excellent' | 'good' | 'average' | 'poor' | 'very_poor';
  notes: string;
}

const CURVES: DepCurve[] = [
  { make: 'Tesla',      model: 'Model Y',         trimNote: '',              yr1: 85, yr2: 77, yr3: 70, yr5: 58, yr7: 48, category: 'excellent', notes: 'Best resale in class; strong used market demand' },
  { make: 'Tesla',      model: 'Model 3',          trimNote: '',              yr1: 83, yr2: 75, yr3: 68, yr5: 56, yr7: 46, category: 'excellent', notes: 'Consistent strong resale driven by brand loyalty' },
  { make: 'Rivian',     model: 'R1T',              trimNote: '',              yr1: 82, yr2: 74, yr3: 67, yr5: 55, yr7: 45, category: 'excellent', notes: 'Limited supply keeps used prices elevated' },
  { make: 'Rivian',     model: 'R1S',              trimNote: '',              yr1: 81, yr2: 73, yr3: 66, yr5: 54, yr7: 44, category: 'excellent', notes: 'Strong SUV demand; adventure premium maintained' },
  { make: 'Ford',       model: 'F-150 Lightning',  trimNote: '',              yr1: 78, yr2: 70, yr3: 62, yr5: 50, yr7: 40, category: 'good',      notes: 'Truck segment EV premium holds well' },
  { make: 'Hyundai',    model: 'IONIQ 6',          trimNote: '',              yr1: 74, yr2: 66, yr3: 59, yr5: 47, yr7: 38, category: 'good',      notes: 'Strong range + efficiency awards support resale' },
  { make: 'Hyundai',    model: 'IONIQ 5',          trimNote: '',              yr1: 73, yr2: 65, yr3: 58, yr5: 46, yr7: 37, category: 'good',      notes: 'Iconic design and long range hold value well' },
  { make: 'Kia',        model: 'EV6',              trimNote: '',              yr1: 72, yr2: 64, yr3: 57, yr5: 45, yr7: 36, category: 'good',      notes: 'Award-winning design; strong used demand' },
  { make: 'BMW',        model: 'i4',               trimNote: '',              yr1: 72, yr2: 63, yr3: 56, yr5: 44, yr7: 35, category: 'good',      notes: 'Premium brand cushions initial drop' },
  { make: 'Volkswagen', model: 'ID.4',             trimNote: '',              yr1: 70, yr2: 62, yr3: 55, yr5: 43, yr7: 34, category: 'good',      notes: 'Reliable German brand perception' },
  { make: 'Ford',       model: 'Mustang Mach-E',   trimNote: '',              yr1: 68, yr2: 59, yr3: 52, yr5: 41, yr7: 33, category: 'average',   notes: 'Decent but trails Tesla/Hyundai' },
  { make: 'Chevrolet',  model: 'Blazer EV',        trimNote: '',              yr1: 66, yr2: 58, yr3: 51, yr5: 40, yr7: 32, category: 'average',   notes: 'Competitive segment reduces premium' },
  { make: 'Chevrolet',  model: 'Equinox EV',       trimNote: '',              yr1: 65, yr2: 57, yr3: 50, yr5: 39, yr7: 31, category: 'average',   notes: 'Affordable entry keeps resale moderate' },
  { make: 'Tesla',      model: 'Model S',          trimNote: '',              yr1: 70, yr2: 60, yr3: 52, yr5: 40, yr7: 30, category: 'average',   notes: 'Early rapid depreciation; recovers mid-life' },
  { make: 'Tesla',      model: 'Model X',          trimNote: '',              yr1: 69, yr2: 59, yr3: 51, yr5: 39, yr7: 30, category: 'average',   notes: 'High MSRP inflates % loss on dollar basis' },
  { make: 'Chevrolet',  model: 'Bolt EV',          trimNote: '',              yr1: 60, yr2: 51, yr3: 44, yr5: 33, yr7: 25, category: 'poor',      notes: 'Two recalls and production end hurt resale' },
  { make: 'Nissan',     model: 'LEAF',             trimNote: '40 kWh',        yr1: 58, yr2: 49, yr3: 42, yr5: 31, yr7: 23, category: 'poor',      notes: 'No active thermal mgmt; battery concern suppresses value' },
  { make: 'Volkswagen', model: 'ID.4',             trimNote: '2021–2022',     yr1: 55, yr2: 46, yr3: 39, yr5: 29, yr7: 22, category: 'poor',      notes: 'Early software issues suppressed resale' },
  { make: 'Nissan',     model: 'LEAF',             trimNote: '24 kWh',        yr1: 48, yr2: 39, yr3: 32, yr5: 22, yr7: 14, category: 'very_poor', notes: 'Oldest thermal-unmanaged pack; very low residual' },
  { make: 'Audi',       model: 'e-tron',           trimNote: '2019–2021',     yr1: 52, yr2: 43, yr3: 36, yr5: 26, yr7: 18, category: 'very_poor', notes: 'Early gen; later superseded by Q8 e-tron' },
];

const CAT_LABEL: Record<string, string> = {
  excellent: 'Excellent', good: 'Good', average: 'Average', poor: 'Poor', very_poor: 'Very Poor',
};
const CAT_COLOR: Record<string, string> = {
  excellent: '#00e676', good: '#66bb6a', average: '#ffc107', poor: '#ff7043', very_poor: '#ff5252',
};

// Interpolate % at a given year (0–7)
function pctAtYear(c: DepCurve, yr: number): number {
  if (yr <= 0) return 100;
  if (yr <= 1) return 100 - (100 - c.yr1) * yr;
  if (yr <= 2) return c.yr1 - (c.yr1 - c.yr2) * (yr - 1);
  if (yr <= 3) return c.yr2 - (c.yr2 - c.yr3) * (yr - 2);
  if (yr <= 5) return c.yr3 - (c.yr3 - c.yr5) * ((yr - 3) / 2);
  return c.yr5 - (c.yr5 - c.yr7) * ((yr - 5) / 2);
}

const CURRENT_YEAR = 2026;

export default function DepreciationContent() {
  const [selCurveKey, setSelCurveKey] = useState(`${CURVES[0].make}|${CURVES[0].model}|${CURVES[0].trimNote}`);
  const [purchaseYear, setPurchaseYear] = useState(CURRENT_YEAR - 2);
  const [purchasePrice, setPurchasePrice] = useState(45000);
  const [odometer, setOdometer] = useState(24000);

  const curve = useMemo(
    () => CURVES.find(c => `${c.make}|${c.model}|${c.trimNote}` === selCurveKey) ?? CURVES[0],
    [selCurveKey],
  );

  const ageYears = CURRENT_YEAR - purchaseYear;
  const currentPct = pctAtYear(curve, ageYears);
  const currentValue = Math.round(purchasePrice * currentPct / 100);
  const totalLoss = purchasePrice - currentValue;

  // Projected values
  const projections = [0, 1, 2, 3, 5, 7].map(yr => ({
    label: purchaseYear + yr === CURRENT_YEAR ? 'Now' : `${purchaseYear + yr}`,
    yr,
    pct: Math.round(pctAtYear(curve, yr)),
    value: Math.round(purchasePrice * pctAtYear(curve, yr) / 100),
  }));

  // Chart data: year 0–7
  const chartData = Array.from({ length: 15 }, (_, i) => {
    const yr = i * 0.5;
    const pct = pctAtYear(curve, yr);
    return {
      year: yr === 0 ? 'Purchase' : `Yr ${yr}`,
      value: Math.round(purchasePrice * pct / 100),
      pct: Math.round(pct),
    };
  });

  // Best time to sell: find year where annual loss rate starts accelerating
  // Practically: before year 3 or at low-depreciation year
  const bestSellYear = curve.category === 'excellent' || curve.category === 'good' ? 3 : 2;
  const bestSellValue = Math.round(purchasePrice * pctAtYear(curve, bestSellYear) / 100);

  const color = CAT_COLOR[curve.category];

  const catPct = Math.round(currentPct);
  const healthBar = Math.max(0, Math.min(100, catPct));

  return (
    <div className="space-y-8">
      {/* ─── Inputs ────────────────────────────────────────────────────────── */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-border bg-bg-secondary p-5">
          <h2 className="font-display text-base font-bold text-text-primary">Your Vehicle</h2>
          <div>
            <label className="mb-1 block text-xs text-text-secondary">EV model</label>
            <select
              value={selCurveKey}
              onChange={e => setSelCurveKey(e.target.value)}
              className="w-full rounded border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {CURVES.map(c => {
                const k = `${c.make}|${c.model}|${c.trimNote}`;
                return <option key={k} value={k}>{c.make} {c.model}{c.trimNote ? ` (${c.trimNote})` : ''}</option>;
              })}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-secondary">Year purchased</label>
            <select
              value={purchaseYear}
              onChange={e => setPurchaseYear(Number(e.target.value))}
              className="w-full rounded border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-4 rounded-lg border border-border bg-bg-secondary p-5">
          <h2 className="font-display text-base font-bold text-text-primary">Purchase Details</h2>
          <div>
            <label className="mb-1 block text-xs text-text-secondary">Purchase price ($)</label>
            <input
              type="number" min={10000} max={200000} step={500}
              value={purchasePrice}
              onChange={e => setPurchasePrice(Number(e.target.value))}
              className="w-full rounded border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-secondary">Current odometer (miles)</label>
            <input
              type="number" min={0} max={300000} step={1000}
              value={odometer}
              onChange={e => setOdometer(Number(e.target.value))}
              className="w-full rounded border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>
      </div>

      {/* ─── Current value summary ─────────────────────────────────────────── */}
      <div className="rounded-lg border border-border bg-bg-secondary p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm text-text-secondary">Estimated current value</div>
            <div className="font-display text-3xl font-bold" style={{ color }}>
              ${currentValue.toLocaleString()}
            </div>
            <div className="mt-1 text-sm text-text-secondary">
              {catPct}% of original · ${totalLoss.toLocaleString()} depreciated in {ageYears} {ageYears === 1 ? 'year' : 'years'}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-bg-tertiary px-4 py-2 text-center">
            <div className="text-xs text-text-tertiary">Depreciation category</div>
            <div className="mt-1 font-bold" style={{ color }}>{CAT_LABEL[curve.category]}</div>
            <div className="mt-0.5 text-xs text-text-tertiary">{curve.notes}</div>
          </div>
        </div>
        {/* Value bar */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-bg-tertiary">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${healthBar}%`, background: color }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-text-tertiary">
          <span>$0</span>
          <span>${purchasePrice.toLocaleString()} (original)</span>
        </div>
      </div>

      {/* ─── Depreciation chart ───────────────────────────────────────────── */}
      <div>
        <h2 className="mb-4 font-display text-base font-bold text-text-primary">
          Value Over Time — {curve.make} {curve.model}
        </h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="year" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} interval={1} />
              <YAxis
                tickFormatter={v => '$' + (v >= 1000 ? Math.round(v / 1000) + 'k' : v)}
                tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
                width={52}
                domain={[0, purchasePrice * 1.05]}
              />
              <Tooltip
                contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 6 }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                formatter={(value) => ['$' + Number(value ?? 0).toLocaleString(), 'Est. value']}
              />
              <ReferenceLine
                x={ageYears <= 7 ? `Yr ${ageYears}` : 'Yr 7'}
                stroke="var(--accent)"
                strokeDasharray="4 3"
                label={{ value: 'Now', fill: 'var(--accent)', fontSize: 10 }}
              />
              <Line
                type="monotone" dataKey="value" stroke={color}
                strokeWidth={2} dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── Projection table ─────────────────────────────────────────────── */}
      <div>
        <h2 className="mb-3 font-display text-base font-bold text-text-primary">Value Projections</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-tertiary text-xs text-text-secondary">
                <th className="px-4 py-3 text-left">Year</th>
                <th className="px-4 py-3 text-right">Est. Value</th>
                <th className="px-4 py-3 text-right">% Retained</th>
                <th className="px-4 py-3 text-right">Total Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projections.map(p => {
                const isNow = purchaseYear + p.yr === CURRENT_YEAR;
                return (
                  <tr key={p.yr} className={isNow ? 'bg-accent/5' : 'text-text-primary'}>
                    <td className="px-4 py-3">
                      {p.label}
                      {isNow && <span className="ml-2 rounded-full bg-accent/20 px-1.5 py-0.5 text-xs text-accent">Now</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold" style={{ color: isNow ? color : undefined }}>
                      ${p.value.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-text-secondary">{p.pct}%</td>
                    <td className="px-4 py-3 text-right font-mono text-red-400">
                      −${(purchasePrice - p.value).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Best time to sell ────────────────────────────────────────────── */}
      <div className="rounded-lg border border-border bg-bg-secondary p-5">
        <h2 className="mb-2 font-display text-base font-bold text-text-primary">Best Time to Sell</h2>
        <p className="text-sm text-text-secondary">
          For the <strong className="text-text-primary">{curve.make} {curve.model}</strong>,
          the optimal sell window is typically around{' '}
          <strong className="text-text-primary">year {bestSellYear}</strong>, when you can expect roughly{' '}
          <strong style={{ color }}>
            ${bestSellValue.toLocaleString()} ({Math.round(pctAtYear(curve, bestSellYear))}% of purchase price)
          </strong>
          . After this point, depreciation accelerates and the remaining value drop outpaces any remaining benefit of ownership.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            { name: 'Get a Carvana offer', url: 'https://www.carvana.com/sell-my-car' },
            { name: 'KBB Instant Cash Offer', url: 'https://www.kbb.com/sell-my-car/' },
            { name: 'CarMax appraisal', url: 'https://www.carmax.com/sell-my-car' },
          ].map(({ name, url }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-2 text-sm font-medium text-accent hover:border-accent/60"
            >
              {name} →
            </a>
          ))}
        </div>
      </div>

      <p className="text-xs text-text-tertiary">
        Depreciation estimates based on iSeeCars and CarEdge published EV depreciation studies. Actual resale value
        depends on vehicle condition, local market demand, battery health, and current inventory levels. Odometer reading
        used for reference only — time-based curves are the primary model.
      </p>
    </div>
  );
}
