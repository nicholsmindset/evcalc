'use client';

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface DegradationCurve {
  modelGroup: string;
  annualPct: number;
  warrantyYears: number;
  warrantyMiles: number;
  warrantyThresholdPct: number;
  chemistry: string;
}

const CURVES: DegradationCurve[] = [
  { modelGroup: 'Tesla Model 3/Y', annualPct: 2.0, warrantyYears: 8, warrantyMiles: 120000, warrantyThresholdPct: 70, chemistry: 'NMC' },
  { modelGroup: 'Tesla Model S/X', annualPct: 1.9, warrantyYears: 8, warrantyMiles: 150000, warrantyThresholdPct: 70, chemistry: 'NMC' },
  { modelGroup: 'Tesla Cybertruck', annualPct: 1.8, warrantyYears: 8, warrantyMiles: 120000, warrantyThresholdPct: 70, chemistry: 'NMC' },
  { modelGroup: 'Hyundai IONIQ 5/6', annualPct: 2.1, warrantyYears: 8, warrantyMiles: 100000, warrantyThresholdPct: 70, chemistry: 'NMC' },
  { modelGroup: 'Kia EV6/EV9', annualPct: 2.1, warrantyYears: 8, warrantyMiles: 100000, warrantyThresholdPct: 70, chemistry: 'NMC' },
  { modelGroup: 'Chevrolet Bolt', annualPct: 2.5, warrantyYears: 8, warrantyMiles: 100000, warrantyThresholdPct: 60, chemistry: 'NMC' },
  { modelGroup: 'Chevrolet Equinox EV', annualPct: 2.0, warrantyYears: 8, warrantyMiles: 100000, warrantyThresholdPct: 70, chemistry: 'NMC' },
  { modelGroup: 'Ford F-150 Lightning', annualPct: 2.2, warrantyYears: 8, warrantyMiles: 100000, warrantyThresholdPct: 70, chemistry: 'NMC' },
  { modelGroup: 'Ford Mustang Mach-E', annualPct: 2.2, warrantyYears: 8, warrantyMiles: 100000, warrantyThresholdPct: 70, chemistry: 'NMC' },
  { modelGroup: 'Rivian R1T/R1S', annualPct: 2.0, warrantyYears: 8, warrantyMiles: 175000, warrantyThresholdPct: 70, chemistry: 'NMC' },
  { modelGroup: 'Volkswagen ID.4', annualPct: 2.3, warrantyYears: 8, warrantyMiles: 100000, warrantyThresholdPct: 70, chemistry: 'NMC' },
  { modelGroup: 'BMW i3/i4', annualPct: 2.1, warrantyYears: 8, warrantyMiles: 100000, warrantyThresholdPct: 70, chemistry: 'NMC' },
  { modelGroup: 'Nissan LEAF (30/40 kWh)', annualPct: 4.2, warrantyYears: 8, warrantyMiles: 100000, warrantyThresholdPct: 75, chemistry: 'LMO' },
  { modelGroup: 'Nissan LEAF Plus (62 kWh)', annualPct: 2.8, warrantyYears: 8, warrantyMiles: 100000, warrantyThresholdPct: 75, chemistry: 'NMC' },
  { modelGroup: 'Audi e-tron/Q8 e-tron', annualPct: 2.0, warrantyYears: 8, warrantyMiles: 100000, warrantyThresholdPct: 70, chemistry: 'NMC' },
  { modelGroup: 'Mercedes EQS/EQB', annualPct: 1.9, warrantyYears: 10, warrantyMiles: 155000, warrantyThresholdPct: 70, chemistry: 'NMC' },
  { modelGroup: 'GMC Hummer EV', annualPct: 2.0, warrantyYears: 8, warrantyMiles: 100000, warrantyThresholdPct: 70, chemistry: 'NMC' },
  { modelGroup: 'Lucid Air', annualPct: 1.7, warrantyYears: 8, warrantyMiles: 150000, warrantyThresholdPct: 70, chemistry: 'NMC' },
  { modelGroup: 'Polestar 2', annualPct: 2.2, warrantyYears: 8, warrantyMiles: 100000, warrantyThresholdPct: 70, chemistry: 'NMC' },
  { modelGroup: 'Genesis GV60/GV70e', annualPct: 2.1, warrantyYears: 8, warrantyMiles: 100000, warrantyThresholdPct: 70, chemistry: 'NMC' },
];

const PURCHASE_YEARS = Array.from({ length: 12 }, (_, i) => 2024 - i);
const ANNUAL_MILES_PRESETS = [7500, 10000, 12000, 15000, 20000];

