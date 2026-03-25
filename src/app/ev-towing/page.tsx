'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { RelatedTools } from '@/components/ui/RelatedTools';

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

// Tow range formula: epa_range × (1 - 0.003 × tow_weight_per_100lbs)
function calcTowRange(epaRange: number, towWeightLbs: number): number {
  const factor = 1 - 0.003 * (towWeightLbs / 100);
  return Math.max(0, Math.round(epaRange * factor));
}

type SortKey = 'towLbs' | 'epaRange' | 'msrp' | 'payloadLbs';

export default function EvTowingPage() {
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
  const SortIcon = ({ k }: { k: SortKey }) => <>{sortKey === k ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}</>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'Best Electric Trucks and SUVs for Towing 2026 — EV Towing Capacity Guide',
        url: 'https://evrangetools.com/ev-towing',
        author: { '@type': 'Organization', name: 'EV Range Tools' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evrangetools.com' },
          { '@type': 'ListItem', position: 2, name: 'EV Towing Guide', item: 'https://evrangetools.com/ev-towing' },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <span className="text-text-primary">EV Towing Guide</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Best Electric Trucks &amp; SUVs for Towing
          </h1>
          <p className="mt-3 text-text-secondary">
            Compare towing capacity, payload, and real-world range-while-towing for every capable EV —
            sorted by max tow weight. Includes a range-while-towing calculator.
          </p>
        </div>

        {/* ─── Range-while-towing calculator ───────────────────────────────── */}
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

        {/* ─── Filter bar ───────────────────────────────────────────────────── */}
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

        {/* ─── Sortable table ───────────────────────────────────────────────── */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-tertiary text-xs text-text-secondary">
                <th className="px-4 py-3 text-left">Vehicle</th>
                <th className="cursor-pointer px-4 py-3 text-right" onClick={() => toggleSort('towLbs')}>
                  Max Tow <SortIcon k="towLbs" />
                </th>
                <th className="cursor-pointer px-4 py-3 text-right" onClick={() => toggleSort('payloadLbs')}>
                  Payload <SortIcon k="payloadLbs" />
                </th>
                <th className="cursor-pointer px-4 py-3 text-right" onClick={() => toggleSort('epaRange')}>
                  EPA Range <SortIcon k="epaRange" />
                </th>
                <th className="px-4 py-3 text-right">Max DCFC</th>
                <th className="cursor-pointer px-4 py-3 text-right" onClick={() => toggleSort('msrp')}>
                  MSRP <SortIcon k="msrp" />
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

        {/* ─── Towing tips ──────────────────────────────────────────────────── */}
        <section className="mt-8">
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">EV Towing Tips</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { tip: 'Plan charging stops more carefully', detail: 'With 30–50% range reduction while towing, you need 2× the charging stops vs. solo driving. Use A Better Routeplanner (ABRP) with trailer weight set.' },
              { tip: 'Never exceed GVWR or tongue weight', detail: 'Tongue weight (typically 10–15% of trailer weight) must not exceed rating. Overloading risks vehicle damage, battery stress, and brake failure.' },
              { tip: 'Reduce highway speed', detail: 'Aerodynamic drag from a trailer increases exponentially with speed. Towing at 60 mph vs 70 mph can add 20+ miles of range.' },
              { tip: 'Use regenerative braking in tow mode', detail: 'Most EVs have a tow mode that increases regen strength — this helps slow the vehicle+trailer without burning brakes on downhills.' },
              { tip: 'Pre-condition the battery before DCFC', detail: 'Cold batteries charge much slower. Set a navigation destination on the car\'s built-in nav before arriving at a fast charger.' },
              { tip: 'Charge the trailer too (if V2L capable)', detail: 'IONIQ 5, EV6, and Kia EV9 have V2L outlets. You can run an inverter on the trailer for campsite power at no extra fuel cost.' },
            ].map(({ tip, detail }) => (
              <div key={tip} className="rounded-lg border border-border bg-bg-secondary p-4">
                <div className="mb-1 font-semibold text-text-primary">{tip}</div>
                <div className="text-sm text-text-secondary">{detail}</div>
              </div>
            ))}
          </div>
        </section>

        <RelatedTools tools={[
          { href: '/calculator', emoji: '📊', label: 'Range Calculator', desc: 'Estimate range at towing speeds and heavy loads' },
          { href: '/road-trip-planner', emoji: '🗺️', label: 'Road Trip Planner', desc: 'Plan a towing trip with charging stops factored in' },
          { href: '/ev-vs-gas', emoji: '⛽', label: 'EV vs Gas Savings', desc: 'Compare towing costs vs a gas truck over 5 years' },
        ]} />
      </div>
    </>
  );
}
