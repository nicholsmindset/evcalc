import type { Metadata } from 'next';
import Link from 'next/link';
import type { ChargerProduct } from '@/lib/supabase/queries/chargers';
import { ChargerProductCard } from '@/components/chargers/ChargerProductCard';

export const revalidate = 2592000;

export const metadata: Metadata = {
  title: 'Best EV Chargers for Tesla 2025 — Wall Connector vs NACS vs J1772',
  description:
    'The best home EV chargers for Tesla owners in 2025. Tesla Wall Connector vs NACS adapters vs J1772 options. Which is fastest and cheapest for Model 3, Y, S, X, Cybertruck?',
  alternates: { canonical: '/best-ev-chargers/tesla' },
  openGraph: {
    title: 'Best EV Chargers for Tesla 2025',
    description: 'Tesla Wall Connector vs third-party NACS chargers vs J1772 adapters. Which is best for your Tesla?',
    url: '/best-ev-chargers/tesla',
    type: 'website',
  },
};

const TESLA_CHARGERS: ChargerProduct[] = [
  { id: 't1', brand: 'Tesla', model: 'Wall Connector Gen 3', charger_level: 2, max_amps: 48, max_kw: 11.5, connector_type: 'NACS', hardwired_or_plug: 'hardwired', plug_type: null, wifi_enabled: true, cable_length_ft: 18, indoor_outdoor: 'both', energy_star_certified: true, nacs_compatible: true, price_usd: 47500, amazon_asin: null, affiliate_url: 'https://www.tesla.com/support/home-charging-installation/wall-connector', image_url: null, rating_stars: 4.8, review_count: 12043, is_recommended: true, recommended_for: ['tesla', 'nacs'], pros: ['Native NACS — no adapter needed', 'Power Sharing between multiple Teslas', 'Sleek minimalist design', 'Over-the-air updates via Tesla app', '18 ft cable'], cons: ['Tesla-branded only', 'Shorter cable than competitors', 'Wall-mount only'], slug: 'tesla-wall-connector' },
  { id: 't2', brand: 'ChargePoint', model: 'Home Flex (NACS)', charger_level: 2, max_amps: 50, max_kw: 12.0, connector_type: 'NACS', hardwired_or_plug: 'plug', plug_type: 'NEMA 14-50', wifi_enabled: true, cable_length_ft: 23, indoor_outdoor: 'both', energy_star_certified: true, nacs_compatible: true, price_usd: 69900, amazon_asin: 'B07VNK3G11', affiliate_url: null, image_url: null, rating_stars: 4.5, review_count: 8203, is_recommended: true, recommended_for: ['tesla', 'smart'], pros: ['50A — faster than Tesla Wall Connector', '23 ft cable', 'Best-in-class ChargePoint app', 'Works with non-Tesla EVs too', 'Adjustable amperage'], cons: ['More expensive than Tesla Wall Connector', 'Larger form factor'], slug: 'chargepoint-home-flex-nacs' },
  { id: 't3', brand: 'Autel', model: 'MaxiCharger NACS', charger_level: 2, max_amps: 50, max_kw: 12.0, connector_type: 'NACS', hardwired_or_plug: 'hardwired', plug_type: null, wifi_enabled: true, cable_length_ft: 25, indoor_outdoor: 'both', energy_star_certified: false, nacs_compatible: true, price_usd: 59900, amazon_asin: 'B09QX99KQS', affiliate_url: null, image_url: null, rating_stars: 4.3, review_count: 2182, is_recommended: true, recommended_for: ['tesla', 'value'], pros: ['25 ft cable', 'Smart app + scheduling', 'NACS native', 'Good build quality'], cons: ['App less polished than ChargePoint', 'Less brand recognition'], slug: 'autel-maxicharger-nacs' },
  { id: 't4', brand: 'Emporia', model: 'EV24 + NACS Adapter', charger_level: 2, max_amps: 48, max_kw: 11.5, connector_type: 'J1772', hardwired_or_plug: 'hardwired', plug_type: null, wifi_enabled: true, cable_length_ft: 24, indoor_outdoor: 'both', energy_star_certified: true, nacs_compatible: false, price_usd: 17900, amazon_asin: 'B08MCTX1VL', affiliate_url: null, image_url: null, rating_stars: 4.2, review_count: 3892, is_recommended: true, recommended_for: ['budget-tesla'], pros: ['Under $200 for charger', 'Use with Tesla J1772 adapter (included with car)', 'WiFi scheduling', 'Energy Star'], cons: ['Requires J1772 adapter (already included with Tesla)', 'J1772 limited to 32A with Tesla adapter'], slug: 'emporia-ev24-j1772' },
];

