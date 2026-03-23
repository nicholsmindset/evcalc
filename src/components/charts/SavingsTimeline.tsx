'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface TimelineData {
  year: number;
  evTotalCumulative: number;
  gasTotalCumulative: number;
  cumulativeSavings: number;
}

interface SavingsTimelineProps {
  data: TimelineData[];
  breakEvenYear?: number | null;
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: number;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-bg-secondary px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-medium text-text-tertiary">Year {label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-text-secondary">{entry.name}:</span>
          <span className="font-mono text-xs font-semibold text-text-primary">
            ${entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export function SavingsTimeline({ data, breakEvenYear }: SavingsTimelineProps) {
  return (
    <div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="gasGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--range-low)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--range-low)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="evGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.5}
            />
            <XAxis
              dataKey="year"
              stroke="var(--text-tertiary)"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              tickFormatter={(v) => `Yr ${v}`}
            />
            <YAxis
              stroke="var(--text-tertiary)"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />

            {breakEvenYear && (
              <ReferenceLine
                x={breakEvenYear}
                stroke="var(--warning)"
                strokeDasharray="4 4"
                label={{
                  value: 'Break Even',
                  position: 'top',
                  style: { fill: 'var(--warning)', fontSize: 10 },
                }}
              />
            )}

            <Area
              type="monotone"
              dataKey="gasTotalCumulative"
              name="Gas Total"
              stroke="var(--range-low)"
              strokeWidth={2}
              fill="url(#gasGradient)"
            />
            <Area
              type="monotone"
              dataKey="evTotalCumulative"
              name="EV Total"
              stroke="var(--accent)"
              strokeWidth={2}
              fill="url(#evGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Savings summary below chart */}
      {data.length > 0 && (
        <div className="mt-3 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-6 rounded-full bg-accent" />
            <span className="text-text-secondary">EV Running Cost</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-6 rounded-full bg-range-low" />
            <span className="text-text-secondary">Gas Running Cost</span>
          </div>
        </div>
      )}
    </div>
  );
}
