import type { Metadata } from 'next';
import { ChargingCostTool } from './components/ChargingCostTool';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';

export const metadata: Metadata = {
  title: 'EV Charging Cost Calculator — How Much Does It Cost to Charge?',
  description:
    'Calculate exactly how much it costs to charge your EV at home, public stations, and DC fast chargers. Uses real state electricity rates from the EIA.',
  alternates: { canonical: '/charging-cost-calculator' },
  openGraph: {
    title: 'EV Charging Cost Calculator — How Much Does It Cost to Charge?',
    description:
      'Calculate exactly how much it costs to charge your EV at home, public stations, and DC fast chargers. Uses real state electricity rates from the EIA.',
    url: '/charging-cost-calculator',
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'EV Charging Cost Calculator',
    description:
      'Calculate how much it costs to charge your electric vehicle at home, public Level 2, and DC fast chargers using real electricity rates.',
    url: '/charging-cost-calculator',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: '/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Charging Cost Calculator',
        item: '/charging-cost-calculator',
      },
    ],
  },
];

export default function ChargingCostPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SchemaMarkup schema={jsonLd} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          EV Charging Cost Calculator — How Much Does It Cost to Charge?
        </h1>
        <p className="mt-2 text-text-secondary">
          Calculate how much it costs to charge your EV at home, public stations, and DC fast chargers.
        </p>
      </div>

      <ChargingCostTool />

      {/* SEO Content */}
      <section className="mt-16 border-t border-border pt-12">
        <h2 className="text-2xl font-display font-bold text-text-primary">
          How Much Does It Cost to Charge an Electric Vehicle?
        </h2>
        <div className="mt-4 max-w-3xl space-y-4 text-text-secondary">
          <p>
            The cost to charge an EV depends on three factors: your electricity rate,
            your vehicle&apos;s efficiency (kWh/100 miles), and the type of charger you use.
            Home charging at Level 2 (240V) is typically the most cost-effective at
            $0.04-0.06 per mile in most US states.
          </p>
          <p>
            DC fast charging is 2-3x more expensive per kWh but can add 200+ miles
            in 30 minutes. Public Level 2 stations typically charge $0.20-0.35/kWh.
            The national average residential electricity rate is approximately $0.16/kWh.
          </p>
          <p>
            Even at higher DC fast charging rates, EVs are significantly cheaper to
            fuel than comparable gas vehicles. The average American drives 1,000 miles
            per month and would spend roughly $40-80 on electricity vs $120-180 on gasoline.
          </p>
        </div>
      </section>

      <RelatedTools tools={[
        { href: '/calculator', emoji: '📊', label: 'Range Calculator', desc: 'Calculate real-world range adjusted for temperature, speed, and conditions' },
        { href: '/ev-vs-gas', emoji: '⛽', label: 'EV vs Gas Savings', desc: 'See your total savings over 5, 7, and 10 years vs a gas car' },
        { href: '/charging-schedule', emoji: '🕐', label: 'Charging Schedule Optimizer', desc: 'Find off-peak hours to cut your electricity bill' },
      ]} />
    </div>
  );
}
