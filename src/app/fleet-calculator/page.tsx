import type { Metadata } from 'next';
import FleetCalcContent from './FleetCalcContent';

export const metadata: Metadata = {
  title: 'Fleet EV ROI Calculator — Total Cost of Ownership for Commercial Fleets',
  description:
    'Calculate the ROI, fuel savings, and total cost of ownership for electrifying your commercial vehicle fleet. Compare EV vs gas costs for 1–500 vehicles with 5- and 10-year projections.',
  keywords: [
    'fleet EV ROI calculator',
    'commercial EV fleet cost',
    'fleet electrification savings',
    'EV fleet total cost of ownership',
    'corporate fleet EV calculator',
  ],
  alternates: { canonical: '/fleet-calculator' },
  openGraph: {
    title: 'Fleet EV ROI Calculator',
    description:
      'See exactly how much your business saves by switching to electric vehicles — fuel, maintenance, and total 10-year TCO.',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Fleet EV ROI Calculator',
      description:
        'Commercial fleet electrification ROI calculator with fuel savings, maintenance reduction, and total cost of ownership projections.',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.evrangetools.com' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Fleet EV ROI Calculator',
          item: 'https://www.evrangetools.com/fleet-calculator',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much does a commercial fleet save by switching to EVs?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Commercial EV fleets typically save 40–70% on fuel costs and 30–50% on maintenance vs. equivalent gas or diesel vehicles. For a 50-vehicle fleet driving 100 miles/day, annual savings often exceed $200,000.',
          },
        },
        {
          '@type': 'Question',
          name: 'What federal tax credits are available for fleet EVs?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The federal §45W commercial clean vehicle credit is unavailable for vehicles acquired after September 30, 2025. This calculator does not assume a federal vehicle credit for a current fleet purchase.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the typical payback period for fleet electrification?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'After federal tax credits, most commercial fleets achieve payback in 2–5 years depending on vehicle type, mileage, local fuel/electricity rates, and available incentives. High-mileage delivery fleets often pay back in under 3 years.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which vehicle types save the most by going electric?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Delivery vans and cargo vans see the highest ROI because they drive high daily mileage and stop-and-go driving maximizes regenerative braking efficiency. Electric delivery vans like the Rivian EDV can save over $12,000 per vehicle per year vs. diesel alternatives.',
          },
        },
      ],
    },
  ],
};

export default function FleetCalculatorPage() {
  const faqItems = (
    jsonLd['@graph'][2] as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] }
  ).mainEntity;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
          Fleet EV ROI Calculator
        </h1>
        <p className="mt-2 max-w-2xl text-text-secondary">
          Compare the purchase, fuel, and operating costs of electric and gas fleets.
        </p>
      </header>
      <FleetCalcContent />

      {/* FAQ Section */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold text-text-primary">
          Fleet EV ROI — Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqItems.map((faq) => (
            <div key={faq.name} className="rounded-xl border border-border bg-bg-secondary p-6">
              <h3 className="mb-3 font-semibold text-text-primary">{faq.name}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {faq.acceptedAnswer.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
