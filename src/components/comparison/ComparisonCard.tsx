import Link from 'next/link';
import type { Vehicle } from '@/lib/supabase/types';

interface ComparisonCardProps {
  vehicle: Vehicle;
  highlight?: boolean;
}

export function ComparisonCard({ vehicle, highlight = false }: ComparisonCardProps) {
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <Link
      href={`/vehicles/${vehicle.slug}`}
      className={`group block rounded-xl border p-6 transition-all hover:shadow-lg hover:shadow-accent/5 ${
        highlight
          ? 'border-accent/30 bg-accent/5'
          : 'border-border bg-bg-secondary hover:border-accent/30'
      }`}
    >
      <h3 className="font-display text-lg font-bold text-text-primary group-hover:text-accent transition-colors">
        {vehicle.year} {vehicle.make} {vehicle.model}
      </h3>
      {vehicle.trim && (
        <p className="text-xs text-text-tertiary">{vehicle.trim}</p>
      )}

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-text-tertiary">EPA Range</span>
          <span className="font-mono font-semibold text-accent">{vehicle.epa_range_mi} mi</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-tertiary">Battery</span>
          <span className="font-mono text-text-secondary">{vehicle.battery_kwh} kWh</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-tertiary">Efficiency</span>
          <span className="font-mono text-text-secondary">{vehicle.efficiency_kwh_per_100mi} kWh/100mi</span>
        </div>
        {vehicle.dc_fast_max_kw && (
          <div className="flex justify-between">
            <span className="text-text-tertiary">DC Fast</span>
            <span className="font-mono text-text-secondary">{vehicle.dc_fast_max_kw} kW</span>
          </div>
        )}
        {vehicle.msrp_usd && (
          <div className="flex justify-between border-t border-border pt-3">
            <span className="text-text-tertiary">MSRP</span>
            <span className="font-mono font-semibold text-text-primary">{fmt(vehicle.msrp_usd)}</span>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-accent opacity-0 transition-opacity group-hover:opacity-100">
        View full specs &rarr;
      </p>
    </Link>
  );
}