const BADGES = ['Best for Tesla (Native)', 'Best Smart NACS Charger', 'Best NACS Value', 'Best Budget (J1772)'];

// Connector compatibility matrix
const COMPATIBILITY = [
  { vehicle: 'Tesla Model 3/Y (2024+)', nacs: '✓ Native', j1772: '✓ (adapter included)', ccs: '✗' },
  { vehicle: 'Tesla Model S/X (2024+)', nacs: '✓ Native', j1772: '✓ (adapter included)', ccs: '✗' },
  { vehicle: 'Tesla Cybertruck (2024+)', nacs: '✓ Native', j1772: '✓ (adapter included)', ccs: '✗' },
  { vehicle: 'Tesla Model 3/Y (2021–2023)', nacs: '✓ with NACS adapter', j1772: '✓ Native', ccs: '✗' },
  { vehicle: 'Tesla Model S/X (pre-2024)', nacs: '✓ with NACS adapter', j1772: '✓ Native', ccs: '✗' },
];

// Max charge speeds by vehicle
const CHARGE_SPEEDS = [
  { vehicle: 'Model 3 Long Range', max_kw: 11.5, wall_connector: '11.5 kW / 38 mi/hr', l2_other: '11.5 kW', time_to_full: '~7 hrs' },
  { vehicle: 'Model Y Long Range', max_kw: 11.5, wall_connector: '11.5 kW / 38 mi/hr', l2_other: '11.5 kW', time_to_full: '~7.5 hrs' },
  { vehicle: 'Model S Plaid', max_kw: 11.5, wall_connector: '11.5 kW / 45 mi/hr', l2_other: '11.5 kW', time_to_full: '~6 hrs' },
  { vehicle: 'Model X', max_kw: 11.5, wall_connector: '11.5 kW / 40 mi/hr', l2_other: '11.5 kW', time_to_full: '~8 hrs' },
  { vehicle: 'Cybertruck (400mi)', max_kw: 19.2, wall_connector: '19.2 kW / 50 mi/hr', l2_other: '11.5 kW', time_to_full: '~11 hrs' },
];