// Projected health at a given age (years)
function projectedHealth(annualPct: number, ageYears: number): number {
  // Non-linear: faster early degradation, flattening over time
  // Year 1: 1.5× rate, then linear
  const earlyLoss = Math.min(ageYears, 1) * annualPct * 1.5;
  const laterLoss = Math.max(0, ageYears - 1) * annualPct;
  return Math.max(60, 100 - earlyLoss - laterLoss);
}

// Estimate current health from mileage (rough rule of thumb)
function estimateHealthFromMileage(annualPct: number, mileage: number, avgMilesPerYear = 12000): number {
  const estimatedYears = mileage / avgMilesPerYear;
  return projectedHealth(annualPct, estimatedYears);
}

export default function BatteryTrackerContent() {
  const [modelGroup, setModelGroup] = useState(CURVES[0].modelGroup);
  const [purchaseYear, setPurchaseYear] = useState(2022);
  const [mileage, setMileage] = useState(30000);
  const [annualMiles, setAnnualMiles] = useState(12000);

  const curve = CURVES.find(c => c.modelGroup === modelGroup) ?? CURVES[0];
  const currentYear = 2026;
  const ageYears = currentYear - purchaseYear;

  const estimatedHealth = useMemo(() => {
    return estimateHealthFromMileage(curve.annualPct, mileage, annualMiles);
  }, [curve, mileage, annualMiles]);

  // Is under warranty?
  const underWarranty =
    ageYears < curve.warrantyYears && mileage < curve.warrantyMiles;
  // warrantyExpiredByYear unused — use underWarranty directly

  // Projection data (0 to 15 years from purchase)
  const projectionData = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => {
      const year = purchaseYear + i;
      const health = projectedHealth(curve.annualPct, i);
      const miles = i * annualMiles;
      return {
        year,
        health: Math.round(health * 10) / 10,
        miles: Math.round(miles / 1000),
        isNow: i === ageYears,
      };
    });
  }, [curve, purchaseYear, ageYears, annualMiles]);

  // When does battery hit warranty threshold?
  const yearsToWarrantyThreshold = useMemo(() => {
    for (let y = 0; y <= 20; y++) {
      if (projectedHealth(curve.annualPct, y) <= curve.warrantyThresholdPct) return y;
    }
    return null;
  }, [curve]);

  // Health color
  const healthColor =
    estimatedHealth >= 90 ? 'text-accent' :
    estimatedHealth >= 80 ? 'text-accent' :
    estimatedHealth >= 70 ? 'text-warning' : 'text-error';

  const healthBg =
    estimatedHealth >= 90 ? 'bg-accent' :
    estimatedHealth >= 80 ? 'bg-accent' :
    estimatedHealth >= 70 ? 'bg-warning' : 'bg-error';

  return (
    <div>
      {/* Selectors */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Vehicle Model</label>
          <select
            value={modelGroup}
            onChange={(e) => setModelGroup(e.target.value)}
            className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-3 text-text-primary outline-none focus:border-accent/60"
          >
            {CURVES.map(c => (
              <option key={c.modelGroup} value={c.modelGroup}>
                {c.modelGroup} ({c.chemistry})
              </option>
            ))}
          </select>
          <div className="mt-1 text-xs text-text-tertiary">
            Avg degradation: {curve.annualPct}%/yr · Warranty: {curve.warrantyYears} yr / {curve.warrantyMiles.toLocaleString()} mi @ {curve.warrantyThresholdPct}%
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Purchase Year</label>
          <select
            value={purchaseYear}
            onChange={(e) => setPurchaseYear(Number(e.target.value))}
            className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-3 text-text-primary outline-none focus:border-accent/60"
          >
            {PURCHASE_YEARS.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <div className="mt-1 text-xs text-text-tertiary">
            Vehicle age: {ageYears} year{ageYears !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-text-primary">Current Odometer</label>
            <span className="font-mono text-sm text-accent">{mileage.toLocaleString()} mi</span>
          </div>
          <input
            type="range" min={0} max={200000} step={1000}
            value={mileage}
            onChange={(e) => setMileage(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-accent"
          />
          <div className="mt-1 flex flex-wrap gap-1.5">
            {[15000, 30000, 50000, 75000, 100000].map(m => (
              <button key={m} onClick={() => setMileage(m)}
                className="rounded-full border border-border bg-bg-tertiary px-2 py-0.5 text-xs text-text-secondary hover:border-accent/30 hover:text-accent">
                {(m / 1000).toFixed(0)}k
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-text-primary">Miles/Year</label>
            <span className="font-mono text-sm text-text-secondary">{annualMiles.toLocaleString()}</span>
          </div>
          <input
            type="range" min={3000} max={30000} step={500}
            value={annualMiles}
            onChange={(e) => setAnnualMiles(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-accent"
          />
          <div className="mt-1 flex gap-1.5">
            {ANNUAL_MILES_PRESETS.map(m => (
              <button key={m} onClick={() => setAnnualMiles(m)}
                className="rounded-full border border-border bg-bg-tertiary px-2 py-0.5 text-xs text-text-secondary hover:border-accent/30 hover:text-accent">
                {(m / 1000).toFixed(1)}k
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Health gauge */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-bg-secondary p-5 text-center">
          <div className={`font-mono text-5xl font-bold ${healthColor}`}>
            {Math.round(estimatedHealth)}%
          </div>
          <div className="mt-1 text-sm text-text-secondary">Estimated battery health</div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg-tertiary">
            <div className={`h-full rounded-full transition-all ${healthBg}`}
              style={{ width: `${estimatedHealth}%` }} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg-secondary p-5 text-center">
          <div className={`font-mono text-2xl font-bold ${underWarranty ? 'text-accent' : 'text-text-tertiary'}`}>
            {underWarranty ? 'Under' : 'Expired'}
          </div>
          <div className="mt-1 text-sm text-text-secondary">Battery warranty</div>
          <div className="mt-2 text-xs text-text-tertiary">
            {underWarranty
              ? `${curve.warrantyYears - ageYears} yr / ${(curve.warrantyMiles - mileage).toLocaleString()} mi remaining`
              : `Expired ${Math.min(ageYears - curve.warrantyYears, Math.round((mileage - curve.warrantyMiles) / annualMiles))} yr ago`}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg-secondary p-5 text-center">
          <div className="font-mono text-2xl font-bold text-text-primary">
            {yearsToWarrantyThreshold !== null
              ? `~${yearsToWarrantyThreshold} yr`
              : '15+ yr'}
          </div>
          <div className="mt-1 text-sm text-text-secondary">
            Until {curve.warrantyThresholdPct}% capacity
          </div>
          <div className="mt-2 text-xs text-text-tertiary">
            at {curve.annualPct}%/yr average degradation
          </div>
        </div>
      </div>

      {/* Degradation chart */}
      <div className="rounded-xl border border-border bg-bg-secondary p-5">
        <h2 className="mb-4 font-display text-base font-bold text-text-primary">
          Projected Battery Health Over Time
        </h2>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projectionData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[55, 105]} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: 12 }}
                formatter={(value) => [`${value ?? 0}%`, 'Battery health']}
              />
              <ReferenceLine y={curve.warrantyThresholdPct} stroke="var(--warning)" strokeDasharray="4 3"
                label={{ value: `Warranty threshold (${curve.warrantyThresholdPct}%)`, fill: 'var(--warning)', fontSize: 10 }} />
              <ReferenceLine y={80} stroke="var(--text-tertiary)" strokeDasharray="2 4"
                label={{ value: '80% (common resale benchmark)', fill: 'var(--text-tertiary)', fontSize: 10 }} />
              <Line
                type="monotone" dataKey="health" stroke="var(--accent)" strokeWidth={2}
                dot={(props) => {
                  if (props.payload.isNow) {
                    return <circle key="now" cx={props.cx} cy={props.cy} r={5} fill="var(--accent)" stroke="var(--bg-primary)" strokeWidth={2} />;
                  }
                  return <g key={props.index} />;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs text-text-tertiary">
          <span>● Current position</span>
          <span>— Projected ({curve.annualPct}%/yr)</span>
        </div>
      </div>

      {/* Degradation tips */}
      <div className="mt-6 rounded-xl border border-border bg-bg-secondary p-5">
        <h2 className="mb-3 font-display text-base font-bold text-text-primary">
          How to Slow Battery Degradation
        </h2>
        <ul className="space-y-2 text-sm text-text-secondary">
          {[
            'Keep daily charge between 20–80% for regular driving (only charge to 100% for long trips)',
            'Avoid frequent DC fast charging if possible — Level 2 home charging is gentler on cells',
            'Don\'t let battery sit at 0% for extended periods',
            'Park in a garage when temperatures are extreme (hot or cold)',
            'Use preconditioning in winter while plugged in — not on battery power',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-0.5 text-accent">✓</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <p className="mt-4 text-xs text-text-tertiary">
        Estimates based on fleet degradation studies (Geotab 2023, Recurrent 2024). Actual results vary
        significantly by climate, charging habits, and individual battery variation. This is not a warranty assessment.
      </p>
    </div>
  );
}
