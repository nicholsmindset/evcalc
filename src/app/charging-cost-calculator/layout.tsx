import type { Metadata } from 'next';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { FAQSection } from '@/components/seo/FAQSection';
import { generateWebApplicationSchema, generateBreadcrumbSchema } from '@/lib/utils/seo';

export const metadata: Metadata = {
  title: 'EV Charging Cost Calculator — How Much Does It Cost to Charge?',
  description:
    'Calculate your exact EV charging cost using real electricity rates by state. Compare home, public, and DC fast charging costs for any electric vehicle.',
  alternates: { canonical: '/charging-cost-calculator' },
  openGraph: {
    title: 'EV Charging Cost Calculator — How Much Does It Cost to Charge?',
    description:
      'Calculate your exact EV charging cost using real electricity rates by state. Compare home, public, and DC fast charging costs for any electric vehicle.',
    url: '/charging-cost-calculator',
    type: 'website',
  },
};

const CHARGING_COST_FAQS = [
  { question: 'How much does it cost to charge an electric car?', answer: 'The average cost to fully charge an EV in the US is $10-15 for home charging using residential electricity rates. At public DC fast chargers, expect $15-30 per session. The exact cost depends on your local electricity rate, battery size, and charging speed.' },
  { question: 'How much does it cost to charge at a Tesla Supercharger?', answer: 'Tesla Supercharger rates vary by location but typically range from $0.25-0.50 per kWh. A full charge on a Tesla Model 3 Long Range (75 kWh battery) costs approximately $19-38 at a Supercharger.' },
  { question: 'Is it cheaper to charge an EV at home or at a public charger?', answer: 'Home charging is significantly cheaper — typically 60-70% less than public DC fast charging. The average US residential rate is about $0.16/kWh compared to $0.35-0.60/kWh at public fast chargers. Charging at home overnight on time-of-use rates can save even more.' },
  { question: 'How much electricity does an EV use per month?', answer: 'The average EV driven 1,000 miles per month uses about 300-350 kWh of electricity. At the US average rate of $0.16/kWh, that costs roughly $48-56/month — compared to $120-180/month in gasoline for an equivalent gas car.' },
  { question: 'What is the cheapest state to charge an EV?', answer: 'Louisiana, Washington, and Idaho have the lowest residential electricity rates in the US at around $0.10-0.12/kWh. Hawaii and Connecticut are the most expensive at $0.35-0.45/kWh. Use our calculator with your actual state rate for precise costs.' },
];

export default function ChargingCostCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SchemaMarkup
        schema={[
          generateWebApplicationSchema(
            'EV Charging Cost Calculator',
            'Calculate your exact EV charging cost using real electricity rates by state.',
            '/charging-cost-calculator'
          ),
          generateBreadcrumbSchema([
            { name: 'Home', href: '/' },
            { name: 'Charging Cost Calculator', href: '/charging-cost-calculator' },
          ]),
        ]}
      />
      {children}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <FAQSection faqs={CHARGING_COST_FAQS} />
      </div>
    </>
  );
}
