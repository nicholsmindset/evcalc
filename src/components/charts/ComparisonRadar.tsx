'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Vehicle } from '@/lib/supabase/types';

interface ComparisonRadarProps {
  vehicles: Vehicle[];
  className?: string;
}

const COLORS = ['#00e676', '#448aff', '#ffc107', '#ff5252', '#ab47bc'];

function normalizeValue(value: number, min: number, max: number): number {
  if (max === min) return 50;
  return Math.round(((value - min) / (max - min)) * 100);
}

interface RadarDimension {
  label: string;
  key: string;
  getValue: (v: Vehicle) => number;
  invert?: boolean; // lower is better (efficiency, price)
}

const DIMENSIONS: RadarDimension[] = [
  { label: 'Range', key: 'range', getValue: (v) => v.epa_range_mi },
  { label: 'Battery', key: 'battery', getValue: (v) => v.battery_kwh },
  { label: 'Efficiency', key: 'efficiency', getValue: (v) => v.efficiency_kwh_per_100mi, invert: true },
  { label: 'Charging', key: 'charging', getValue: (v) => v.dc_fast_max_kw || 0 },
  { label: 'Value', key: 'value', getValue: (v) => v.msrp_usd || 50000, invert: true },
];

export function ComparisonRadar({ vehicles, className = '' }: ComparisonRadarProps) {
  if (vehicles.length === 0) return null;

  // Calculate min/max for normalization
  const ranges = DIMENSIONS.map((dim) => {
    const values = vehicles.map((v) => dim.getValue(v));
    return { min: Math.min(...values), max: Math.max(...values) };
  });

  // Build radar data points
  const data = DIMENSIONS.map((dim, i) => {
    const point: Record<string, string | number> = { dimension: dim.label };
    vehicles.forEach((v) => {
      const raw = dim.getValue(v);
      let normalized = normalizeValue(raw, ranges[i].min, ranges[i].max);
      if (dim.invert) normalized = 100 - normalized;
      // Clamp between 10-100 for visual clarity
      point[`${v.make} ${v.model}`] = Math.max(10, normalized);
    });
    return point;
  });

  return (
    <div className={`h-[350px] w-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          {vehicles.map((v, i) => (
            <Radar
              key={v.id}
              name={`${v.make} ${v.model}`}
              dataKey={`${v.make} ${v.model}`}
              stroke={COLORS[i % COLORS.length]}
              fill={COLORS[i % COLORS.length]}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          ))}
          <Legend
            wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
