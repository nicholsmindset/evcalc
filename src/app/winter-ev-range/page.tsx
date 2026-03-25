import type { Metadata } from 'next';
import Link from 'next/link';
import WinterCalcContent from './WinterCalcContent';
import { RelatedTools } from '@/components/ui/RelatedTools';

export const metadata: Metadata = {
  title: 'Winter EV Range Calculator — How Cold Weather Affects Range',
  description:
    'See exactly how cold weather reduces your EV\'s range. Enter your vehicle and city to get winter range estimates at avg, 20°F, 0°F, and record low temperatures.',
  alternates: { canonical: '/winter-ev-range' },
  openGraph: {
    title: 'Winter EV Range Calculator — Cold Weather Range by City',
    description:
      'Physics-based winter range calculator for any EV in any US city. Shows heat pump advantage, temperature coefficients, and a winter prep checklist.',
    url: '/winter-ev-range',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Winter EV Range Calculator',
      url: 'https://evrangetools.com/winter-ev-range',
      description:
        'Calculate how cold temperatures affect your electric vehicle range. Compares heat pump vs resistive heating impact for any EV in any US city.',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evrangetools.com' },
        { '@type': 'ListItem', position: 2, name: 'Winter EV Range Calculator', item: 'https://evrangetools.com/winter-ev-range' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much does cold weather reduce EV range?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cold weather typically reduces EV range by 15-30% at 20°F and 30-50% at 0°F compared to EPA-rated range. The exact impact depends on whether your EV has a heat pump (milder impact) or resistive heater (more severe). At the coldest temperatures (below -10°F), range can drop 50-60% from EPA ratings.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does a heat pump really make a big difference in winter?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes — a heat pump can save 20-50 miles of range in cold weather compared to resistive heating. Heat pumps move heat from the outside air rather than generating it electrically, using 2-4x less energy. Tesla, Hyundai, Kia, BMW, and VW heat pumps show the most benefit below 40°F.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the best way to maximize EV range in winter?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The most effective strategies are: (1) Pre-condition the battery while plugged in, not on battery power; (2) Use seat heaters instead of full cabin heat; (3) Set a departure time in the app so the battery is warm when you leave; (4) Keep the battery above 20% (cold increases internal resistance at low state of charge); (5) Reduce highway speed slightly.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which EV has the best winter range?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'EVs with the best absolute winter range are the Tesla Model S/X and Lucid Air due to large battery packs. For percentage retained in cold, heat pump equipped vehicles (Tesla Model 3/Y post-2021, Hyundai IONIQ 5/6, Kia EV6) retain range better than resistive-heat vehicles. The Nissan LEAF suffers most due to no active thermal management.',
          },
        },
      ],
    },
  ],
};

export default function WinterEvRangePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <span className="text-text-primary">Winter EV Range</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Winter EV Range Calculator
          </h1>
          <p className="mt-3 text-text-secondary">
            See how cold weather affects your EV&apos;s range. Select your vehicle and city to get
            real winter estimates — heat pump advantage included.
          </p>
        </div>

        <WinterCalcContent />

        <RelatedTools tools={[
          { href: '/calculator', emoji: '📊', label: 'Range Calculator', desc: 'Fine-tune range estimates for your exact winter conditions' },
          { href: '/road-trip-planner', emoji: '🗺️', label: 'Road Trip Planner', desc: 'Plan a winter road trip with charging stops built in' },
          { href: '/battery-health-tracker', emoji: '🔋', label: 'Battery Health Tracker', desc: 'Learn how cold weather affects long-term battery health' },
        ]} />
      </div>
    </>
  );
}
