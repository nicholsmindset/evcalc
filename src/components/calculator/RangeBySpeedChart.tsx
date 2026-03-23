'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface RangeBySpeedChartProps {
  data: Array<{ speed: number; range: number }>;
  currentSpeed: number;
  epaRange: number;
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: number;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-bg-secondary px-3 py-2 shadow-lg">
      <p className="text-xs text-text-tertiary">{label} mph</p>
      <p className="font-mono text-sm font-bold text-accent">
        {payload[0].value} mi
      </p>
    </div>
  );
}

export function RangeBySpeedChart({ data, currentSpeed, epaRange }: RangeBySpeedChartProps) {
  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-6">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-display font-semibold text-text-primary">
        <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
        Range by Speed
      </h3>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.5}
            />
            <XAxis
              dataKey="speed"
              stroke="var(--text-tertiary)"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              label={{
                value: 'Speed (mph)',
                position: 'insideBottom',
                offset: -2,
                style: { fill: 'var(--text-tertiary)', fontSize: 11 },
              }}
            />
            <YAxis
              stroke="var(--text-tertiary)"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              label={{
                value: 'Range (mi)',
                angle: -90,
                position: 'insideLeft',
                offset: 10,
                style: { fill: 'var(--text-tertiary)', fontSize: 11 },
              }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* EPA reference line */}
            <ReferenceLine
              y={epaRange}
              stroke="var(--text-tertiary)"
              strokeDasharray="6 4"
              label={{
                value: `EPA ${epaRange} mi`,
                position: 'right',
                style: { fill: 'var(--text-tertiary)', fontSize: 10 },
              }}
            />

            {/* Current speed marker */}
            <ReferenceLine
              x={currentSpeed}
              stroke="var(--accent)"
              strokeDasharray="4 4"
              strokeOpacity={0.6}
            />

            <Line
              type="monotone"
              dataKey="range"
              stroke="var(--accent)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 6,
                fill: 'var(--accent)',
                stroke: 'var(--bg-primary)',
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-3 text-center text-xs text-text-tertiary">
        Range drops significantly above 55 mph due to aerodynamic drag (proportional to v&sup2;)
      </p>
    </div>
  );
}
