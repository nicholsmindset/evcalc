import type { Metadata } from 'next';
import { ChatInterface } from '@/components/advisor/ChatInterface';

export const metadata: Metadata = {
  title: 'AI EV Advisor — Get Personalized Electric Vehicle Answers',
  description:
    'Ask our AI expert about EV range, charging, costs, and buying advice. Get instant, personalized answers powered by EPA data and real-world EV knowledge.',
  alternates: { canonical: '/advisor' },
  openGraph: {
    title: 'AI EV Advisor — Get Personalized Electric Vehicle Answers',
    description:
      'Ask our AI expert about EV range, charging, costs, and buying advice. Get instant, personalized answers powered by EPA data and real-world EV knowledge.',
    url: '/advisor',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'AI EV Advisor',
      url: 'https://evrangetools.com/advisor',
      description:
        'Ask our AI expert about EV range, charging, costs, and buying advice. Get instant, personalized answers powered by EPA data and real-world EV knowledge.',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evrangetools.com' },
        { '@type': 'ListItem', position: 2, name: 'AI EV Advisor', item: 'https://evrangetools.com/advisor' },
      ],
    },
  ],
};

export default function AdvisorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          AI EV Advisor — Get Answers About Electric Vehicles
        </h1>
        <p className="mt-2 text-text-secondary">
          Get instant answers about EV range, charging strategies, costs, and buying advice from our AI expert.
        </p>
      </div>

      {/* Chat Interface */}
      <ChatInterface />

      {/* SEO Content */}
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="text-xl font-display font-bold text-text-primary">
          About the AI Range Advisor
        </h2>
        <div className="mt-4 max-w-3xl space-y-3 text-sm text-text-secondary">
          <p>
            Our AI Range Advisor is trained on comprehensive EV data including EPA ratings,
            real-world range tests, charging infrastructure, and cost analysis. Ask about
            specific vehicles, compare models, or get personalized recommendations.
          </p>
          <p>
            Popular topics: how cold weather affects range, optimal charging habits for
            battery longevity, road trip planning tips, EV vs gas cost comparisons, and
            which EV is best for your driving patterns.
          </p>
        </div>
      </section>
    </div>
  );
}
