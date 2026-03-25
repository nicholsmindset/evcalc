import type { Metadata } from 'next';
import Link from 'next/link';
import AffordabilityContent from './AffordabilityContent';

export const metadata: Metadata = {
  title: 'Can I Afford an EV? — EV Affordability Calculator',
  description:
    'Find out which EVs fit your monthly budget. Enter your income, down payment, credit score, and driving habits to see monthly costs vs. your current gas car.',
  alternates: { canonical: '/can-i-afford-an-ev' },
  openGraph: {
    title: 'Can I Afford an EV? EV Affordability Calculator',
    description:
      'See exactly which EVs fit your budget — monthly payment, insurance, charging cost, and gas savings all in one number.',
    url: '/can-i-afford-an-ev',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'EV Affordability Calculator',
      url: 'https://evrangetools.com/can-i-afford-an-ev',
      description:
        'Calculate which electric vehicles fit your monthly budget, including payment, insurance, and charging costs minus fuel savings.',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evrangetools.com' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Can I Afford an EV?',
          item: 'https://evrangetools.com/can-i-afford-an-ev',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is included in the monthly EV cost estimate?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The estimate includes: monthly loan payment (based on vehicle price minus federal tax credit, your down payment, and credit score), estimated insurance, home charging electricity cost, and subtracts ~$50/month in average maintenance savings compared to a gas car.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does the calculator include the federal EV tax credit?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The $7,500 federal EV tax credit (or $4,000 for used vehicles) is automatically applied to reduce the vehicle price before calculating your monthly payment. Eligibility depends on your income, vehicle MSRP, and whether you buy or lease.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is the charging cost calculated?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Charging cost uses the national average electricity rate of $0.16/kWh, your monthly miles, and each vehicle\'s efficiency (kWh per 100 miles) to estimate your home charging bill. This is typically 60-80% less than gasoline costs.',
          },
        },
        {
          '@type': 'Question',
          name: 'What credit score is needed to finance an EV?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most buyers finance with "good" credit (670-739) at rates around 5-7%. "Excellent" credit (740+) qualifies for the best rates near 4-5.5%. "Fair" credit (580-669) is still financeable but at higher rates (9-12%). Many EVs also qualify for special manufacturer financing rates.',
          },
        },
      ],
    },
  ],
};

export default function CanIAffordAnEVPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <span className="text-text-primary">Can I Afford an EV?</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Can I Afford an EV?
          </h1>
          <p className="mt-3 max-w-2xl text-text-secondary">
            Set your monthly budget and see which EVs actually fit — including payment, insurance,
            charging, and what you&apos;ll save on gas.
          </p>
        </div>

        <AffordabilityContent />

        {/* Related tools */}
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-3 font-display text-lg font-bold text-text-primary">Related Tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/find-my-ev" className="text-sm text-accent hover:underline">
              Find My EV — Personalized Recommendations
            </Link>
            <Link href="/ev-vs-gas" className="text-sm text-accent hover:underline">
              EV vs Gas Savings Calculator
            </Link>
            <Link href="/tco-calculator" className="text-sm text-accent hover:underline">
              Total Cost of Ownership
            </Link>
            <Link href="/tax-credit-checker" className="text-sm text-accent hover:underline">
              EV Tax Credit Checker
            </Link>
            <Link href="/charging-cost-calculator" className="text-sm text-accent hover:underline">
              Charging Cost Calculator
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
