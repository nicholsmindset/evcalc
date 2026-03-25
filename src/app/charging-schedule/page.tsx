import type { Metadata } from 'next';
import Link from 'next/link';
import ChargingScheduleContent from './ChargingScheduleContent';

export const metadata: Metadata = {
  title: 'Optimal EV Charging Schedule — Save with Off-Peak TOU Rates',
  description:
    'Find the cheapest time to charge your EV based on your utility\'s TOU rates. See a 24-hour rate timeline, optimal charging window, and estimated monthly savings.',
  alternates: { canonical: '/charging-schedule' },
  openGraph: {
    title: 'Optimal EV Charging Schedule — TOU Rate Calculator',
    description:
      'Enter your utility, EV, and departure time to find the cheapest off-peak charging window. Visual 24-hour timeline with savings estimate.',
    url: '/charging-schedule',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Optimal EV Charging Schedule Calculator',
      url: 'https://evrangetools.com/charging-schedule',
      description:
        'Calculate the optimal time to charge your electric vehicle based on your utility\'s time-of-use (TOU) rates. Shows 24-hour rate timeline and monthly savings.',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evrangetools.com' },
        { '@type': 'ListItem', position: 2, name: 'Charging Schedule', item: 'https://evrangetools.com/charging-schedule' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the cheapest time to charge an EV?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The cheapest time to charge an EV is during off-peak hours on your utility\'s time-of-use (TOU) rate plan — typically midnight to 6am on weekdays. Utilities like PG&E, ComEd, and APS offer super off-peak rates as low as 6–12¢/kWh during these hours, vs. 30–67¢/kWh during peak periods (usually 4–9pm). On a TOU plan, off-peak charging can save $300–800/year vs. charging during peak hours.',
          },
        },
        {
          '@type': 'Question',
          name: 'Should I switch to a time-of-use rate plan for my EV?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, for most EV owners who can charge overnight, a TOU or EV-specific rate plan saves significant money. The key requirement is flexibility to shift at least 80% of your charging to off-peak hours. If you plug in every night when you get home (before peak hours end), a flat rate may be better. Most utilities now offer EV-specific TOU plans with rates as low as 6–11¢/kWh overnight.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I set my EV to charge at a specific time?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most EVs let you set a departure time or charge schedule through the car\'s companion app. Tesla: Schedule → Departure Time. Hyundai Bluelink: Charge Settings → Scheduled Charging. FordPass: Charging → Preferred Charge Times. BMW My BMW app: Charging → Timer. The car then calculates when to start charging so it\'s ready at your departure time — also warming the battery in winter.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much can I save by charging during off-peak hours?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Savings depend on your utility\'s rate spread and how much you drive. At PG&E\'s EV2-A rate (peak 55¢/kWh vs. super off-peak 12¢/kWh), shifting 40 miles/day of charging saves about $500–700/year. At ComEd in Illinois (peak 22¢ vs. off-peak 7¢), savings are $150–250/year. The bigger the rate spread and the more you drive, the greater the savings.',
          },
        },
      ],
    },
  ],
};

export default function ChargingSchedulePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <span className="text-text-primary">Charging Schedule</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Optimal EV Charging Schedule
          </h1>
          <p className="mt-3 text-text-secondary">
            Find the cheapest time to charge based on your utility&apos;s time-of-use rates.
            See your 24-hour rate timeline, optimal start time, and estimated monthly savings.
          </p>
        </div>

        <ChargingScheduleContent />

        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-3 font-display text-lg font-bold text-text-primary">Related Tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/charging-cost-calculator" className="text-sm text-accent hover:underline">Charging Cost Calculator</Link>
            <Link href="/home-charger-wizard" className="text-sm text-accent hover:underline">Home Charger Wizard</Link>
            <Link href="/ev-vs-gas/compare" className="text-sm text-accent hover:underline">EV vs Gas Comparison</Link>
            <Link href="/solar-ev-calculator" className="text-sm text-accent hover:underline">Solar + EV Calculator</Link>
          </div>
        </section>
      </div>
    </>
  );
}
