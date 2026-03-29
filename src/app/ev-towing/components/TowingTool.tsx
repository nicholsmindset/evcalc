'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface TowEV {
  slug: string;
  make: string;
  model: string;
  trim: string;
  towLbs: number;
  payloadLbs: number;
  epaRange: number;
  msrp: number;
  driveType: string;
  connector: string;
  dcFastKw: number;
  batteryKwh: number;
  note: string;
}

const TOW_EVS: TowEV[] = [
  { slug: 'ford-f150-lightning-pro-2024', make: 'Ford', model: 'F-150 Lightning', trim: 'Pro', towLbs: 14000, payloadLbs: 2235, epaRange: 240, msrp: 49995, driveType: 'AWD', connector: 'NACS', dcFastKw: 150, batteryKwh: 98, note: 'Max tow capacity in class. Onboard generator (Pro Power Onboard) standard.' },
  { slug: 'rivian-r1t-adventure-2024', make: 'Rivian', model: 'R1T', trim: 'Adventure', towLbs: 11000, payloadLbs: 1760, epaRange: 314, msrp: 71700, driveType: 'AWD', connector: 'NACS', dcFastKw: 220, batteryKwh: 135, note: 'Best tow + range combination. Gear tunnel for hidden storage.' },
  { slug: 'rivian-r1s-adventure-2024', make: 'Rivian', model: 'R1S', trim: 'Adventure', towLbs: 7700, payloadLbs: 1760, epaRange: 321, msrp: 75900, driveType: 'AWD', connector: 'NACS', dcFastKw: 220, batteryKwh: 135, note: '3-row SUV with real towing. Excellent for boats and smaller trailers.' },
  { slug: 'tesla-model-x-plaid-2024', make: 'Tesla', model: 'Model X', trim: 'Plaid', towLbs: 8500, payloadLbs: 1800, epaRange: 333, msrp: 109990, driveType: 'AWD', connector: 'NACS', dcFastKw: 250, batteryKwh: 100, note: '6-seat option. Falcon wing doors. Highest EV tow rating for SUVs before Cybertruck.' },
  { slug: 'kia-ev9-light-rwd-2024', make: 'Kia', model: 'EV9', trim: 'Light AWD', towLbs: 5000, payloadLbs: 1650, epaRange: 280, msrp: 56900, driveType: 'AWD', connector: 'NACS', dcFastKw: 240, batteryKwh: 99.8, note: '3-row family SUV. V2L capable — can power a campsite from the EV.' },
  { slug: 'chevrolet-blazer-ev-rs-2024', make: 'Chevrolet', model: 'Blazer EV', trim: 'RS', towLbs: 3920, payloadLbs: 1543, epaRange: 324, msrp: 49995, driveType: 'AWD', connector: 'NACS', dcFastKw: 190, batteryKwh: 89, note: 'Best value option for light towing. Stylish crossover.' },
  { slug: 'chevrolet-equinox-ev-lt-2024', make: 'Chevrolet', model: 'Equinox EV', trim: 'LT AWD', towLbs: 3500, payloadLbs: 1540, epaRange: 280, msrp: 39995, driveType: 'AWD', connector: 'NACS', dcFastKw: 150, batteryKwh: 85, note: 'Most affordable EV with towing. Ideal for small trailers / jet skis.' },
  { slug: 'tesla-model-y-long-range-2024', make: 'Tesla', model: 'Model Y', trim: 'Long Range AWD', towLbs: 3500, payloadLbs: 1020, epaRange: 330, msrp: 50990, driveType: 'AWD', connector: 'NACS', dcFastKw: 250, batteryKwh: 82, note: 'Huge Supercharger network makes it practical for tow trips.' },
  { slug: 'tesla-model-3-long-range-2024', make: 'Tesla', model: 'Model 3', trim: 'Long Range AWD', towLbs: 3500, payloadLbs: 1000, epaRange: 358, msrp: 47240, driveType: 'AWD', connector: 'NACS', dcFastKw: 250, batteryKwh: 82, note: 'Surprising tow rating for a sedan. Best for very light loads.' },
  { slug: 'volkswagen-id4-pro-2024', make: 'Volkswagen', model: 'ID.4', trim: 'Pro AWD', towLbs: 3500, payloadLbs: 1540, epaRange: 255, msrp: 44995, driveType: 'AWD', connector: 'CCS1', dcFastKw: 135, batteryKwh: 82, note: 'European-spec towing. Best for bikes / small boats.' },
  { slug: 'ford-mustang-mach-e-4x-2024', make: 'Ford', model: 'Mustang Mach-E', trim: '4X AWD', towLbs: 3500, payloadLbs: 1320, epaRange: 290, msrp: 50995, driveType: 'AWD', connector: 'NACS', dcFastKw: 150, batteryKwh: 91, note: 'Crossover with light tow capability. Good for small trailers.' },
  { slug: 'bmw-ix-xdrive50-2024', make: 'BMW', model: 'iX', trim: 'xDrive50', towLbs: 3500, payloadLbs: 1760, epaRange: 324, msrp: 87100, driveType: 'AWD', connector: 'CCS1', dcFastKw: 195, batteryKwh: 105.2, note: 'Luxury towing option. Excellent range for a German SUV.' },
  { slug: 'hyundai-ioniq-5-awd-2024', make: 'Hyundai', model: 'IONIQ 5', trim: 'AWD Standard', towLbs: 2000, payloadLbs: 860, epaRange: 266, msrp: 45450, driveType: 'AWD', connector: 'NACS', dcFastKw: 350, batteryKwh: 77.4, note: 'Ultra-fast 350 kW charging. V2L capable for campsite power.' },
  { slug: 'kia-ev6-gt-line-awd-2024', make: 'Kia', model: 'EV6', trim: 'GT-Line AWD', towLbs: 2000, payloadLbs: 860, epaRange: 274, msrp: 48600, driveType: 'AWD', connector: 'NACS', dcFastKw: 350, batteryKwh: 77.4, note: 'Sporty crossover. 350 kW charging speed is best-in-class.' },
  { slug: 'audi-q8-etron-2024', make: 'Audi', model: 'Q8 e-tron', trim: 'Prestige', towLbs: 2800, payloadLbs: 1000, epaRange: 300, msrp: 74400, driveType: 'AWD', connector: 'CCS1', dcFastKw: 170, batteryKwh: 114, note: 'Luxury EV SUV with decent towing. Best for light European trailers.' },
];

