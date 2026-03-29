import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About EV Range Tools — Our Mission & Data Sources',
  description: 'Learn about EV Range Tools, the most accurate electric vehicle range tool on the internet. Powered by EPA, NREL, and OpenChargeMap data.',
  alternates: { canonical: '/about' },
};

const DATA_SOURCES = [
  {
    name: 'U.S. Environmental Protection Agency (EPA)',
    description: 'Official EPA-rated range, efficiency, and battery data for every EV sold in the United States.',
    url: 'https://www.fueleconomy.gov',
  },
  {
    name: 'National Renewable Energy Laboratory (NREL)',
    description: 'Charging station locations, alternative fuel data, and energy research for 85,000+ US stations.',
    url: 'https://developer.nrel.gov',
  },
  {
    name: 'OpenChargeMap',
    description: 'Global charging station data covering 100+ countries with crowd-sourced verification.',
    url: 'https://openchargemap.org',
  },
  {
    name: 'U.S. Energy Information Administration (EIA)',
    description: 'State-by-state residential electricity rates and gasoline price data updated monthly.',
    url: 'https://www.eia.gov',
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          About EV Range Tools
        </h1>
        <p className="mt-4 text-lg text-text-secondary">
          The most comprehensive, accurate EV range calculator on the internet.
        </p>
      </div>

      {/* Mission */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-display font-bold text-text-primary">Our Mission</h2>
        <div className="space-y-4 text-text-secondary">
          <p>
            We built EV Range Tools to answer the question every EV buyer asks:
            &ldquo;How far can this car <em>really</em> go?&rdquo; EPA range numbers are a starting
            point, but real-world range depends on temperature, speed, terrain, HVAC usage,
            cargo weight, and battery health.
          </p>
          <p>
            Our physics-based range model adjusts EPA data for real driving conditions, giving you
            a realistic estimate before you buy or before you hit the road. Every calculation is
            transparent &mdash; you can see exactly how each factor affects your range.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-display font-bold text-text-primary">How Our Calculator Works</h2>
        <div className="space-y-3 text-sm text-text-secondary">
          <div className="rounded-xl border border-border bg-bg-secondary p-5">
            <h3 className="font-display font-semibold text-text-primary">1. Start with EPA Data</h3>
            <p className="mt-1">We use the official EPA-rated range as the baseline for every vehicle.</p>
          </div>
          <div className="rounded-xl border border-border bg-bg-secondary p-5">
            <h3 className="font-display font-semibold text-text-primary">2. Apply Physics-Based Adjustments</h3>
            <p className="mt-1">Temperature coefficients, aerodynamic drag at speed, terrain elevation changes, HVAC power draw, and cargo weight are applied multiplicatively.</p>
          </div>
          <div className="rounded-xl border border-border bg-bg-secondary p-5">
            <h3 className="font-display font-semibold text-text-primary">3. Factor Battery Health</h3>
            <p className="mt-1">Battery degradation is applied as a final multiplier. A battery at 90% health delivers 90% of the adjusted range.</p>
          </div>
          <div className="rounded-xl border border-border bg-bg-secondary p-5">
            <h3 className="font-display font-semibold text-text-primary">4. Show the Breakdown</h3>
            <p className="mt-1">Every result includes a factor-by-factor breakdown so you understand exactly what affects your range.</p>
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-display font-bold text-text-primary">Our Data Sources</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {DATA_SOURCES.map((source) => (
            <div key={source.name} className="rounded-xl border border-border bg-bg-secondary p-5">
              <h3 className="font-display font-semibold text-text-primary">{source.name}</h3>
              <p className="mt-2 text-sm text-text-secondary">{source.description}</p>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-xs text-accent hover:underline"
              >
                Visit source
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mb-12 rounded-xl border border-border bg-bg-secondary p-6">
        <h2 className="mb-3 text-lg font-display font-semibold text-text-primary">Data Accuracy</h2>
        <p className="text-sm text-text-secondary">
          Our range estimates are based on published EPA data and established physics models.
          Actual range may vary based on individual driving habits, vehicle condition, weather,
          and other factors. We provide estimates for informational purposes and recommend
          verifying with your vehicle&apos;s onboard range estimator for trip planning.
        </p>
      </section>

      {/* Tools */}
      <section>
        <h2 className="mb-4 text-xl font-display font-bold text-text-primary">Our Tools</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/calculator" className="text-sm text-accent hover:underline">Range Calculator</Link>
          <Link href="/vehicles" className="text-sm text-accent hover:underline">Vehicle Database</Link>
          <Link href="/compare" className="text-sm text-accent hover:underline">Compare EVs</Link>
          <Link href="/charging-stations" className="text-sm text-accent hover:underline">Charging Station Finder</Link>
          <Link href="/charging-cost-calculator" className="text-sm text-accent hover:underline">Charging Cost Calculator</Link>
          <Link href="/ev-vs-gas" className="text-sm text-accent hover:underline">EV vs Gas Savings</Link>
          <Link href="/road-trip-planner" className="text-sm text-accent hover:underline">Road Trip Planner</Link>
          <Link href="/tco-calculator" className="text-sm text-accent hover:underline">Total Cost of Ownership</Link>
          <Link href="/home-charger" className="text-sm text-accent hover:underline">Home Charger Guide</Link>
          <Link href="/advisor" className="text-sm text-accent hover:underline">AI Range Advisor</Link>
        </div>
      </section>
    </div>
  );
}
