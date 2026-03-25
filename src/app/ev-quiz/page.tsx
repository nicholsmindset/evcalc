import type { Metadata } from 'next';
import Link from 'next/link';
import QuizContent from './QuizContent';

export const metadata: Metadata = {
  title: 'EV Readiness Quiz 2025 — Is an Electric Car Right for You?',
  description:
    'Take our free 10-question EV readiness quiz. Get a personalized score, radar chart, and 3 EV recommendations matched to your lifestyle, budget, and driving habits.',
  alternates: { canonical: '/ev-quiz' },
  openGraph: {
    title: 'EV Readiness Quiz — Is an Electric Car Right for You?',
    description: 'Answer 10 questions and get your EV readiness score, profile chart, and personalized vehicle recommendations.',
    url: '/ev-quiz',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'EV Readiness Quiz',
  url: 'https://evrangetools.com/ev-quiz',
  description: '10-question quiz that determines EV readiness across 5 dimensions: Readiness, Financial Fit, Charging Access, Range Confidence, and Environmental Impact.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default function EvQuizPage() {
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
          <span className="text-text-primary">EV Readiness Quiz</span>
        </nav>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Is an EV Right for You?
          </h1>
          <p className="mt-3 text-text-secondary">
            A free 10-question quiz that measures your EV readiness across 5 key dimensions
            and recommends the best EVs for your lifestyle.
          </p>
        </div>

        {/* Quiz */}
        <QuizContent />
      </div>
    </>
  );
}
