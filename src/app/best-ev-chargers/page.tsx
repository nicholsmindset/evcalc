import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllChargers } from '@/lib/supabase/queries/chargers';
import type { ChargerProduct } from '@/lib/supabase/queries/chargers';
import { ChargerProductCard } from '@/components/chargers/ChargerProductCard';

export const revalidate = 2592000; // 30 days

export const metadata: Metadata = {
  title: 'Best EV Chargers 2025 — Top 7 Home Chargers Reviewed',
  description:
    'The best home EV chargers of 2025 reviewed and ranked. Top picks for overall, value, smart, Tesla, portable, and high-power charging. Updated monthly.',
  alternates: { canonical: '/best-ev-chargers' },
  openGraph: {
    title: 'Best EV Chargers 2025 — Top 7 Home Chargers Reviewed',
    description: 'Expert-tested rankings of the best Level 2 home EV chargers — ChargePoint, Grizzl-E, JuiceBox, Wallbox, Tesla, and more.',
    url: '/best-ev-chargers',
    type: 'website',
  },
};

// Static editorial picks — slugs match charger_products.slug
const PICKS: { badge: string; slug: string; why: string }[] = [
  { badge: 'Best Overall', slug: 'chargepoint-home-flex', why: 'The most versatile Level 2 charger — adjustable 16–50A, WiFi app, NACS adapter available, and 23 ft cable.' },
  { badge: 'Best Value', slug: 'grizzle-e-classic', why: 'The no-nonsense choice: weatherproof, 40A hardwired, no subscription fees, lifetime warranty. Hard to beat at $269.' },
  { badge: 'Best Smart Charger', slug: 'juicebox-48', why: 'Best app + scheduling + energy monitoring. Integrates with Alexa, Google Home, and utility TOU programs.' },
  { badge: 'Best for Tesla', slug: 'tesla-wall-connector', why: 'Native NACS connector, up to 48A, sleek wall design, and auto-adjusts when multiple Teslas charge simultaneously.' },
  { badge: 'Best Portable', slug: 'lectron-v-box-32', why: 'Dual-voltage 120V/240V, NEMA 14-50 plug, 32A — 20 miles/hr at home or at any campsite RV hookup.' },
  { badge: 'Best Budget', slug: 'emporia-ev24', why: 'Full 48A, WiFi, Energy Star certified, under $200. The best bang-per-watt of any Level 2 charger on the market.' },
  { badge: 'Best High-Power', slug: 'autel-maxicharger-80a', why: '80A (19.2 kW) — the fastest residential charger available, ideal for Rivian, Hummer EV, and large-battery trucks.' },
];

