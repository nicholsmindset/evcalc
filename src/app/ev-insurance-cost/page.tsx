import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { InsuranceCostTool } from './components/InsuranceCostTool';

export const metadata: Metadata = {
  title: 'EV Insurance Cost Guide — Which Electric Cars Are Cheapest to Insure?',
  description:
    'Compare annual insurance costs for 30 electric vehicles. See cheapest and most expensive EVs to insure, state-by-state estimates, and tips to lower your premium.',
  alternates: {
    canonical: '/ev-insurance-cost',
  },
  openGraph: {
    title: 'EV Insurance Cost Guide — Which Electric Cars Are Cheapest to Insure?',
    description:
      'Compare annual insurance costs for 30 electric vehicles. See cheapest and most expensive EVs to insure, state-by-state estimates, and tips to lower your premium.',
    url: '/ev-insurance-cost',
    type: 'article',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'EV Insurance Cost Guide — Which Electric Cars Are Cheapest to Insure?',
      description:
        'Compare annual insurance costs for 30 electric vehicles. See cheapest and most expensive EVs to insure, state-by-state estimates, and tips to lower your premium.',
      url: 'https://evrangetools.com/ev-insurance-cost',
      author: { '@type': 'Organization', name: 'EV Range Tools' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evrangetools.com' },
        { '@type': 'ListItem', position: 2, name: 'EV Insurance Cost', item: 'https://evrangetools.com/ev-insurance-cost' },
      ],
    },
  ],
};

const TIPS = [
  { tip: 'Increase your deductible', detail: 'Raising from $500 to $1,000 can cut premiums 10–20%. Only do this if you have emergency savings to cover it.' },
  { tip: 'Bundle home + auto', detail: 'Most insurers offer 5–15% multi-policy discounts. If you own a home or rent, bundling almost always pays.' },
  { tip: 'Use telematics / usage-based insurance', detail: 'EVs are ideal for telematics programs (State Farm Drive Safe, Progressive Snapshot). EV owners tend to drive conservatively and score well.' },
  { tip: 'Shop annually', detail: 'EV insurance rates have been dropping as insurers gain data. Shopping every renewal can save $200–500/year versus staying with your current insurer.' },
  { tip: 'Ask about EV-specific discounts', detail: 'Some insurers (Tesla Insurance, Lemonade) specialize in EVs and can offer 15–30% lower rates than traditional insurers.' },
  { tip: 'Maintain a good credit score', detail: 'In most states, credit score is one of the strongest predictors of insurance rates. A 50-point credit score improvement can reduce premiums 10–15%.' },
];

export default function EvInsuranceCostPage() {
  return (
    <>
      <SchemaMarkup schema={jsonLd} />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <span className="text-text-primary">EV Insurance Cost</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            EV Insurance Cost Guide
          </h1>
          <p className="mt-3 text-text-secondary">
            Annual insurance estimates for 30 electric vehicles — sortable by cost, brand, and vs. gas car premium.
            Estimates based on Bankrate and NerdWallet published averages for a 35-year-old driver with good credit and a clean record.
          </p>
        </div>

        <InsuranceCostTool />

        {/* ─── Tips to lower EV insurance ──────────────────────────────────── */}
        <section className="mt-8">
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">How to Lower Your EV Insurance</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {TIPS.map(({ tip, detail }) => (
              <div key={tip} className="rounded-lg border border-border bg-bg-secondary p-4">
                <div className="mb-1 font-semibold text-text-primary">{tip}</div>
                <div className="text-sm text-text-secondary">{detail}</div>
              </div>
            ))}
          </div>
        </section>

        <RelatedTools tools={[
          { href: '/ev-depreciation-calculator', emoji: '📉', label: 'Depreciation Calculator', desc: 'Project your EV\'s resale value at 3, 5, and 7 years' },
          { href: '/tco-calculator', emoji: '📈', label: 'Total Cost of Ownership', desc: 'Include insurance in your full lifetime ownership cost' },
          { href: '/lease-vs-buy', emoji: '📋', label: 'Lease vs Buy Calculator', desc: 'See how insurance affects your lease vs buy decision' },
        ]} />
      </div>
    </>
  );
}
