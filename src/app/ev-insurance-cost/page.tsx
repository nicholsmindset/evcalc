'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { RelatedTools } from '@/components/ui/RelatedTools';

// ─── Static insurance data (from migration 015 seed) ─────────────────────────
interface InsuranceEst {
  make: string;
  model: string;
  trim: string;
  avg: number;
  low: number;
  high: number;
  tier: 'low' | 'moderate' | 'high' | 'very_high';
  vsGasPct: number;
  msrp: number;
}

const ESTIMATES: InsuranceEst[] = [
  { make: 'Tesla',      model: 'Model S Plaid',     trim: '',              avg: 3890, low: 3200, high: 4600, tier: 'very_high', vsGasPct: 42,  msrp: 104990 },
  { make: 'Tesla',      model: 'Model X Plaid',     trim: '',              avg: 3720, low: 3000, high: 4400, tier: 'very_high', vsGasPct: 38,  msrp: 109990 },
  { make: 'Lucid',      model: 'Air Grand Touring', trim: '',              avg: 3650, low: 2900, high: 4400, tier: 'very_high', vsGasPct: 45,  msrp: 138000 },
  { make: 'Rivian',     model: 'R1T Adventure',     trim: '',              avg: 3420, low: 2800, high: 4100, tier: 'very_high', vsGasPct: 35,  msrp: 71700  },
  { make: 'Rivian',     model: 'R1S Adventure',     trim: '',              avg: 3380, low: 2700, high: 4000, tier: 'very_high', vsGasPct: 33,  msrp: 75900  },
  { make: 'Audi',       model: 'e-tron GT',         trim: '',              avg: 2810, low: 2200, high: 3400, tier: 'high',      vsGasPct: 28,  msrp: 106395 },
  { make: 'Mercedes',   model: 'EQS 450+',          trim: '',              avg: 2930, low: 2300, high: 3500, tier: 'high',      vsGasPct: 30,  msrp: 104400 },
  { make: 'BMW',        model: 'iX',                trim: 'xDrive50',      avg: 2680, low: 2100, high: 3200, tier: 'high',      vsGasPct: 25,  msrp: 87100  },
  { make: 'BMW',        model: 'i4',                trim: 'eDrive40',      avg: 2420, low: 1950, high: 2900, tier: 'high',      vsGasPct: 20,  msrp: 57400  },
  { make: 'Tesla',      model: 'Model 3',           trim: 'Long Range',    avg: 2340, low: 1900, high: 2800, tier: 'high',      vsGasPct: 18,  msrp: 47240  },
  { make: 'Tesla',      model: 'Model Y',           trim: 'Long Range',    avg: 2290, low: 1850, high: 2750, tier: 'high',      vsGasPct: 16,  msrp: 50990  },
  { make: 'Ford',       model: 'F-150 Lightning',   trim: 'Pro',           avg: 1820, low: 1450, high: 2190, tier: 'moderate',  vsGasPct: 10,  msrp: 49995  },
  { make: 'Kia',        model: 'EV9',               trim: 'Light RWD',     avg: 1720, low: 1380, high: 2060, tier: 'moderate',  vsGasPct: 8,   msrp: 54900  },
  { make: 'Ford',       model: 'Mustang Mach-E',    trim: 'RWD',           avg: 1660, low: 1350, high: 2000, tier: 'moderate',  vsGasPct: 5,   msrp: 42995  },
  { make: 'Hyundai',    model: 'IONIQ 5',           trim: 'SE RWD',        avg: 1620, low: 1300, high: 1950, tier: 'moderate',  vsGasPct: 5,   msrp: 41450  },
  { make: 'Chevrolet',  model: 'Blazer EV',         trim: '',              avg: 1580, low: 1280, high: 1900, tier: 'moderate',  vsGasPct: 4,   msrp: 44995  },
  { make: 'Kia',        model: 'EV6',               trim: 'Light RWD',     avg: 1580, low: 1280, high: 1900, tier: 'moderate',  vsGasPct: 3,   msrp: 42600  },
  { make: 'Hyundai',    model: 'IONIQ 6',           trim: 'SE RWD',        avg: 1540, low: 1250, high: 1850, tier: 'moderate',  vsGasPct: 2,   msrp: 38615  },
  { make: 'Tesla',      model: 'Model 3',           trim: 'RWD',           avg: 1980, low: 1600, high: 2400, tier: 'moderate',  vsGasPct: 12,  msrp: 40240  },
  { make: 'Tesla',      model: 'Model Y',           trim: 'RWD',           avg: 1940, low: 1550, high: 2350, tier: 'moderate',  vsGasPct: 10,  msrp: 43990  },
  { make: 'Volkswagen', model: 'ID.4',              trim: 'Pro',           avg: 1490, low: 1200, high: 1800, tier: 'moderate',  vsGasPct: 0,   msrp: 38995  },
  { make: 'Honda',      model: 'Prologue',          trim: '',              avg: 1410, low: 1130, high: 1690, tier: 'low',       vsGasPct: -2,  msrp: 47400  },
  { make: 'Chevrolet',  model: 'Equinox EV',        trim: '',              avg: 1380, low: 1100, high: 1660, tier: 'low',       vsGasPct: -3,  msrp: 34995  },
  { make: 'Subaru',     model: 'Solterra',          trim: '',              avg: 1340, low: 1080, high: 1610, tier: 'low',       vsGasPct: -2,  msrp: 44995  },
  { make: 'Toyota',     model: 'bZ4X',              trim: '',              avg: 1310, low: 1050, high: 1570, tier: 'low',       vsGasPct: -4,  msrp: 44765  },
  { make: 'Mazda',      model: 'MX-30',             trim: '',              avg: 1240, low: 1000, high: 1490, tier: 'low',       vsGasPct: -6,  msrp: 33470  },
  { make: 'Chevrolet',  model: 'Bolt EV',           trim: '',              avg: 1290, low: 1040, high: 1550, tier: 'low',       vsGasPct: -5,  msrp: 26500  },
  { make: 'Mini',       model: 'Cooper SE',         trim: '',              avg: 1390, low: 1120, high: 1670, tier: 'low',       vsGasPct: -1,  msrp: 29900  },
  { make: 'Nissan',     model: 'LEAF',              trim: '40 kWh',        avg: 1180, low: 950,  high: 1420, tier: 'low',       vsGasPct: -8,  msrp: 28040  },
  { make: 'Volvo',      model: 'EX30',              trim: '',              avg: 1460, low: 1170, high: 1750, tier: 'low',       vsGasPct: 0,   msrp: 34950  },
];

