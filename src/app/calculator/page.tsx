import Link from 'next/link';
import { calculateRange } from '@/lib/calculations/range';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CalculatorContent } from './CalculatorContent';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { FAQSection } from '@/components/seo/FAQSection';
import { generateWebApplicationSchema, generateBreadcrumbSchema, generateHowToSchema } from '@/lib/utils/seo';
import { RelatedTools } from '@/components/ui/RelatedTools';

export const metadata: Metadata = {
  title: 'EV Range Calculator — Calculate Real-World Electric Car Range',
  description:
    "Calculate your EV's real-world range adjusted for temperature, speed, terrain, HVAC, and battery health. Compare vehicles from Tesla, Hyundai, Kia, Ford and more.",
  alternates: { canonical: '/calculator' },
  openGraph: {
    title: 'EV Range Calculator — Calculate Real-World Electric Car Range',
    description:
      "Calculate your EV's real-world range adjusted for temperature, speed, terrain, HVAC, and battery health. Compare vehicles from Tesla, Hyundai, Kia, Ford and more.",
    url: '/calculator',
    type: 'website',
  },
};

const CALCULATOR_FAQS = [
  { question: 'How accurate is this EV range calculator?', answer: 'This is a planning estimate using a vehicle range rating and shared adjustment factors. It has not been validated to a fixed percentage accuracy for each model. Weather, tires, wind, elevation and battery temperature can produce different results. Leave a reserve and use your vehicle navigation for trip planning.' },
  { question: 'Is this range measured or calculated?', answer: 'The starting range comes from the vehicle catalog. The adjusted range is calculated, not a road-test result. Shared temperature, speed, terrain, heating, cargo and battery-health factors are multiplied together.' },
  { question: 'Does the calculator include my current charge level?', answer: 'The result represents a full-charge estimate. For a planning approximation, multiply it by the fraction of battery you intend to use. A 300-mile estimate with a window from 80% to 20% gives about 180 miles before your reserve. Actual usable range varies.' },
  { question: 'How does cold weather affect EV range?', answer: 'Cold weather can increase energy used for battery conditioning and cabin heating. The effect varies by vehicle, trip length and weather. Compare heat-pump and resistive-heating settings, and precondition while plugged in when your vehicle supports it.' },
  { question: 'What do the battery units mean?', answer: 'kWh measures energy stored or consumed. kW measures power, such as charging speed. A charging rate in kW is not the battery capacity in kWh.' },
];

const EXAMPLES = [
  { label: 'Reference conditions', temperatureF: 70, speedMph: 55, terrain: 'mixed' as const, hvacMode: 'off' as const },
  { label: 'Highway driving', temperatureF: 70, speedMph: 70, terrain: 'highway' as const, hvacMode: 'off' as const },
  { label: 'Cold highway, heat pump', temperatureF: 30, speedMph: 70, terrain: 'highway' as const, hvacMode: 'heat_pump' as const },
].map((example) => ({ ...example, range: calculateRange({ ...example, epaRangeMi: 300, cargoLbs: 0, batteryHealthPct: 100 }).adjustedRangeMi }));

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
          generateHowToSchema(
            'How to Calculate Your EV Real-World Range',
            "Use our calculator to find your EV's real-world range adjusted for temperature, speed, terrain, and battery health.",
            [
              { name: 'Select your vehicle', text: 'Choose your EV make, model, year, and trim from the dropdown.' },
              { name: 'Set temperature', text: 'Enter the outside temperature in °F or °C for your driving conditions.' },
              { name: 'Set driving conditions', text: 'Adjust speed, terrain type (city/highway/hilly), and HVAC mode.' },
              { name: 'View your range', text: 'See your adjusted real-world range and a breakdown of how each factor affects your battery.' },
            ]
          ),
          generateBreadcrumbSchema([
            { name: 'Home', href: '/' },
            { name: 'Range Calculator', href: '/calculator' },
          ]),
        ]}
      />
      <header className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-bold text-text-primary sm:text-4xl">EV Range Calculator — Estimate Your Driving Range</h1>
        <p className="mt-3 max-w-3xl text-text-secondary">Select your electric car and compare estimated range in different temperatures, speeds and driving conditions. Results are planning estimates, not measured road-test results.</p>
        <p className="mt-3 text-sm text-text-secondary">Start with the <Link href="/vehicles/tesla-model-3-long-range-2025" className="text-accent hover:underline">2025 Tesla Model 3 Long Range AWD</Link>, <Link href="/vehicles/tesla-model-y-long-range-2025" className="text-accent hover:underline">Model Y Long Range AWD</Link>, or <Link href="/vehicles" className="text-accent hover:underline">browse the vehicle catalog</Link>.</p>
      </header>
      <Suspense fallback={<div className="mx-auto my-8 h-40 max-w-7xl animate-pulse rounded-xl bg-bg-secondary" aria-label="Loading interactive calculator" />}>
        <CalculatorContent />
      </Suspense>
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <section className="my-10 max-w-3xl space-y-4 text-text-secondary">
          <h2 className="text-2xl font-display font-bold text-text-primary">Example: a car rated for 300 miles</h2>
          <p>These examples use the same model as the interactive tool, with no extra cargo and 100% battery health. They illustrate the calculation; they are not results from a specific vehicle test.</p>
          <table className="w-full text-sm"><thead><tr><th className="py-2 text-left">Conditions</th><th className="text-right">Estimated full-charge range</th></tr></thead><tbody>{EXAMPLES.map((e) => <tr key={e.label} className="border-t border-border"><td className="py-3">{e.label}: {e.temperatureF}°F, {e.speedMph} mph</td><td className="text-right">{e.range} miles</td></tr>)}</tbody></table>
          <h2 id="methodology" className="pt-6 text-2xl font-display font-bold text-text-primary">How the range estimate works</h2>
          <p>Starting range × temperature factor × speed factor × terrain factor × HVAC factor × cargo factor × battery health. The reference is 70°F, 55 mph, mixed terrain, heating off and no extra cargo. Battery health is applied as a proportional adjustment.</p>
          <p>The coefficients are our simplified assumptions shared across models. They do not simulate a route, wind, rain, tire pressure, elevation profile or charging stops. EPA range is a standardized comparison, not a guarantee for a particular trip.</p>
          <p>Learn about range and charging from <a href="https://www.fueleconomy.gov/feg/evtech.shtml" className="text-accent hover:underline">FuelEconomy.gov</a>. Compare the model-year label with your vehicle, and retain a reserve for unexpected conditions.</p>
        </section>
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
