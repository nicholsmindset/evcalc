import type { Metadata } from 'next';
import Link from 'next/link';
import { FAQSection } from '@/components/seo/FAQSection';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { ChargingTimeTool } from './components/ChargingTimeTool';

export const metadata: Metadata = {
  title: 'EV Charging Time Calculator — How Long Does It Take to Charge?',
  description:
    'Calculate exactly how long it takes to charge any electric vehicle. Compare Level 1, Level 2, and DC fast charging speeds based on battery size and charge level.',
  alternates: {
    canonical: '/ev-charging-time-calculator',
  },
  openGraph: {
    title: 'EV Charging Time Calculator — How Long Does It Take to Charge?',
    description:
      'Calculate exactly how long it takes to charge any electric vehicle. Compare Level 1, Level 2, and DC fast charging speeds based on battery size and charge level.',
    url: '/ev-charging-time-calculator',
    type: 'website',
  },
};

const CHARGING_FAQS = [
  { question: 'How long does it take to charge an electric car?', answer: 'Charging time depends on battery size and charger speed. Level 1 (120V): 40-60 hours for a full charge. Level 2 at home: 8-12 hours. DC fast charger (50 kW): 1-2 hours from near-empty to 80%. Ultra-fast DC (150-350 kW): 20-45 minutes from 10% to 80%.' },
  { question: 'How long does it take to charge a Tesla?', answer: 'Tesla charging times: Level 2 at 48A: 6-9 hours for a full charge. Tesla Supercharger (250 kW): 15-25 minutes for 80% on Model 3/Y. Model S/X at a V3 Supercharger can add up to 1,000 miles per hour of charging at peak rates.' },
  { question: 'Why do EVs only charge to 80% at fast chargers?', answer: "DC fast chargers slow significantly above 80% to protect battery longevity. The last 20% (80-100%) can take as long as the first 80%. For road trips, it's most efficient to stop at 10-20% and charge to 80% rather than waiting for 100%. Most EVs show this charging curve in their navigation systems." },
  { question: 'How many kWh does it take to charge an EV?', answer: 'It depends on battery size and current state of charge. Most EVs have 40-100 kWh batteries. Charging from empty to full requires the full battery capacity minus charging losses (typically 10-15%). A 75 kWh battery needs about 83 kWh of grid electricity for a complete charge.' },
  { question: 'Does charging speed damage EV batteries?', answer: 'Frequent DC fast charging can slightly accelerate battery degradation — typically an additional 1-2% per year for daily fast chargers. Level 2 charging is gentler on the battery. Most manufacturers recommend using DC fast charging only when needed on trips, and relying on Level 2 for daily charging.' },
];

const CHARGING_SPEED_ROWS = [
  { type: 'Level 1 (120V)', power: '1.4 kW', mph: '3-5 mi', use: 'PHEVs, overnight trickle charge' },
  { type: 'Level 2 — 32A', power: '7.7 kW', mph: '25-30 mi', use: 'Daily home charging' },
  { type: 'Level 2 — 48A', power: '11.5 kW', mph: '35-45 mi', use: 'Fast home or destination charging' },
  { type: 'DC Fast 50 kW', power: '50 kW', mph: '100-150 mi', use: 'Older public stations' },
  { type: 'DC Fast 150 kW', power: '150 kW', mph: '200-300 mi', use: 'Highway charging stops' },
  { type: 'DC Fast 350 kW', power: '350 kW', mph: '400-600 mi', use: 'Ultra-fast road trip charging' },
];

export default function EvChargingTimeCalculatorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SchemaMarkup
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'EV Charging Time Calculator',
            description:
              'Calculate exactly how long it takes to charge any electric vehicle. Compare Level 1, Level 2, and DC fast charging speeds based on battery size and charge level.',
            url: '/ev-charging-time-calculator',
            applicationCategory: 'UtilityApplication',
            operatingSystem: 'All',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: CHARGING_FAQS.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: '/',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'EV Charging Time Calculator',
                item: '/ev-charging-time-calculator',
              },
            ],
          },
        ]}
      />

      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          EV Charging Time Calculator — How Long to Charge?
        </h1>
        <p className="mt-3 max-w-2xl text-text-secondary">
          Calculate exactly how long it takes to charge any electric vehicle based on battery size,
          current charge level, and charger type.
        </p>
      </div>

      <ChargingTimeTool />

      {/* Charging Speed Reference Guide */}
      <section className="mt-12 mb-12">
        <h2 className="mb-6 text-xl font-display font-bold text-text-primary">
          Charging Speed Reference Guide
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-secondary text-left text-xs text-text-tertiary">
                <th className="px-4 py-3">Charger Type</th>
                <th className="px-4 py-3">Power</th>
                <th className="px-4 py-3">Miles / Hour</th>
                <th className="px-4 py-3">Best For</th>
              </tr>
            </thead>
            <tbody>
              {CHARGING_SPEED_ROWS.map((row) => (
                <tr key={row.type} className="border-b border-border/50">
                  <td className="px-4 py-3 font-medium text-text-primary">{row.type}</td>
                  <td className="px-4 py-3 font-mono text-accent">{row.power}</td>
                  <td className="px-4 py-3 font-mono text-text-secondary">{row.mph}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-12 rounded-xl border border-border bg-bg-secondary p-6">
        <h2 className="mb-4 text-lg font-display font-semibold text-text-primary">Related Tools</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/charging-cost-calculator" className="text-sm text-accent hover:underline">Charging Cost Calculator</Link>
          <Link href="/charging-stations" className="text-sm text-accent hover:underline">Find Charging Stations</Link>
          <Link href="/home-charger" className="text-sm text-accent hover:underline">Home Charger Guide</Link>
          <Link href="/road-trip-planner" className="text-sm text-accent hover:underline">Road Trip Planner</Link>
          <Link href="/calculator" className="text-sm text-accent hover:underline">Range Calculator</Link>
          <Link href="/ev-vs-gas" className="text-sm text-accent hover:underline">EV vs Gas Savings</Link>
        </div>
      </section>

      <FAQSection faqs={CHARGING_FAQS} />
    </div>
  );
}
