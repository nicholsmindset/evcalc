import type { Metadata } from 'next';
import Link from 'next/link';
import SolarCalcContent from './SolarCalcContent';
import { RelatedTools } from '@/components/ui/RelatedTools';

export const metadata: Metadata = {
  title: 'Solar + EV Calculator — Size Your Solar System for EV Charging',
  description:
    'Calculate how many solar panels you need to power your electric vehicle. Uses NREL PVWatts data for your exact location. Includes system cost, 30% ITC savings, and payback period.',
  alternates: { canonical: '/solar-ev-calculator' },
  openGraph: {
    title: 'Solar + EV Calculator — How Much Solar to Charge Your EV?',
    description:
      'Enter your EV, location, and daily miles to see monthly solar production vs EV consumption, system costs after the 30% tax credit, and your payback period.',
    url: '/solar-ev-calculator',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Solar + EV Charging Calculator',
      url: 'https://evrangetools.com/solar-ev-calculator',
      description:
        'Calculate solar panel system size, cost, and payback period for powering your electric vehicle with solar energy.',
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
          name: 'Solar + EV Calculator',
          item: 'https://evrangetools.com/solar-ev-calculator',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How many solar panels do I need to charge an EV?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It depends on your location and how much you drive. A typical EV driving 35 miles/day uses about 250-350 kWh/month for charging. In a sunny state like California or Texas, a 4-6 kW solar system (12-18 panels) can fully cover this. In less sunny states like the Pacific Northwest, you may need 6-10 kW. Use this calculator with your exact location for a precise answer.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the federal solar tax credit (ITC)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The federal Investment Tax Credit (ITC) provides a 30% tax credit on the full cost of a residential solar installation. For a $24,000 system, you would receive a $7,200 credit against your federal income taxes, reducing your net cost to $16,800. The 30% rate is guaranteed through 2032.',
          },
        },
        {
          '@type': 'Question',
          name: 'How accurate is this solar estimate?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Solar production estimates use NREL\'s PVWatts API (v8), which is the industry standard tool used by solar installers, utilities, and researchers. It uses 30 years of historical weather data for your location. Actual production will vary ±10-15% based on shading, panel orientation, soiling, and equipment degradation.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the payback period for solar panels used to charge an EV?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The payback period shown is calculated using only EV charging savings. In reality, solar also offsets your home electricity use, significantly shortening the actual payback. Most US homeowners see payback in 5-10 years when accounting for all savings. In high-rate states like California, Hawaii, and Connecticut, payback can be 4-6 years.',
          },
        },
      ],
    },
  ],
};

export default function SolarEvCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <span className="text-text-primary">Solar + EV Calculator</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Solar + EV Charging Calculator
          </h1>
          <p className="mt-3 text-text-secondary">
            Find out exactly how much solar you need to power your EV — with real production data
            for your location, system costs after the 30% federal tax credit, and monthly coverage breakdown.
          </p>
        </div>

        <SolarCalcContent />

        <RelatedTools tools={[
          { href: '/v2h-calculator', emoji: '🏠', label: 'V2H Calculator', desc: 'See how long your EV can power your home during an outage' },
          { href: '/charging-schedule', emoji: '🕐', label: 'Charging Schedule Optimizer', desc: 'Optimize charging times around your solar production peak' },
          { href: '/charging-cost-calculator', emoji: '🔋', label: 'Charging Cost Calculator', desc: 'Compare charging costs before and after solar' },
        ]} />
      </div>
    </>
  );
}
