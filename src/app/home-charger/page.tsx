import Link from 'next/link';
import type { Metadata } from 'next';
import { ProductRecommendation, type AffiliateProduct } from '@/components/affiliate/ProductRecommendation';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { FAQSection } from '@/components/seo/FAQSection';
import { generateWebApplicationSchema, generateBreadcrumbSchema } from '@/lib/utils/seo';

export const metadata: Metadata = {
  title: 'Home EV Charger Guide — Which Charger Is Right for You?',
  description: 'Compare Level 1 vs Level 2 home EV chargers. Learn installation costs, charging speeds, electrical requirements, and the best chargers for every budget.',
};

const HOME_CHARGER_FAQS = [
  { question: 'How much does a home EV charger cost?', answer: 'A Level 2 home EV charger costs $300-700 for the unit, plus $500-2,000 for professional installation. Total cost ranges from $800-2,700 depending on your electrical setup. The ChargePoint Home Flex ($699) and Grizzl-E Classic ($460) are top-rated options.' },
  { question: 'Can I install an EV charger myself?', answer: 'A Level 1 charger (120V) requires no installation — just plug into a standard outlet. Level 2 chargers require a 240V circuit and should be installed by a licensed electrician for safety and code compliance. DIY 240V electrical work may void your warranty and violate local building codes.' },
  { question: 'How long does it take to charge an EV at home?', answer: 'Level 1 (120V): 40-60 hours for a full charge, adding 3-5 miles per hour. Level 2 at 32A (7.7 kW): 8-10 hours, adding 25-30 miles per hour. Level 2 at 48A (11.5 kW): 5-7 hours, adding 35-45 miles per hour. Most EV owners charge overnight and wake up to a full battery.' },
  { question: 'Do I need to upgrade my electrical panel?', answer: 'If your panel is 200A or higher, you likely have capacity for a Level 2 charger without an upgrade. Older homes with 100A or 150A panels may need an upgrade ($1,500-3,000). An electrician can assess your available capacity. Some smart chargers can share circuits to avoid panel upgrades.' },
  { question: 'What is the best home EV charger?', answer: 'Top picks for 2025: ChargePoint Home Flex (best overall, 50A, WiFi, $699), Grizzl-E Classic (best value, 40A, $460), Tesla Wall Connector (best for Tesla owners, 48A, $475), and Wallbox Pulsar Plus (best smart features, 48A, $649). All are UL-listed and rated for indoor/outdoor use.' },
];

const CHARGERS = [
  {
    name: 'Level 1 (120V)',
    power: '1.4 kW',
    milesPerHour: '3-5',
    fullChargeTime: '40-60 hours',
    installCost: '$0',
    monthlyElectric: '$30-50',
    bestFor: 'PHEVs, low-mileage drivers, apartments',
    pros: ['No installation needed', 'Uses standard outlet', 'Zero upfront cost'],
    cons: ['Very slow charging', 'Not practical for long-range EVs', 'May not keep up with daily driving'],
  },
  {
    name: 'Level 2 — 32A (7.7 kW)',
    power: '7.7 kW',
    milesPerHour: '25-30',
    fullChargeTime: '8-10 hours',
    installCost: '$500-1,500',
    monthlyElectric: '$30-50',
    bestFor: 'Most EV owners, daily commuters',
    pros: ['Overnight full charge', 'Reasonable install cost', 'Most popular option'],
    cons: ['Requires 240V outlet or hardwire', 'May need electrical panel upgrade'],
  },
  {
    name: 'Level 2 — 48A (11.5 kW)',
    power: '11.5 kW',
    milesPerHour: '35-45',
    fullChargeTime: '5-7 hours',
    installCost: '$800-2,000',
    monthlyElectric: '$30-50',
    bestFor: 'Large battery EVs, high-mileage drivers, multi-EV households',
    pros: ['Fastest home charging', 'Future-proof', 'Great for large batteries'],
    cons: ['Higher equipment cost', 'May require 60A circuit', 'Possible panel upgrade'],
  },
];

