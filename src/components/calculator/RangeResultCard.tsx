'use client';

import type { FactorBreakdown } from '@/lib/calculations/range';

interface RangeResultCardProps {
  factorBreakdown: FactorBreakdown[];
  adjustedRangeMi: number;
  adjustedRangeKm: number;
  epaRange: number;
}

function getImpactColor(impact: number): string {
  if (impact > 0.02) return 'text-range-full';
  if (impact > -0.02) return 'text-text-secondary';
  if (impact > -0.10) return 'text-range-caution';
  return 'text-range-low';
}

function ImpactBar({ impact, maxImpact }: { impact: number; maxImpact: number }) {
  const pct = Math.abs(impact) / maxImpact * 100;
  const isPositive = impact > 0;

  return (
    <div className="flex h-1.5 w-full items-center">
      {/* Negative side */}
      <div className="flex h-full w-1/2 justify-end">
        {!isPositive && (
          <div
            className="h-full rounded-l-full bg-range-low/60 transition-all duration-500"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        )}
      </div>
      {/* Center line */}
      <div className="h-3 w-px bg-border" />
      {/* Positive side */}
      <div className="flex h-full w-1/2">
        {isPositive && (
          <div
            className="h-full rounded-r-full bg-range-full/60 transition-all duration-500"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        )}
      </div>
    </div>
  );
}

export function RangeResultCard({
  factorBreakdown,
  adjustedRangeMi,
  adjustedRangeKm,
  epaRange,
}: RangeResultCardProps) {
  const maxImpact = Math.max(
    ...factorBreakdown.map((f) => Math.abs(f.impact)),
    0.01,
  );

  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-6">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-display font-semibold text-text-primary">
        <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
        </svg>
        Factor Breakdown
      </h3>

      {/* Summary row */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-bg-tertiary p-3 text-center">
          <p className="text-xs text-text-tertiary">Estimated</p>
          <p className="font-mono text-xl font-bold text-accent">{adjustedRangeMi}</p>
          <p className="text-xs text-text-tertiary">miles</p>
        </div>
        <div className="rounded-lg bg-bg-tertiary p-3 text-center">
          <p className="text-xs text-text-tertiary">Estimated</p>
          <p className="font-mono text-xl font-bold text-text-primary">{adjustedRangeKm}</p>
          <p className="text-xs text-text-tertiary">km</p>
        </div>
        <div className="rounded-lg bg-bg-tertiary p-3 text-center">
          <p className="text-xs text-text-tertiary">EPA Rated</p>
          <p className="font-mono text-xl font-bold text-text-secondary">{epaRange}</p>
          <p className="text-xs text-text-tertiary">miles</p>
        </div>
      </div>

      {/* Factor list */}
      <div className="space-y-3">
        {factorBreakdown.map((factor, i) => (
          <div
            key={factor.factor}
            className="animate-fade-in-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">{factor.factor}</span>
              <span className={`font-mono text-sm font-semibold ${getImpactColor(factor.impact)}`}>
                {factor.impact >= 0 ? '+' : ''}{(factor.impact * 100).toFixed(1)}%
              </span>
            </div>
            <ImpactBar impact={factor.impact} maxImpact={maxImpact} />
            <p className="mt-0.5 text-xs text-text-tertiary">{factor.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
