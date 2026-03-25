'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface EVSpec {
  slug: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  msrp: number;
  epaRange: number;
  batteryKwh: number;
  dcFastMaxKw: number;
  cargoVolume: number; // cu ft
  seating: number;
  vehicleClass: 'sedan' | 'suv' | 'truck' | 'van' | 'hatchback';
  acceleration0to60: number; // seconds
  techScore: number; // 1-10
  federalCredit: number;
}

// Static EV dataset — normalized 0-1 per dimension for scoring
const EVS: EVSpec[] = [
  { slug: 'tesla-model-3-long-range-2024', make: 'Tesla', model: 'Model 3', year: 2024, trim: 'Long Range', msrp: 42990, epaRange: 358, batteryKwh: 82, dcFastMaxKw: 170, cargoVolume: 15, seating: 5, vehicleClass: 'sedan', acceleration0to60: 4.2, techScore: 9, federalCredit: 0 },
  { slug: 'tesla-model-y-long-range-2024', make: 'Tesla', model: 'Model Y', year: 2024, trim: 'Long Range', msrp: 47990, epaRange: 330, batteryKwh: 82, dcFastMaxKw: 250, cargoVolume: 76, seating: 5, vehicleClass: 'suv', acceleration0to60: 4.8, techScore: 9, federalCredit: 7500 },
  { slug: 'hyundai-ioniq-6-long-range-2024', make: 'Hyundai', model: 'IONIQ 6', year: 2024, trim: 'Long Range RWD', msrp: 38615, epaRange: 361, batteryKwh: 77.4, dcFastMaxKw: 350, cargoVolume: 12, seating: 5, vehicleClass: 'sedan', acceleration0to60: 5.1, techScore: 8, federalCredit: 7500 },
  { slug: 'hyundai-ioniq-5-long-range-2024', make: 'Hyundai', model: 'IONIQ 5', year: 2024, trim: 'Long Range AWD', msrp: 44900, epaRange: 266, batteryKwh: 77.4, dcFastMaxKw: 350, cargoVolume: 27, seating: 5, vehicleClass: 'suv', acceleration0to60: 5.1, techScore: 8, federalCredit: 7500 },
  { slug: 'ford-f150-lightning-extended-2024', make: 'Ford', model: 'F-150 Lightning', year: 2024, trim: 'Extended Range', msrp: 67474, epaRange: 320, batteryKwh: 131, dcFastMaxKw: 150, cargoVolume: 100, seating: 5, vehicleClass: 'truck', acceleration0to60: 4.0, techScore: 7, federalCredit: 7500 },
  { slug: 'rivian-r1t-standard-2024', make: 'Rivian', model: 'R1T', year: 2024, trim: 'Standard', msrp: 70000, epaRange: 270, batteryKwh: 135, dcFastMaxKw: 220, cargoVolume: 110, seating: 5, vehicleClass: 'truck', acceleration0to60: 3.0, techScore: 9, federalCredit: 0 },
  { slug: 'chevrolet-equinox-ev-2024', make: 'Chevrolet', model: 'Equinox EV', year: 2024, trim: 'LT', msrp: 34995, epaRange: 319, batteryKwh: 82, dcFastMaxKw: 150, cargoVolume: 57, seating: 5, vehicleClass: 'suv', acceleration0to60: 6.3, techScore: 6, federalCredit: 7500 },
  { slug: 'kia-ev6-long-range-2024', make: 'Kia', model: 'EV6', year: 2024, trim: 'Long Range RWD', msrp: 42600, epaRange: 310, batteryKwh: 77.4, dcFastMaxKw: 350, cargoVolume: 24, seating: 5, vehicleClass: 'suv', acceleration0to60: 5.1, techScore: 8, federalCredit: 7500 },
  { slug: 'volkswagen-id4-pro-2024', make: 'Volkswagen', model: 'ID.4', year: 2024, trim: 'Pro', msrp: 38995, epaRange: 291, batteryKwh: 82, dcFastMaxKw: 135, cargoVolume: 30, seating: 5, vehicleClass: 'suv', acceleration0to60: 5.7, techScore: 6, federalCredit: 7500 },
  { slug: 'tesla-model-x-2024', make: 'Tesla', model: 'Model X', year: 2024, trim: 'Base', msrp: 79990, epaRange: 335, batteryKwh: 100, dcFastMaxKw: 250, cargoVolume: 91, seating: 7, vehicleClass: 'suv', acceleration0to60: 3.9, techScore: 10, federalCredit: 0 },
  { slug: 'rivian-r1s-standard-2024', make: 'Rivian', model: 'R1S', year: 2024, trim: 'Standard', msrp: 75900, epaRange: 260, batteryKwh: 135, dcFastMaxKw: 220, cargoVolume: 105, seating: 7, vehicleClass: 'suv', acceleration0to60: 3.0, techScore: 9, federalCredit: 0 },
  { slug: 'nissan-leaf-2024', make: 'Nissan', model: 'LEAF', year: 2024, trim: 'Plus SV', msrp: 34040, epaRange: 212, batteryKwh: 62, dcFastMaxKw: 100, cargoVolume: 24, seating: 5, vehicleClass: 'hatchback', acceleration0to60: 6.5, techScore: 5, federalCredit: 7500 },
  { slug: 'chevrolet-blazer-ev-2024', make: 'Chevrolet', model: 'Blazer EV', year: 2024, trim: 'RS AWD', msrp: 51995, epaRange: 279, batteryKwh: 85, dcFastMaxKw: 190, cargoVolume: 65, seating: 5, vehicleClass: 'suv', acceleration0to60: 4.5, techScore: 7, federalCredit: 0 },
  { slug: 'bmw-i4-m50-2024', make: 'BMW', model: 'i4', year: 2024, trim: 'M50', msrp: 72800, epaRange: 227, batteryKwh: 83.9, dcFastMaxKw: 210, cargoVolume: 15, seating: 5, vehicleClass: 'sedan', acceleration0to60: 3.7, techScore: 9, federalCredit: 0 },
  { slug: 'mercedes-eqb-2024', make: 'Mercedes-Benz', model: 'EQB', year: 2024, trim: '350 4MATIC', msrp: 56050, epaRange: 243, batteryKwh: 70.5, dcFastMaxKw: 100, cargoVolume: 62, seating: 7, vehicleClass: 'suv', acceleration0to60: 6.2, techScore: 8, federalCredit: 0 },
];

