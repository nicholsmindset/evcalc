'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface CostBarData {
  name: string;
  cost: number;
  color: string;
}

interface CostComparisonBarProps {
  data: CostBarData[];
  title?: string;
  valuePrefix?: string;
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-border bg-bg-secondary px-3 py-2 shadow-lg">
      <p className="text-xs text-text-tertiary">{label}</p>
      <p className="font-mono text-sm font-bold text-accent">
        ${payload[0].value.toFixed(2)}
      </p>
    </div>
  );
}

export function CostComparisonBar({
  data,
  title,
  valuePrefix = '$',
}: CostComparisonBarProps) {
  return (
    <div>
      {title && (
        <h4 className="mb-3 text-sm font-semibold text-text-primary">{title}</h4>
      )}
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              opacity={0.5}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="var(--text-tertiary)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              stroke="var(--text-tertiary)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              tickFormatter={(v) => `${valuePrefix}${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="cost" radius={[4, 4, 0, 0]} maxBarSize={48}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
