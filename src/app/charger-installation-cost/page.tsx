import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import InstallationCalcContent from './InstallationCalcContent';
import { RelatedTools } from '@/components/ui/RelatedTools';

export const metadata: Metadata = {
  title: 'EV Charger Installation Cost Calculator 2025 | How Much Does It Cost?',
  description:
    'Calculate EV charger installation costs by state. Get itemized estimates for labor, wire, breaker, permit, and panel upgrade. Average cost: $300–$1,200.',
  alternates: { canonical: '/charger-installation-cost' },
  openGraph: {
    title: 'EV Charger Installation Cost Calculator 2025',
    description:
      'Get an accurate cost estimate for Level 2 EV charger installation by state — labor, wire, permit, and panel upgrade included.',
    url: '/charger-installation-cost',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'EV Charger Installation Cost Calculator',
      url: 'https://evrangetools.com/charger-installation-cost',
      description:
        'Calculate the cost to install a Level 2 EV charger at home, including labor, materials, permits, and optional panel upgrades.',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'HowTo',
      name: 'How to Estimate EV Charger Installation Cost',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Select your state',
          text: 'Choose your state to get accurate local labor rates and permit costs.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Describe your electrical setup',
          text: 'Tell us whether you have an existing 240V outlet, a 200A panel, or need a panel upgrade.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Choose charger amperage',
          text: 'Select the amperage of the charger you plan to install (32–60A recommended).',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Enter panel distance',
          text: 'Estimate how far your electrical panel is from where the charger will be installed.',
        },
        {
          '@type': 'HowToStep',
          position: 5,
          name: 'Review your cost estimate',
          text: 'Get an itemized breakdown of labor, wire, breaker, permit, and total installation cost.',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much does it cost to install a Level 2 EV charger?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The average cost to install a Level 2 EV charger is $300–$1,200 for a straightforward installation. If you need a new 240V circuit, expect $400–$900. A panel upgrade adds $1,500–$3,000. Labor rates vary by state.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need a permit to install an EV charger?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most states and municipalities require an electrical permit for EV charger installation. Permits typically cost $50–$200. Your electrician will usually pull the permit for you as part of the installation.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I get a tax credit for EV charger installation?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The federal §30C Alternative Fuel Vehicle Refueling Property Credit covers 30% of both the charger and installation cost, up to $1,000 for homeowners. File IRS Form 8911 with your tax return.',
          },
        },
        {
          '@type': 'Question',
          name: 'What wire gauge do I need for a Level 2 EV charger?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Per NEC 625.44, the circuit must be rated at 125% of the charger load. For a 40A charger (most common), you need a 50A circuit with 8 AWG wire. For a 48A charger, you need a 60A circuit with 6 AWG wire.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does EV charger installation take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A basic installation with an existing 240V outlet takes 1–2 hours. Installing a new circuit takes 2–4 hours. A panel upgrade adds 4–6 hours. Most installations are completed in a single day.',
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evrangetools.com' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'EV Charger Installation Cost Calculator',
          item: 'https://evrangetools.com/charger-installation-cost',
        },
      ],
    },
  ],
};

