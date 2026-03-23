'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { DegradationProjection } from '@/lib/calculations/degradation';

interface DegradationCurveProps {
  projections: DegradationProjection[];
  currentYear?: number;
  showRange?: boolean;
  className?: string;
}

function healthColor(pct: number): string {
  if (pct >= 90) return 'var(--range-full)';
  if (pct >= 80) return 'var(--range-good)';
  if (pct >= 75) return 'var(--range-caution)';
  return 'var(--range-low)';
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
  dataKey: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: number;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-lg border px-3 py-2 shadow-lg"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border)',
      }}
    >
      <p className="mb-1 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
        Year {label}
      </p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.dataKey === 'healthPercent' ? `${entry.value}%` : `${entry.value} mi`}
        </p>
      ))}
    </div>
  );
}

export function DegradationCurve({
  projections,
  currentYear,
  showRange = true,
  className = '',
}: DegradationCurveProps) {
  if (!projections.length) return null;

  const hasRangeData = showRange && projections.some((p) => p.estimatedRangeMi !== null);

  return (
    <div className={`h-[350px] w-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={projections}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" opacity={0.5} />
          <XAxis
            dataKey="year"
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            label={{
              value: 'Years',
              position: 'insideBottomRight',
              offset: -5,
              fill: 'var(--text-tertiary)',
              fontSize: 11,
            }}
          />
          <YAxis
            yAxisId="health"
            domain={[65, 100]}
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            label={{
              value: 'Health %',
              angle: -90,
              position: 'insideLeft',
              fill: 'var(--text-tertiary)',
              fontSize: 11,
            }}
          />
          {hasRangeData && (
            <YAxis
              yAxisId="range"
              orientation="right"
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              label={{
                value: 'Range (mi)',
                angle: 90,
                position: 'insideRight',
                fill: 'var(--text-tertiary)',
                fontSize: 11,
              }}
            />
          )}
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />

          {/* 80% warranty threshold line */}
          <ReferenceLine
            yAxisId="health"
            y={80}
            stroke="var(--range-caution)"
            strokeDasharray="6 3"
            label={{
              value: '80% warranty',
              position: 'insideTopLeft',
              fill: 'var(--range-caution)',
              fontSize: 10,
            }}
          />

          {/* Current year marker */}
          {currentYear !== undefined && (
            <ReferenceLine
              x={currentYear}
              stroke="var(--accent)"
              strokeDasharray="4 4"
              label={{
                value: 'Now',
                position: 'top',
                fill: 'var(--accent)',
                fontSize: 10,
              }}
            />
          )}

          <Line
            yAxisId="health"
            type="monotone"
            dataKey="healthPercent"
            name="Battery Health"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={(props) => {
              const { cx, cy, payload } = props as { cx?: number; cy?: number; payload?: DegradationProjection };
              if (cx == null || cy == null || !payload) return <circle r={0} />;
              return (
                <circle
                  key={payload.year}
                  cx={cx}
                  cy={cy}
                  r={3}
                  fill={healthColor(payload.healthPercent)}
                  stroke="none"
                />
              );
            }}
            activeDot={{ r: 5, stroke: 'var(--accent)', strokeWidth: 2, fill: 'var(--bg-primary)' }}
          />

          {hasRangeData && (
            <Line
              yAxisId="range"
              type="monotone"
              dataKey="estimatedRangeMi"
              name="Estimated Range"
              stroke="#448aff"
              strokeWidth={2}
              strokeDasharray="5 3"
              dot={false}
              activeDot={{ r: 4, stroke: '#448aff', strokeWidth: 2, fill: 'var(--bg-primary)' }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
