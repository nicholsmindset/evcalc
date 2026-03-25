import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllStateIncentiveSummaries } from '@/lib/supabase/queries/incentives';

export const revalidate = 2592000; // 30 days

export const metadata: Metadata = {
  title: 'State EV Incentives, Tax Credits & Rebates 2025 | All 50 States',
  description:
    'Find state EV incentives, rebates, and tax credits for all 50 states in 2025. Stack state incentives with the $7,500 federal EV tax credit for maximum savings.',
  alternates: { canonical: '/ev-incentives' },
  openGraph: {
    title: 'State EV Incentives & Rebates 2025',
    description: 'EV rebates and incentives for all 50 states — stack with the $7,500 federal tax credit.',
    url: '/ev-incentives',
    type: 'website',
  },
};

// Fallback state list with slugs for static rendering when DB is empty
const FALLBACK_STATES = [
  { state_name: 'Alabama', slug: 'alabama', state_code: 'AL', max_amount: 75, incentive_count: 1 },
  { state_name: 'Alaska', slug: 'alaska', state_code: 'AK', max_amount: 500, incentive_count: 1 },
  { state_name: 'Arizona', slug: 'arizona', state_code: 'AZ', max_amount: null, incentive_count: 1 },
  { state_name: 'Arkansas', slug: 'arkansas', state_code: 'AR', max_amount: 250, incentive_count: 1 },
  { state_name: 'California', slug: 'california', state_code: 'CA', max_amount: 2000, incentive_count: 3 },
  { state_name: 'Colorado', slug: 'colorado', state_code: 'CO', max_amount: 5000, incentive_count: 2 },
  { state_name: 'Connecticut', slug: 'connecticut', state_code: 'CT', max_amount: 9500, incentive_count: 1 },
  { state_name: 'Delaware', slug: 'delaware', state_code: 'DE', max_amount: 2500, incentive_count: 1 },
  { state_name: 'Florida', slug: 'florida', state_code: 'FL', max_amount: null, incentive_count: 1 },
  { state_name: 'Georgia', slug: 'georgia', state_code: 'GA', max_amount: null, incentive_count: 1 },
  { state_name: 'Hawaii', slug: 'hawaii', state_code: 'HI', max_amount: 2500, incentive_count: 1 },
  { state_name: 'Idaho', slug: 'idaho', state_code: 'ID', max_amount: 200, incentive_count: 1 },
  { state_name: 'Illinois', slug: 'illinois', state_code: 'IL', max_amount: 4000, incentive_count: 2 },
  { state_name: 'Indiana', slug: 'indiana', state_code: 'IN', max_amount: 200, incentive_count: 1 },
  { state_name: 'Iowa', slug: 'iowa', state_code: 'IA', max_amount: 200, incentive_count: 1 },
  { state_name: 'Kansas', slug: 'kansas', state_code: 'KS', max_amount: 200, incentive_count: 1 },
  { state_name: 'Kentucky', slug: 'kentucky', state_code: 'KY', max_amount: 100, incentive_count: 1 },
  { state_name: 'Louisiana', slug: 'louisiana', state_code: 'LA', max_amount: 250, incentive_count: 1 },
  { state_name: 'Maine', slug: 'maine', state_code: 'ME', max_amount: 2000, incentive_count: 1 },
  { state_name: 'Maryland', slug: 'maryland', state_code: 'MD', max_amount: 3000, incentive_count: 1 },
  { state_name: 'Massachusetts', slug: 'massachusetts', state_code: 'MA', max_amount: 3500, incentive_count: 2 },
  { state_name: 'Michigan', slug: 'michigan', state_code: 'MI', max_amount: 500, incentive_count: 1 },
  { state_name: 'Minnesota', slug: 'minnesota', state_code: 'MN', max_amount: 2500, incentive_count: 1 },
  { state_name: 'Mississippi', slug: 'mississippi', state_code: 'MS', max_amount: 100, incentive_count: 1 },
  { state_name: 'Missouri', slug: 'missouri', state_code: 'MO', max_amount: 200, incentive_count: 1 },
  { state_name: 'Montana', slug: 'montana', state_code: 'MT', max_amount: 200, incentive_count: 1 },
  { state_name: 'Nebraska', slug: 'nebraska', state_code: 'NE', max_amount: 200, incentive_count: 1 },
  { state_name: 'Nevada', slug: 'nevada', state_code: 'NV', max_amount: null, incentive_count: 1 },
  { state_name: 'New Hampshire', slug: 'new-hampshire', state_code: 'NH', max_amount: 1500, incentive_count: 1 },
  { state_name: 'New Jersey', slug: 'new-jersey', state_code: 'NJ', max_amount: 4000, incentive_count: 2 },
  { state_name: 'New Mexico', slug: 'new-mexico', state_code: 'NM', max_amount: 4000, incentive_count: 1 },
  { state_name: 'New York', slug: 'new-york', state_code: 'NY', max_amount: 2000, incentive_count: 3 },
  { state_name: 'North Carolina', slug: 'north-carolina', state_code: 'NC', max_amount: 200, incentive_count: 1 },
  { state_name: 'North Dakota', slug: 'north-dakota', state_code: 'ND', max_amount: 200, incentive_count: 1 },
  { state_name: 'Ohio', slug: 'ohio', state_code: 'OH', max_amount: 250, incentive_count: 1 },
  { state_name: 'Oklahoma', slug: 'oklahoma', state_code: 'OK', max_amount: 200, incentive_count: 1 },
  { state_name: 'Oregon', slug: 'oregon', state_code: 'OR', max_amount: 2500, incentive_count: 2 },
  { state_name: 'Pennsylvania', slug: 'pennsylvania', state_code: 'PA', max_amount: 3000, incentive_count: 1 },
  { state_name: 'Rhode Island', slug: 'rhode-island', state_code: 'RI', max_amount: 1500, incentive_count: 1 },
  { state_name: 'South Carolina', slug: 'south-carolina', state_code: 'SC', max_amount: 250, incentive_count: 1 },
  { state_name: 'South Dakota', slug: 'south-dakota', state_code: 'SD', max_amount: 150, incentive_count: 1 },
  { state_name: 'Tennessee', slug: 'tennessee', state_code: 'TN', max_amount: 200, incentive_count: 1 },
  { state_name: 'Texas', slug: 'texas', state_code: 'TX', max_amount: 2500, incentive_count: 1 },
  { state_name: 'Utah', slug: 'utah', state_code: 'UT', max_amount: 600, incentive_count: 1 },
  { state_name: 'Vermont', slug: 'vermont', state_code: 'VT', max_amount: 5000, incentive_count: 1 },
  { state_name: 'Virginia', slug: 'virginia', state_code: 'VA', max_amount: 2500, incentive_count: 1 },
  { state_name: 'Washington', slug: 'washington', state_code: 'WA', max_amount: null, incentive_count: 2 },
  { state_name: 'West Virginia', slug: 'west-virginia', state_code: 'WV', max_amount: 100, incentive_count: 1 },
  { state_name: 'Wisconsin', slug: 'wisconsin', state_code: 'WI', max_amount: 1500, incentive_count: 1 },
  { state_name: 'Wyoming', slug: 'wyoming', state_code: 'WY', max_amount: 200, incentive_count: 1 },
  { state_name: 'District of Columbia', slug: 'district-of-columbia', state_code: 'DC', max_amount: 1000, incentive_count: 2 },
];

