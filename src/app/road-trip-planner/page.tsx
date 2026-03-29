import type { Metadata } from 'next';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { generateBreadcrumbSchema } from '@/lib/utils/seo';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { RoadTripTool } from './components/RoadTripTool';

export const metadata: Metadata = {
  title: 'EV Road Trip Planner — Plan Routes with Charging Stops',
  description:
    'Plan your EV road trip with optimized charging stops. Calculate real-world range, find DC fast chargers along your route, and estimate total travel time.',
  alternates: { canonical: '/road-trip-planner' },
  openGraph: {
    title: 'EV Road Trip Planner — Plan Routes with Charging Stops',
    description:
      'Plan your EV road trip with optimized charging stops. Calculate real-world range, find DC fast chargers along your route, and estimate total travel time.',
    url: '/road-trip-planner',
    type: 'website',
  },
};

export default function RoadTripPlannerPage() {
  return (
    <>
      <SchemaMarkup
        schema={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'EV Road Trip Planner',
            description:
              'Plan your EV road trip with optimized charging stops. Calculate real-world range, find DC fast chargers along your route, and estimate total travel time.',
            url: '/road-trip-planner',
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          },
          generateBreadcrumbSchema([
            { name: 'Home', href: '/' },
            { name: 'Road Trip Planner', href: '/road-trip-planner' },
          ]),
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
            EV Road Trip Planner — Plan Routes with Charging Stops
          </h1>
          <p className="mt-2 text-text-secondary">
            Plan your route, find charging stops, and estimate travel time with your EV.
          </p>
        </div>

        <RoadTripTool />

        {/* SEO Content */}
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="text-2xl font-display font-bold text-text-primary">
            Plan Your EV Road Trip with Confidence
          </h2>
          <div className="mt-4 max-w-3xl space-y-4 text-text-secondary">
            <p>
              Range anxiety is the #1 concern for EV road trippers, but with proper planning
              it&apos;s easily managed. Our road trip planner calculates your actual range based on
              highway speed, temperature, and battery health — then finds DC fast charging
              stations along your route.
            </p>
            <p>
              The US now has over 85,000 public EV charging stations with 273,000+ ports.
              Major networks like Tesla Supercharger (now open to all EVs via NACS),
              Electrify America, ChargePoint, and EVgo provide coast-to-coast coverage.
              Most DC fast chargers can add 200+ miles of range in 20-30 minutes.
            </p>
            <p>
              Tips for efficient EV road trips: charge to 80% (faster than 100%), plan stops
              every 150-200 miles, keep speeds under 70 mph when possible, and pre-condition
              your battery before arriving at a charger in cold weather.
            </p>
          </div>
        </section>
        <RelatedTools tools={[
          { href: '/charging-stations', emoji: '📍', label: 'Charging Station Finder', desc: 'Browse 85,000+ stations on a live map with filters' },
          { href: '/winter-ev-range', emoji: '❄️', label: 'Winter Range Calculator', desc: 'Check cold-weather range estimates before a winter trip' },
          { href: '/calculator', emoji: '📊', label: 'Range Calculator', desc: 'Calculate real-world range for your conditions before you leave' },
        ]} />
      </div>
    </>
  );
}
