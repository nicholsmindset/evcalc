import type { Metadata } from 'next';
import Link from 'next/link';
import BatteryTrackerContent from './BatteryTrackerContent';

export const metadata: Metadata = {
  title: 'EV Battery Health Tracker — Estimate Your Battery Degradation',
  description:
    'Estimate your EV battery health by model and mileage. See projected degradation curve, warranty status, and when to expect 80% capacity. Based on real fleet data.',
  alternates: { canonical: '/battery-health-tracker' },
  openGraph: {
    title: 'EV Battery Health Tracker — How Degraded Is Your Battery?',
    description:
      'Enter your EV model, purchase year, and mileage to see estimated battery health %, degradation projection chart, and warranty coverage status.',
    url: '/battery-health-tracker',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'EV Battery Health Tracker',
      url: 'https://evrangetools.com/battery-health-tracker',
      description: 'Estimate EV battery health percentage based on vehicle model, purchase year, and mileage using fleet degradation data.',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evrangetools.com' },
        { '@type': 'ListItem', position: 2, name: 'Battery Health Tracker', item: 'https://evrangetools.com/battery-health-tracker' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How fast do EV batteries degrade?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most modern EVs with active thermal management degrade at 1.5-2.5% per year on average. A Tesla Model 3 loses about 2% capacity annually, meaning an 8-year-old vehicle would have roughly 84-86% of original capacity. The Nissan LEAF (30-40 kWh) degrades faster at ~4%/year due to passive air cooling.',
          },
        },
        {
          '@type': 'Question',
          name: 'What does the EV battery warranty cover?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Federal law requires EVs sold after 2010 to have an 8-year/100,000-mile battery warranty. Most manufacturers cover battery replacement if capacity drops below 70% (60% for some Chevy models) within the warranty period. Rivian offers the best warranty at 8 years/175,000 miles.',
          },
        },
        {
          '@type': 'Question',
          name: 'How can I check my actual EV battery health?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The most accurate methods: (1) Many EVs show battery health in the official app — Tesla, Rivian, and Hyundai display State of Health. (2) OBD-II diagnostic apps (Torque Pro, LeafSpy for LEAF, Tesla Scanner for Tesla) can read battery management system data. (3) Have a dealer run a battery diagnostic. (4) Track your max range at 100% charge over time and compare to EPA range.',
          },
        },
        {
          '@type': 'Question',
          name: 'At what battery health should I be concerned?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Below 80% health is when most drivers start noticing significant range reduction (e.g., a 300-mile EV now gets 240 miles). Below 70% typically triggers a warranty claim if still within the coverage period. Below 60% makes the vehicle impractical for many drivers and significantly reduces resale value.',
          },
        },
      ],
    },
  ],
};

export default function BatteryHealthTrackerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <span className="text-text-primary">Battery Health Tracker</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            EV Battery Health Tracker
          </h1>
          <p className="mt-3 text-text-secondary">
            Estimate your battery&apos;s health based on model and mileage, see projected degradation over time,
            and check your warranty coverage.
          </p>
        </div>

        <BatteryTrackerContent />

        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-3 font-display text-lg font-bold text-text-primary">Related Tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/winter-ev-range" className="text-sm text-accent hover:underline">Winter EV Range Calculator</Link>
            <Link href="/calculator" className="text-sm text-accent hover:underline">EV Range Calculator</Link>
            <Link href="/find-my-ev" className="text-sm text-accent hover:underline">Find My EV</Link>
            <Link href="/ev-depreciation-calculator" className="text-sm text-accent hover:underline">EV Depreciation Calculator</Link>
          </div>
        </section>
      </div>
    </>
  );
}
