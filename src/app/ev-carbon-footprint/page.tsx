import type { Metadata } from 'next';
import Link from 'next/link';
import CarbonCalcContent from './CarbonCalcContent';
import { RelatedTools } from '@/components/ui/RelatedTools';

export const metadata: Metadata = {
  title: 'EV Carbon Footprint Calculator — CO₂ vs Gas Car Comparison',
  description:
    'Calculate your electric car\'s true carbon footprint vs a gas car. Includes manufacturing emissions, state grid intensity, lifetime CO₂ comparison, and breakeven timeline.',
  alternates: { canonical: '/ev-carbon-footprint' },
  openGraph: {
    title: 'EV Carbon Footprint Calculator — Lifetime CO₂ vs Gas',
    description:
      'See exactly how much CO₂ your EV saves vs a gas car — by state, annual miles, and vehicle. Includes manufacturing emissions and lifecycle breakeven.',
    url: '/ev-carbon-footprint',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'EV Carbon Footprint Calculator',
      url: 'https://evrangetools.com/ev-carbon-footprint',
      description:
        'Calculate the lifetime CO₂ footprint of your electric vehicle vs a gas car, accounting for your state\'s grid intensity, driving habits, and manufacturing emissions.',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evrangetools.com' },
        { '@type': 'ListItem', position: 2, name: 'EV Carbon Footprint Calculator', item: 'https://evrangetools.com/ev-carbon-footprint' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Are EVs really better for the environment?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'In most of the US, yes — significantly. Even accounting for manufacturing emissions (which are higher for EVs due to battery production), most EVs break even with gas cars within 1–3 years and save 30–70% of lifetime CO₂ emissions. The benefit is largest in states with clean grids like California, Washington, Oregon, and New York, and smallest in coal-heavy states like West Virginia and Wyoming. As the grid gets cleaner over time, EVs become even more beneficial.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much CO₂ does manufacturing an EV produce?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Manufacturing an EV typically produces 8–15 metric tons of CO₂ more than a comparable gas car, primarily due to battery production. A Tesla Model 3 adds about 9 tons; a large SUV or pickup like the Rivian R1T adds 13–14 tons. However, this "carbon debt" is typically paid off within 1–3 years of driving, after which the EV is net-positive for the environment. Source: Argonne National Laboratory GREET model.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which states have the cleanest electricity grids for EVs?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The cleanest grids for EV charging in the US are: Vermont (0.026 lbs CO₂/kWh — nearly all renewable/nuclear), Washington (0.132 — hydroelectric), Oregon (0.259 — hydro + wind), Idaho (0.157 — hydro), and California (0.397 — solar + wind). The dirtiest grids are West Virginia (1.01 — coal), Wyoming (1.035 — coal), and Hawaii (1.147 — oil). Data from EPA eGRID2023.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does EV carbon footprint improve over time?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, in two ways. First, the US electrical grid is getting cleaner every year as coal plants close and solar/wind expand — the average grid intensity dropped ~35% from 2007 to 2023. An EV bought today will produce less CO₂ per mile in 10 years than it does today. Second, if you add home solar, your EV\'s operational emissions drop to near-zero. No gas car has this potential for improvement.',
          },
        },
      ],
    },
  ],
};

export default function EvCarbonFootprintPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <span className="text-text-primary">EV Carbon Footprint Calculator</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            EV Carbon Footprint Calculator
          </h1>
          <p className="mt-3 text-text-secondary">
            How much CO₂ does your electric car actually save? Compare your EV to a gas car
            by state grid intensity, annual miles, and vehicle — including manufacturing emissions
            and lifetime breakeven timeline.
          </p>
        </div>

        <CarbonCalcContent />

        {/* FAQ */}
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-6 font-display text-xl font-bold text-text-primary">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {(jsonLd['@graph'][2] as { mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }> }).mainEntity.map((q) => (
              <div key={q.name}>
                <h3 className="mb-2 font-semibold text-text-primary">{q.name}</h3>
                <p className="text-sm text-text-secondary">{q.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>

        <RelatedTools tools={[
          { href: '/ev-vs-gas', emoji: '⛽', label: 'EV vs Gas Savings', desc: 'Combine emissions savings with financial savings analysis' },
          { href: '/solar-ev-calculator', emoji: '☀️', label: 'Solar + EV Calculator', desc: 'Size a solar system to charge your EV on clean energy' },
          { href: '/calculator', emoji: '📊', label: 'Range Calculator', desc: 'Calculate real-world range for your driving conditions' },
        ]} />
      </div>
    </>
  );
}
