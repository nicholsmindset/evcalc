'use client';

import { useMemo } from 'react';

interface RangeGaugeProps {
  adjustedRange: number;
  epaRange: number;
  pctOfEpa: number;
}

function getRangeColor(pct: number): string {
  if (pct >= 80) return 'var(--range-full)';
  if (pct >= 50) return 'var(--range-good)';
  if (pct >= 20) return 'var(--range-caution)';
  return 'var(--range-low)';
}

export function RangeGauge({ adjustedRange, epaRange, pctOfEpa }: RangeGaugeProps) {
  const size = 280;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Gauge shows 270° arc (not full circle)
  const arcLength = circumference * 0.75;
  const fillPct = Math.min(Math.max(pctOfEpa / 100, 0), 1.2); // Allow slight over 100%
  const fillLength = arcLength * Math.min(fillPct, 1);
  const dashOffset = arcLength - fillLength;

  const color = useMemo(() => getRangeColor(pctOfEpa), [pctOfEpa]);
  const diff = adjustedRange - epaRange;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform rotate-[135deg]"
        >
          {/* Background arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Fill arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${color})`,
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono text-6xl font-bold transition-colors duration-300 animate-count-up"
            style={{ color }}
            key={adjustedRange}
          >
            {adjustedRange}
          </span>
          <span className="mt-1 text-sm text-text-secondary">miles estimated</span>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="text-xs text-text-tertiary">EPA {epaRange} mi</span>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-semibold"
              style={{
                color,
                backgroundColor: `${color}15`,
              }}
            >
              {diff >= 0 ? '+' : ''}{diff} mi
            </span>
          </div>
        </div>
      </div>

      {/* Percentage bar */}
      <div className="mt-4 w-full max-w-[280px]">
        <div className="flex items-center justify-between text-xs text-text-tertiary">
          <span>0%</span>
          <span className="font-semibold" style={{ color }}>
            {pctOfEpa}% of EPA
          </span>
          <span>120%</span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${Math.min(pctOfEpa / 1.2, 100)}%`,
              backgroundColor: color,
              boxShadow: `0 0 8px ${color}40`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