export default async function EVIncentivesIndexPage() {
  let states = await getAllStateIncentiveSummaries();
  if (states.length === 0) states = FALLBACK_STATES;

  const TOP_STATES = states
    .filter((s) => s.max_amount && s.max_amount >= 2000)
    .sort((a, b) => (b.max_amount ?? 0) - (a.max_amount ?? 0))
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <nav className="mb-3 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <span className="text-text-primary">EV Incentives by State</span>
        </nav>
        <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          State EV Incentives &amp; Rebates 2025
        </h1>
        <p className="mt-3 max-w-2xl text-text-secondary">
          Find electric vehicle rebates, tax credits, and charger incentives for your state.
          Stack with the <span className="font-semibold text-accent">$7,500 federal EV credit</span> for maximum savings.
        </p>
      </div>

      {/* Federal credit summary */}
      <div className="mb-10 rounded-xl border border-accent/20 bg-accent/5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-text-primary">
              Start with the Federal $7,500 Credit
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Before checking state incentives, verify your federal credit eligibility.
              Income limit: $150k single / $300k joint. MSRP caps: $55k car / $80k SUV.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/tax-credit-checker"
              className="whitespace-nowrap rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg-primary transition-all hover:bg-accent-dim"
            >
              Check Eligibility
            </Link>
            <Link
              href="/lease-vs-buy"
              className="whitespace-nowrap rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-secondary transition-all hover:border-accent/30 hover:text-accent"
            >
              Leasing Strategy
            </Link>
          </div>
        </div>
      </div>

      {/* Top states */}
      {TOP_STATES.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 font-display text-xl font-bold text-text-primary">Best State EV Incentives</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOP_STATES.map((state) => (
              <Link
                key={state.slug}
                href={`/ev-incentives/${state.slug}`}
                className="group rounded-xl border border-border bg-bg-secondary p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-display font-semibold text-text-primary group-hover:text-accent transition-colors">
                      {state.state_name}
                    </div>
                    <div className="mt-0.5 text-xs text-text-tertiary">{state.incentive_count} program{state.incentive_count !== 1 ? 's' : ''}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl font-bold text-green-400">
                      {state.max_amount ? `$${state.max_amount.toLocaleString()}` : 'Varies'}
                    </div>
                    <div className="text-xs text-text-tertiary">state savings</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All states A-Z */}
      <section>
        <h2 className="mb-4 font-display text-xl font-bold text-text-primary">All States A–Z</h2>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {states.map((state) => (
            <Link
              key={state.slug}
              href={`/ev-incentives/${state.slug}`}
              className="group flex items-center justify-between rounded-lg border border-border bg-bg-secondary px-4 py-3 transition-all hover:border-accent/30 hover:bg-bg-tertiary"
            >
              <span className="text-sm text-text-primary group-hover:text-accent transition-colors">
                {state.state_name}
              </span>
              <span className="text-xs font-semibold text-accent">
                {state.max_amount ? `$${state.max_amount.toLocaleString()}` : '→'}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA row */}
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="mb-4 font-display text-lg font-bold text-text-primary">Related Tools</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/tax-credit-checker" className="text-sm text-accent hover:underline">Federal Tax Credit Checker</Link>
          <Link href="/home-charger-wizard" className="text-sm text-accent hover:underline">Home Charger Setup Wizard</Link>
          <Link href="/lease-vs-buy" className="text-sm text-accent hover:underline">Lease vs Buy Calculator</Link>
          <Link href="/tco-calculator" className="text-sm text-accent hover:underline">Total Cost of Ownership</Link>
          <Link href="/vehicles" className="text-sm text-accent hover:underline">Browse All EVs</Link>
        </div>
      </section>
    </div>
  );
}