// State insurance cost multipliers (vs national avg)
const STATE_MULTIPLIERS: Record<string, number> = {
  MI: 1.82, LA: 1.74, FL: 1.58, NY: 1.42, NJ: 1.38,
  DC: 1.35, DE: 1.30, CO: 1.28, SC: 1.22, MD: 1.18,
  GA: 1.15, NV: 1.12, OR: 1.10, RI: 1.08, KY: 1.06,
  WA: 1.04, CA: 1.02, TX: 1.00, IL: 0.98, PA: 0.96,
  AZ: 0.95, OH: 0.93, MA: 0.92, WI: 0.90, MN: 0.88,
  NC: 0.86, IN: 0.85, TN: 0.84, VA: 0.83, CT: 0.82,
  MO: 0.81, UT: 0.80, AL: 0.79, AR: 0.78, MS: 0.77,
  OK: 0.76, KS: 0.75, NE: 0.74, SD: 0.73, ND: 0.72,
  WY: 0.71, MT: 0.70, ID: 0.69, AK: 0.68, HI: 0.82,
  NM: 0.80, NH: 0.78, VT: 0.76, ME: 0.74, WV: 0.73, IA: 0.75,
};

const STATES = Object.keys(STATE_MULTIPLIERS).sort();

const TIER_LABEL: Record<string, string> = {
  low: 'Low', moderate: 'Moderate', high: 'High', very_high: 'Very High',
};
const TIER_COLOR: Record<string, string> = {
  low: 'text-green-400', moderate: 'text-yellow-400',
  high: 'text-orange-400', very_high: 'text-red-400',
};
const TIER_BG: Record<string, string> = {
  low: 'bg-green-400/10', moderate: 'bg-yellow-400/10',
  high: 'bg-orange-400/10', very_high: 'bg-red-400/10',
};

type SortKey = 'avg' | 'make' | 'vsGasPct' | 'msrp';