const POPULAR_UNITS = [
  { name: 'ChargePoint Home Flex', amps: '16-50A', price: '$699', wifi: true, cable: '23 ft', rating: '4.7/5' },
  { name: 'Grizzl-E Classic', amps: '16-40A', price: '$460', wifi: false, cable: '24 ft', rating: '4.6/5' },
  { name: 'JuiceBox 48', amps: '48A', price: '$589', wifi: true, cable: '25 ft', rating: '4.5/5' },
  { name: 'Wallbox Pulsar Plus', amps: '48A', price: '$649', wifi: true, cable: '25 ft', rating: '4.5/5' },
  { name: 'Tesla Wall Connector', amps: '48A', price: '$475', wifi: true, cable: '24 ft', rating: '4.7/5' },
  { name: 'Lectron V-Box', amps: '48A', price: '$380', wifi: false, cable: '21 ft', rating: '4.4/5' },
];

const HOME_CHARGER_PRODUCTS: AffiliateProduct[] = [
  {
    name: 'ChargePoint Home Flex Level 2 EV Charger',
    category: 'charger',
    affiliateUrl: 'https://www.amazon.com/dp/B07WXZDHGV?tag=evrangecalc-20',
    priceDisplay: '$699.00',
    rating: 4.6,
    reviewCount: 3200,
    description: 'NEMA 14-50 plug or hardwired. Up to 50A / 12kW. WiFi-connected with energy tracking.',
  },
  {
    name: 'Grizzl-E Classic Level 2 EV Charger',
    category: 'charger',
    affiliateUrl: 'https://www.amazon.com/dp/B085C7152V?tag=evrangecalc-20',
    priceDisplay: '$459.00',
    rating: 4.7,
    reviewCount: 1800,
    description: 'NEMA 14-50 plug. 40A / 9.6kW. Indoor/outdoor rated. No subscription. 24ft cable.',
  },
  {
    name: 'Lectron NACS to J1772 Adapter',
    category: 'adapter',
    affiliateUrl: 'https://www.amazon.com/dp/B0CNFK7YH4?tag=evrangecalc-20',
    priceDisplay: '$149.99',
    rating: 4.5,
    reviewCount: 890,
    description: 'Charge non-Tesla EVs at Tesla Superchargers. Supports up to 250kW DC and 19.2kW AC.',
  },
];

