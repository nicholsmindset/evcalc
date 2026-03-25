import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllChargers } from '@/lib/supabase/queries/chargers';
import type { ChargerProduct } from '@/lib/supabase/queries/chargers';
import { ChargerProductCard } from '@/components/chargers/ChargerProductCard';

export const revalidate = 2592000;

export const metadata: Metadata = {
  title: 'Best Level 2 EV Chargers 2025 — Top 6 Home Chargers Reviewed',
  description:
    'The best Level 2 home EV chargers of 2025. Top picks for hardwired and plug-in 240V charging, from $175 to $800. Compared by speed, features, and price.',
  alternates: { canonical: '/best-ev-chargers/level-2' },
  openGraph: {
    title: 'Best Level 2 EV Chargers 2025',
    description: 'Top 6 Level 2 home EV chargers — ChargePoint Home Flex, Grizzl-E, JuiceBox 48, Emporia, Wallbox, and more.',
    url: '/best-ev-chargers/level-2',
    type: 'website',
  },
};

const FALLBACK_L2: ChargerProduct[] = [
  { id: '1', brand: 'ChargePoint', model: 'Home Flex', charger_level: 2, max_amps: 50, max_kw: 12.0, connector_type: 'J1772', hardwired_or_plug: 'plug', plug_type: 'NEMA 14-50', wifi_enabled: true, cable_length_ft: 23, indoor_outdoor: 'both', energy_star_certified: true, nacs_compatible: true, price_usd: 69900, amazon_asin: 'B07VNK3G11', affiliate_url: null, image_url: null, rating_stars: 4.5, review_count: 8203, is_recommended: true, recommended_for: ['overall'], pros: ['Adjustable 16–50A amperage', '23 ft cable', 'NACS adapter included', 'Strong app'], cons: ['Higher cost than competitors'], slug: 'chargepoint-home-flex' },
  { id: '2', brand: 'Grizzl-E', model: 'Classic', charger_level: 2, max_amps: 40, max_kw: 9.6, connector_type: 'J1772', hardwired_or_plug: 'hardwired', plug_type: null, wifi_enabled: false, cable_length_ft: 24, indoor_outdoor: 'outdoor', energy_star_certified: false, nacs_compatible: false, price_usd: 26900, amazon_asin: 'B07XF3H15J', affiliate_url: null, image_url: null, rating_stars: 4.7, review_count: 5412, is_recommended: true, recommended_for: ['value'], pros: ['Lifetime warranty', 'IP67 weatherproof', '40A no fees'], cons: ['No WiFi'], slug: 'grizzle-e-classic' },
  { id: '3', brand: 'JuiceBox', model: '48', charger_level: 2, max_amps: 48, max_kw: 11.5, connector_type: 'J1772', hardwired_or_plug: 'hardwired', plug_type: null, wifi_enabled: true, cable_length_ft: 25, indoor_outdoor: 'both', energy_star_certified: true, nacs_compatible: false, price_usd: 64900, amazon_asin: 'B01N4Z5DF7', affiliate_url: null, image_url: null, rating_stars: 4.4, review_count: 7891, is_recommended: true, recommended_for: ['smart'], pros: ['Best-in-class app', 'TOU scheduling', 'Alexa/Google integration'], cons: ['Some features require subscription'], slug: 'juicebox-48' },
  { id: '4', brand: 'Emporia', model: 'EV24', charger_level: 2, max_amps: 48, max_kw: 11.5, connector_type: 'J1772', hardwired_or_plug: 'hardwired', plug_type: null, wifi_enabled: true, cable_length_ft: 24, indoor_outdoor: 'both', energy_star_certified: true, nacs_compatible: false, price_usd: 17900, amazon_asin: 'B08MCTX1VL', affiliate_url: null, image_url: null, rating_stars: 4.2, review_count: 3892, is_recommended: true, recommended_for: ['budget'], pros: ['Under $200', '48A WiFi', 'Energy monitoring'], cons: ['App quality below JuiceBox'], slug: 'emporia-ev24' },
  { id: '5', brand: 'Wallbox', model: 'Pulsar Plus', charger_level: 2, max_amps: 48, max_kw: 11.5, connector_type: 'J1772', hardwired_or_plug: 'hardwired', plug_type: null, wifi_enabled: true, cable_length_ft: 25, indoor_outdoor: 'both', energy_star_certified: true, nacs_compatible: false, price_usd: 64900, amazon_asin: 'B08MX9GGWH', affiliate_url: null, image_url: null, rating_stars: 4.3, review_count: 4201, is_recommended: true, recommended_for: ['smart', 'compact'], pros: ['Compact design', 'Bluetooth + WiFi', 'bidirectional V2H on some models'], cons: ['App can be slow'], slug: 'wallbox-pulsar-plus' },
  { id: '6', brand: 'Autel', model: 'MaxiCharger 80A', charger_level: 2, max_amps: 80, max_kw: 19.2, connector_type: 'J1772', hardwired_or_plug: 'hardwired', plug_type: null, wifi_enabled: true, cable_length_ft: 25, indoor_outdoor: 'both', energy_star_certified: false, nacs_compatible: true, price_usd: 79900, amazon_asin: 'B09QX99KQS', affiliate_url: null, image_url: null, rating_stars: 4.3, review_count: 1872, is_recommended: false, recommended_for: ['high-power'], pros: ['80A max', 'NACS adapter', 'Fastest residential charger'], cons: ['Requires 100A dedicated circuit', 'Most expensive'], slug: 'autel-maxicharger-80a' },
];

const RANK_BADGES = ['Best Overall', 'Best Value', 'Best Smart', 'Best Budget', 'Most Compact', 'Most Powerful'];