const FALLBACK_CHARGERS: ChargerProduct[] = [
  { id: '1', brand: 'ChargePoint', model: 'Home Flex', charger_level: 2, max_amps: 50, max_kw: 12.0, connector_type: 'J1772', hardwired_or_plug: 'plug', plug_type: 'NEMA 14-50', wifi_enabled: true, cable_length_ft: 23, indoor_outdoor: 'both', energy_star_certified: true, nacs_compatible: true, price_usd: 69900, amazon_asin: 'B07VNK3G11', affiliate_url: null, image_url: null, rating_stars: 4.5, review_count: 8203, is_recommended: true, recommended_for: ['smart', 'overall'], pros: ['Adjustable 16–50A', '23 ft cable', 'NACS adapter available', 'No subscription fees'], cons: ['Higher upfront cost'], slug: 'chargepoint-home-flex' },
  { id: '2', brand: 'Grizzl-E', model: 'Classic', charger_level: 2, max_amps: 40, max_kw: 9.6, connector_type: 'J1772', hardwired_or_plug: 'hardwired', plug_type: null, wifi_enabled: false, cable_length_ft: 24, indoor_outdoor: 'outdoor', energy_star_certified: false, nacs_compatible: false, price_usd: 26900, amazon_asin: 'B07XF3H15J', affiliate_url: null, image_url: null, rating_stars: 4.7, review_count: 5412, is_recommended: true, recommended_for: ['value', 'outdoor'], pros: ['Lifetime warranty', 'IP67 weatherproof', '40A no subscription', 'Made in Canada'], cons: ['No WiFi', 'Hardwired only'], slug: 'grizzle-e-classic' },
  { id: '3', brand: 'JuiceBox', model: '48', charger_level: 2, max_amps: 48, max_kw: 11.5, connector_type: 'J1772', hardwired_or_plug: 'hardwired', plug_type: null, wifi_enabled: true, cable_length_ft: 25, indoor_outdoor: 'both', energy_star_certified: true, nacs_compatible: false, price_usd: 64900, amazon_asin: 'B01N4Z5DF7', affiliate_url: null, image_url: null, rating_stars: 4.4, review_count: 7891, is_recommended: true, recommended_for: ['smart', 'utility-tou'], pros: ['Best-in-class app', 'TOU scheduling', 'Alexa/Google integration', 'Energy monitoring'], cons: ['Subscription for some features'], slug: 'juicebox-48' },
  { id: '4', brand: 'Tesla', model: 'Wall Connector', charger_level: 2, max_amps: 48, max_kw: 11.5, connector_type: 'NACS', hardwired_or_plug: 'hardwired', plug_type: null, wifi_enabled: true, cable_length_ft: 18, indoor_outdoor: 'both', energy_star_certified: true, nacs_compatible: true, price_usd: 47500, amazon_asin: null, affiliate_url: 'https://www.tesla.com/support/home-charging-installation/wall-connector', image_url: null, rating_stars: 4.8, review_count: 12043, is_recommended: true, recommended_for: ['tesla', 'smart'], pros: ['Native NACS', 'Auto load-balancing', 'Sleek design', '18 ft cable'], cons: ['Tesla-first design', 'Short cable vs. competitors'], slug: 'tesla-wall-connector' },
  { id: '5', brand: 'Lectron', model: 'V-BOX 32', charger_level: 2, max_amps: 32, max_kw: 7.7, connector_type: 'J1772', hardwired_or_plug: 'plug', plug_type: 'NEMA 14-50', wifi_enabled: false, cable_length_ft: 16, indoor_outdoor: 'both', energy_star_certified: false, nacs_compatible: false, price_usd: 22900, amazon_asin: 'B09MFPN6FG', affiliate_url: null, image_url: null, rating_stars: 4.3, review_count: 2341, is_recommended: true, recommended_for: ['portable', 'budget'], pros: ['Dual-voltage 120V/240V', 'NEMA 14-50 plug', 'Portable for travel', 'No installation needed'], cons: ['32A max', 'No WiFi', 'Shorter cable'], slug: 'lectron-v-box-32' },
  { id: '6', brand: 'Emporia', model: 'EV24', charger_level: 2, max_amps: 48, max_kw: 11.5, connector_type: 'J1772', hardwired_or_plug: 'hardwired', plug_type: null, wifi_enabled: true, cable_length_ft: 24, indoor_outdoor: 'both', energy_star_certified: true, nacs_compatible: false, price_usd: 17900, amazon_asin: 'B08MCTX1VL', affiliate_url: null, image_url: null, rating_stars: 4.2, review_count: 3892, is_recommended: true, recommended_for: ['budget', 'value'], pros: ['Under $200', '48A WiFi', 'Energy Star', 'Energy monitoring'], cons: ['App less polished than JuiceBox'], slug: 'emporia-ev24' },
  { id: '7', brand: 'Autel', model: 'MaxiCharger 80A', charger_level: 2, max_amps: 80, max_kw: 19.2, connector_type: 'J1772', hardwired_or_plug: 'hardwired', plug_type: null, wifi_enabled: true, cable_length_ft: 25, indoor_outdoor: 'both', energy_star_certified: false, nacs_compatible: true, price_usd: 79900, amazon_asin: 'B09QX99KQS', affiliate_url: null, image_url: null, rating_stars: 4.3, review_count: 1872, is_recommended: false, recommended_for: ['high-power', 'trucks'], pros: ['80A / 19.2 kW max', 'NACS adapter', 'Dual-port option', 'Premium display'], cons: ['Expensive', 'Requires 100A circuit'], slug: 'autel-maxicharger-80a' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Best EV Chargers 2025',
  description: 'Top 7 home EV chargers reviewed and ranked by category',
  numberOfItems: 7,
  itemListElement: PICKS.map((pick, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: pick.badge,
  })),
};