export default function ChargerInstallationCostPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <span className="text-text-primary">EV Charger Installation Cost Calculator</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            EV Charger Installation Cost Calculator
          </h1>
          <p className="mt-3 max-w-2xl text-text-secondary">
            Get an accurate, itemized estimate for installing a Level 2 charger at your home —
            labor, wire, breaker, permit, and panel upgrade by state.
          </p>

          {/* Feature badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              'All 50 States',
              'Itemized Breakdown',
              'Electrician Guidance',
              'Federal Credit Estimate',
            ].map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-border bg-bg-secondary px-3 py-1 text-xs text-text-secondary"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Calculator */}
        <Suspense
          fallback={
            <div className="h-96 animate-pulse rounded-2xl bg-bg-secondary" />
          }
        >
          <InstallationCalcContent />
        </Suspense>

        {/* How it works */}
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-4 font-display text-xl font-bold text-text-primary">
            How Installation Costs Are Calculated
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: 'Labor',
                desc: 'Hourly rates sourced from HomeAdvisor and Angi averages by state. Typically $75–$130/hr for a licensed electrician.',
              },
              {
                label: 'Wire & Materials',
                desc: 'Wire cost depends on distance to panel and required AWG gauge. Breaker cost varies by amperage (typically $20–$60).',
              },
              {
                label: 'Permits',
                desc: 'Most jurisdictions require an electrical permit for 240V circuits. Average permit cost is $50–$200 depending on your city.',
              },
              {
                label: 'Panel Upgrade',
                desc: 'If your panel is 100A or less, upgrading to 200A costs $1,500–$3,000 for parts and labor. Often required for 48A+ chargers.',
              },
              {
                label: 'Wire Gauge (NEC 625.44)',
                desc: 'National Electrical Code requires EV circuits to be rated at 125% of continuous load. A 40A charger needs a 50A circuit (8 AWG).',
              },
              {
                label: 'Utility Rebates',
                desc: 'Many utilities offer $100–$1,000 rebates for Level 2 charger installation. These are deducted from your net cost.',
              },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-bg-secondary p-4">
                <div className="mb-1 font-semibold text-text-primary">{item.label}</div>
                <p className="text-sm text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-10">
          <h2 className="mb-4 font-display text-xl font-bold text-text-primary">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'How much does Level 2 EV charger installation cost?',
                a: 'Most homeowners pay $300–$1,200 for a standard installation. If you need a new 240V circuit run from your panel, add $200–$500 in wire and labor. Panel upgrades (if needed) add $1,500–$3,000. The average all-in cost is $500–$900.',
              },
              {
                q: 'What is the cheapest way to install an EV charger at home?',
                a: 'The cheapest option is if you already have a NEMA 14-50 outlet in your garage — installation takes 1–2 hours and costs $150–$300. Otherwise, compare quotes from at least 3 licensed electricians. Check for utility rebates (up to $1,000) and the federal 30% tax credit to reduce your out-of-pocket cost.',
              },
              {
                q: 'Can I install an EV charger myself?',
                a: 'Plugging in a Level 1 charger (standard 120V outlet) requires no installation. For Level 2 hardwired chargers, you need a licensed electrician — DIY electrical work violates most local codes and can void homeowner\'s insurance. Some plug-in Level 2 chargers (like the Grizzl-E or ChargePoint Flex) can use an existing NEMA 14-50 outlet if you have one.',
              },
              {
                q: 'Do I need a 200-amp panel for an EV charger?',
                a: 'Not always. A 32A charger only uses 40A of capacity, which most 100A panels can accommodate. However, if your panel is already near capacity (running HVAC, electric appliances, etc.), an upgrade to 200A is recommended — especially for 48A+ chargers. An electrician can assess your panel\'s available capacity.',
              },
              {
                q: 'What charger amperage should I choose?',
                a: 'For most EVs, a 40–48A charger provides 25–35 miles of range per hour of charging — plenty for overnight charging. A 32A charger (most affordable) adds about 20 miles/hour. Only choose 60A+ if you have a large-battery truck or SUV (Rivian, GMC Hummer) that can accept higher charging rates.',
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-border bg-bg-secondary"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-medium text-text-primary">
                  {faq.q}
                  <span className="ml-4 flex-shrink-0 text-text-tertiary transition-transform group-open:rotate-180">
                    ▾
                  </span>
                </summary>
                <p className="px-5 pb-4 text-sm text-text-secondary">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <RelatedTools tools={[
          { href: '/home-charger-wizard', emoji: '🔌', label: 'Charger Setup Wizard', desc: 'Get personalized charger picks before you call an electrician' },
          { href: '/ev-rebates', emoji: '💵', label: 'Utility Rebates', desc: 'Find rebates from your utility — up to $1,000 back' },
          { href: '/charging-stations', emoji: '📍', label: 'Charging Station Finder', desc: 'Find nearby public stations as a backup while you set up at home' },
        ]} />
      </div>
    </>
  );
}
