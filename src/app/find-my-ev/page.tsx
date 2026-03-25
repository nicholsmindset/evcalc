import type { Metadata } from 'next';
import Link from 'next/link';
import RecommendationContent from './RecommendationContent';

export const metadata: Metadata = {
  title: 'Find My EV — Personalized Electric Car Recommendation Engine',
  description:
    'Answer 6 quick questions about range, budget, cargo, charging speed, performance, and tech to get your top 5 personalized EV matches with match percentage.',
  alternates: { canonical: '/find-my-ev' },
  openGraph: {
    title: 'Find My Perfect EV — Personalized Recommendation Engine',
    description:
      'Slide 6 priority weights — range, value, cargo, charging, performance, tech — and instantly see your top 5 EV matches ranked by compatibility.',
    url: '/find-my-ev',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'EV Recommendation Engine',
      url: 'https://evrangetools.com/find-my-ev',
      description:
        'Personalized EV recommendation tool that scores all electric vehicles against your priorities to find your perfect match.',
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
          name: 'Find My EV',
          item: 'https://evrangetools.com/find-my-ev',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does the EV recommendation algorithm work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Each vehicle is scored across 6 dimensions: range, value (budget), cargo space, DC fast charging speed, 0-60 acceleration, and tech/software quality. Your slider weights determine how much each dimension matters. Scores are normalized 0-100% across all vehicles and weighted-averaged to produce a final match percentage.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does the max budget include the federal tax credit?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The budget filter applies after subtracting applicable federal tax credits (up to $7,500 for new EVs). So a $42,500 EV with a $7,500 credit has an effective cost of $35,000 — this is what is compared against your budget.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which EVs are included in the recommendation engine?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The engine includes 15+ popular 2024 model year EVs covering sedans, SUVs, trucks, and hatchbacks from Tesla, Hyundai, Ford, Rivian, Chevrolet, Kia, Volkswagen, BMW, Mercedes-Benz, and Nissan.',
          },
        },
      ],
    },
  ],
};

export default function FindMyEVPage() {
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
          <span className="text-text-primary">Find My EV</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Find My Perfect EV
          </h1>
          <p className="mt-3 text-text-secondary">
            Dial in what matters most to you. Your top matches update instantly based on your priorities.
          </p>
        </div>

        <RecommendationContent />

        {/* Related tools */}
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-3 font-display text-lg font-bold text-text-primary">Related Tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/can-i-afford-an-ev" className="text-sm text-accent hover:underline">
              Can I Afford an EV?
            </Link>
            <Link href="/vehicles" className="text-sm text-accent hover:underline">
              Browse All EVs
            </Link>
            <Link href="/calculator" className="text-sm text-accent hover:underline">
              EV Range Calculator
            </Link>
            <Link href="/ev-vs-gas" className="text-sm text-accent hover:underline">
              EV vs Gas Savings
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
