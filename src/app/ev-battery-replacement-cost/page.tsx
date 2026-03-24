import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { FAQSection } from '@/components/seo/FAQSection';
import { generateBreadcrumbSchema } from '@/lib/utils/seo';

export const metadata: Metadata = {
  title: 'EV Battery Replacement Cost — How Much Does It Cost in 2025?',
  description:
    'Find out how much an EV battery replacement costs by model. Tesla, Hyundai, Chevy, Nissan battery prices, warranty coverage, and how long EV batteries really last.',
  alternates: { canonical: '/ev-battery-replacement-cost' },
  openGraph: {
    title: 'EV Battery Replacement Cost — How Much Does It Cost in 2025?',
    description:
      'Find out how much an EV battery replacement costs by model. Battery prices, warranty coverage, and how long EV batteries really last.',
    url: '/ev-battery-replacement-cost',
    type: 'website',
  },
};

const BATTERY_COSTS = [
  { make: 'Tesla', model: 'Model 3', kwh: '75 kWh', cost: '$13,000-16,000', warranty: '8 yr / 100K mi' },
  { make: 'Tesla', model: 'Model Y', kwh: '75-82 kWh', cost: '$14,000-17,000', warranty: '8 yr / 120K mi' },
  { make: 'Tesla', model: 'Model S/X', kwh: '100 kWh', cost: '$20,000-25,000', warranty: '8 yr / 150K mi' },
  { make: 'Chevrolet', model: 'Bolt EV', kwh: '65 kWh', cost: '$9,000-16,000', warranty: '8 yr / 100K mi' },
  { make: 'Nissan', model: 'Leaf (40 kWh)', kwh: '40 kWh', cost: '$5,500-8,500', warranty: '8 yr / 100K mi' },
  { make: 'Hyundai', model: 'Ioniq 5', kwh: '77 kWh', cost: '$15,000-20,000', warranty: '8 yr / 100K mi' },
  { make: 'Ford', model: 'Mustang Mach-E', kwh: '91 kWh', cost: '$16,000-22,000', warranty: '8 yr / 100K mi' },
  { make: 'Kia', model: 'EV6', kwh: '77 kWh', cost: '$15,000-19,000', warranty: '8 yr / 100K mi' },
];

const BATTERY_FAQS = [
  { question: 'How much does EV battery replacement cost?', answer: 'EV battery replacement costs range from $5,500-25,000 depending on the vehicle model and battery size. The Nissan Leaf (40 kWh) is on the lower end at $5,500-8,500. Tesla Model S/X batteries (100 kWh) can cost $20,000-25,000. Most replacements fall in the $10,000-16,000 range.' },
  { question: 'How long does an EV battery last before replacement?', answer: 'Modern EV batteries are designed to last 15-20 years or 200,000-300,000 miles. Real-world data from Teslas shows average degradation of just 12% after 200,000 miles. Most owners will never need a battery replacement — warranties cover 8 years/100,000 miles with at least 70% capacity retention.' },
  { question: 'Is EV battery replacement covered under warranty?', answer: "Yes. Federal law requires EV manufacturers to warrant the battery for at least 8 years or 100,000 miles, guaranteeing a minimum of 70% of original capacity. Many brands offer 10-year/150,000-mile coverage. If your battery degrades below 70% within the warranty period, the manufacturer must repair or replace it for free." },
  { question: 'Can I replace just part of an EV battery?', answer: "It depends on the manufacturer. Tesla uses a modular design allowing replacement of individual battery modules (typically $1,500-5,000 per module). Nissan also offers module replacements for the Leaf. Other manufacturers often require replacing the entire pack. Aftermarket battery refurbishers offer rebuilt packs at 30-50% below dealer prices." },
  { question: 'Will EV battery replacement costs drop?', answer: 'Yes, significantly. Battery costs have fallen 90% since 2010 (from $1,100/kWh to $115/kWh in 2024). By 2030, replacement costs are projected to drop to $3,000-8,000 for most vehicles. Solid-state batteries entering production around 2027-2030 promise both lower costs and longer lifespan.' },
];

