import type { Metadata } from 'next';
import Link from 'next/link';
import type { ChargerProduct } from '@/lib/supabase/queries/chargers';
import { ChargerProductCard } from '@/components/chargers/ChargerProductCard';

export const revalidate = 2592000;

export const metadata: Metadata = {
  title: 'Best Level 1 EV Chargers 2025 — Top 5 Slow Chargers for Home',
  description:
    'The best Level 1 EV chargers of 2025 for 120V home charging. Top picks for plug-in convenience chargers that work with any standard outlet. From $49–$299.',
  alternates: { canonical: '/best-ev-chargers/level-1' },
  openGraph: {
    title: 'Best Level 1 EV Chargers 2025',
    description: 'Top 5 Level 1 EV chargers for 120V home charging — ideal for PHEVs, short commuters, and emergency backup.',
    url: '/best-ev-chargers/level-1',
    type: 'website',
  },
};

const LEVEL1_CHARGERS: ChargerProduct[] = [
  { id: 'l1a', brand: 'Lectron', model: 'Level 1 EVSE', charger_level: 1, max_amps: 16, max_kw: 1.9, connector_type: 'J1772', hardwired_or_plug: 'plug', plug_type: 'NEMA 5-15', wifi_enabled: false, cable_length_ft: 20, indoor_outdoor: 'both', energy_star_certified: false, nacs_compatible: false, price_usd: 5900, amazon_asin: 'B09KJNPHBS', affiliate_url: null, image_url: null, rating_stars: 4.2, review_count: 1345, is_recommended: true, recommended_for: ['level-1', 'budget'], pros: ['Works on standard 120V outlet', 'Ultra-portable with carry bag', 'Emergency backup', '20 ft cable'], cons: ['~5–6 miles/hr max', 'Not for daily long commutes'], slug: 'lectron-l1-evse' },
  { id: 'l1b', brand: 'JuiceBox', model: '32 Smart EVSE', charger_level: 1, max_amps: 32, max_kw: 7.7, connector_type: 'J1772', hardwired_or_plug: 'plug', plug_type: 'NEMA 14-50', wifi_enabled: true, cable_length_ft: 25, indoor_outdoor: 'both', energy_star_certified: true, nacs_compatible: false, price_usd: 54900, amazon_asin: 'B0CQRS3TH4', affiliate_url: null, image_url: null, rating_stars: 4.3, review_count: 891, is_recommended: true, recommended_for: ['smart', 'phev'], pros: ['WiFi scheduling', 'Energy monitoring', 'Can plug into 120V or 240V', 'JuiceBox app'], cons: ['Pricier than non-smart L1 options'], slug: 'juicebox-32' },
  { id: 'l1c', brand: 'Siemens', model: 'VersiCharge VC30GRYU', charger_level: 1, max_amps: 30, max_kw: 3.6, connector_type: 'J1772', hardwired_or_plug: 'plug', plug_type: 'NEMA 6-30', wifi_enabled: false, cable_length_ft: 20, indoor_outdoor: 'indoor', energy_star_certified: false, nacs_compatible: false, price_usd: 29900, amazon_asin: 'B00GMKV7NC', affiliate_url: null, image_url: null, rating_stars: 4.4, review_count: 2891, is_recommended: true, recommended_for: ['reliable', 'indoor'], pros: ['Trusted brand', '20 ft cable', 'Proven reliability', 'Simple design'], cons: ['No WiFi', 'Indoor-only rated'], slug: 'siemens-versicharge' },
  { id: 'l1d', brand: 'BougeRV', model: 'Level 1 EVSE', charger_level: 1, max_amps: 12, max_kw: 1.4, connector_type: 'J1772', hardwired_or_plug: 'plug', plug_type: 'NEMA 5-15', wifi_enabled: false, cable_length_ft: 25, indoor_outdoor: 'both', energy_star_certified: false, nacs_compatible: false, price_usd: 4900, amazon_asin: 'B0C8R55H7G', affiliate_url: null, image_url: null, rating_stars: 4.0, review_count: 743, is_recommended: false, recommended_for: ['budget', 'phev'], pros: ['Under $50', '25 ft cable', 'Lightweight for travel', 'Carry bag included'], cons: ['12A limit', 'Lower build quality'], slug: 'bougerv-l1-evse' },
  { id: 'l1e', brand: 'Mustart', model: 'Level 1+2 EVSE', charger_level: 1, max_amps: 16, max_kw: 1.9, connector_type: 'J1772', hardwired_or_plug: 'plug', plug_type: 'NEMA 5-15', wifi_enabled: false, cable_length_ft: 25, indoor_outdoor: 'both', energy_star_certified: false, nacs_compatible: false, price_usd: 11900, amazon_asin: 'B08VHW9T5W', affiliate_url: null, image_url: null, rating_stars: 4.2, review_count: 1203, is_recommended: false, recommended_for: ['phev', 'travel'], pros: ['Works on 120V and 240V', '25 ft cable', 'IP67 weather-rated', 'Adjustable amps'], cons: ['Complex interface', 'Bulky form factor'], slug: 'mustart-l1-l2-evse' },
];

const BADGES = ['Best Overall L1', 'Best Smart L1', 'Most Reliable', 'Best Budget L1', 'Most Versatile'];

