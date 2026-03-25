'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

interface CumulativeCostChartProps {
  leaseCosts: number[];
  financeCosts: number[];
  cashCosts: number[];
  breakEvenMonth: number | null;
  showCash?: boolean;
}

function formatCurrency(value: number) {
  if (Math.abs(value) >= 1000) {
    return '$' + (value / 1000).toFixed(0) + 'k';
  }
  return '$' + value.toLocaleString();
}

interface TooltipPayload {
  color: string;
  name: string;
  value: number;
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-bg-secondary p-3 text-sm shadow-lg">
      <p className="mb-2 font-semibold text-text-primary">Month {label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-text-secondary">{entry.name}:</span>
          <span className="font-mono font-semibold text-text-primary">
            {entry.value < 0 ? '-' : ''}${Math.abs(entry.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export function CumulativeCostChart({
  leaseCosts,
  financeCosts,
  cashCosts,
  breakEvenMonth,
  showCash = true,
}: CumulativeCostChartProps) {
  // Sample every 6 months for cleaner chart
  const data = leaseCosts.map((_, i) => ({
    month: i + 1,
    Lease: leaseCosts[i],
    Finance: financeCosts[i],
    ...(showCash ? { Cash: cashCosts[i] } : {}),
  })).filter((_, i) => i % 6 === 5 || i === 0); // month 1, 6, 12, 18, ...

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="month"
          tick={{ fill: '#8888a0', fontSize: 12 }}
          tickFormatter={(v) => `Mo ${v}`}
          axisLine={{ stroke: '#2a2a3e' }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatCurrency}
          tick={{ fill: '#8888a0', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={55}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '13px', color: '#8888a0', paddingTop: '12px' }}
        />
        {breakEvenMonth && (
          <ReferenceLine
            x={Math.ceil(breakEvenMonth / 6) * 6}
            stroke="#ffc107"
            strokeDasharray="4 4"
            label={{
              value: `Break-even ~mo ${breakEvenMonth}`,
              fill: '#ffc107',
              fontSize: 11,
              position: 'insideTopRight',
            }}
          />
        )}
        <Line
          type="monotone"
          dataKey="Lease"
          stroke="#448aff"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="Finance"
          stroke="#00e676"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        {showCash && (
          <Line
            type="monotone"
            dataKey="Cash"
            stroke="#ff5252"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
