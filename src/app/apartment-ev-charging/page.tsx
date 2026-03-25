import type { Metadata } from 'next';
import Link from 'next/link';
import ApartmentContent from './ApartmentContent';

export const metadata: Metadata = {
  title: 'Apartment EV Charging Guide — Your Right-to-Charge Options',
  description:
    'Complete guide to EV charging in apartments, condos, and HOAs. Check your state\'s right-to-charge law, explore 5 charging options ranked by feasibility, and get a landlord letter template.',
  alternates: { canonical: '/apartment-ev-charging' },
  openGraph: {
    title: 'Apartment EV Charging Guide: 5 Options + State Laws',
    description:
      'Don\'t let a lack of home charging stop you from going electric. Explore every option from HOA negotiation to public charging — with real cost comparisons.',
    url: '/apartment-ev-charging',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Apartment EV Charging Guide — Right-to-Charge Laws, Options, and Costs',
      description: 'Complete guide covering right-to-charge laws by state, 5 EV charging options for apartment dwellers, cost comparisons, and landlord request templates.',
      url: 'https://evrangetools.com/apartment-ev-charging',
      author: { '@type': 'Organization', name: 'EV Range Tools' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evrangetools.com' },
        { '@type': 'ListItem', position: 2, name: 'Apartment EV Charging', item: 'https://evrangetools.com/apartment-ev-charging' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Can my landlord refuse to let me install an EV charger?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'In California, Colorado, Florida, Hawaii, Oregon, Nevada, and 8 other states, landlords cannot unreasonably deny EV charging requests. In most other states, there is no statewide protection — but you can still negotiate, propose cost-sharing arrangements, or rely on public charging networks.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does it cost to charge an EV at a public charging station?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Level 2 public charging (ChargePoint, EVgo, Blink) typically costs $0.30-$0.50/kWh, or $0.10-$0.20/mile. DC fast charging costs $0.35-$0.65/kWh. This is significantly more than home charging ($0.13-$0.27/kWh) but still cheaper than gasoline in most cases. Many networks offer monthly plans that reduce per-kWh cost.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the cheapest EV charging option for apartment dwellers?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A Level 2 charger installed in your parking space (with landlord permission) is the cheapest long-term option. If that\'s not possible, free workplace charging (where available) is best. Public Level 2 with a network membership plan is next. Avoid relying primarily on DC fast charging — it\'s 3-4x more expensive per mile than home charging.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I charge an EV with a regular 120V outlet (Level 1)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes — all EVs come with a Level 1 (120V) charging cord. If you have a standard outlet in your parking spot or garage, you can charge at ~3-5 miles per hour. This works well for drivers who commute less than 40 miles daily and can charge overnight. It\'s slow but completely free (or part of your rent) if you have a dedicated outlet.',
          },
        },
      ],
    },
  ],
};

export default function ApartmentEvChargingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <span className="text-text-primary">Apartment EV Charging</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            EV Charging in Apartments &amp; Condos
          </h1>
          <p className="mt-3 text-text-secondary">
            No garage? No problem. Here are all your options — from right-to-charge laws to public
            charging strategies — ranked by cost and feasibility.
          </p>
        </div>

        <ApartmentContent />

        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-3 font-display text-lg font-bold text-text-primary">Related Tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/charging-cost-calculator" className="text-sm text-accent hover:underline">Charging Cost Calculator</Link>
            <Link href="/find-my-ev" className="text-sm text-accent hover:underline">Find My EV</Link>
            <Link href="/home-charger-wizard" className="text-sm text-accent hover:underline">Home Charger Wizard</Link>
            <Link href="/ev-incentives" className="text-sm text-accent hover:underline">EV Incentives by State</Link>
          </div>
        </section>
      </div>
    </>
  );
}
