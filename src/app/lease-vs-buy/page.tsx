import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import LeaseVsBuyContent from './LeaseVsBuyContent';

export const metadata: Metadata = {
  title: 'EV Lease vs Buy Calculator 2025 | Compare Monthly Payments & Total Cost',
  description:
    'Should you lease or buy an electric vehicle? Compare monthly payments, total cost, and break-even analysis. See how the $7,500 federal tax credit applies differently to leasing vs. purchasing.',
  openGraph: {
    title: 'EV Lease vs Buy Calculator 2025',
    description:
      'Compare leasing vs. financing vs. cash purchase for any EV. Includes $7,500 IRA tax credit, break-even analysis, and real lease money factors.',
    url: '/lease-vs-buy',
    type: 'website',
  },
  alternates: { canonical: '/lease-vs-buy' },
};

const FAQ_ITEMS = [
  {
    q: 'Should I lease or buy an electric vehicle?',
    a: 'It depends on your situation. Leasing typically offers lower monthly payments and allows you to upgrade to a newer EV every 2–3 years as technology improves. Buying builds equity and can be cheaper long-term if you keep the vehicle 5+ years. Our calculator shows exactly when buying becomes cheaper (break-even month).',
  },
  {
    q: 'How does the $7,500 federal tax credit work for leasing?',
    a: 'When you lease an EV, the dealer (as the commercial buyer) claims the IRS §45W Commercial Clean Vehicle Credit and typically passes the full $7,500 as a capital cost reduction — lowering your monthly payment. There is no income limit on you as the lessee. When you purchase, the §30D New Clean Vehicle Credit is income-limited: $150,000 single / $300,000 married filing jointly.',
  },
  {
    q: 'What is a money factor in a lease?',
    a: 'The money factor is the lease equivalent of an interest rate. Multiply it by 2,400 to get the approximate APR. For example, a money factor of 0.00125 = 3% APR. Lower is better. Money factors are set by the manufacturer\'s captive finance arm and change monthly.',
  },
  {
    q: 'What is residual value in a lease?',
    a: 'The residual value is what the leasing company projects the car will be worth at the end of your lease term, expressed as a percentage of MSRP. A higher residual means lower monthly payments because you\'re financing less depreciation. EVs typically have residuals between 45–60% for 36-month leases.',
  },
  {
    q: 'Can I negotiate a lease price?',
    a: 'Yes — the capitalized cost (equivalent of the selling price) is negotiable. You cannot typically negotiate the money factor or residual value set by the manufacturer\'s finance arm, but dealers may offer additional discounts. Always negotiate the selling price, not just the monthly payment.',
  },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'EV Lease vs Buy Calculator',
  applicationCategory: 'FinanceApplication',
  description: 'Compare leasing vs. buying an electric vehicle with break-even analysis and tax credit optimization.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Lease vs finance vs cash comparison',
    'Federal EV tax credit ($7,500) optimization',
    'Break-even analysis chart',
    'Real lease money factor and residual data',
    'State sales tax rates',
    'Credit score APR tiers',
  ],
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

export default function LeaseVsBuyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="mb-3 flex gap-2 text-xs text-text-tertiary">
            <Link href="/" className="hover:text-text-secondary">Home</Link>
            <span>/</span>
            <span className="text-text-primary">Lease vs Buy Calculator</span>
          </nav>
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            EV Lease vs Buy Calculator
          </h1>
          <p className="mt-2 max-w-2xl text-text-secondary">
            Compare monthly payments, total cost, and break-even timelines for any electric vehicle.
            Includes the <span className="font-medium text-accent">$7,500 federal tax credit</span> and
            real lease money factors from manufacturer programs.
          </p>
        </div>

        {/* Calculator */}
        <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-bg-secondary" />}>
          <LeaseVsBuyContent />
        </Suspense>

        {/* FAQ Section */}
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="mb-6 font-display text-2xl font-bold text-text-primary">
            Lease vs Buy: Common Questions
          </h2>
          <div className="space-y-6">
            {FAQ_ITEMS.map(({ q, a }) => (
              <div key={q} className="rounded-xl border border-border bg-bg-secondary p-6">
                <h3 className="font-display font-semibold text-text-primary">{q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Tools */}
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">Related Tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/ev-vs-gas" className="text-sm text-accent hover:underline">EV vs Gas Savings</Link>
            <Link href="/tco-calculator" className="text-sm text-accent hover:underline">Total Cost of Ownership</Link>
            <Link href="/charging-cost-calculator" className="text-sm text-accent hover:underline">Charging Cost Calculator</Link>
            <Link href="/calculator" className="text-sm text-accent hover:underline">Range Calculator</Link>
            <Link href="/compare" className="text-sm text-accent hover:underline">Vehicle Comparison</Link>
            <Link href="/vehicles" className="text-sm text-accent hover:underline">Browse All EVs</Link>
          </div>
        </section>
      </div>
    </>
  );
}
