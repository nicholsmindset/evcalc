'use client';

import type { ChargerProduct } from '@/lib/supabase/queries/chargers';

interface ChargerProductCardProps {
  charger: ChargerProduct;
  rank?: number;
  showBadge?: string;
}

function StarRating({ stars, count }: { stars: number; count: number | null }) {
  const full = Math.floor(stars);
  const half = stars - full >= 0.5;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            className={`h-3.5 w-3.5 ${i < full ? 'text-yellow-400' : i === full && half ? 'text-yellow-400' : 'text-border'}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-text-secondary">
        {stars.toFixed(1)} {count ? `(${count.toLocaleString()})` : ''}
      </span>
    </div>
  );
}

export function ChargerProductCard({ charger, rank, showBadge }: ChargerProductCardProps) {
  const priceFormatted = `$${(charger.price_usd / 100).toFixed(0)}`;
  const kwDisplay = charger.max_kw >= 10 ? charger.max_kw.toFixed(1) : charger.max_kw.toFixed(1);
  const chargeRate = Math.round(charger.max_kw * 3.5); // ~3.5 mi/kWh average

  const affiliateUrl = charger.amazon_asin
    ? `https://www.amazon.com/dp/${charger.amazon_asin}?tag=evrangetools-20`
    : charger.affiliate_url ?? '#';

  return (
    <div className="relative flex flex-col rounded-xl border border-border bg-bg-secondary p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
      {/* Rank / Badge */}
      {(rank || showBadge) && (
        <div className="mb-3 flex items-center gap-2">
          {rank && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
              {rank}
            </span>
          )}
          {showBadge && (
            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
              {showBadge}
            </span>
          )}
        </div>
      )}

      {/* Header */}
      <div className="mb-3">
        <h3 className="font-display text-base font-semibold text-text-primary">
          {charger.brand} {charger.model}
        </h3>
        {charger.rating_stars && (
          <div className="mt-1">
            <StarRating stars={charger.rating_stars} count={charger.review_count} />
          </div>
        )}
      </div>

      {/* Specs grid */}
      <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-bg-tertiary px-3 py-2">
          <div className="text-text-tertiary">Power</div>
          <div className="font-mono font-semibold text-accent">{kwDisplay} kW</div>
          <div className="text-text-secondary">≈{chargeRate} mi/hr</div>
        </div>
        <div className="rounded-lg bg-bg-tertiary px-3 py-2">
          <div className="text-text-tertiary">Amps</div>
          <div className="font-mono font-semibold text-text-primary">{charger.max_amps}A</div>
          <div className="text-text-secondary">Level {charger.charger_level}</div>
        </div>
        <div className="rounded-lg bg-bg-tertiary px-3 py-2">
          <div className="text-text-tertiary">Install</div>
          <div className="font-semibold text-text-primary capitalize">{charger.hardwired_or_plug}</div>
          <div className="text-text-secondary">{charger.plug_type ?? 'Hardwired'}</div>
        </div>
        <div className="rounded-lg bg-bg-tertiary px-3 py-2">
          <div className="text-text-tertiary">Smart</div>
          <div className={`font-semibold ${charger.wifi_enabled ? 'text-accent' : 'text-text-secondary'}`}>
            {charger.wifi_enabled ? 'WiFi ✓' : 'No WiFi'}
          </div>
          <div className="text-text-secondary">{charger.indoor_outdoor}</div>
        </div>
      </div>

      {/* Badges */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {charger.energy_star_certified && (
          <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400">Energy Star</span>
        )}
        {charger.nacs_compatible && (
          <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">NACS Compatible</span>
        )}
        {charger.cable_length_ft && (
          <span className="rounded-full bg-bg-tertiary px-2 py-0.5 text-xs text-text-secondary">
            {charger.cable_length_ft} ft cable
          </span>
        )}
      </div>

      {/* Pros */}
      {charger.pros && charger.pros.length > 0 && (
        <ul className="mb-4 space-y-1">
          {charger.pros.slice(0, 3).map((pro) => (
            <li key={pro} className="flex items-start gap-1.5 text-xs text-text-secondary">
              <span className="mt-0.5 text-accent">✓</span>
              <span>{pro}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Price + CTA */}
      <div className="mt-auto flex items-center justify-between">
        <div>
          <span className="font-display text-xl font-bold text-text-primary">{priceFormatted}</span>
          <span className="ml-1 text-xs text-text-tertiary">on Amazon</span>
        </div>
        <a
          href={affiliateUrl}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg-primary transition-all hover:bg-accent-dim"
        >
          View on Amazon
        </a>
      </div>
    </div>
  );
}