// Tow range formula: epa_range * (1 - 0.003 * tow_weight_per_100lbs)
function calcTowRange(epaRange: number, towWeightLbs: number): number {
  const factor = 1 - 0.003 * (towWeightLbs / 100);
  return Math.max(0, Math.round(epaRange * factor));
}

type SortKey = 'towLbs' | 'epaRange' | 'msrp' | 'payloadLbs';

function SortIcon({ k, sortKey, sortDir }: { k: SortKey; sortKey: SortKey; sortDir: 'asc' | 'desc' }) {
  return <>{sortKey === k ? (sortDir === 'asc' ? ' \u2191' : ' \u2193') : ' \u2195'}</>;
}

export function TowingTool() {
  const [towWeight, setTowWeight] = useState(3000);
  const [selEVSlug, setSelEVSlug] = useState(TOW_EVS[0].slug);
  const [sortKey, setSortKey] = useState<SortKey>('towLbs');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [filterMinTow, setFilterMinTow] = useState(0);

  const selEV = TOW_EVS.find(e => e.slug === selEVSlug) ?? TOW_EVS[0];
  const calcedRange = calcTowRange(selEV.epaRange, towWeight);
  const rangeDrop = selEV.epaRange - calcedRange;
  const dropPct = Math.round((rangeDrop / selEV.epaRange) * 100);

  const sortedEVs = useMemo(() => {
    return TOW_EVS
      .filter(e => e.towLbs >= filterMinTow)
      .sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        return sortDir === 'asc' ? av - bv : bv - av;
      });
  }, [sortKey, sortDir, filterMinTow]);

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir('desc'); }
  }

  return (
    <>
      {/* Range-while-towing calculator */}
      <div className="mb-10 rounded-lg border border-border bg-bg-secondary p-5">
        <h2 className="mb-4 font-display text-base font-bold text-text-primary">
          Towing Range Calculator
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-text-secondary">Select EV</label>
              <select
                value={selEVSlug}
                onChange={e => setSelEVSlug(e.target.value)}
                className="w-full rounded border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {TOW_EVS.map(ev => (
                  <option key={ev.slug} value={ev.slug}>{ev.make} {ev.model} {ev.trim}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-secondary">
                Trailer weight: {towWeight.toLocaleString()} lbs
              </label>
              <input
                type="range" min={500} max={selEV.towLbs} step={500}
                value={towWeight}
                onChange={e => setTowWeight(Number(e.target.value))}
                className="w-full accent-accent"
              />
              <div className="flex justify-between text-xs text-text-tertiary">
                <span>500 lbs</span>
                <span>{selEV.towLbs.toLocaleString()} lbs (max)</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-3 rounded-lg bg-bg-tertiary p-4">
            <div>
              <div className="text-xs text-text-tertiary">EPA range (no tow)</div>
              <div className="font-mono text-lg font-bold text-text-primary">{selEV.epaRange} mi</div>
            </div>
            <div>
              <div className="text-xs text-text-tertiary">Est. range towing {towWeight.toLocaleString()} lbs</div>
              <div className="font-mono text-2xl font-bold text-accent">{calcedRange} mi</div>
            </div>
            <div className="text-xs text-red-400">
              −{rangeDrop} mi ({dropPct}% range reduction)
            </div>
            <p className="text-xs text-text-tertiary">{selEV.note}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-text-tertiary">
          Formula: EPA range × (1 − 0.3% per 100 lbs towed). Based on SAE J2807 tow testing patterns.
          Actual range varies with speed, terrain, weather, and trailer aerodynamics.
        </p>
      </div>

      {/* Filter bar */}
      <div className="mb-4 flex flex-wrap items-end gap-4">
        <div>
          <label className="mb-1 block text-xs text-text-secondary">Min tow capacity (lbs)</label>
          <select
            value={filterMinTow}
            onChange={e => setFilterMinTow(Number(e.target.value))}
            className="rounded border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {[0, 2000, 3500, 5000, 7500, 10000].map(v => (
              <option key={v} value={v}>{v === 0 ? 'All' : `${v.toLocaleString()}+ lbs`}</option>
            ))}
          </select>
        </div>
        <div className="text-xs text-text-tertiary">{sortedEVs.length} vehicles</div>
      </div>

      {/* Sortable table */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-tertiary text-xs text-text-secondary">
              <th className="px-4 py-3 text-left">Vehicle</th>
              <th className="cursor-pointer px-4 py-3 text-right" onClick={() => toggleSort('towLbs')}>
                Max Tow <SortIcon k="towLbs" sortKey={sortKey} sortDir={sortDir} />
              </th>
              <th className="cursor-pointer px-4 py-3 text-right" onClick={() => toggleSort('payloadLbs')}>
                Payload <SortIcon k="payloadLbs" sortKey={sortKey} sortDir={sortDir} />
              </th>
              <th className="cursor-pointer px-4 py-3 text-right" onClick={() => toggleSort('epaRange')}>
                EPA Range <SortIcon k="epaRange" sortKey={sortKey} sortDir={sortDir} />
              </th>
              <th className="px-4 py-3 text-right">Max DCFC</th>
              <th className="cursor-pointer px-4 py-3 text-right" onClick={() => toggleSort('msrp')}>
                MSRP <SortIcon k="msrp" sortKey={sortKey} sortDir={sortDir} />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedEVs.map(ev => {
              const towRangeAt3k = calcTowRange(ev.epaRange, 3000);
              return (
                <tr key={ev.slug} className="hover:bg-bg-secondary/50">
                  <td className="px-4 py-3">
                    <Link href={`/vehicles/${ev.slug}/towing`} className="font-semibold text-text-primary hover:text-accent">
                      {ev.make} {ev.model}
                    </Link>
                    <div className="text-xs text-text-tertiary">{ev.trim} · {ev.driveType} · {ev.connector}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-accent">
                    {ev.towLbs.toLocaleString()} lbs
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-text-secondary">
                    {ev.payloadLbs.toLocaleString()} lbs
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-mono">{ev.epaRange} mi</div>
                    <div className="text-xs text-text-tertiary">~{towRangeAt3k} mi @ 3k lbs tow</div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-text-secondary">{ev.dcFastKw} kW</td>
                  <td className="px-4 py-3 text-right font-mono text-text-secondary">
                    ${ev.msrp.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
