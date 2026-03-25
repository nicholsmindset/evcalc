import type { Metadata } from 'next';
import Link from 'next/link';
import GasCarCompareContent from './GasCarCompareContent';

export const metadata: Metadata = {
  title: 'EV vs Gas Car Cost Comparison — Calculate Your Real Savings',
  description:
    'Compare any EV against any gas car side-by-side. See annual fuel savings, maintenance costs, payback period, and 10-year cumulative cost chart using real EPA MPG data.',
  alternates: { canonical: '/ev-vs-gas/compare' },
  openGraph: {
    title: 'EV vs Gas Car: Real Cost Comparison Calculator',
    description:
      'Pick any gas car from the EPA database, pick an EV, and see exactly how much you save on fuel, maintenance, and CO₂ over 10 years.',
    url: '/ev-vs-gas/compare',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'EV vs Gas Car Cost Comparison',
      url: 'https://evrangetools.com/ev-vs-gas/compare',
      description:
        'Compare any electric vehicle against any gas car using EPA fuel economy data. Calculates annual fuel savings, maintenance cost difference, payback period, and 10-year cumulative cost.',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evrangetools.com' },
        { '@type': 'ListItem', position: 2, name: 'EV vs Gas', item: 'https://evrangetools.com/ev-vs-gas/compare' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much cheaper is it to fuel an EV vs a gas car?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'At US average electricity rates ($0.16/kWh) and gas prices ($3.50/gal), driving an EV costs about 3–5¢ per mile versus 10–18¢ per mile for a gas car. That\'s 50–75% less per mile on fuel alone. The exact savings depend on your local electricity rate, gas price, and the specific vehicles being compared.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are EVs cheaper to maintain than gas cars?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes — EVs have significantly lower maintenance costs. According to AAA\'s 2024 study, EVs cost about 3.1¢ per mile to maintain vs. 6.1¢ per mile for gas vehicles. EVs have no oil changes, fewer brake replacements (regenerative braking), no transmission service, and simpler cooling systems. Over 12,000 miles/year, that\'s roughly $360/year in maintenance savings.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does it take for an EV to pay back its higher purchase price?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Payback periods vary widely, but for many popular EV/gas comparisons it\'s 3–7 years when combining fuel and maintenance savings. The $7,500 federal tax credit (available on many EVs) significantly shortens payback. EVs with similar MSRP to their gas equivalents (like the Chevy Equinox EV vs. Equinox gas) can break even in under 3 years.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does driving an EV really reduce CO2 emissions?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, even accounting for electricity generation. The average US grid emits about 0.386 lbs of CO2 per kWh. A typical EV driving 12,000 miles/year produces roughly 1,000–1,500 lbs of CO2 from driving, vs. 8,000–12,000 lbs for a 30 MPG gas car. EVs in states with clean grids (California, Washington, New York) have dramatically lower emissions.',
          },
        },
      ],
    },
  ],
};

export default function EvVsGasComparePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <span className="text-text-primary">EV vs Gas Comparison</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            EV vs Gas Car: Real Cost Comparison
          </h1>
          <p className="mt-3 text-text-secondary">
            Search any gas car from the EPA database, pick an EV, and see the true cost difference —
            fuel, maintenance, CO₂, and 10-year cumulative spending.
          </p>
        </div>

        <GasCarCompareContent />

        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-3 font-display text-lg font-bold text-text-primary">Related Tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/charging-cost-calculator" className="text-sm text-accent hover:underline">Charging Cost Calculator</Link>
            <Link href="/tco-calculator" className="text-sm text-accent hover:underline">Total Cost of Ownership</Link>
            <Link href="/find-my-ev" className="text-sm text-accent hover:underline">Find My EV</Link>
            <Link href="/ev-incentives" className="text-sm text-accent hover:underline">EV Incentives by State</Link>
          </div>
        </section>
      </div>
    </>
  );
}