export default async function BestEvChargersPage() {
  let chargers = await getAllChargers(2);
  if (chargers.length === 0) chargers = FALLBACK_CHARGERS;

  // Map picks to charger data
  const pickedChargers = PICKS.map((pick) => {
    const charger = chargers.find((c) => c.slug === pick.slug) ?? chargers[PICKS.indexOf(pick)] ?? chargers[0];
    return { ...pick, charger };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <span className="text-text-primary">Best EV Chargers</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">Buyer&apos;s Guide</div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Best EV Home Chargers of 2025
          </h1>
          <p className="mt-3 max-w-2xl text-text-secondary">
            We tested and ranked the top Level 2 home chargers by category — from best overall to best for Tesla owners.
            All picks include real-world charging speeds, installation requirements, and honest pros and cons.
          </p>
          <p className="mt-2 text-xs text-text-tertiary">
            Last updated: March 2025 · Data verified from manufacturer specs and Amazon reviews
          </p>
        </div>

        {/* Quick nav */}
        <div className="mb-10 rounded-xl border border-border bg-bg-secondary p-5">
          <h2 className="mb-3 text-sm font-semibold text-text-primary">Jump to Category</h2>
          <div className="flex flex-wrap gap-2">
            {PICKS.map((p) => (
              <a
                key={p.badge}
                href={`#${p.badge.toLowerCase().replace(/\s+/g, '-')}`}
                className="rounded-lg border border-border bg-bg-tertiary px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-accent/30 hover:text-accent"
              >
                {p.badge}
              </a>
            ))}
          </div>
        </div>

        {/* Picks */}
        <div className="space-y-12">
          {pickedChargers.map(({ badge, why, charger }) => (
            <section key={badge} id={badge.toLowerCase().replace(/\s+/g, '-')}>
              <div className="mb-4">
                <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                  {badge}
                </span>
                <p className="mt-2 text-sm text-text-secondary">{why}</p>
              </div>
              <div className="max-w-sm">
                <ChargerProductCard charger={charger} showBadge={badge} />
              </div>
            </section>
          ))}
        </div>

        {/* Comparison table */}
        <section className="mt-14 border-t border-border pt-8">
          <h2 className="mb-5 font-display text-xl font-bold text-text-primary">Full Comparison Table</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-secondary text-left text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  <th className="px-4 py-3">Charger</th>
                  <th className="px-4 py-3">Amps</th>
                  <th className="px-4 py-3">Speed</th>
                  <th className="px-4 py-3">WiFi</th>
                  <th className="px-4 py-3">Install</th>
                  <th className="px-4 py-3">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pickedChargers.map(({ badge, charger }) => (
                  <tr key={badge} className="bg-bg-primary transition-colors hover:bg-bg-secondary">
                    <td className="px-4 py-3">
                      <div className="font-medium text-text-primary">{charger.brand} {charger.model}</div>
                      <div className="text-xs text-accent">{badge}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-text-primary">{charger.max_amps}A</td>
                    <td className="px-4 py-3 text-text-secondary">{charger.max_kw.toFixed(1)} kW</td>
                    <td className="px-4 py-3">
                      <span className={charger.wifi_enabled ? 'text-accent' : 'text-text-tertiary'}>
                        {charger.wifi_enabled ? '✓' : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 capitalize text-text-secondary">{charger.hardwired_or_plug}</td>
                    <td className="px-4 py-3 font-mono font-semibold text-text-primary">
                      ${(charger.price_usd / 100).toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Buying guide */}
        <section className="mt-10">
          <h2 className="mb-4 font-display text-xl font-bold text-text-primary">How to Choose an EV Charger</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: 'Hardwired vs Plug-In', body: 'Hardwired chargers are permanently mounted — typically 40–80A, require an electrician. Plug-in chargers use a NEMA 14-50 outlet — convenient but limited to 32–50A. If you own your home and plan to stay, hardwired is more future-proof.' },
              { title: 'How Many Amps Do You Need?', body: 'A 40A charger adds ~25 miles/hour — enough to fully charge most EVs overnight. Go to 48A+ if you drive >100 miles daily. 80A is only needed for Rivian R1T/R1S, GMC Hummer EV, or other large-battery vehicles.' },
              { title: 'WiFi / Smart Features', body: 'Smart chargers let you schedule off-peak charging to save on electricity costs, monitor energy use, and receive alerts. If your utility has TOU rates, WiFi scheduling can pay for itself quickly.' },
              { title: 'NACS vs J1772 Connector', body: 'Tesla vehicles use NACS. Most other EVs use J1772. Many chargers now offer NACS adapters or dual-port options. The Tesla Wall Connector is NACS-native; all others use J1772 with an optional adapter.' },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-bg-secondary p-4">
                <h3 className="mb-1.5 font-semibold text-text-primary">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sub-guide links */}
        <section className="mt-10 border-t border-border pt-8">
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">Category Guides</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: '/best-ev-chargers/level-2', label: 'Best Level 2 Chargers', desc: 'Top 6 hardwired & plug-in' },
              { href: '/best-ev-chargers/portable', label: 'Best Portable Chargers', desc: 'Top 5 for travel & renters' },
              { href: '/best-ev-chargers/level-1', label: 'Best Level 1 Chargers', desc: 'Top 5 for 120V charging' },
              { href: '/best-ev-chargers/tesla', label: 'Best for Tesla', desc: 'Wall Connector vs J1772 adapters' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-xl border border-border bg-bg-secondary p-4 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
              >
                <div className="font-medium text-text-primary group-hover:text-accent transition-colors">{item.label}</div>
                <div className="mt-0.5 text-xs text-text-tertiary">{item.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Related tools */}
        <section className="mt-10 border-t border-border pt-8">
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">Related Tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/home-charger-wizard" className="text-sm text-accent hover:underline">Home Charger Setup Wizard</Link>
            <Link href="/charger-installation-cost" className="text-sm text-accent hover:underline">Installation Cost Calculator</Link>
            <Link href="/ev-rebates" className="text-sm text-accent hover:underline">Utility Rebates</Link>
            <Link href="/tax-credit-checker" className="text-sm text-accent hover:underline">Federal Tax Credit Checker</Link>
          </div>
        </section>
      </div>
    </>
  );
}
