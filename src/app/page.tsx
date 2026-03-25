import type { Metadata } from 'next';
import Link from 'next/link';
import { POPULAR_VEHICLES } from '@/lib/utils/constants';
import { formatCurrency } from '@/lib/utils/formatting';

export const metadata: Metadata = {
  title: 'EV Range Tools — Free EV Calculators, Comparisons & Charging Maps',
  description:
    'The most comprehensive free EV tools — range calculator, charging cost, EV vs gas savings, road trip planner, and more. Powered by EPA data.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'EV Range Tools — Free EV Calculators, Comparisons & Charging Maps',
    description:
      'The most comprehensive free EV tools — range calculator, charging cost, EV vs gas savings, road trip planner, and more. Powered by EPA data.',
    url: '/',
    type: 'website',
  },
};


const TOOLS = [
  {
    href: '/calculator',
    title: 'Range Calculator',
    description: 'Calculate real-world EV range adjusted for temperature, speed, terrain, and conditions.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008H15.75v-.008zm0 2.25h.008v.008H15.75V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
      </svg>
    ),
  },
  {
    href: '/charging-cost-calculator',
    title: 'Charging Cost',
    description: 'Find your exact cost per charge using real electricity rates by state and country.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: '/ev-vs-gas',
    title: 'EV vs Gas Savings',
    description: 'See exactly how much you\'ll save switching from gas to electric over 5, 7, or 10 years.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    href: '/road-trip-planner',
    title: 'Road Trip Planner',
    description: 'Plan your EV road trip with optimized charging stops and real-time station data.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
  },
  {
    href: '/compare',
    title: 'Compare EVs',
    description: 'Compare any two electric vehicles side by side: range, charging, price, and more.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    href: '/charging-stations',
    title: 'Charging Stations',
    description: 'Find EV charging stations near you or along your route. 85,000+ US stations.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    href: '/lease-vs-buy',
    title: 'Lease vs Buy',
    description: 'Compare monthly payments, total cost, and break-even timelines. Includes $7,500 tax credit analysis.',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-4.125-1.688a4.5 4.5 0 00-3.75 0l-4.5 1.875-.375-.375A.375.375 0 016 21.375V7.507c0-.97.684-1.8 1.638-1.98l.39-.073A48.4 48.4 0 0112 5.25c.83 0 1.652.04 2.472.118l.39.073A2.01 2.01 0 0118 7.507v2.25" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-display font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              How Far Can Your EV{' '}
              <span className="text-accent">Really</span> Go?
            </h1>
            <p className="mt-6 text-lg leading-8 text-text-secondary sm:text-xl">
              The most accurate EV range calculator on the internet. Adjust for temperature,
              speed, terrain, and real driving conditions. Powered by EPA data and physics-based modeling.
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

      {/* Tools Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-display font-bold text-text-primary sm:text-3xl">
          Everything You Need for EV Ownership
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-text-secondary">
          Free tools powered by real data from the EPA, NREL, and OpenChargeMap.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group relative rounded-xl border border-border bg-bg-secondary p-6 transition-all hover:border-accent/30 hover:bg-bg-tertiary hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-3 text-accent">
                {tool.icon}
              </div>
              <h3 className="text-lg font-display font-semibold text-text-primary group-hover:text-accent transition-colors">
                {tool.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {tool.description}
              </p>
              <div className="mt-4 flex items-center text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                Try it now
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

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
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-text-tertiary">
            Powered by official data from the{' '}
            <span className="text-text-secondary">U.S. Environmental Protection Agency (EPA)</span>,{' '}
            <span className="text-text-secondary">National Renewable Energy Laboratory (NREL)</span>, and{' '}
            <span className="text-text-secondary">OpenChargeMap</span>.
          </p>
        </div>
      </section>
    </>
  );
}
