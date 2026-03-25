import type { Metadata } from 'next';
import Link from 'next/link';
import { POPULAR_VEHICLES } from '@/lib/utils/constants';
import { formatCurrency } from '@/lib/utils/formatting';

export const metadata: Metadata = {
  title: 'EV Range Tools — Free EV Calculators, Comparisons & Charging Maps',
  description:
    'The most comprehensive free EV tools — range calculator, charging cost, carbon footprint, depreciation, towing guide, and more. Powered by EPA data.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'EV Range Tools — Free EV Calculators, Comparisons & Charging Maps',
    description:
      'The most comprehensive free EV tools — range calculator, charging cost, carbon footprint, depreciation, towing guide, and more. Powered by EPA data.',
    url: '/',
    type: 'website',
  },
};

// Intent-based tool sections
const SECTIONS = [
  {
    id: 'shopping',
    headline: 'Thinking About Going Electric?',
    subheadline: 'Find the right EV, check what you qualify for, and see the real savings before you buy.',
    seeAllLabel: 'See all buying tools →',
    seeAllHref: '/compare',
    bg: 'bg-bg-secondary',
    tools: [
      { href: '/find-my-ev', emoji: '🔍', label: 'EV Finder Quiz', desc: 'Answer 5 questions, get matched to the best EVs for your life', badge: 'New' },
      { href: '/compare', emoji: '⚖️', label: 'Compare EVs', desc: 'Side-by-side specs, range, charging speed, and price for any two EVs' },
      { href: '/can-i-afford-an-ev', emoji: '💰', label: 'Can I Afford an EV?', desc: 'Monthly payment estimator with tax credits applied' },
      { href: '/tax-credit-checker', emoji: '✅', label: 'Tax Credit Checker', desc: 'Check $7,500 federal eligibility in 60 seconds' },
      { href: '/ev-incentives', emoji: '🏛️', label: 'State EV Incentives', desc: 'Stack state rebates on top of the federal credit — all 50 states' },
      { href: '/advisor', emoji: '🤖', label: 'AI EV Advisor', desc: 'Ask anything about EVs. Personalized answers powered by Claude.', badge: 'AI' },
    ],
  },
  {
    id: 'calculators',
    headline: 'Crunching the Numbers?',
    subheadline: 'Every EV financial calculator in one place. Powered by EPA and EIA data.',
    seeAllLabel: 'See all 12 calculators →',
    seeAllHref: '/calculators',
    bg: '',
    tools: [
      { href: '/calculator', emoji: '📊', label: 'Range Calculator', desc: 'Real-world range adjusted for temperature, speed, terrain, and HVAC' },
      { href: '/ev-vs-gas', emoji: '⛽', label: 'EV vs Gas Savings', desc: 'See exactly how much you\'ll save over 5, 7, and 10 years' },
      { href: '/tco-calculator', emoji: '📈', label: 'Total Cost of Ownership', desc: 'Full lifetime cost: purchase, charging, maintenance, depreciation' },
      { href: '/lease-vs-buy', emoji: '📋', label: 'Lease vs Buy', desc: 'Compare monthly payments and break-even with the $7,500 credit' },
      { href: '/charging-cost-calculator', emoji: '🔋', label: 'Charging Cost Calculator', desc: 'Exact cost per charge using real state electricity rates' },
      { href: '/ev-vs-hybrid', emoji: '🔄', label: 'EV vs Hybrid', desc: 'Full financial and emissions comparison', badge: 'New' },
    ],
  },
  {
    id: 'charging',
    headline: 'Setting Up Charging at Home?',
    subheadline: 'Everything you need to pick a charger, get it installed, and pay less for electricity.',
    seeAllLabel: 'See all charging guides →',
    seeAllHref: '/home-charger',
    bg: 'bg-bg-secondary',
    tools: [
      { href: '/home-charger-wizard', emoji: '🔌', label: 'Charger Setup Wizard', desc: 'Personalized Level 2 charger picks and installation estimate' },
      { href: '/home-charger', emoji: '🏠', label: 'Home Charger Guide', desc: 'How Level 1 vs Level 2 vs DC fast charging actually works' },
      { href: '/charger-installation-cost', emoji: '🔧', label: 'Installation Cost', desc: 'Itemized install cost by state — what an electrician will charge' },
      { href: '/charging-stations', emoji: '📍', label: 'Charging Station Finder', desc: '85,000+ stations on a live map. Filter by network, speed, connector' },
      { href: '/charging-networks', emoji: '⚡', label: 'Charging Networks', desc: 'Tesla vs ChargePoint vs EVgo vs EA — pricing and coverage compared', badge: 'New' },
      { href: '/apartment-ev-charging', emoji: '🏢', label: 'Apartment Charging', desc: 'Right-to-charge laws and workarounds if you can\'t install at home' },
    ],
  },
  {
    id: 'ownership',
    headline: 'Already Own an EV?',
    subheadline: 'Tools for real EV life — road trips, battery health, towing, and long-term ownership math.',
    seeAllLabel: 'See all ownership tools →',
    seeAllHref: '/road-trip-planner',
    bg: '',
    tools: [
      { href: '/road-trip-planner', emoji: '🗺️', label: 'Road Trip Planner', desc: 'Plan any route with optimized charging stops. Real-time station data' },
      { href: '/winter-ev-range', emoji: '❄️', label: 'Winter Range by City', desc: 'See cold-weather range loss for your EV in your city' },
      { href: '/battery-health-tracker', emoji: '🔋', label: 'Battery Health Tracker', desc: 'Track degradation over time and project future range' },
      { href: '/ev-towing', emoji: '🚛', label: 'EV Towing Guide', desc: 'Tow capacity, payload, and real towing range for 15 EVs', badge: 'New' },
      { href: '/ev-carbon-footprint', emoji: '🌱', label: 'Carbon Footprint', desc: 'How much CO₂ does your EV save? Lifecycle breakeven by state', badge: 'New' },
      { href: '/charging-schedule', emoji: '🕐', label: 'Charging Schedule Optimizer', desc: 'Set off-peak TOU charging windows to cut your electricity bill' },
    ],
  },
] as const;

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              25+ free tools for EV owners and buyers
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              How Far Can Your EV{' '}
              <span className="text-accent">Really</span> Go?
            </h1>
            <p className="mt-6 text-lg leading-8 text-text-secondary sm:text-xl">
              The most accurate EV range calculator on the internet. Calculate range, compare costs,
              check incentives, and plan trips — all free, powered by EPA data.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/calculator"
                className="rounded-lg bg-accent px-6 py-3 text-base font-semibold text-bg-primary shadow-lg shadow-accent/25 hover:bg-accent-dim transition-all hover:shadow-accent/40"
              >
                Calculate Your Range
              </Link>
              <Link
                href="/vehicles"
                className="rounded-lg border border-border px-6 py-3 text-base font-semibold text-text-primary hover:bg-bg-tertiary transition-colors"
              >
                Browse Vehicles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intent-Based Tool Sections */}
      {SECTIONS.map((section) => (
        <section key={section.id} className={`border-t border-border${section.bg ? ` ${section.bg}` : ''}`}>
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between mb-2">
              <div>
                <h2 className="text-2xl font-display font-bold text-text-primary sm:text-3xl">
                  {section.headline}
                </h2>
                <p className="mt-2 text-text-secondary max-w-2xl">{section.subheadline}</p>
              </div>
              <Link
                href={section.seeAllHref}
                className="mt-3 sm:mt-0 text-sm font-medium text-accent hover:underline shrink-0"
              >
                {section.seeAllLabel}
              </Link>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {section.tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group relative flex items-start gap-4 rounded-xl border border-border bg-bg-primary p-5 transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
                >
                  <span className="text-2xl shrink-0 mt-0.5">{tool.emoji}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-base font-semibold text-text-primary group-hover:text-accent transition-colors">
                        {tool.label}
                      </h3>
                      {'badge' in tool && tool.badge && (
                        <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">{tool.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Popular EVs */}
      <section className="border-t border-border bg-bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-display font-bold text-text-primary sm:text-3xl">
            Popular Electric Vehicles
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-text-secondary">
            Explore range data for the most popular EVs on the market.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {POPULAR_VEHICLES.map((vehicle) => (
              <Link
                key={vehicle.slug}
                href={`/vehicles/${vehicle.slug}`}
                className="group rounded-xl border border-border bg-bg-primary p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
              >
                <h3 className="font-display font-semibold text-text-primary group-hover:text-accent transition-colors">
                  {vehicle.name}
                </h3>
                <p className="mt-1 text-xs text-text-tertiary">{vehicle.year}</p>

                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <span className="font-mono text-2xl font-bold text-accent">
                      {vehicle.epaRangeMi}
                    </span>
                    <span className="ml-1 text-xs text-text-secondary">mi EPA</span>
                  </div>
                  <span className="text-xs text-text-secondary">
                    {formatCurrency(vehicle.msrp)}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-primary hover:bg-bg-tertiary transition-colors"
            >
              Browse all EVs
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-text-tertiary">
            Powered by official data from the{' '}
            <span className="text-text-secondary">U.S. Environmental Protection Agency (EPA)</span>,{' '}
            <span className="text-text-secondary">National Renewable Energy Laboratory (NREL)</span>,{' '}
            <span className="text-text-secondary">EPA eGRID</span>, and{' '}
            <span className="text-text-secondary">OpenChargeMap</span>.
          </p>
        </div>
      </section>
    </>
  );
}
