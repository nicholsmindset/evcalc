import type { Metadata } from 'next';
import { TcoTool } from './components/TcoTool';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { generateWebApplicationSchema, generateBreadcrumbSchema } from '@/lib/utils/seo';

export const metadata: Metadata = {
  title: 'EV Total Cost of Ownership Calculator — Compare EV vs Gas Over 5-10 Years',
  description:
    'Compare the full ownership cost of an EV vs gas car including purchase price, fuel, maintenance, insurance, and depreciation. See which costs less over time.',
  alternates: { canonical: '/tco-calculator' },
  openGraph: {
    title: 'EV Total Cost of Ownership Calculator — Compare EV vs Gas Over 5-10 Years',
    description:
      'Compare the full ownership cost of an EV vs gas car including purchase price, fuel, maintenance, insurance, and depreciation. See which costs less over time.',
    url: '/tco-calculator',
    type: 'website',
  },
};

export default function TcoCalculatorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SchemaMarkup
        schema={[
          generateWebApplicationSchema(
            'EV Total Cost of Ownership Calculator',
            'Compare the full ownership cost of an EV vs gas car over 5-10 years including purchase price, fuel, maintenance, insurance, and depreciation.',
            '/tco-calculator'
          ),
          generateBreadcrumbSchema([
            { name: 'Home', href: '/' },
            { name: 'Total Cost of Ownership Calculator', href: '/tco-calculator' },
          ]),
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          EV Total Cost of Ownership — Compare EV vs Gas Over 5-10 Years
        </h1>
        <p className="mt-2 text-text-secondary">
          Compare the full ownership cost of an EV vs gas car — purchase price, fuel, maintenance, insurance, and depreciation.
        </p>
      </div>

      <TcoTool />

      {/* SEO Content */}
      <section className="mt-16 border-t border-border pt-12">
        <h2 className="mb-4 text-xl font-display font-bold text-text-primary">
          Understanding Total Cost of Ownership
        </h2>
        <div className="max-w-3xl space-y-3 text-sm text-text-secondary">
          <p>
            The sticker price is only part of the story. Total Cost of Ownership (TCO) includes
            every cost you&apos;ll face over the life of the vehicle: fuel, maintenance, insurance,
            depreciation, and tax incentives.
          </p>
          <p>
            EVs typically cost more upfront but save significantly on fuel and maintenance.
            With federal tax credits up to $7,500 and lower running costs, many EVs reach
            cost parity with gas cars within 2-3 years.
          </p>
        </div>
      </section>

      <RelatedTools tools={[
        { href: '/ev-vs-gas', emoji: '\u26FD', label: 'EV vs Gas Savings', desc: 'Side-by-side annual cost comparison vs your current gas car' },
        { href: '/lease-vs-buy', emoji: '\uD83D\uDCCB', label: 'Lease vs Buy Calculator', desc: 'Monthly payments and total cost with tax credit analysis' },
        { href: '/ev-depreciation-calculator', emoji: '\uD83D\uDCC9', label: 'Depreciation Calculator', desc: 'See how much your EV will be worth in 3\u20137 years' },
      ]} />
    </div>
  );
}
