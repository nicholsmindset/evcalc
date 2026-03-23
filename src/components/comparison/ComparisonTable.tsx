import type { Vehicle } from '@/lib/supabase/types';

interface ComparisonSpec {
  label: string;
  getValue: (v: Vehicle) => string;
  getNumeric?: (v: Vehicle) => number;
  highlight?: 'higher' | 'lower';
}

const DEFAULT_SPECS: ComparisonSpec[] = [
  { label: 'EPA Range', getValue: (v) => `${v.epa_range_mi} mi`, getNumeric: (v) => v.epa_range_mi, highlight: 'higher' },
  { label: 'Battery', getValue: (v) => `${v.battery_kwh} kWh`, getNumeric: (v) => v.battery_kwh, highlight: 'higher' },
  { label: 'Efficiency', getValue: (v) => `${v.efficiency_kwh_per_100mi} kWh/100mi`, getNumeric: (v) => v.efficiency_kwh_per_100mi, highlight: 'lower' },
  { label: 'DC Fast Max', getValue: (v) => v.dc_fast_max_kw ? `${v.dc_fast_max_kw} kW` : '—', getNumeric: (v) => v.dc_fast_max_kw || 0, highlight: 'higher' },
  { label: 'DC Fast Time', getValue: (v) => v.charge_time_dc_fast_mins ? `~${v.charge_time_dc_fast_mins} min` : '—' },
  { label: 'Level 2 Time', getValue: (v) => v.charge_time_240v_hrs ? `~${v.charge_time_240v_hrs} hrs` : '—' },
  { label: 'Connector', getValue: (v) => v.connector_type || '—' },
  { label: 'Drivetrain', getValue: (v) => v.drivetrain || '—' },
  { label: 'Curb Weight', getValue: (v) => v.curb_weight_lbs ? `${v.curb_weight_lbs.toLocaleString()} lbs` : '—' },
  { label: 'Seating', getValue: (v) => v.seating_capacity ? `${v.seating_capacity}` : '—' },
  { label: 'MSRP', getValue: (v) => v.msrp_usd ? `$${v.msrp_usd.toLocaleString()}` : '—', getNumeric: (v) => v.msrp_usd || Infinity, highlight: 'lower' },
];

interface ComparisonTableProps {
  vehicles: Vehicle[];
  specs?: ComparisonSpec[];
}

export function ComparisonTable({
  vehicles,
  specs = DEFAULT_SPECS,
}: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="border-b border-border bg-bg-secondary">
            <th className="px-4 py-3 text-left text-xs font-semibold text-text-tertiary">Spec</th>
            {vehicles.map((v) => (
              <th key={v.id} className="px-4 py-3 text-right text-xs font-semibold text-accent">
                {v.make} {v.model}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {specs.map((spec) => {
            const numericValues = spec.getNumeric
              ? vehicles.map((v) => spec.getNumeric!(v))
              : null;
            const best = numericValues
              ? spec.highlight === 'higher'
                ? Math.max(...numericValues)
                : spec.highlight === 'lower'
                ? Math.min(...numericValues.filter((n) => n !== Infinity && n > 0))
                : null
              : null;

            return (
              <tr key={spec.label} className="odd:bg-bg-secondary/30">
                <td className="px-4 py-3 text-sm text-text-secondary">{spec.label}</td>
                {vehicles.map((v, i) => {
                  const isWinner =
                    best !== null && numericValues && numericValues[i] === best && numericValues[i] !== Infinity;
                  return (
                    <td
                      key={v.id}
                      className={`px-4 py-3 text-right font-mono text-sm font-semibold ${isWinner ? 'text-accent' : 'text-text-primary'}`}
                    >
                      {spec.getValue(v)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
