import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CalculatorContent } from './CalculatorContent';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { FAQSection } from '@/components/seo/FAQSection';
import { generateWebApplicationSchema, generateBreadcrumbSchema } from '@/lib/utils/seo';
import { RelatedTools } from '@/components/ui/RelatedTools';

export const metadata: Metadata = {
  title: 'EV Range Calculator — Calculate Real-World Electric Car Range',
  description:
    "Calculate your EV's real-world range adjusted for temperature, speed, terrain, HVAC, and battery health. Works for Tesla, Hyundai, Kia, Ford, and 60+ models.",
  alternates: { canonical: '/calculator' },
  openGraph: {
    title: 'EV Range Calculator — Calculate Real-World Electric Car Range',
    description:
      "Calculate your EV's real-world range adjusted for temperature, speed, terrain, HVAC, and battery health. Works for Tesla, Hyundai, Kia, Ford, and 60+ models.",
    url: '/calculator',
    type: 'website',
  },
};

const CALCULATOR_FAQS = [
  { question: 'How accurate is the EV range calculator?', answer: 'Our calculator uses physics-based modeling with EPA-certified data to predict real-world range within 5-10% accuracy. We account for temperature effects on battery chemistry, aerodynamic drag at different speeds, terrain elevation changes, HVAC energy consumption, and battery degradation — the same factors that determine your actual driving range.' },
  { question: 'How far can a Tesla go on one charge?', answer: 'Tesla range varies by model: Model 3 Standard Range (272 mi), Model 3 Long Range (341 mi), Model Y Long Range (310 mi), Model S (405 mi), and Model X (348 mi). These are EPA-rated ranges — real-world range depends on speed, temperature, and driving style. Use our calculator to see adjusted range for your conditions.' },
  { question: 'How does cold weather affect EV range?', answer: 'Cold weather significantly reduces EV range: expect 10-20% loss at 40°F, 20-30% at 20°F, and up to 40% at 0°F. This is caused by reduced battery chemistry efficiency and energy used for cabin heating. Heat pump-equipped EVs (Tesla, Hyundai, Kia) lose less range in cold weather than resistive heating systems.' },
  { question: 'Does driving faster reduce EV range?', answer: 'Yes, significantly. Aerodynamic drag increases with the square of speed, so driving at 75 mph uses about 25% more energy than 55 mph. Highway driving at 80 mph can reduce range by 30-40% compared to city driving at 30-40 mph. The optimal speed for maximum EV range is 25-35 mph.' },
  { question: 'How does battery health affect EV range?', answer: 'Battery degradation directly reduces your maximum range. A battery at 90% health delivers 90% of its original range. Modern EV batteries degrade about 2-3% per year on average. After 8 years, expect 80-85% of original capacity. Factors that accelerate degradation include frequent DC fast charging, extreme temperatures, and charging to 100% regularly.' },
];

export default function CalculatorPage() {
  return (
    <>
      <SchemaMarkup
        schema={[
          generateWebApplicationSchema(
            'EV Range Calculator',
            "Calculate your EV's real-world range adjusted for temperature, speed, terrain, HVAC, and battery health.",
            '/calculator'
          ),
          generateBreadcrumbSchema([
            { name: 'Home', href: '/' },
            { name: 'Range Calculator', href: '/calculator' },
          ]),
        ]}
      />
      <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
            EV Range Calculator
          </h1>
          <p className="mt-2 text-text-secondary">
            Calculate real-world range adjusted for temperature, speed, terrain, and driving conditions.
          </p>
        </div>
        <div className="h-16 animate-pulse rounded-xl bg-bg-secondary" />
      </div>
    }>
      <CalculatorContent />
    </Suspense>
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <FAQSection faqs={CALCULATOR_FAQS} />
        <RelatedTools tools={[
          { href: '/charging-cost-calculator', emoji: '🔋', label: 'Charging Cost Calculator', desc: 'Find your exact cost per charge using real state electricity rates' },
          { href: '/road-trip-planner', emoji: '🗺️', label: 'Road Trip Planner', desc: 'Plan any route with optimized charging stops and real-time station data' },
          { href: '/winter-ev-range', emoji: '❄️', label: 'Winter Range Calculator', desc: 'See how cold weather impacts your range city by city' },
        ]} />
      </div>
    </>
  );
}
