import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllChargers } from '@/lib/supabase/queries/chargers';
import type { ChargerProduct } from '@/lib/supabase/queries/chargers';
import { ChargerProductCard } from '@/components/chargers/ChargerProductCard';

export const revalidate = 2592000;

export const metadata: Metadata = {
  title: 'Best Portable EV Chargers 2025 — Top 5 for Travel & Apartment Renters',
  description:
    'The best portable EV chargers of 2025 for apartment renters, travelers, and road trips. Level 1 and Level 2 options from $50–$400. Works with NEMA 14-50 and 5-15 outlets.',
  alternates: { canonical: '/best-ev-chargers/portable' },
  openGraph: {
    title: 'Best Portable EV Chargers 2025',
    description: 'Top 5 portable EV chargers for travel and apartment living. Level 1 and Level 2 options for any outlet.',
    url: '/best-ev-chargers/portable',
    type: 'website',
  },
};

const PORTABLE_CHARGERS: ChargerProduct[] = [
  { id: 'p1', brand: 'Lectron', model: 'V-BOX 32', charger_level: 2, max_amps: 32, max_kw: 7.7, connector_type: 'J1772', hardwired_or_plug: 'plug', plug_type: 'NEMA 14-50', wifi_enabled: false, cable_length_ft: 16, indoor_outdoor: 'both', energy_star_certified: false, nacs_compatible: false, price_usd: 22900, amazon_asin: 'B09MFPN6FG', affiliate_url: null, image_url: null, rating_stars: 4.3, review_count: 2341, is_recommended: true, recommended_for: ['portable', 'travel'], pros: ['Dual 120V/240V', 'NEMA 14-50 plug', '20 miles/hr at 240V', 'Use at RV parks'], cons: ['Short 16 ft cable', 'No WiFi'], slug: 'lectron-v-box-32' },
  { id: 'p2', brand: 'BougeRV', model: 'Portable EV Charger', charger_level: 2, max_amps: 32, max_kw: 7.7, connector_type: 'J1772', hardwired_or_plug: 'plug', plug_type: 'NEMA 14-50', wifi_enabled: false, cable_length_ft: 23, indoor_outdoor: 'both', energy_star_certified: false, nacs_compatible: false, price_usd: 18900, amazon_asin: 'B0BXJCJLJ8', affiliate_url: null, image_url: null, rating_stars: 4.1, review_count: 1823, is_recommended: true, recommended_for: ['budget-portable', 'camping'], pros: ['Under $200', '23 ft cable', 'Carry bag included', 'NEMA 14-50'], cons: ['Build quality below premium brands', 'No app'], slug: 'bougerv-portable' },
  { id: 'p3', brand: 'ChargePoint', model: 'Flex Portable', charger_level: 2, max_amps: 50, max_kw: 12.0, connector_type: 'J1772', hardwired_or_plug: 'plug', plug_type: 'NEMA 14-50', wifi_enabled: true, cable_length_ft: 23, indoor_outdoor: 'both', energy_star_certified: true, nacs_compatible: true, price_usd: 69900, amazon_asin: 'B07VNK3G11', affiliate_url: null, image_url: null, rating_stars: 4.5, review_count: 8203, is_recommended: true, recommended_for: ['premium-portable', 'smart'], pros: ['50A max', 'WiFi scheduling', 'NACS adapter', 'Best app'], cons: ['Most expensive portable', 'Large form factor'], slug: 'chargepoint-home-flex' },
  { id: 'p4', brand: 'Lectron', model: 'Level 1 120V EVSE', charger_level: 1, max_amps: 12, max_kw: 1.4, connector_type: 'J1772', hardwired_or_plug: 'plug', plug_type: 'NEMA 5-15', wifi_enabled: false, cable_length_ft: 20, indoor_outdoor: 'both', energy_star_certified: false, nacs_compatible: false, price_usd: 5900, amazon_asin: 'B09KJNPHBS', affiliate_url: null, image_url: null, rating_stars: 4.1, review_count: 1203, is_recommended: true, recommended_for: ['budget', 'level-1', 'emergency'], pros: ['Standard 120V outlet', 'Ultra-portable', 'Emergency backup', 'No installation'], cons: ['~4 miles/hr only', 'Not for daily drivers'], slug: 'lectron-level1' },
  { id: 'p5', brand: 'Grizzl-E', model: 'Duo', charger_level: 2, max_amps: 40, max_kw: 9.6, connector_type: 'J1772', hardwired_or_plug: 'plug', plug_type: 'NEMA 14-50', wifi_enabled: false, cable_length_ft: 24, indoor_outdoor: 'outdoor', energy_star_certified: false, nacs_compatible: false, price_usd: 39900, amazon_asin: 'B0BZQ1F1NX', affiliate_url: null, image_url: null, rating_stars: 4.6, review_count: 891, is_recommended: false, recommended_for: ['dual', 'shared'], pros: ['2 J1772 ports', '40A total', 'IP67 outdoor-rated', 'Share between 2 EVs'], cons: ['Not truly portable', 'Each port gets ~20A when both active'], slug: 'grizzle-e-duo' },
];

const BADGES = ['Best Portable', 'Best Budget Portable', 'Best Premium Portable', 'Best Level 1', 'Best for 2 EVs'];