const VEHICLE_CLASSES = ['All', 'sedan', 'suv', 'truck', 'hatchback'] as const;
type VehicleClassFilter = typeof VEHICLE_CLASSES[number];

// Compute min/max for normalization
const ranges = {
  range: { min: Math.min(...EVS.map(e => e.epaRange)), max: Math.max(...EVS.map(e => e.epaRange)) },
  msrp: { min: Math.min(...EVS.map(e => e.msrp)), max: Math.max(...EVS.map(e => e.msrp)) },
  cargo: { min: Math.min(...EVS.map(e => e.cargoVolume)), max: Math.max(...EVS.map(e => e.cargoVolume)) },
  dcFast: { min: Math.min(...EVS.map(e => e.dcFastMaxKw)), max: Math.max(...EVS.map(e => e.dcFastMaxKw)) },
  accel: { min: Math.min(...EVS.map(e => e.acceleration0to60)), max: Math.max(...EVS.map(e => e.acceleration0to60)) },
  tech: { min: 1, max: 10 },
};

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return (value - min) / (max - min);
}

function scoreEV(ev: EVSpec, weights: Weights, maxBudget: number): number {
  if (ev.msrp - ev.federalCredit > maxBudget) return -1; // filter out

  const rangeScore = normalize(ev.epaRange, ranges.range.min, ranges.range.max);
  const budgetScore = 1 - normalize(ev.msrp - ev.federalCredit, ranges.msrp.min - 7500, ranges.msrp.max);
  const cargoScore = normalize(ev.cargoVolume, ranges.cargo.min, ranges.cargo.max);
  const chargingScore = normalize(ev.dcFastMaxKw, ranges.dcFast.min, ranges.dcFast.max);
  const perfScore = 1 - normalize(ev.acceleration0to60, ranges.accel.min, ranges.accel.max);
  const techScore = normalize(ev.techScore, ranges.tech.min, ranges.tech.max);

  const totalWeight = weights.range + weights.budget + weights.cargo + weights.charging + weights.performance + weights.tech;
  if (totalWeight === 0) return 0;

  return (
    (rangeScore * weights.range +
      budgetScore * weights.budget +
      cargoScore * weights.cargo +
      chargingScore * weights.charging +
      perfScore * weights.performance +
      techScore * weights.tech) /
    totalWeight
  );
}

