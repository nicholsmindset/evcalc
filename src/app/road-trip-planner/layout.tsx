import type { Metadata } from 'next';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { FAQSection } from '@/components/seo/FAQSection';
import { ProductRecommendation, type AffiliateProduct } from '@/components/affiliate/ProductRecommendation';
import { generateWebApplicationSchema, generateBreadcrumbSchema } from '@/lib/utils/seo';

export const metadata: Metadata = {
  title: 'EV Road Trip Planner — Plan Routes with Charging Stops',
  description:
    'Plan your electric vehicle road trip with optimized charging stops, real-time station data, and range-adjusted routing for any EV model.',
  alternates: { canonical: '/road-trip-planner' },
  openGraph: {
    title: 'EV Road Trip Planner — Plan Routes with Charging Stops',
    description:
      'Plan your electric vehicle road trip with optimized charging stops, real-time station data, and range-adjusted routing for any EV model.',
    url: '/road-trip-planner',
    type: 'website',
  },
};

const ROAD_TRIP_PRODUCTS: AffiliateProduct[] = [
  {
    name: 'BAUER Portable EV Charger — Level 1 & Level 2 (120V/240V)',
    category: 'charger',
    affiliateUrl: 'https://www.amazon.com/dp/B0BQKFKHVS?tag=evrangecalc-20',
    priceDisplay: '$189.99',
    rating: 4.4,
    reviewCount: 1200,
    description: 'Dual-voltage portable EV charger. 16A Level 2 on 240V for faster charging at hotels and campgrounds.',
  },
  {
    name: 'Tesla to J1772 Adapter (Non-Tesla EVs at Tesla Chargers)',
    category: 'adapter',
    affiliateUrl: 'https://www.amazon.com/dp/B0CNFK7YH4?tag=evrangecalc-20',
    priceDisplay: '$149.99',
    rating: 4.5,
    reviewCount: 890,
    description: 'Use Tesla Destination chargers and Superchargers with non-Tesla EVs. Supports up to 250kW DC.',
  },
  {
    name: 'Magnetic Phone Mount for Car Dashboard',
    category: 'accessory',
    affiliateUrl: 'https://www.amazon.com/dp/B07THRCL5H?tag=evrangecalc-20',
    priceDisplay: '$25.99',
    rating: 4.6,
    reviewCount: 45000,
    description: 'Strong magnetic mount for navigation on road trips. Universal fit, 360° rotation.',
  },
];

const ROAD_TRIP_FAQS = [
  { question: 'Can you road trip in an electric car?', answer: 'Absolutely. With 350,000+ public charging stations in the US (including 30,000+ DC fast chargers), road trips in EVs are practical and increasingly convenient. Most modern EVs have 250-350 miles of range, and fast chargers can add 150-200 miles in 20-30 minutes.' },
  { question: 'How do I plan an EV road trip?', answer: "Use our planner to enter your start, destination, and vehicle. We calculate optimal charging stops based on your EV's real-world range, accounting for speed, elevation, and weather. The planner shows charging station locations, estimated charge times, and total trip duration." },
  { question: 'How long does it take to charge on a road trip?', answer: 'At DC fast chargers (150-350 kW), most EVs charge from 10% to 80% in 20-40 minutes. Plan for 2-3 charging stops on a 500-mile trip, adding about 1-1.5 hours total. Many drivers combine charging with meal stops.' },
  { question: 'What charging networks are best for road trips?', answer: 'Tesla Supercharger (now open to other EVs via NACS), Electrify America, and ChargePoint are the most reliable networks for road trips. Electrify America has stations every 70 miles along major highways, and Tesla Superchargers are the most extensive network with 17,000+ US locations.' },
  { question: 'How does weather affect EV road trip range?', answer: 'Cold weather (below 40°F) can reduce range by 20-40%, requiring more frequent charging stops. Hot weather (above 95°F) reduces range by 5-15%. Our planner accounts for temperature when calculating your route and charging stops.' },
];

export default function RoadTripPlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SchemaMarkup
        schema={[
          generateWebApplicationSchema(
            'EV Road Trip Planner',
            'Plan your electric vehicle road trip with optimized charging stops and range-adjusted routing.',
            '/road-trip-planner'
          ),
          generateBreadcrumbSchema([
            { name: 'Home', href: '/' },
            { name: 'Road Trip Planner', href: '/road-trip-planner' },
          ]),
        ]}
      />
      {children}
      <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <ProductRecommendation
          title="Road Trip Essentials for EV Drivers"
          products={ROAD_TRIP_PRODUCTS}
        />
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <FAQSection faqs={ROAD_TRIP_FAQS} />
      </div>
    </>
  );
}
