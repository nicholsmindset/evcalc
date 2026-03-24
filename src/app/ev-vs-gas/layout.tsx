import type { Metadata } from 'next';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { FAQSection } from '@/components/seo/FAQSection';
import { ProductRecommendation, type AffiliateProduct } from '@/components/affiliate/ProductRecommendation';
import { generateWebApplicationSchema, generateBreadcrumbSchema } from '@/lib/utils/seo';

export const metadata: Metadata = {
  title: 'EV vs Gas Savings Calculator — Is an Electric Car Cheaper?',
  description:
    "See exactly how much you'll save switching from gas to electric over 5, 7, or 10 years. Compare fuel costs, maintenance, and total savings.",
  alternates: { canonical: '/ev-vs-gas' },
  openGraph: {
    title: 'EV vs Gas Savings Calculator — Is an Electric Car Cheaper?',
    description:
      "See exactly how much you'll save switching from gas to electric over 5, 7, or 10 years. Compare fuel costs, maintenance, and total savings.",
    url: '/ev-vs-gas',
    type: 'website',
  },
};

const EV_VS_GAS_PRODUCTS: AffiliateProduct[] = [
  {
    name: 'ChargePoint Home Flex Level 2 EV Charger',
    category: 'charger',
    affiliateUrl: 'https://www.amazon.com/dp/B07WXZDHGV?tag=robertnicho0a-20',
    priceDisplay: '$699.00',
    rating: 4.6,
    reviewCount: 3200,
    description: 'Ready to switch? The ChargePoint Home Flex is the top-rated Level 2 charger. Up to 50A / 12kW with WiFi energy tracking.',
  },
  {
    name: 'Grizzl-E Classic Level 2 EV Charger',
    category: 'charger',
    affiliateUrl: 'https://www.amazon.com/dp/B085C7152V?tag=robertnicho0a-20',
    priceDisplay: '$459.00',
    rating: 4.7,
    reviewCount: 1800,
    description: 'Best value Level 2 home charger. 40A / 9.6kW, indoor/outdoor rated, no subscription required.',
  },
  {
    name: 'NOCO Genius10 Smart Battery Charger',
    category: 'accessory',
    affiliateUrl: 'https://www.amazon.com/dp/B07W8KXL2T?tag=robertnicho0a-20',
    priceDisplay: '$89.95',
    rating: 4.7,
    reviewCount: 22000,
    description: 'Keep your 12V auxiliary battery healthy — EVs still have one. Smart maintenance charger for garage storage.',
  },
];

const EV_VS_GAS_FAQS = [
  { question: 'Are electric cars worth it in 2025?', answer: 'For most drivers, yes. EVs now cost less to fuel ($500-800/year vs $1,500-2,500 for gas), require less maintenance (no oil changes, fewer brake replacements), and qualify for up to $7,500 in federal tax credits. The average EV owner saves $6,000-10,000 over 5 years compared to a gas car.' },
  { question: 'Is an electric car cheaper than gas long-term?', answer: 'Yes, in most cases. While EVs have a higher upfront cost, lower fuel costs ($0.04-0.06/mile vs $0.12-0.20/mile for gas) and reduced maintenance (40% fewer parts) make EVs cheaper over 5-10 years. Our calculator shows the exact break-even point for any EV vs gas comparison.' },
  { question: 'How much do you save on maintenance with an EV?', answer: 'EV owners save an average of $4,600 in maintenance costs over the first 50,000 miles. EVs have no oil changes, no transmission service, and regenerative braking extends brake pad life to 100,000+ miles. The main maintenance costs are tires and cabin air filters.' },
  { question: 'What is the EV tax credit for 2025?', answer: 'The federal EV tax credit provides up to $7,500 for new qualifying EVs and up to $4,000 for used EVs. The credit amount depends on battery sourcing and assembly requirements. Many states offer additional rebates of $500-5,000.' },
  { question: 'How much does EV insurance cost compared to gas cars?', answer: 'EV insurance averages 15-25% more than comparable gas cars due to higher repair costs for battery and specialized components. However, some insurers offer EV-specific discounts. Shopping around can minimize the difference to under $200/year.' },
];

export default function EvVsGasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SchemaMarkup
        schema={[
          generateWebApplicationSchema(
            'EV vs Gas Savings Calculator',
            'Compare fuel costs, maintenance, and total savings when switching from gas to electric.',
            '/ev-vs-gas'
          ),
          generateBreadcrumbSchema([
            { name: 'Home', href: '/' },
            { name: 'EV vs Gas Savings', href: '/ev-vs-gas' },
          ]),
        ]}
      />
      {children}
      <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <ProductRecommendation
          title="Ready to Switch? Top Home Chargers"
          products={EV_VS_GAS_PRODUCTS}
        />
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <FAQSection faqs={EV_VS_GAS_FAQS} />
      </div>
    </>
  );
}