function whyBest(ev: EVSpec, weights: Weights): string[] {
  const reasons: string[] = [];
  if (weights.range >= 7 && ev.epaRange >= 310) reasons.push(`Outstanding ${ev.epaRange}-mile range`);
  if (weights.budget >= 7 && ev.msrp - ev.federalCredit < 35000) reasons.push('Excellent value after incentives');
  if (weights.cargo >= 7 && ev.cargoVolume >= 60) reasons.push(`${ev.cargoVolume} cu ft of cargo space`);
  if (weights.charging >= 7 && ev.dcFastMaxKw >= 250) reasons.push(`Ultra-fast ${ev.dcFastMaxKw} kW charging`);
  if (weights.performance >= 7 && ev.acceleration0to60 <= 4.0) reasons.push(`${ev.acceleration0to60}s 0–60 performance`);
  if (weights.tech >= 7 && ev.techScore >= 9) reasons.push('Best-in-class tech & software');
  if (ev.seating >= 7) reasons.push(`${ev.seating}-passenger seating`);
  if (ev.federalCredit > 0) reasons.push(`$${ev.federalCredit.toLocaleString()} federal credit`);
  return reasons.slice(0, 3);
}

interface Weights {
  range: number;
  budget: number;
  cargo: number;
  charging: number;
  performance: number;
  tech: number;
}

const WEIGHT_LABELS: Record<keyof Weights, string> = {
  range: 'Long Range',
  budget: 'Best Value',
  cargo: 'Cargo Space',
  charging: 'Fast Charging',
  performance: 'Performance',
  tech: 'Tech & Luxury',
};

const WEIGHT_ICONS: Record<keyof Weights, string> = {
  range: '🔋',
  budget: '💰',
  cargo: '📦',
  charging: '⚡',
  performance: '🚀',
  tech: '🎛️',
};

const BUDGET_PRESETS = [40000, 50000, 60000, 75000, 100000];