const SPEC_TABLE_KEYS: { key: keyof ChargerProduct; label: string }[] = [
  { key: 'max_amps', label: 'Max Amps' },
  { key: 'max_kw', label: 'Max kW' },
  { key: 'wifi_enabled', label: 'WiFi' },
  { key: 'cable_length_ft', label: 'Cable' },
  { key: 'hardwired_or_plug', label: 'Install' },
  { key: 'price_usd', label: 'Price' },
];

export default async function BestLevel2ChargersPage() {
  let chargers = await getAllChargers(2);
  if (chargers.length === 0) chargers = FALLBACK_L2;
  const top6 = chargers.slice(0, 6);

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <Link href="/best-ev-chargers" className="hover:text-text-secondary">Best EV Chargers</Link>
          <span>/</span>
          <span className="text-text-primary">Level 2</span>
        </nav>

        <div className="mb-8">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Buyer&apos;s Guide</div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Best Level 2 EV Chargers of 2025
          </h1>
          <p className="mt-3 max-w-2xl text-text-secondary">
            Level 2 chargers run on 240V and deliver 15–75 miles of range per hour — replacing your EV battery overnight.
            Here are the top 6 picks for 2025, tested for speed, reliability, and value.
          </p>
          <p className="mt-2 text-xs text-text-tertiary">Last updated: March 2025</p>
        </div>

        {/* What is Level 2 */}
        <div className="mb-10 rounded-xl border border-accent/20 bg-accent/5 p-5">
          <h2 className="mb-2 font-semibold text-text-primary">What Is a Level 2 Charger?</h2>
          <p className="text-sm text-text-secondary">
            Level 2 chargers use a 240V outlet (same as your dryer) and deliver 3–19 kW — roughly 15–75 miles of range per hour.
            They require either a NEMA 14-50 plug-in or hardwired installation by a licensed electrician.
            A 40A Level 2 charger can fully charge most EVs in 4–8 hours — ideal for overnight charging at home.
          </p>
        </div>

        {/* Product grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {top6.map((charger, i) => (
            <ChargerProductCard
              key={charger.id}
              charger={charger}
              rank={i + 1}
              showBadge={RANK_BADGES[i]}
            />
          ))}
        </div>

        {/* Comparison table */}
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-4 font-display text-xl font-bold text-text-primary">Side-by-Side Comparison</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-secondary text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  <th className="px-4 py-3">Charger</th>
                  {SPEC_TABLE_KEYS.map((k) => (
                    <th key={k.key} className="px-4 py-3">{k.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {top6.map((c, i) => (
                  <tr key={c.id} className="bg-bg-primary transition-colors hover:bg-bg-secondary">
                    <td className="px-4 py-3">
                      <div className="font-medium text-text-primary">{c.brand} {c.model}</div>
                      <div className="text-xs text-accent">{RANK_BADGES[i]}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-text-primary">{c.max_amps}A</td>
                    <td className="px-4 py-3 font-mono text-text-secondary">{c.max_kw.toFixed(1)}</td>
                    <td className="px-4 py-3">
                      <span className={c.wifi_enabled ? 'text-accent' : 'text-text-tertiary'}>
                        {c.wifi_enabled ? '✓' : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{c.cable_length_ft ? `${c.cable_length_ft} ft` : '—'}</td>
                    <td className="px-4 py-3 capitalize text-text-secondary">{c.hardwired_or_plug}</td>
                    <td className="px-4 py-3 font-mono font-semibold text-text-primary">${(c.price_usd / 100).toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Buying advice */}
        <section className="mt-10">
          <h2 className="mb-4 font-display text-xl font-bold text-text-primary">Level 2 Charger Buying Guide</h2>
          <div className="space-y-4 text-sm text-text-secondary">
            <div>
              <h3 className="mb-1 font-semibold text-text-primary">32A vs 40A vs 48A — Which to Choose?</h3>
              <p>A 32A charger (7.7 kW) adds about 22 miles/hour — fine for average commuters under 60 miles/day. A 40A charger (9.6 kW) adds 28 miles/hour and is the sweet spot for most drivers. Go to 48A (11.5 kW) if you drive 80–100 miles daily or want faster top-ups. Only choose 60A+ for long-range vehicles you frequently drive over 200 miles.</p>
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-text-primary">Plug-In vs Hardwired</h3>
              <p>Plug-in models (NEMA 14-50) are easier to install, portable if you move, and can be DIY if you already have a 240V outlet. Hardwired chargers are more permanently installed, can go higher amperage (50A+), and look cleaner on the wall. For most homeowners planning to stay long-term, hardwired is the better choice.</p>
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-text-primary">Do You Need WiFi?</h3>
              <p>WiFi adds $50–150 to the price but delivers real value: off-peak scheduling (saves $15–40/month on electricity), remote monitoring, and utility program integration. The JuiceBox 48 has the best app; the Emporia EV24 has WiFi for under $200. If you have TOU electricity rates, WiFi pays for itself in 6–12 months.</p>
            </div>
          </div>
        </section>

        {/* Related */}
        <section className="mt-10 border-t border-border pt-8">
          <h2 className="mb-3 font-display text-lg font-bold text-text-primary">Related Guides</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/best-ev-chargers" className="text-sm text-accent hover:underline">Best EV Chargers Overall</Link>
            <Link href="/best-ev-chargers/portable" className="text-sm text-accent hover:underline">Best Portable Chargers</Link>
            <Link href="/best-ev-chargers/tesla" className="text-sm text-accent hover:underline">Best for Tesla</Link>
            <Link href="/charger-installation-cost" className="text-sm text-accent hover:underline">Installation Cost Calculator</Link>
            <Link href="/ev-rebates" className="text-sm text-accent hover:underline">Utility Rebates</Link>
          </div>
        </section>
      </div>
    </>
  );
}