export default async function BestPortableChargersPage() {
  const dbChargers = await getAllChargers();
  const portableChargers = dbChargers.filter((c) =>
    c.hardwired_or_plug === 'plug' && c.plug_type?.includes('14-50')
  );
  const chargers = portableChargers.length >= 3 ? portableChargers.slice(0, 5) : PORTABLE_CHARGERS;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
        <Link href="/" className="hover:text-text-secondary">Home</Link>
        <span>/</span>
        <Link href="/best-ev-chargers" className="hover:text-text-secondary">Best EV Chargers</Link>
        <span>/</span>
        <span className="text-text-primary">Portable</span>
      </nav>

      <div className="mb-8">
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Buyer&apos;s Guide</div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          Best Portable EV Chargers of 2025
        </h1>
        <p className="mt-3 max-w-2xl text-text-secondary">
          Portable EV chargers work with standard outlets — no installation required.
          The best picks for apartment renters, road trippers, and anyone without a garage.
        </p>
        <p className="mt-2 text-xs text-text-tertiary">Last updated: March 2025</p>
      </div>

      {/* Who needs a portable charger */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Apartment Renters', desc: 'No dedicated parking or panel access. Use public 120V outlets or ask your building for a NEMA 14-50.' },
          { label: 'Road Trippers', desc: 'Campgrounds and RV parks often have NEMA 14-50 outlets. A portable Level 2 gets you 20 miles/hr anywhere.' },
          { label: 'Emergency Backup', desc: 'Keep a Level 1 charger in your car as an emergency backup. Works at any standard 120V outlet.' },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-bg-secondary p-4">
            <h3 className="mb-1 font-semibold text-text-primary">{item.label}</h3>
            <p className="text-sm text-text-secondary">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {chargers.map((charger, i) => (
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
        <h2 className="mb-4 font-display text-xl font-bold text-text-primary">Charging Speed by Outlet Type</h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-secondary text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                <th className="px-4 py-3">Outlet</th>
                <th className="px-4 py-3">Voltage</th>
                <th className="px-4 py-3">Amps</th>
                <th className="px-4 py-3">kW</th>
                <th className="px-4 py-3">Miles/Hour</th>
                <th className="px-4 py-3">Full Charge (75 kWh)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                ['NEMA 5-15 (standard)', '120V', '12A', '1.4 kW', '~4 miles', '~52 hours'],
                ['NEMA 5-20 (20A outlet)', '120V', '16A', '1.9 kW', '~6 miles', '~39 hours'],
                ['NEMA 14-30 (dryer outlet)', '240V', '24A', '5.8 kW', '~20 miles', '~13 hours'],
                ['NEMA 14-50 (RV/range)', '240V', '40A', '9.6 kW', '~28 miles', '~7.8 hours'],
                ['NEMA 6-50 (welder outlet)', '240V', '40A', '9.6 kW', '~28 miles', '~7.8 hours'],
              ].map(([outlet, v, a, kw, mph, full]) => (
                <tr key={outlet} className="bg-bg-primary hover:bg-bg-secondary">
                  <td className="px-4 py-3 font-medium text-text-primary">{outlet}</td>
                  <td className="px-4 py-3 font-mono text-text-secondary">{v}</td>
                  <td className="px-4 py-3 font-mono text-text-secondary">{a}</td>
                  <td className="px-4 py-3 font-mono text-accent">{kw}</td>
                  <td className="px-4 py-3 text-text-secondary">{mph}</td>
                  <td className="px-4 py-3 text-text-secondary">{full}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Apartment tips */}
      <section className="mt-10">
        <h2 className="mb-4 font-display text-xl font-bold text-text-primary">Apartment Charging Tips</h2>
        <div className="space-y-3 text-sm text-text-secondary">
          <p><span className="font-semibold text-text-primary">Ask your building manager</span> about right-to-charge laws in your state. California, Colorado, New York, and 10+ other states require landlords to accommodate EV charging requests.</p>
          <p><span className="font-semibold text-text-primary">Look for NEMA 14-50 outlets</span> in your parking garage — buildings with electric dryers, EV parking, or workshop spaces often have them. One 14-50 outlet + a portable charger = Level 2 charging for under $250.</p>
          <p><span className="font-semibold text-text-primary">Use public Level 2 stations for daily charging</span> and keep a Level 1 charger at home for top-ups. Many workplaces, shopping centers, and destinations have free or low-cost Level 2 charging.</p>
        </div>
      </section>

      <section className="mt-10 border-t border-border pt-8">
        <h2 className="mb-3 font-display text-lg font-bold text-text-primary">Related Guides</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/best-ev-chargers" className="text-sm text-accent hover:underline">Best EV Chargers Overall</Link>
          <Link href="/best-ev-chargers/level-1" className="text-sm text-accent hover:underline">Best Level 1 Chargers</Link>
          <Link href="/apartment-ev-charging" className="text-sm text-accent hover:underline">Apartment EV Charging Guide</Link>
          <Link href="/charger-installation-cost" className="text-sm text-accent hover:underline">Installation Cost Calculator</Link>
        </div>
      </section>
    </div>
  );
}
