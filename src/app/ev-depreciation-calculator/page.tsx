import type { Metadata } from 'next';
import Link from 'next/link';
import DepreciationContent from './DepreciationContent';
import { RelatedTools } from '@/components/ui/RelatedTools';

export const metadata: Metadata = {
  title: 'EV Depreciation Calculator — Estimate Your Electric Car\'s Resale Value',
  description:
    'Calculate how much your EV has depreciated and project its future value. Based on real resale data for 20 EV models — see when to sell for maximum return.',
  alternates: { canonical: '/ev-depreciation-calculator' },
  openGraph: {
    title: 'EV Depreciation Calculator — Current & Projected Value',
    description:
      'Enter your EV, purchase year, and price to see current estimated value, a depreciation curve chart, and the best time to sell.',
    url: '/ev-depreciation-calculator',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'EV Depreciation Calculator',
      url: 'https://evrangetools.com/ev-depreciation-calculator',
      description: 'Estimate electric vehicle resale value based on model, purchase year, and original price using real depreciation curve data.',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evrangetools.com' },
        { '@type': 'ListItem', position: 2, name: 'EV Depreciation Calculator', item: 'https://evrangetools.com/ev-depreciation-calculator' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Which EVs hold their value best?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Tesla Model Y and Model 3 consistently top EV resale rankings, retaining 70–85% of value after one year. Rivian R1T and R1S also hold value exceptionally well due to limited supply. Hyundai IONIQ 5/6 and Kia EV6 are the best non-Tesla/Rivian options, retaining 73–74% after year one. EVs to avoid for resale: early Nissan LEAF (24 kWh), early Audi e-tron, and early VW ID.4 (2021–22).',
          },
        },
        {
          '@type': 'Question',
          name: 'Do EVs depreciate faster than gas cars?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It depends on the model. The average car retains about 60–65% of its value after 3 years. Top EVs like Tesla Model Y (70%) and Rivian R1T (67%) beat this. However, older or lower-tier EVs like the Nissan LEAF (42% after 3 years) and early Chevy Bolt (44%) depreciate significantly faster. The key factors are: battery technology (active thermal management), brand demand, and federal tax credit eligibility on new models (which depresses used prices).',
          },
        },
        {
          '@type': 'Question',
          name: 'When is the best time to sell an EV?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For most EVs, year 2–3 is the sweet spot: the sharpest first-year depreciation has already happened, but you still have significant value remaining. For Tesla specifically, selling before a major model refresh (often 3–4 year cycles) can protect value. For EVs with poor resale (LEAF, early Bolt), selling sooner rather than later minimizes further loss. Always check current Carvana/CarMax offers against your projection.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does the federal EV tax credit affect resale values?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, significantly. When a popular EV qualifies for a $7,500 federal tax credit on new purchases, it effectively lowers the new car price buyers are willing to pay — which pulls down used prices too. This is why Chevy Bolt resale values dropped sharply after the 2023 rebate, and why Tesla\'s price cuts have sometimes suppressed used Tesla values. Used EVs now also qualify for up to $4,000 federal tax credit (income-limited), which can actually improve used EV values.',
          },
        },
      ],
    },
  ],
};

export default function EvDepreciationCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <span className="text-text-primary">EV Depreciation Calculator</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            EV Depreciation Calculator
          </h1>
          <p className="mt-3 text-text-secondary">
            See how much your EV is worth today, projected values at 3 and 5 years, and the best time to sell —
            based on real resale data from iSeeCars and CarEdge.
          </p>
        </div>

        <DepreciationContent />

        <RelatedTools tools={[
          { href: '/tco-calculator', emoji: '📈', label: 'Total Cost of Ownership', desc: 'Include depreciation in your full lifetime ownership cost' },
          { href: '/ev-insurance-cost', emoji: '🛡️', label: 'EV Insurance Cost Guide', desc: 'Annual insurance costs for 30+ EV models' },
          { href: '/battery-health-tracker', emoji: '🔋', label: 'Battery Health Tracker', desc: 'Track how degradation affects your residual value over time' },
        ]} />
      </div>
    </>
  );
}