export default function RecommendationContent() {
  const [weights, setWeights] = useState<Weights>({
    range: 5,
    budget: 5,
    cargo: 3,
    charging: 5,
    performance: 5,
    tech: 5,
  });
  const [maxBudget, setMaxBudget] = useState(60000);
  const [classFilter, setClassFilter] = useState<VehicleClassFilter>('All');
  const [hasSearched, setHasSearched] = useState(false);

  const results = useMemo(() => {
    if (!hasSearched) return [];
    return EVS
      .filter(ev => classFilter === 'All' || ev.vehicleClass === classFilter)
      .map(ev => ({ ev, score: scoreEV(ev, weights, maxBudget) }))
      .filter(r => r.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [weights, maxBudget, classFilter, hasSearched]);

  const handleFind = () => setHasSearched(true);

  return (
    <div>
      {/* Sliders */}
      <div className="mb-8 rounded-2xl border border-border bg-bg-secondary p-6">
        <h2 className="mb-5 font-display text-lg font-bold text-text-primary">
          What matters most to you?
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {(Object.keys(weights) as Array<keyof Weights>).map((key) => (
            <div key={key}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary">
                  {WEIGHT_ICONS[key]} {WEIGHT_LABELS[key]}
                </span>
                <span className="font-mono text-xs text-text-tertiary">{weights[key]}/10</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={weights[key]}
                onChange={(e) =>
                  setWeights((prev) => ({ ...prev, [key]: Number(e.target.value) }))
                }
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-accent"
              />
              <div className="mt-0.5 flex justify-between text-[10px] text-text-tertiary">
                <span>Not important</span>
                <span>Critical</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget + Filter Row */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {/* Budget */}
        <div className="rounded-xl border border-border bg-bg-secondary p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">Max Budget</span>
            <span className="font-mono text-sm text-accent">${maxBudget.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={25000}
            max={120000}
            step={1000}
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-accent"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {BUDGET_PRESETS.map((b) => (
              <button
                key={b}
                onClick={() => setMaxBudget(b)}
                className={`rounded-full px-2.5 py-0.5 text-xs transition-colors ${
                  maxBudget === b
                    ? 'bg-accent/20 text-accent border border-accent/30'
                    : 'border border-border bg-bg-tertiary text-text-secondary hover:border-accent/30 hover:text-accent'
                }`}
              >
                ${(b / 1000).toFixed(0)}k
              </button>
            ))}
          </div>
        </div>

        {/* Class filter */}
        <div className="rounded-xl border border-border bg-bg-secondary p-4">
          <div className="mb-2 text-sm font-medium text-text-primary">Vehicle Type</div>
          <div className="flex flex-wrap gap-1.5">
            {VEHICLE_CLASSES.map((cls) => (
              <button
                key={cls}
                onClick={() => setClassFilter(cls)}
                className={`rounded-full px-3 py-1 text-xs capitalize transition-colors ${
                  classFilter === cls
                    ? 'bg-accent/20 text-accent border border-accent/30'
                    : 'border border-border bg-bg-tertiary text-text-secondary hover:border-accent/30 hover:text-accent'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleFind}
        className="mb-8 w-full rounded-xl bg-accent py-3.5 font-display text-base font-bold text-bg-primary transition-opacity hover:opacity-90"
      >
        Find My Perfect EV
      </button>

      {/* Results */}
      {hasSearched && (
        <div>
          {results.length === 0 ? (
            <div className="rounded-xl border border-border bg-bg-secondary p-8 text-center text-text-secondary">
              No EVs found in that budget + type combination. Try raising your budget or selecting &quot;All&quot; types.
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold text-text-primary">
                Your Top {results.length} Matches
              </h2>
              {results.map(({ ev, score }, i) => {
                const pct = Math.round(score * 100);
                const reasons = whyBest(ev, weights);
                const netPrice = ev.msrp - ev.federalCredit;

                return (
                  <div
                    key={ev.slug}
                    className={`rounded-2xl border bg-bg-secondary p-5 transition-all ${
                      i === 0
                        ? 'border-accent/40 shadow-lg shadow-accent/5'
                        : 'border-border'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Rank */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          i === 0
                            ? 'bg-accent/20 text-accent'
                            : 'bg-bg-tertiary text-text-secondary'
                        }`}
                      >
                        #{i + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display font-semibold text-text-primary">
                            {ev.year} {ev.make} {ev.model} {ev.trim}
                          </h3>
                          {i === 0 && (
                            <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-semibold text-accent">
                              Best Match
                            </span>
                          )}
                          {ev.federalCredit > 0 && (
                            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-text-secondary">
                              ${ev.federalCredit.toLocaleString()} credit
                            </span>
                          )}
                        </div>

                        {/* Match bar */}
                        <div className="mt-2 flex items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-tertiary">
                            <div
                              className="h-full rounded-full bg-accent transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="shrink-0 font-mono text-sm font-bold text-accent">
                            {pct}% match
                          </span>
                        </div>

                        {/* Key stats */}
                        <div className="mt-3 flex flex-wrap gap-4 text-sm">
                          <span className="text-text-secondary">
                            <span className="font-semibold text-text-primary">{ev.epaRange} mi</span> range
                          </span>
                          <span className="text-text-secondary">
                            <span className="font-semibold text-text-primary">${netPrice.toLocaleString()}</span> net
                          </span>
                          <span className="text-text-secondary">
                            <span className="font-semibold text-text-primary">{ev.dcFastMaxKw} kW</span> DC fast
                          </span>
                          <span className="text-text-secondary">
                            <span className="font-semibold text-text-primary">{ev.acceleration0to60}s</span> 0–60
                          </span>
                        </div>

                        {/* Why this matches */}
                        {reasons.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {reasons.map((r) => (
                              <span
                                key={r}
                                className="rounded-full bg-bg-tertiary px-2.5 py-0.5 text-xs text-text-secondary"
                              >
                                ✓ {r}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-3 flex gap-3">
                          <Link
                            href={`/vehicles/${ev.slug}`}
                            className="text-sm text-accent hover:underline"
                          >
                            Full specs →
                          </Link>
                          <Link
                            href={`/can-i-afford-an-ev`}
                            className="text-sm text-text-secondary hover:text-text-primary"
                          >
                            Can I afford it?
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Compare CTA */}
              {results.length >= 2 && (
                <div className="rounded-xl border border-border bg-bg-secondary p-4 text-center">
                  <p className="mb-2 text-sm text-text-secondary">
                    Want to dig deeper?
                  </p>
                  <Link
                    href={`/compare/${results[0].ev.slug}-vs-${results[1].ev.slug}`}
                    className="text-sm font-medium text-accent hover:underline"
                  >
                    Compare #{1} vs #{2} side by side →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
