import type { Metadata } from 'next';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { generateBreadcrumbSchema } from '@/lib/utils/seo';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { EvVsGasTool } from './components/EvVsGasTool';

export const metadata: Metadata = {
  title: 'EV vs Gas Savings Calculator — How Much Can You Save?',
  description:
    'Compare the total running costs of an electric vehicle vs a gas car. See fuel savings, maintenance savings, cost per mile, and break-even timeline over 5-10 years.',
  alternates: { canonical: '/ev-vs-gas' },
  openGraph: {
    title: 'EV vs Gas Savings Calculator — How Much Can You Save?',
    description:
      'Compare the total running costs of an electric vehicle vs a gas car. See fuel savings, maintenance savings, cost per mile, and break-even timeline over 5-10 years.',
    url: '/ev-vs-gas',
    type: 'website',
  },
};

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'EV vs Gas Savings Calculator',
  description:
    'Compare the total running costs of an electric vehicle vs a gas car. See fuel savings, maintenance savings, cost per mile, and break-even timeline over 5-10 years.',
  url: '/ev-vs-gas',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', href: '/' },
  { name: 'EV vs Gas Savings Calculator', href: '/ev-vs-gas' },
]);

export default function EvVsGasPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SchemaMarkup schema={[webAppSchema, breadcrumbSchema]} />

      {/* Header — static, server-rendered for SEO */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          EV vs Gas Savings — Is an Electric Car Cheaper Than Gas?
        </h1>
        <p className="mt-2 text-text-secondary">
          Compare the total running costs of an electric vehicle vs a gas car over time.
        </p>
      </div>

      {/* Interactive tool — client component */}
      <EvVsGasTool />

      {/* SEO Content — static, server-rendered */}
      <section className="mt-16 border-t border-border pt-12">
        <h2 className="text-2xl font-display font-bold text-text-primary">
          How Much Can You Save With an Electric Vehicle?
        </h2>
        <div className="mt-4 max-w-3xl space-y-4 text-text-secondary">
          <p>
            Electric vehicles are significantly cheaper to fuel and maintain than gas cars.
            The average American drives 12,000 miles per year and spends roughly $1,800-$2,400
            on gasoline. An equivalent EV would cost $500-$700 in electricity — saving
            $1,100-$1,700 annually on fuel alone.
          </p>
          <p>
            Maintenance savings add another $480 per year on average. EVs have no oil changes,
            fewer brake replacements (thanks to regenerative braking), no transmission fluid,
            and fewer moving parts overall. The typical EV costs about $0.06 per mile to
            maintain vs $0.10 per mile for a gas car.
          </p>
          <p>
            Over 5 years, the total savings from fuel and maintenance typically range from
            $7,500 to $11,000 depending on your electricity rate, gas prices, and driving
            habits. In many cases, these savings offset the higher purchase price of an EV
            within 3-5 years.
          </p>
        </div>
      </section>

      <RelatedTools tools={[
        { href: '/tco-calculator', emoji: '📈', label: 'Total Cost of Ownership', desc: 'Full lifetime cost breakdown including depreciation and maintenance' },
        { href: '/lease-vs-buy', emoji: '📋', label: 'Lease vs Buy Calculator', desc: 'Compare payments and break-even timelines with the $7,500 credit' },
        { href: '/ev-depreciation-calculator', emoji: '📉', label: 'Depreciation Calculator', desc: 'Project your EV\'s resale value at 3, 5, and 7 years' },
      ]} />
    </div>
  );
}