export default function EvInsuranceCostPage() {
  const [sortKey, setSortKey] = useState<SortKey>('avg');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filterTier, setFilterTier] = useState('all');
  const [selectedState, setSelectedState] = useState('');

  const multiplier = selectedState ? (STATE_MULTIPLIERS[selectedState] ?? 1) : 1;

  const sorted = useMemo(() => {
    const filtered = filterTier === 'all' ? [...ESTIMATES] : ESTIMATES.filter(e => e.tier === filterTier);
    return filtered.sort((a, b) => {
      let av: number | string = a[sortKey];
      let bv: number | string = b[sortKey];
      if (sortKey === 'make') { av = a.make + a.model; bv = b.make + b.model; }
      if (typeof av === 'string' && typeof bv === 'string') return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [sortKey, sortDir, filterTier]);

  const cheapest5 = [...ESTIMATES].sort((a, b) => a.avg - b.avg).slice(0, 5);
  const priciest5 = [...ESTIMATES].sort((a, b) => b.avg - a.avg).slice(0, 5);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }
  function setDir(d: 'asc' | 'desc') { setSortDir(d); }

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'EV Insurance Cost Guide — Which Electric Cars Are Cheapest to Insure?',
        description: 'Compare annual insurance costs for 30 electric vehicles. See cheapest and most expensive EVs to insure, state-by-state estimates, and tips to lower your premium.',
        url: 'https://evrangetools.com/ev-insurance-cost',
        author: { '@type': 'Organization', name: 'EV Range Tools' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evrangetools.com' },
          { '@type': 'ListItem', position: 2, name: 'EV Insurance Cost', item: 'https://evrangetools.com/ev-insurance-cost' },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <span className="text-text-primary">EV Insurance Cost</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            EV Insurance Cost Guide
          </h1>
          <p className="mt-3 text-text-secondary">
            Annual insurance estimates for 30 electric vehicles — sortable by cost, brand, and vs. gas car premium.
            Estimates based on Bankrate and NerdWallet published averages for a 35-year-old driver with good credit and a clean record.
          </p>
        </div>

        {/* ─── Top 5 cards ─────────────────────────────────────────────────── */}
        <div className="mb-10 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="mb-3 font-display text-base font-bold text-green-400">5 Cheapest to Insure</h2>
            <div className="space-y-2">
              {cheapest5.map((e, i) => (
                <div key={e.make + e.model + e.trim} className="flex items-center justify-between rounded-lg border border-border bg-bg-secondary px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text-tertiary">#{i + 1}</span>
                    <div>
                      <div className="text-sm font-semibold text-text-primary">{e.make} {e.model}</div>
                      {e.trim && <div className="text-xs text-text-tertiary">{e.trim}</div>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-bold text-green-400">${e.avg.toLocaleString()}/yr</div>
                    <div className="text-xs text-text-tertiary">{e.vsGasPct < 0 ? `${Math.abs(e.vsGasPct)}% less than gas` : `${e.vsGasPct}% more`}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-display text-base font-bold text-red-400">5 Most Expensive to Insure</h2>
            <div className="space-y-2">
              {priciest5.map((e, i) => (
                <div key={e.make + e.model + e.trim} className="flex items-center justify-between rounded-lg border border-border bg-bg-secondary px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text-tertiary">#{i + 1}</span>
                    <div>
                      <div className="text-sm font-semibold text-text-primary">{e.make} {e.model}</div>
                      {e.trim && <div className="text-xs text-text-tertiary">{e.trim}</div>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-bold text-red-400">${e.avg.toLocaleString()}/yr</div>
                    <div className="text-xs text-text-tertiary">{e.vsGasPct > 0 ? `${e.vsGasPct}% more than gas` : 'about same as gas'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── State adjuster ──────────────────────────────────────────────── */}
        <div className="mb-6 flex flex-wrap items-end gap-4 rounded-lg border border-border bg-bg-secondary p-4">
          <div>
            <label className="mb-1 block text-xs text-text-secondary">Adjust for your state</label>
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="rounded border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="">National average</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {selectedState && (
            <div className="text-sm text-text-secondary">
              {STATE_MULTIPLIERS[selectedState] > 1
                ? <span className="text-red-400">+{Math.round((STATE_MULTIPLIERS[selectedState] - 1) * 100)}% above national avg in {selectedState}</span>
                : <span className="text-green-400">{Math.round((1 - STATE_MULTIPLIERS[selectedState]) * 100)}% below national avg in {selectedState}</span>
              }
            </div>
          )}
          <div className="ml-auto flex gap-2">
            <button onClick={() => setFilterTier('all')} className={`rounded px-3 py-1.5 text-xs font-medium ${filterTier === 'all' ? 'bg-accent text-bg-primary' : 'border border-border text-text-secondary hover:text-text-primary'}`}>All</button>
            {['low','moderate','high','very_high'].map(t => (
              <button key={t} onClick={() => setFilterTier(t)} className={`rounded px-3 py-1.5 text-xs font-medium ${filterTier === t ? 'bg-accent text-bg-primary' : 'border border-border text-text-secondary hover:text-text-primary'}`}>
                {TIER_LABEL[t]}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Sortable table ──────────────────────────────────────────────── */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-tertiary text-xs text-text-secondary">
                <th className="cursor-pointer px-4 py-3 text-left" onClick={() => toggleSort('make')}>
                  Vehicle <SortIcon k="make" />
                </th>
                <th className="cursor-pointer px-4 py-3 text-right" onClick={() => toggleSort('avg')}>
                  Est. Annual Premium <SortIcon k="avg" />
                </th>
                <th className="px-4 py-3 text-right">Range</th>
                <th className="cursor-pointer px-4 py-3 text-center" onClick={() => toggleSort('vsGasPct')}>
                  vs Gas Car <SortIcon k="vsGasPct" />
                </th>
                <th className="px-4 py-3 text-center">Tier</th>
                <th className="cursor-pointer px-4 py-3 text-right" onClick={() => toggleSort('msrp')}>
                  MSRP <SortIcon k="msrp" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-text-primary">
              {sorted.map(e => {
                const adj = Math.round(e.avg * multiplier);
                const adjLow = Math.round(e.low * multiplier);
                const adjHigh = Math.round(e.high * multiplier);
                return (
                  <tr key={e.make + e.model + e.trim} className="hover:bg-bg-secondary/50">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{e.make} {e.model}</div>
                      {e.trim && <div className="text-xs text-text-tertiary">{e.trim}</div>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="font-mono font-bold text-text-primary">${adj.toLocaleString()}</div>
                      <div className="text-xs text-text-tertiary">${Math.round(adj / 12).toLocaleString()}/mo</div>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-text-tertiary">
                      ${adjLow.toLocaleString()} – ${adjHigh.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={e.vsGasPct > 0 ? 'text-red-400' : 'text-green-400'}>
                        {e.vsGasPct > 0 ? `+${e.vsGasPct}%` : `${e.vsGasPct}%`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TIER_BG[e.tier]} ${TIER_COLOR[e.tier]}`}>
                        {TIER_LABEL[e.tier]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-text-secondary">
                      ${e.msrp.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-text-tertiary">
          Estimates for a 35-year-old driver, good credit, clean record, full coverage. Actual rates vary significantly by age, driving record, ZIP code, and insurer. Click any insurer to compare real quotes.
        </p>

        {/* ─── Get quotes CTA ──────────────────────────────────────────────── */}
        <div className="mt-6 rounded-lg border border-border bg-bg-secondary p-5">
          <h2 className="mb-2 font-display text-base font-bold text-text-primary">Compare Real Quotes for Your EV</h2>
          <p className="mb-4 text-sm text-text-secondary">Estimates above are averages. Your actual rate depends on your ZIP, age, driving record, and coverage limits. Compare quotes from multiple insurers to find the best rate.</p>
          <div className="flex flex-wrap gap-3">
            {[
              { name: 'Insurify', url: 'https://insurify.com', note: 'Compare 40+ insurers' },
              { name: 'The Zebra', url: 'https://www.thezebra.com', note: 'Free comparison tool' },
              { name: 'NerdWallet Insurance', url: 'https://www.nerdwallet.com/insurance/car', note: 'Editorial ratings' },
            ].map(({ name, url, note }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="flex flex-col rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm hover:border-accent/60"
              >
                <span className="font-semibold text-accent">{name}</span>
                <span className="text-xs text-text-tertiary">{note}</span>
              </a>
            ))}
          </div>
        </div>

        {/* ─── Tips to lower EV insurance ──────────────────────────────────── */}
        <section className="mt-8">
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">How to Lower Your EV Insurance</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { tip: 'Increase your deductible', detail: 'Raising from $500 to $1,000 can cut premiums 10–20%. Only do this if you have emergency savings to cover it.' },
              { tip: 'Bundle home + auto', detail: 'Most insurers offer 5–15% multi-policy discounts. If you own a home or rent, bundling almost always pays.' },
              { tip: 'Use telematics / usage-based insurance', detail: 'EVs are ideal for telematics programs (State Farm Drive Safe, Progressive Snapshot). EV owners tend to drive conservatively and score well.' },
              { tip: 'Shop annually', detail: 'EV insurance rates have been dropping as insurers gain data. Shopping every renewal can save $200–500/year versus staying with your current insurer.' },
              { tip: 'Ask about EV-specific discounts', detail: 'Some insurers (Tesla Insurance, Lemonade) specialize in EVs and can offer 15–30% lower rates than traditional insurers.' },
              { tip: 'Maintain a good credit score', detail: 'In most states, credit score is one of the strongest predictors of insurance rates. A 50-point credit score improvement can reduce premiums 10–15%.' },
            ].map(({ tip, detail }) => (
              <div key={tip} className="rounded-lg border border-border bg-bg-secondary p-4">
                <div className="mb-1 font-semibold text-text-primary">{tip}</div>
                <div className="text-sm text-text-secondary">{detail}</div>
              </div>
            ))}
          </div>
        </section>

        <RelatedTools tools={[
          { href: '/ev-depreciation-calculator', emoji: '📉', label: 'Depreciation Calculator', desc: 'Project your EV\'s resale value at 3, 5, and 7 years' },
          { href: '/tco-calculator', emoji: '📈', label: 'Total Cost of Ownership', desc: 'Include insurance in your full lifetime ownership cost' },
          { href: '/lease-vs-buy', emoji: '📋', label: 'Lease vs Buy Calculator', desc: 'See how insurance affects your lease vs buy decision' },
        ]} />
      </div>
    </>
  );
}
