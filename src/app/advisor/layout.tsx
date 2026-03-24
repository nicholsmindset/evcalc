import type { Metadata } from 'next';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { FAQSection } from '@/components/seo/FAQSection';
import { generateWebApplicationSchema, generateBreadcrumbSchema } from '@/lib/utils/seo';

export const metadata: Metadata = {
  title: 'AI EV Advisor — Get Instant Answers About Electric Vehicles',
  description:
    'Ask our AI expert about EV range, charging, costs, and buying advice. Personalized recommendations for your driving patterns.',
  alternates: { canonical: '/advisor' },
  openGraph: {
    title: 'AI EV Advisor — Get Instant Answers About Electric Vehicles',
    description:
      'Ask our AI expert about EV range, charging, costs, and buying advice. Personalized recommendations for your driving patterns.',
    url: '/advisor',
    type: 'website',
  },
};

const ADVISOR_FAQS = [
  { question: 'What can the AI EV Advisor help with?', answer: 'Our AI advisor can answer questions about EV range, charging options, cost comparisons, buying recommendations, battery health, home charger installation, and road trip planning. It uses EPA data and real-world information to provide accurate, personalized answers.' },
  { question: 'How long do EV batteries last?', answer: 'Modern EV batteries are designed to last 200,000-300,000 miles or 15-20 years. Most manufacturers warranty the battery for 8 years/100,000 miles with a guarantee of at least 70% capacity retention. Real-world data shows average degradation of just 2-3% per year.' },
  { question: 'Which EV should I buy?', answer: 'The best EV depends on your needs: Tesla Model Y or Hyundai Ioniq 5 for families, Chevrolet Equinox EV or Nissan Ariya for value, Tesla Model 3 or BMW i4 for commuters, and Rivian R1S or Kia EV9 for those needing three rows. Use our comparison tool to see detailed specs.' },
  { question: "How do I maximize my EV's range?", answer: 'Key range tips: precondition the battery while plugged in, drive at moderate speeds (55-65 mph is optimal), use Eco mode, minimize HVAC usage with seat heaters instead, maintain proper tire pressure, and avoid carrying unnecessary cargo. These changes can improve range by 15-30%.' },
  { question: 'When is the best time to buy an EV?', answer: 'End of quarter (March, June, September, December) and year-end typically offer the best deals as manufacturers push to meet sales targets. Model year changeovers (August-October) bring discounts on outgoing models. The federal tax credit of up to $7,500 is available year-round for qualifying models.' },
];

export default function AdvisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SchemaMarkup
        schema={[
          generateWebApplicationSchema(
            'AI EV Advisor',
            'Get instant AI-powered answers about EV range, charging, costs, and buying advice.',
            '/advisor'
          ),
          generateBreadcrumbSchema([
            { name: 'Home', href: '/' },
            { name: 'AI EV Advisor', href: '/advisor' },
          ]),
        ]}
      />
      {children}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <FAQSection faqs={ADVISOR_FAQS} />
      </div>
    </>
  );
}
