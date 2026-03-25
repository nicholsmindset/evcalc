import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CALCULATOR_CONFIGS } from './configs';
import CalcContent from './CalcContent';

export const dynamic = 'force-static';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(CALCULATOR_CONFIGS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = CALCULATOR_CONFIGS[slug];
  if (!config) return {};

  const descriptions: Record<string, string> = {
    'watts-to-kwh': 'Convert watts to kWh instantly. Calculate energy from power (W) × time (hours) ÷ 1,000. Includes EV charging examples for Level 1, Level 2, and DC fast chargers.',
    'kw-to-kwh': 'Convert kilowatts to kWh instantly. Multiply kW × hours to get energy delivered. Common EV charging examples from 1.4 kW Level 1 to 350 kW DC fast chargers.',
    'kwh-to-watts': 'Convert kWh to watts: (kWh ÷ hours) × 1,000 = watts. Find required charger power from battery size and charge time. EV sizing examples included.',
    'ah-to-kwh': 'Convert amp-hours to kWh: (Ah × V) ÷ 1,000. Calculate EV and home battery capacity. Presets for 12V, 48V, 400V, and 800V battery systems.',
    'amp-to-kwh': 'Convert amps to kWh: (A × V × H) ÷ 1,000. Calculate energy from charger amperage, voltage, and time. EV charging examples for 32A, 40A, 48A, and 80A circuits.',
  };

  return {
    title: `${config.title} — Free Online Converter`,
    description: descriptions[slug] ?? config.tagline,
    alternates: { canonical: `/calculators/${slug}` },
    openGraph: {
      title: config.title,
      description: config.tagline,
      url: `/calculators/${slug}`,
      type: 'website',
    },
  };
}

export default async function CalculatorPage({ params }: PageProps) {
  const { slug } = await params;
  const config = CALCULATOR_CONFIGS[slug];
  if (!config) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: config.title,
        url: `https://evrangetools.com/calculators/${slug}`,
        description: config.tagline,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evrangetools.com' },
          { '@type': 'ListItem', position: 2, name: 'Calculators', item: 'https://evrangetools.com/calculators' },
          { '@type': 'ListItem', position: 3, name: config.title, item: `https://evrangetools.com/calculators/${slug}` },
        ],
      },
      {
        '@type': 'HowTo',
        name: `How to ${config.title.replace(' Calculator', '')}`,
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Enter inputs', text: 'Fill in the required values or choose from preset EV examples.' },
          { '@type': 'HowToStep', position: 2, name: 'See instant result', text: 'The result updates instantly as you type — no button press needed.' },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <Link href="/calculators" className="hover:text-text-secondary">Calculators</Link>
          <span>/</span>
          <span className="text-text-primary">{config.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {config.title}
          </h1>
          <p className="mt-2 text-text-secondary">{config.tagline}</p>
        </div>

        <CalcContent slug={slug} />
      </div>
    </>
  );
}
