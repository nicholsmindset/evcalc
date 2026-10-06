import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllStateIncentiveSummaries } from '@/lib/supabase/queries/incentives';
import { RelatedTools } from '@/components/ui/RelatedTools';

export const revalidate = 86400; // Refresh program listings daily

export const metadata: Metadata = {
  title: 'State EV Incentives & Rebates 2026 | All 50 States',
  description:
    'Explore state EV incentives and rebates. Check each program source for current funding, eligibility, and deadlines; federal vehicle purchase credits ended after September 30, 2025.',
  alternates: { canonical: '/ev-incentives' },
  openGraph: {
    title: 'State EV Incentives & Rebates 2026',
    description: 'Explore state EV programs and verify current terms with each program administrator.',
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
          State EV Incentives &amp; Rebates
        </h1>
        <p className="mt-3 max-w-2xl text-text-secondary">
          Find electric vehicle rebates, tax credits, and charger incentives for your state.
          Program amounts and funding can change. Confirm current eligibility and availability with the program administrator before making a purchase.
        </p>
      </div>

      {/* Federal credit summary */}
      <div className="mb-10 rounded-xl border border-accent/20 bg-accent/5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-text-primary">
              Federal vehicle purchase credits have ended
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              The federal new and used clean vehicle credits generally do not apply to vehicles acquired after September 30, 2025. Earlier acquisitions may still qualify under IRS rules.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/tax-credit-checker"
              className="whitespace-nowrap rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg-primary transition-all hover:bg-accent-dim"
            >
              Check Acquisition Date
            </Link>
            <Link
              href="/lease-vs-buy"
              className="whitespace-nowrap rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-secondary transition-all hover:border-accent/30 hover:text-accent"
            >
              Compare Lease and Buy
            </Link>
          </div>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-text-primary">Recently reviewed state guides</h2>
        <p className="mb-4 text-sm text-text-secondary">These guides were checked against official sources on October 6, 2026. Other listings still need a fresh program review; use their administrator links before budgeting a rebate.</p>
        <div className="grid gap-4 sm:grid-cols-3">{['Alabama', 'Delaware', 'Mississippi'].map(name => <Link key={name} href={`/ev-incentives/${name.toLowerCase()}`} className="rounded-xl border border-border bg-bg-secondary p-5 text-accent hover:border-accent">{name}: read eligibility and sources →</Link>)}</div>
      </section>

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
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <RelatedTools tools={[
        { href: '/tax-credit-checker', emoji: '✅', label: 'Tax Credit Checker', desc: 'Check the federal acquisition deadline' },
        { href: '/ev-rebates', emoji: '💵', label: 'Utility Rebates', desc: 'Explore utility charger rebate programs' },
        { href: '/lease-vs-buy', emoji: '📋', label: 'Lease vs Buy Calculator', desc: 'See how incentives change your monthly payment calculation' },
      ]} />
    </div>
  );
}
