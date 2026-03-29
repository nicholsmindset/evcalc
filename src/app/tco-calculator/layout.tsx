import { FAQSection } from '@/components/seo/FAQSection';

const TCO_FAQS = [
  { question: 'What is total cost of ownership for an EV?', answer: 'Total cost of ownership (TCO) includes purchase price, fuel costs, maintenance, insurance, depreciation, and any tax credits or incentives. For most EVs, the TCO is $5,000-15,000 less than a comparable gas car over 5 years, despite higher upfront costs.' },
  { question: 'How much does EV battery replacement cost?', answer: 'EV battery replacement costs range from $5,000-15,000 depending on the vehicle. However, most EV batteries are warrantied for 8 years/100,000 miles and are expected to last 200,000+ miles. Battery degradation averages only 2-3% per year for modern EVs.' },
  { question: 'Do electric cars depreciate faster than gas cars?', answer: 'EVs historically depreciated faster, but the gap is narrowing. Tesla models retain 65-75% of their value after 3 years. Popular models like the Model Y and Hyundai Ioniq 5 now depreciate at similar rates to comparable gas SUVs.' },
  { question: 'What maintenance costs should I budget for an EV?', answer: 'Budget approximately $600-900/year for EV maintenance: tire rotations ($50-75 every 6 months), cabin air filter ($30-50 annually), brake fluid check, and windshield wipers. No oil changes, transmission service, or spark plug replacements needed.' },
  { question: 'How do EV fuel costs compare to gas cars?', answer: 'EVs cost about $0.04-0.06 per mile to fuel at home charging rates, compared to $0.12-0.20 per mile for gas cars. For a driver doing 12,000 miles/year, that saves $720-1,680 annually in fuel costs alone.' },
];

export default function TcoCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <FAQSection faqs={TCO_FAQS} />
      </div>
    </>
  );
}