// Charge time data for popular PHEVs
const PHEV_TIMES = [
  { vehicle: 'Toyota Prius Prime', battery_kwh: 8.8, l1_hrs: '~7 hrs', l2_hrs: '~2 hrs' },
  { vehicle: 'Ford Escape PHEV', battery_kwh: 14.4, l1_hrs: '~11 hrs', l2_hrs: '~3.5 hrs' },
  { vehicle: 'Jeep Wrangler 4xe', battery_kwh: 17.0, l1_hrs: '~13 hrs', l2_hrs: '~4 hrs' },
  { vehicle: 'Hyundai Tucson PHEV', battery_kwh: 13.8, l1_hrs: '~10 hrs', l2_hrs: '~3.5 hrs' },
  { vehicle: 'Chevrolet Volt', battery_kwh: 18.4, l1_hrs: '~15 hrs', l2_hrs: '~4.5 hrs' },
  { vehicle: 'BMW 330e', battery_kwh: 12.0, l1_hrs: '~9 hrs', l2_hrs: '~3 hrs' },
];

export default function BestLevel1ChargersPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
        <Link href="/" className="hover:text-text-secondary">Home</Link>
        <span>/</span>
        <Link href="/best-ev-chargers" className="hover:text-text-secondary">Best EV Chargers</Link>
        <span>/</span>
        <span className="text-text-primary">Level 1</span>
      </nav>

      <div className="mb-8">
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Buyer&apos;s Guide</div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Best Level 1 EV Chargers of 2025
        </h1>
        <p className="mt-3 max-w-2xl text-text-secondary">
          Level 1 chargers use any standard 120V outlet — no installation needed.
          Best for PHEVs, short commuters, and anyone who needs a reliable backup.
        </p>
        <p className="mt-2 text-xs text-text-tertiary">Last updated: March 2025</p>
      </div>

      {/* When L1 makes sense */}
      <div className="mb-10 rounded-xl border border-border bg-bg-secondary p-5">
        <h2 className="mb-3 font-semibold text-text-primary">When Is Level 1 Charging Enough?</h2>
        <div className="grid gap-3 sm:grid-cols-3 text-sm text-text-secondary">
          <div>
            <div className="font-semibold text-text-primary mb-1">PHEVs (under 25 kWh)</div>
            <p>PHEVs have small batteries (8–20 kWh) that fully charge in 7–15 hours at 120V overnight. Level 2 is faster but not necessary.</p>
          </div>
          <div>
            <div className="font-semibold text-text-primary mb-1">Short Commuters (&lt;40 miles)</div>
            <p>If you drive less than 40 miles/day, a Level 1 charger replenishes your range overnight (~50 miles in 12 hours at 120V 12A).</p>
          </div>
          <div>
            <div className="font-semibold text-text-primary mb-1">Emergency Backup</div>
            <p>Every EV owner should have a Level 1 EVSE in the car. When Level 2 isn't available, any 120V outlet keeps you from running empty.</p>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {LEVEL1_CHARGERS.map((charger, i) => (
          <ChargerProductCard
            key={charger.id}
            charger={charger}
            rank={i + 1}
            showBadge={BADGES[i]}
          />
        ))}
      </div>

      {/* PHEV charge times */}
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="mb-4 font-display text-xl font-bold text-text-primary">
          PHEV Charge Times: Level 1 vs Level 2
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-secondary text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Battery</th>
                <th className="px-4 py-3">Level 1 (120V 12A)</th>
                <th className="px-4 py-3">Level 2 (240V 32A)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PHEV_TIMES.map((row) => (
                <tr key={row.vehicle} className="bg-bg-primary hover:bg-bg-secondary">
                  <td className="px-4 py-3 font-medium text-text-primary">{row.vehicle}</td>
                  <td className="px-4 py-3 font-mono text-text-secondary">{row.battery_kwh} kWh</td>
                  <td className="px-4 py-3 text-text-secondary">{row.l1_hrs}</td>
                  <td className="px-4 py-3 text-accent font-medium">{row.l2_hrs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-text-tertiary">
          Assumes 90% charging efficiency. L1 at 12A / 1.44 kW. L2 at 32A / 7.68 kW.
        </p>
      </section>

      {/* Upgrade recommendation */}
      <section className="mt-10 rounded-xl border border-accent/20 bg-accent/5 p-5">
        <h2 className="mb-2 font-semibold text-text-primary">Should You Upgrade to Level 2?</h2>
        <p className="text-sm text-text-secondary">
          If you drive a full BEV (not a PHEV), a Level 2 charger is almost always worth the investment.
          A 40A Level 2 charger costs $600–$1,200 installed, but the federal 30% tax credit brings it down to $420–$840.
          Many utility companies also offer $200–$500 rebates. The time savings and convenience pay for themselves quickly.
        </p>
        <div className="mt-3 flex gap-3">
          <Link
            href="/charger-installation-cost"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg-primary hover:bg-accent-dim"
          >
            Calculate Installation Cost
          </Link>
          <Link
            href="/ev-rebates"
            className="rounded-lg border border-accent/30 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/5"
          >
            Find Utility Rebates
          </Link>
        </div>
      </section>

      <section className="mt-10 border-t border-border pt-8">
        <h2 className="mb-3 font-display text-lg font-bold text-text-primary">Related Guides</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/best-ev-chargers" className="text-sm text-accent hover:underline">Best EV Chargers Overall</Link>
          <Link href="/best-ev-chargers/portable" className="text-sm text-accent hover:underline">Best Portable Chargers</Link>
          <Link href="/best-ev-chargers/level-2" className="text-sm text-accent hover:underline">Best Level 2 Chargers</Link>
          <Link href="/home-charger-wizard" className="text-sm text-accent hover:underline">Home Charger Setup Wizard</Link>
        </div>
      </section>
    </div>
  );
}
