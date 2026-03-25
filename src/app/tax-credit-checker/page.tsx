import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import TaxCreditContent from './TaxCreditContent';
import { RelatedTools } from '@/components/ui/RelatedTools';

export const metadata: Metadata = {
  title: 'EV Tax Credit Eligibility Checker 2025 | $7,500 Federal Credit Calculator',
  description:
    'Check if you qualify for the $7,500 federal EV tax credit (§30D) in 60 seconds. Enter your income, filing status, and vehicle to get a YES/NO verdict with full checklist.',
  alternates: { canonical: '/tax-credit-checker' },
  openGraph: {
    title: 'EV Tax Credit Eligibility Checker 2025',
    description:
      'Find out if you qualify for the $7,500 federal EV tax credit in 60 seconds. Includes income limits, MSRP caps, and leasing strategy.',
    url: '/tax-credit-checker',
    type: 'website',
  },
};

const FAQ_ITEMS = [
  {
    q: 'How much is the federal EV tax credit in 2025?',
    a: 'The §30D New Clean Vehicle Credit is up to $7,500 for new EVs purchased in 2025. The amount depends on battery mineral and component sourcing requirements. Many popular EVs qualify for the full $7,500. There is also a §25E Used Clean Vehicle Credit of up to $4,000 (or 30% of the sale price) for qualifying used EVs.',
  },
  {
    q: 'What are the income limits for the 2025 EV tax credit?',
    a: 'For new EVs (§30D): $150,000 AGI for single filers, $300,000 for married filing jointly, and $225,000 for heads of household. For used EVs (§25E): $75,000 single, $150,000 joint, $112,500 head of household. These are based on your current or prior year AGI, whichever is lower.',
  },
  {
    q: 'What is the MSRP cap for the EV tax credit?',
    a: '$55,000 MSRP cap for cars and sedans. $80,000 cap for SUVs, pickup trucks, and vans. The vehicle\'s MSRP must be at or below these limits to qualify for §30D. These limits do NOT apply to leased vehicles under §45W.',
  },
  {
    q: 'Can I get the $7,500 tax credit if my income is too high?',
    a: 'Yes — by leasing instead of buying. When you lease an EV, the leasing company (dealer or financial arm) claims the §45W Commercial Clean Vehicle Credit. This has NO income limit on you as the lessee. Most leasing companies pass the full $7,500 as a capitalized cost reduction, lowering your monthly payment.',
  },
  {
    q: 'Can I claim the EV tax credit at the point of sale?',
    a: 'Yes — starting in 2024 (tax year), you can transfer the §30D credit to the dealer at the point of sale, effectively getting the $7,500 as a discount off the purchase price rather than waiting for your tax return. Ask your dealer about "instant rebate" or "credit transfer" at purchase.',
  },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'EV Tax Credit Eligibility Checker',
  applicationCategory: 'FinanceApplication',
  description: 'Check if you qualify for the $7,500 federal EV tax credit with income verification and MSRP checks.',
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

export default function TaxCreditCheckerPage() {
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
            <span className="text-text-primary">EV Tax Credit Checker</span>
          </nav>
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            EV Tax Credit Eligibility Checker
          </h1>
          <p className="mt-3 max-w-2xl text-text-secondary">
            Find out in 60 seconds if you qualify for the{' '}
            <span className="font-semibold text-accent">$7,500 federal EV tax credit</span>.
            Includes income limits, MSRP caps, and leasing strategy if you don&apos;t qualify.
          </p>
          {/* Quick stats */}
          <div className="mt-5 flex flex-wrap gap-4">
            {[
              { label: 'New EV Credit', value: 'Up to $7,500' },
              { label: 'Used EV Credit', value: 'Up to $4,000' },
              { label: 'Charger Credit', value: 'Up to $1,000' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-bg-secondary px-4 py-3">
                <div className="text-xs text-text-secondary">{s.label}</div>
                <div className="font-display font-bold text-accent">{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Checker */}
        <div className="rounded-2xl border border-border bg-bg-secondary p-6 sm:p-8">
          <Suspense fallback={<div className="h-80 animate-pulse rounded-xl bg-bg-tertiary" />}>
            <TaxCreditContent />
          </Suspense>
        </div>

        {/* Leasing callout */}
        <div className="mt-8 rounded-xl border border-accent/20 bg-accent/5 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display font-semibold text-text-primary">
                Income Too High? Leasing Gets You $7,500 Anyway
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                Leased EVs qualify under §45W with <strong className="text-text-primary">no income limit</strong>.
                See exactly how leasing compares to buying for your situation.
              </p>
            </div>
            <Link
              href="/lease-vs-buy"
              className="whitespace-nowrap rounded-lg border border-accent/30 px-4 py-2 text-sm font-semibold text-accent transition-all hover:bg-accent/10"
            >
              Lease vs Buy Calculator →
            </Link>
          </div>
        </div>

        {/* State incentives */}
        <div className="mt-4 rounded-xl border border-border bg-bg-secondary p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display font-semibold text-text-primary">
                Stack Federal + State Incentives
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                Many states offer additional $1,000–$9,500 rebates on top of the federal credit.
              </p>
            </div>
            <Link
              href="/ev-incentives"
              className="whitespace-nowrap rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-secondary transition-all hover:border-accent/30 hover:text-accent"
            >
              Browse State Incentives →
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <section className="mt-14 border-t border-border pt-10">
          <h2 className="mb-6 font-display text-2xl font-bold text-text-primary">
            Federal EV Tax Credit FAQs
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
          { href: '/ev-incentives', emoji: '🏛️', label: 'State EV Incentives', desc: 'Stack state rebates on top of your federal savings — all 50 states' },
          { href: '/lease-vs-buy', emoji: '📋', label: 'Lease vs Buy Calculator', desc: 'Apply the $7,500 credit directly to your payment comparison' },
          { href: '/can-i-afford-an-ev', emoji: '💰', label: 'Can I Afford an EV?', desc: 'Full affordability check with all credits factored in' },
        ]} />
      </div>
    </>
  );
}
