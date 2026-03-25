import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ChargerWizard } from '@/components/wizard/ChargerWizard';
import { RelatedTools } from '@/components/ui/RelatedTools';

export const metadata: Metadata = {
  title: 'Home EV Charger Setup Wizard 2025 | Find the Best Level 2 Charger',
  description:
    'Answer 5 questions and get personalized Level 2 EV charger recommendations, installation cost estimates for your state, and electrician guidance. Free.',
  alternates: { canonical: '/home-charger-wizard' },
  openGraph: {
    title: 'Home EV Charger Setup Wizard 2025',
    description:
      'Get personalized charger recommendations, installation cost estimates, and electrician guidance — in under 2 minutes.',
    url: '/home-charger-wizard',
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    q: 'What is a Level 2 EV charger?',
    a: 'A Level 2 charger uses 240V power (the same voltage as a dryer or oven) and typically delivers 7–12 kW of charging power, adding 25–50 miles of range per hour. This is the standard for home charging — a full charge overnight from near-empty is easy. Level 1 (120V) adds only 3–5 miles/hour and is too slow for most drivers.',
  },
  {
    q: 'How much does it cost to install a Level 2 charger?',
    a: 'Installation costs range from $200–$1,200 depending on your location and electrical situation. If you already have a 240V outlet (NEMA 14-50) nearby, costs are on the low end. A new circuit from your panel typically runs $400–$800 in labor, wire, breaker, and permit fees. A full panel upgrade (if needed) adds $1,500–$3,000.',
  },
  {
    q: 'Do I need a permit to install an EV charger?',
    a: 'In most states, yes — a permit is required for new 240V circuit installation. Your electrician should handle the permit. Permit costs range from $50–$200. Some jurisdictions allow homeowner-pulled permits. Skipping permits can cause issues when selling your home or filing insurance claims.',
  },
  {
    q: 'Can I install a Level 2 charger myself?',
    a: 'The charger mounting itself is straightforward, but the 240V electrical work requires a licensed electrician in most states. Some jurisdictions allow homeowner electrical work with a permit. For safety and code compliance, we strongly recommend hiring a licensed electrician for the circuit installation.',
  },
  {
    q: 'What is the federal tax credit for EV charger installation?',
    a: 'The IRS 30C Alternative Fuel Vehicle Refueling Property Credit provides a 30% tax credit (up to $1,000) for residential EV charger purchase and installation costs. This is separate from the vehicle $7,500 credit. You must install the charger at your primary residence and file IRS Form 8911.',
  },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Home EV Charger Setup Wizard',
  applicationCategory: 'UtilitiesApplication',
  description: 'Personalized Level 2 EV charger recommendations with installation cost estimates by state.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
};

export default function HomeChargerWizardPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <nav className="mb-3 flex gap-2 text-xs text-text-tertiary">
            <Link href="/" className="hover:text-text-secondary">Home</Link>
            <span>/</span>
            <span className="text-text-primary">Home Charger Setup Wizard</span>
          </nav>
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Home EV Charger Setup Wizard
          </h1>
          <p className="mt-3 max-w-2xl text-text-secondary">
            Answer 5 quick questions and get personalized charger recommendations, installation cost estimates
            for your state, and a guide for your electrician.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="flex items-center gap-1.5 text-text-secondary">
              <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Real Amazon prices
            </span>
            <span className="flex items-center gap-1.5 text-text-secondary">
              <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Installation costs by state
            </span>
            <span className="flex items-center gap-1.5 text-text-secondary">
              <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Electrician guide included
            </span>
          </div>
        </div>

        {/* Wizard */}
        <div className="rounded-2xl border border-border bg-bg-secondary p-6 sm:p-8">
          <Suspense fallback={<div className="h-80 animate-pulse rounded-xl bg-bg-tertiary" />}>
            <ChargerWizard />
          </Suspense>
        </div>

        {/* Federal tax credit callout */}
        <div className="mt-8 rounded-xl border border-accent/20 bg-accent/5 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display font-semibold text-text-primary">
                30% Federal Tax Credit for Charger Installation
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                IRS Form 8911 — claim up to <span className="font-semibold text-accent">$1,000 back</span> on your charger + installation costs.
                No income limit.
              </p>
            </div>
            <Link
              href="/ev-tax-credit"
              className="whitespace-nowrap rounded-lg border border-accent/30 px-4 py-2 text-sm font-semibold text-accent transition-all hover:bg-accent/10"
            >
              Check Eligibility →
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <section className="mt-14 border-t border-border pt-10">
          <h2 className="mb-6 font-display text-2xl font-bold text-text-primary">
            Home EV Charger FAQs
          </h2>
          <div className="space-y-5">
            {FAQ_ITEMS.map(({ q, a }) => (
              <div key={q} className="rounded-xl border border-border bg-bg-secondary p-5">
                <h3 className="font-display font-semibold text-text-primary">{q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{a}</p>
              </div>
            ))}
          </div>
        </section>

        <RelatedTools tools={[
          { href: '/charger-installation-cost', emoji: '🔧', label: 'Installation Cost Calculator', desc: 'Itemized installation cost estimates by state' },
          { href: '/ev-rebates', emoji: '💵', label: 'Utility Rebates', desc: '35+ utilities offering up to $1,000 back on charger installation' },
          { href: '/charging-schedule', emoji: '🕐', label: 'Charging Schedule Optimizer', desc: 'Set off-peak charging windows to minimize electricity costs' },
        ]} />
      </div>
    </>
  );
}
