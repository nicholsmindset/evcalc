import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { generateBreadcrumbSchema } from '@/lib/utils/seo';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { TowingTool } from './components/TowingTool';

export const metadata: Metadata = {
  title: 'Best Electric Trucks & SUVs for Towing 2026 — EV Towing Capacity Guide',
  description:
    'Compare towing capacity, payload, and real-world range-while-towing for 15 capable electric vehicles. Includes a range-while-towing calculator.',
  alternates: { canonical: '/ev-towing' },
  openGraph: {
    title: 'Best Electric Trucks & SUVs for Towing 2026 — EV Towing Capacity Guide',
    description:
      'Compare towing capacity, payload, and real-world range-while-towing for 15 capable electric vehicles. Includes a range-while-towing calculator.',
    url: '/ev-towing',
    type: 'website',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Best Electric Trucks and SUVs for Towing 2026 — EV Towing Capacity Guide',
  url: 'https://evrangetools.com/ev-towing',
  author: { '@type': 'Organization', name: 'EV Range Tools' },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', href: '/' },
  { name: 'EV Towing Guide', href: '/ev-towing' },
]);

export default function EvTowingPage() {
  return (
    <>
      <SchemaMarkup schema={[articleSchema, breadcrumbSchema]} />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <span className="text-text-primary">EV Towing Guide</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Best Electric Trucks &amp; SUVs for Towing
          </h1>
          <p className="mt-3 text-text-secondary">
            Compare towing capacity, payload, and real-world range-while-towing for every capable EV —
            sorted by max tow weight. Includes a range-while-towing calculator.
          </p>
        </div>

        <TowingTool />

        {/* EV Towing Tips */}
        <section className="mt-8">
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">EV Towing Tips</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { tip: 'Plan charging stops more carefully', detail: 'With 30\u201350% range reduction while towing, you need 2\u00d7 the charging stops vs. solo driving. Use A Better Routeplanner (ABRP) with trailer weight set.' },
              { tip: 'Never exceed GVWR or tongue weight', detail: 'Tongue weight (typically 10\u201315% of trailer weight) must not exceed rating. Overloading risks vehicle damage, battery stress, and brake failure.' },
              { tip: 'Reduce highway speed', detail: 'Aerodynamic drag from a trailer increases exponentially with speed. Towing at 60 mph vs 70 mph can add 20+ miles of range.' },
              { tip: 'Use regenerative braking in tow mode', detail: 'Most EVs have a tow mode that increases regen strength \u2014 this helps slow the vehicle+trailer without burning brakes on downhills.' },
              { tip: 'Pre-condition the battery before DCFC', detail: 'Cold batteries charge much slower. Set a navigation destination on the car\'s built-in nav before arriving at a fast charger.' },
              { tip: 'Charge the trailer too (if V2L capable)', detail: 'IONIQ 5, EV6, and Kia EV9 have V2L outlets. You can run an inverter on the trailer for campsite power at no extra fuel cost.' },
            ].map(({ tip, detail }) => (
              <div key={tip} className="rounded-lg border border-border bg-bg-secondary p-4">
                <div className="mb-1 font-semibold text-text-primary">{tip}</div>
                <div className="text-sm text-text-secondary">{detail}</div>
              </div>
            ))}
          </div>
        </section>

        <RelatedTools tools={[
          { href: '/calculator', emoji: '\ud83d\udcca', label: 'Range Calculator', desc: 'Estimate range at towing speeds and heavy loads' },
          { href: '/road-trip-planner', emoji: '\ud83d\uddfa\ufe0f', label: 'Road Trip Planner', desc: 'Plan a towing trip with charging stops factored in' },
          { href: '/ev-vs-gas', emoji: '\u26fd', label: 'EV vs Gas Savings', desc: 'Compare towing costs vs a gas truck over 5 years' },
        ]} />
      </div>
    </>
  );
}