export default function HomeChargerPage() {
  return (
    <>
    <SchemaMarkup
      schema={[
        generateWebApplicationSchema(
          'Home EV Charger Guide',
          'Compare Level 1 vs Level 2 home EV chargers. Learn installation costs, charging speeds, and electrical requirements.',
          '/home-charger'
        ),
        generateBreadcrumbSchema([
          { name: 'Home', href: '/' },
          { name: 'Home Charger Guide', href: '/home-charger' },
        ]),
      ]}
    />
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          Home EV Charger Guide
        </h1>
        <p className="mt-2 max-w-2xl text-text-secondary">
          Everything you need to know about charging your EV at home — from choosing the right
          charger to installation costs and electrical requirements.
        </p>
      </div>

      {/* Charger Comparison */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-display font-bold text-text-primary">
          Level 1 vs Level 2: Which Do You Need?
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {CHARGERS.map((charger, i) => (
            <div
              key={charger.name}
              className={`rounded-xl border p-6 ${i === 1 ? 'border-accent/30 bg-bg-secondary ring-1 ring-accent/10' : 'border-border bg-bg-secondary'}`}
            >
              {i === 1 && (
                <span className="mb-3 inline-block rounded-full bg-accent/10 px-3 py-0.5 text-xs font-semibold text-accent">
                  Most Popular
                </span>
              )}
              <h3 className="font-display text-lg font-bold text-text-primary">{charger.name}</h3>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Power</span>
                  <span className="font-mono font-semibold text-text-primary">{charger.power}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Miles/Hour</span>
                  <span className="font-mono font-semibold text-accent">{charger.milesPerHour}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Full Charge</span>
                  <span className="font-mono font-semibold text-text-primary">{charger.fullChargeTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Install Cost</span>
                  <span className="font-mono font-semibold text-text-primary">{charger.installCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Monthly Electric</span>
                  <span className="font-mono font-semibold text-text-primary">{charger.monthlyElectric}</span>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-bg-tertiary p-3 text-xs text-text-secondary">
                <strong className="text-text-primary">Best for:</strong> {charger.bestFor}
              </div>
              <div className="mt-4 space-y-1">
                {charger.pros.map((pro) => (
                  <p key={pro} className="text-xs text-success">+ {pro}</p>
                ))}
                {charger.cons.map((con) => (
                  <p key={con} className="text-xs text-error">- {con}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Charger Units */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-display font-bold text-text-primary">
          Top-Rated Home Chargers (2025)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-text-tertiary">
                <th className="pb-3 pr-4">Charger</th>
                <th className="pb-3 pr-4">Amps</th>
                <th className="pb-3 pr-4">Price</th>
                <th className="pb-3 pr-4">Wi-Fi</th>
                <th className="pb-3 pr-4">Cable</th>
                <th className="pb-3">Rating</th>
              </tr>
            </thead>
            <tbody>
              {POPULAR_UNITS.map((unit) => (
                <tr key={unit.name} className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium text-text-primary">{unit.name}</td>
                  <td className="py-3 pr-4 font-mono text-text-secondary">{unit.amps}</td>
                  <td className="py-3 pr-4 font-mono font-semibold text-accent">{unit.price}</td>
                  <td className="py-3 pr-4 text-text-secondary">{unit.wifi ? 'Yes' : 'No'}</td>
                  <td className="py-3 pr-4 font-mono text-text-secondary">{unit.cable}</td>
                  <td className="py-3 font-mono text-warning">{unit.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recommended Products */}
      <ProductRecommendation
        title="Top Picks: Home Charging Equipment"
        className="mb-12"
        products={HOME_CHARGER_PRODUCTS}
      />

      {/* Installation Checklist */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-display font-bold text-text-primary">
          Installation Checklist
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { step: '1', title: 'Check Your Electrical Panel', desc: 'You need at least 40A available capacity for a Level 2 charger. Panels under 200A may need upgrading.' },
            { step: '2', title: 'Choose Location', desc: 'Install near your parking spot. Shorter cable runs = lower install cost. Indoor garage is ideal.' },
            { step: '3', title: 'Get Permits', desc: 'Most jurisdictions require an electrical permit. Your electrician should handle this.' },
            { step: '4', title: 'Hire a Licensed Electrician', desc: 'Get 2-3 quotes. Typical install: $500-1,500. Panel upgrade if needed: $1,500-3,000.' },
            { step: '5', title: 'Check Incentives', desc: 'Many utilities offer $200-500 rebates for Level 2 charger installation. Check your provider.' },
            { step: '6', title: 'Consider Time-of-Use Rates', desc: 'Switch to TOU electricity plan to charge at night for 50%+ savings on electricity.' },
          ].map((item) => (
            <div key={item.step} className="rounded-xl border border-border bg-bg-secondary p-5">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                <span className="font-mono text-sm font-bold text-accent">{item.step}</span>
              </div>
              <h3 className="font-display font-semibold text-text-primary">{item.title}</h3>
              <p className="mt-1 text-sm text-text-secondary">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection faqs={HOME_CHARGER_FAQS} />

      {/* Related Tools */}
      <section className="rounded-xl border border-border bg-bg-secondary p-6">
        <h2 className="mb-4 text-lg font-display font-semibold text-text-primary">Related Tools</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link href="/charging-cost-calculator" className="text-sm text-accent hover:underline">Charging Cost Calculator</Link>
          <Link href="/ev-vs-gas" className="text-sm text-accent hover:underline">EV vs Gas Savings</Link>
          <Link href="/tco-calculator" className="text-sm text-accent hover:underline">Total Cost of Ownership</Link>
          <Link href="/charging-stations" className="text-sm text-accent hover:underline">Charging Station Finder</Link>
          <Link href="/calculator" className="text-sm text-accent hover:underline">Range Calculator</Link>
          <Link href="/blog/how-to-maximize-ev-battery-life" className="text-sm text-accent hover:underline">Battery Health Guide</Link>
        </div>
      </section>
    </div>
    </>
  );
}