export default function EvBatteryReplacementCostPage() {
  return (
    <>
      <SchemaMarkup
        schema={generateBreadcrumbSchema([
          { name: 'Home', href: '/' },
          { name: 'EV Battery Replacement Cost', href: '/ev-battery-replacement-cost' },
        ])}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
            EV Battery Replacement Cost — How Much Does It Cost in 2025?
          </h1>
          <p className="mt-3 max-w-2xl text-text-secondary">
            Real battery replacement costs by model, warranty coverage details, and how long EV
            batteries actually last. Data sourced from manufacturer quotes and owner reports.
          </p>
        </div>

        {/* Cost Table */}
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-display font-bold text-text-primary">
            Battery Replacement Cost by Model (2025)
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-secondary text-left text-xs text-text-tertiary">
                  <th className="px-4 py-3 font-medium">Make</th>
                  <th className="px-4 py-3 font-medium">Model</th>
                  <th className="px-4 py-3 font-medium">Battery Size</th>
                  <th className="px-4 py-3 font-medium">Replacement Cost</th>
                  <th className="px-4 py-3 font-medium">Warranty</th>
                </tr>
              </thead>
              <tbody>
                {BATTERY_COSTS.map((row) => (
                  <tr key={`${row.make}-${row.model}`} className="border-b border-border/50">
                    <td className="px-4 py-3 font-medium text-text-primary">{row.make}</td>
                    <td className="px-4 py-3 text-text-secondary">{row.model}</td>
                    <td className="px-4 py-3 font-mono text-text-secondary">{row.kwh}</td>
                    <td className="px-4 py-3 font-mono font-semibold text-accent">{row.cost}</td>
                    <td className="px-4 py-3 text-text-secondary">{row.warranty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-text-tertiary">
            Costs include parts and labor. Prices vary by region and change over time. Source: Manufacturer quotes and owner reports.
          </p>
        </section>

        {/* Key Facts */}
        <section className="mb-12 grid gap-6 sm:grid-cols-3">
          {[
            { stat: '2-3%', label: 'Average annual battery degradation', sub: 'Real-world data from 350,000+ EVs' },
            { stat: '$115/kWh', label: 'Average battery cost in 2024', sub: 'Down 90% from $1,100/kWh in 2010' },
            { stat: '8 years', label: 'Federal warranty minimum', sub: 'Guaranteed 70%+ capacity retention' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-bg-secondary p-6 text-center">
              <div className="font-mono text-3xl font-bold text-accent">{item.stat}</div>
              <div className="mt-2 font-medium text-text-primary">{item.label}</div>
              <div className="mt-1 text-xs text-text-tertiary">{item.sub}</div>
            </div>
          ))}
        </section>

        {/* Related Tools */}
        <section className="mb-12 rounded-xl border border-border bg-bg-secondary p-6">
          <h2 className="mb-4 text-lg font-display font-semibold text-text-primary">Related Tools</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/tco-calculator" className="text-sm text-accent hover:underline">Total Cost of Ownership Calculator</Link>
            <Link href="/ev-vs-gas" className="text-sm text-accent hover:underline">EV vs Gas Savings Calculator</Link>
            <Link href="/calculator" className="text-sm text-accent hover:underline">EV Range Calculator</Link>
            <Link href="/vehicles" className="text-sm text-accent hover:underline">Browse EV Specs & Range</Link>
            <Link href="/ev-vs-hybrid" className="text-sm text-accent hover:underline">EV vs Hybrid Comparison</Link>
            <Link href="/home-charger" className="text-sm text-accent hover:underline">Home Charger Guide</Link>
          </div>
        </section>

        <FAQSection faqs={BATTERY_FAQS} />
      </div>
    </>
  );
}
