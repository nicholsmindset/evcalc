import type { Metadata } from 'next';
import Link from 'next/link';
import V2HContent from './V2HContent';

export const metadata: Metadata = {
  title: 'V2H & V2L Calculator — How Long Can Your EV Power Your Home?',
  description:
    'Calculate how long your EV can power your home during an outage. Supports Ford F-150 Lightning, Rivian R1T/R1S, GMC Hummer EV, Nissan LEAF, Hyundai IONIQ 5, and more.',
  alternates: { canonical: '/v2h-calculator' },
  openGraph: {
    title: 'V2H Calculator — EV Home Backup Power Duration',
    description:
      'Select appliances and see how long your EV battery will last as backup power. V2H and V2L vehicles with runtime breakdown per appliance.',
    url: '/v2h-calculator',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'V2H & V2L EV Backup Power Calculator',
      url: 'https://evrangetools.com/v2h-calculator',
      description:
        'Calculate how long a V2H or V2L capable electric vehicle can power home appliances during a power outage.',
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
          name: 'V2H Calculator',
          item: 'https://evrangetools.com/v2h-calculator',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the difference between V2H and V2L?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'V2H (Vehicle-to-Home) uses a bidirectional charger and transfer switch to power your entire home circuit, including hardwired appliances like your HVAC system. V2L (Vehicle-to-Load) provides a standard 120V outlet directly from the car, powering individual devices you plug in. V2H requires professional installation (~$6,000-9,000); V2L requires no installation.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which EVs support V2H in the US?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'As of 2024, V2H-capable EVs in the US include: Ford F-150 Lightning (9.6 kW), Rivian R1T and R1S (11.5 kW), GMC Hummer EV (11.5 kW), and Nissan LEAF (6 kW with compatible hardware). V2L vehicles include Hyundai IONIQ 5, Kia EV6, and Kia EV9 (all at 3.6 kW).',
          },
        },
        {
          '@type': 'Question',
          name: 'How long can a Ford F-150 Lightning power a house?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A Ford F-150 Lightning Extended Range (131 kWh) can power an average home using essential appliances (refrigerator, lights, phones, router) for approximately 3-4 days. With a full load including HVAC and other high-draw appliances, runtime drops to 8-12 hours.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does using V2H or V2L damage the EV battery?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Frequent deep discharging through V2H use can cause additional battery degradation compared to normal driving use. Ford and Rivian recommend keeping a minimum 20% charge reserve. Most manufacturers design V2H systems to stay within safe operating parameters, but extended daily V2H use may accelerate long-term capacity loss.',
          },
        },
      ],
    },
  ],
};

export default function V2HCalculatorPage() {
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
          <span className="text-text-primary">V2H Calculator</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            V2H &amp; V2L Backup Power Calculator
          </h1>
          <p className="mt-3 text-text-secondary">
            How long will your EV power your home during an outage? Select your vehicle, charge level, and appliances to find out.
          </p>
        </div>

        <V2HContent />

        {/* Related tools */}
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-3 font-display text-lg font-bold text-text-primary">Related Tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/solar-ev-calculator" className="text-sm text-accent hover:underline">
              Solar + EV Calculator
            </Link>
            <Link href="/charging-cost-calculator" className="text-sm text-accent hover:underline">
              Charging Cost Calculator
            </Link>
            <Link href="/calculator" className="text-sm text-accent hover:underline">
              EV Range Calculator
            </Link>
            <Link href="/find-my-ev" className="text-sm text-accent hover:underline">
              Find My EV
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
