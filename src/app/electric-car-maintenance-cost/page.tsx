import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { FAQSection } from '@/components/seo/FAQSection';
import { generateBreadcrumbSchema } from '@/lib/utils/seo';

export const metadata: Metadata = {
  title: 'Electric Car Maintenance Cost — EV vs Gas Maintenance Compared',
  description:
    'How much does it cost to maintain an electric car? Compare EV vs gas car maintenance costs, what EVs need serviced, and how much you save per year.',
  alternates: { canonical: '/electric-car-maintenance-cost' },
  openGraph: {
    title: 'Electric Car Maintenance Cost — EV vs Gas Maintenance Compared',
    description:
      'Compare EV vs gas car maintenance costs. See what EVs need serviced and how much you save per year.',
    url: '/electric-car-maintenance-cost',
    type: 'website',
  },
};

const MAINTENANCE_COMPARISON = [
  { service: 'Oil Change', ev: 'Never needed', gas: '$60-150 every 5K-7.5K mi', savings: '$150-450/yr' },
  { service: 'Transmission Service', ev: 'Not applicable', gas: '$80-200 every 30K mi', savings: '$30-80/yr' },
  { service: 'Spark Plugs', ev: 'Not applicable', gas: '$100-300 every 30K mi', savings: '$40-120/yr' },
  { service: 'Timing Belt', ev: 'Not applicable', gas: '$500-1,000 every 60-100K mi', savings: '$60-150/yr' },
  { service: 'Brake Service', ev: 'Rarely (regenerative braking)', gas: '$300-600 every 25K-35K mi', savings: '$200-400/yr' },
  { service: 'Air Filter (engine)', ev: 'Not applicable', gas: '$30-80 every 12K mi', savings: '$30-80/yr' },
  { service: 'Cabin Air Filter', ev: '$20-50/yr', gas: '$20-50/yr', savings: '$0' },
  { service: 'Tire Rotation', ev: '$50-80/yr', gas: '$50-80/yr', savings: '$0' },
  { service: 'Coolant Flush', ev: '$0 (minimal cooling system)', gas: '$100-150 every 30K mi', savings: '$30-60/yr' },
  { service: 'Wiper Blades', ev: '$20-50/yr', gas: '$20-50/yr', savings: '$0' },
];

const MAINTENANCE_FAQS = [
  { question: 'How much does it cost to maintain an electric car?', answer: 'Electric car owners spend an average of $600-1,000/year on maintenance — roughly 40% less than gas cars ($900-1,500/year). EVs eliminate oil changes, transmission service, spark plugs, and timing belts. The main costs are tire rotations, cabin air filter, wiper blades, and occasional brake fluid checks.' },
  { question: 'Do electric cars need oil changes?', answer: "No. Electric motors don't use engine oil, so EVs never need oil changes. This alone saves $150-450 per year compared to a gas car. Some EVs have small gearbox oil reservations that may need service every 50,000-100,000 miles, but this is much less frequent and cheaper than regular oil changes." },
  { question: 'How long do EV brakes last?', answer: 'EV brakes typically last 100,000-150,000+ miles thanks to regenerative braking. When you lift off the accelerator, the motor slows the car and captures energy, reducing physical brake use by 60-90%. Many EV owners never replace brake pads in the first 100,000 miles.' },
  { question: 'What does an electric car need for maintenance?', answer: 'Regular EV maintenance includes: tire rotation every 5,000-7,500 miles ($50-80), cabin air filter annually ($20-50), wiper blades annually ($20-50), brake fluid check every 2 years ($50-100), coolant check every 2 years (minimal), and tire pressure monitoring. Total: $600-900/year.' },
  { question: 'Are electric cars more reliable than gas cars?', answer: 'EVs have significantly fewer parts that can fail — no combustion engine, transmission, exhaust system, fuel injectors, or catalytic converter. Consumer Reports data shows EV owners report 40% fewer problems than gas car owners. Tesla and Hyundai/Kia EVs consistently rank among the most reliable vehicles in their categories.' },
];

export default function ElectricCarMaintenanceCostPage() {
  return (
    <>
      <SchemaMarkup
        schema={generateBreadcrumbSchema([
          { name: 'Home', href: '/' },
          { name: 'Electric Car Maintenance Cost', href: '/electric-car-maintenance-cost' },
        ])}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
            Electric Car Maintenance Cost — EV vs Gas Compared
          </h1>
          <p className="mt-3 max-w-2xl text-text-secondary">
            EV owners save an average of $4,600 over 100,000 miles on maintenance alone. Here is
            exactly what electric cars need — and what they skip entirely.
          </p>
        </div>

        {/* Summary Stats */}
        <section className="mb-12 grid gap-6 sm:grid-cols-3">
          {[
            { stat: '$600-900', label: 'Average EV maintenance per year', sub: 'vs $900-1,500 for gas cars' },
            { stat: '40%', label: 'Less maintenance than gas cars', sub: 'Fewer parts = fewer failures' },
            { stat: '$4,600', label: 'Savings over 100,000 miles', sub: 'Source: Consumer Reports' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-border bg-bg-secondary p-6 text-center">
              <div className="font-mono text-3xl font-bold text-accent">{item.stat}</div>
              <div className="mt-2 font-medium text-text-primary">{item.label}</div>
              <div className="mt-1 text-xs text-text-tertiary">{item.sub}</div>
            </div>
          ))}
        </section>

        {/* Maintenance Comparison Table */}
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-display font-bold text-text-primary">
            EV vs Gas Car — Service-by-Service Comparison
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-secondary text-left text-xs text-text-tertiary">
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium text-accent">Electric Car</th>
                  <th className="px-4 py-3 font-medium">Gas Car</th>
                  <th className="px-4 py-3 font-medium text-success">Annual Savings</th>
                </tr>
              </thead>
              <tbody>
                {MAINTENANCE_COMPARISON.map((row) => (
                  <tr key={row.service} className="border-b border-border/50">
                    <td className="px-4 py-3 font-medium text-text-primary">{row.service}</td>
                    <td className={`px-4 py-3 ${row.ev.includes('Never') || row.ev.includes('Not') || row.ev.includes('Rarely') ? 'text-accent font-medium' : 'text-text-secondary'}`}>
                      {row.ev}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{row.gas}</td>
                    <td className={`px-4 py-3 font-mono font-semibold ${row.savings === '$0' ? 'text-text-tertiary' : 'text-success'}`}>
                      {row.savings}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Related Tools */}
        <section className="mb-12 rounded-xl border border-border bg-bg-secondary p-6">
          <h2 className="mb-4 text-lg font-display font-semibold text-text-primary">Calculate Your Total Savings</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/ev-vs-gas" className="text-sm text-accent hover:underline">EV vs Gas Savings Calculator</Link>
            <Link href="/tco-calculator" className="text-sm text-accent hover:underline">Total Cost of Ownership</Link>
            <Link href="/ev-battery-replacement-cost" className="text-sm text-accent hover:underline">Battery Replacement Cost</Link>
            <Link href="/calculator" className="text-sm text-accent hover:underline">EV Range Calculator</Link>
            <Link href="/vehicles" className="text-sm text-accent hover:underline">Browse All EV Models</Link>
            <Link href="/ev-vs-hybrid" className="text-sm text-accent hover:underline">EV vs Hybrid Comparison</Link>
          </div>
        </section>

        <FAQSection faqs={MAINTENANCE_FAQS} />
      </div>
    </>
  );
}