export default function BestTeslaChargersPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
        <Link href="/" className="hover:text-text-secondary">Home</Link>
        <span>/</span>
        <Link href="/best-ev-chargers" className="hover:text-text-secondary">Best EV Chargers</Link>
        <span>/</span>
        <span className="text-text-primary">Tesla</span>
      </nav>

      <div className="mb-8">
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Buyer&apos;s Guide</div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Best Home Chargers for Tesla 2025
        </h1>
        <p className="mt-3 max-w-2xl text-text-secondary">
          Tesla&apos;s native connector (NACS) is now an industry standard — but which charger is right for your Tesla?
          We compared the Tesla Wall Connector, third-party NACS chargers, and J1772 options.
        </p>
        <p className="mt-2 text-xs text-text-tertiary">Last updated: March 2025</p>
      </div>

      {/* NACS vs J1772 explainer */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-bg-secondary p-5">
          <h2 className="mb-2 font-semibold text-text-primary">NACS Chargers (Recommended)</h2>
          <p className="text-sm text-text-secondary">
            NACS (North American Charging Standard) is Tesla&apos;s native connector, now adopted by Ford, GM, Rivian, Honda, and most new EVs.
            A NACS charger connects directly — no adapter required. The Tesla Wall Connector and some third-party chargers (ChargePoint, Autel) have NACS versions.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-bg-secondary p-5">
          <h2 className="mb-2 font-semibold text-text-primary">J1772 Chargers (With Adapter)</h2>
          <p className="text-sm text-text-secondary">
            All Teslas ship with a J1772 adapter, so any Level 2 J1772 charger works.
            However, the J1772 adapter limits charging speed to ~32A (7.7 kW) on most Teslas — less than the 48A maximum.
            For max speed, use a NACS charger natively.
          </p>
        </div>
      </div>

      {/* Top picks */}
      <div className="grid gap-6 sm:grid-cols-2">
        {TESLA_CHARGERS.map((charger, i) => (
          <ChargerProductCard
            key={charger.id}
            charger={charger}
            rank={i + 1}
            showBadge={BADGES[i]}
          />
        ))}
      </div>

      {/* Charge speed table */}
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="mb-4 font-display text-xl font-bold text-text-primary">
          Home Charging Speeds by Tesla Model
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-secondary text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Max AC Charge Rate</th>
                <th className="px-4 py-3">Wall Connector Speed</th>
                <th className="px-4 py-3">Approx. Full Charge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {CHARGE_SPEEDS.map((row) => (
                <tr key={row.vehicle} className="bg-bg-primary hover:bg-bg-secondary">
                  <td className="px-4 py-3 font-medium text-text-primary">{row.vehicle}</td>
                  <td className="px-4 py-3 font-mono text-text-secondary">{row.max_kw} kW</td>
                  <td className="px-4 py-3 text-accent">{row.wall_connector}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.time_to_full}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-text-tertiary">Based on 11.5 kW charger (48A, 240V). Cybertruck accepts up to 19.2 kW from an 80A circuit.</p>
      </section>

      {/* Connector compatibility */}
      <section className="mt-10">
        <h2 className="mb-4 font-display text-xl font-bold text-text-primary">
          Tesla Connector Compatibility Guide
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-secondary text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">NACS Charger</th>
                <th className="px-4 py-3">J1772 Charger</th>
                <th className="px-4 py-3">CCS Charger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {COMPATIBILITY.map((row) => (
                <tr key={row.vehicle} className="bg-bg-primary hover:bg-bg-secondary">
                  <td className="px-4 py-3 font-medium text-text-primary">{row.vehicle}</td>
                  <td className="px-4 py-3 text-accent">{row.nacs}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.j1772}</td>
                  <td className="px-4 py-3 text-text-tertiary">{row.ccs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recommendation */}
      <section className="mt-10 rounded-xl border border-accent/20 bg-accent/5 p-5">
        <h2 className="mb-2 font-semibold text-text-primary">Our Recommendation for Tesla Owners</h2>
        <p className="text-sm text-text-secondary">
          <span className="font-semibold text-text-primary">Tesla Wall Connector ($475)</span> is the best choice if you want the cleanest install, Tesla app integration, and Power Sharing between multiple Teslas.
          It&apos;s the only charger with real-time load balancing for 2+ Tesla households.
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          <span className="font-semibold text-text-primary">ChargePoint Home Flex with NACS ($699)</span> is better if you want a smarter app, higher amperage (50A vs 48A), or might switch to a non-Tesla EV in the future. It also has a longer cable.
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          <span className="font-semibold text-text-primary">Emporia EV24 + J1772 adapter ($179)</span> is the budget pick — but remember the J1772 adapter limits charging to ~32A max on most Teslas.
        </p>
      </section>

      <section className="mt-10 border-t border-border pt-8">
        <h2 className="mb-3 font-display text-lg font-bold text-text-primary">Related Guides</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/best-ev-chargers" className="text-sm text-accent hover:underline">Best EV Chargers Overall</Link>
          <Link href="/best-ev-chargers/level-2" className="text-sm text-accent hover:underline">Best Level 2 Chargers</Link>
          <Link href="/charger-installation-cost" className="text-sm text-accent hover:underline">Installation Cost Calculator</Link>
          <Link href="/tax-credit-checker" className="text-sm text-accent hover:underline">Federal Tax Credit Checker</Link>
          <Link href="/ev-rebates" className="text-sm text-accent hover:underline">Utility Rebates</Link>
        </div>
      </section>
    </div>
  );
}
