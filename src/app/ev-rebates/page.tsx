import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllUtilityRebates } from '@/lib/supabase/queries/utilities';

export const revalidate = 2592000; // 30 days

export const metadata: Metadata = {
  title: 'EV Charger Rebates by Utility 2025 | Find Your Utility Rebate',
  description:
    'Find EV charger rebates from your electric utility. 35+ major US utilities offer $200–$1,000 rebates for Level 2 home charger installation.',
  alternates: { canonical: '/ev-rebates' },
  openGraph: {
    title: 'EV Charger Rebates by Utility 2025',
    description: 'Find your utility\'s EV charger rebate — up to $1,000 for Level 2 home charging installation.',
    url: '/ev-rebates',
    type: 'website',
  },
};

const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'District of Columbia',
};

// Fallback utilities for static rendering when DB is empty
const FALLBACK_UTILITIES = [
  { utility_slug: 'comed', utility_name: 'ComEd', state: 'IL', amount: 500 },
  { utility_slug: 'pseg', utility_name: 'PSE&G', state: 'NJ', amount: 500 },
  { utility_slug: 'pge', utility_name: 'Pacific Gas and Electric', state: 'CA', amount: 1000 },
  { utility_slug: 'sce', utility_name: 'Southern California Edison', state: 'CA', amount: 1000 },
  { utility_slug: 'sdge', utility_name: 'San Diego Gas & Electric', state: 'CA', amount: 500 },
  { utility_slug: 'dte-energy', utility_name: 'DTE Energy', state: 'MI', amount: 500 },
  { utility_slug: 'consumers-energy', utility_name: 'Consumers Energy', state: 'MI', amount: 500 },
  { utility_slug: 'eversource', utility_name: 'Eversource Energy', state: 'CT', amount: 400 },
  { utility_slug: 'coned', utility_name: 'Con Edison', state: 'NY', amount: 500 },
  { utility_slug: 'dominion-energy', utility_name: 'Dominion Energy', state: 'VA', amount: 125 },
];

export default async function EvRebatesIndexPage() {
  let utilities = await getAllUtilityRebates();
  if (utilities.length === 0) utilities = FALLBACK_UTILITIES as typeof utilities;

  // Group by state
  const byState: Record<string, typeof utilities> = {};
  for (const u of utilities) {
    if (!byState[u.state]) byState[u.state] = [];
    byState[u.state].push(u);
  }
  const sortedStates = Object.keys(byState).sort((a, b) =>
    (STATE_NAMES[a] ?? a).localeCompare(STATE_NAMES[b] ?? b)
  );

  // Top rebates (≥$400)
  const topUtilities = [...utilities]
    .filter((u) => u.amount && u.amount >= 400)
    .sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0))
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <nav className="mb-3 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <span className="text-text-primary">EV Charger Rebates by Utility</span>
        </nav>
        <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          EV Charger Rebates by Utility 2025
        </h1>
        <p className="mt-3 max-w-2xl text-text-secondary">
          Your electric utility may pay for your Level 2 charger installation.
          Find rebates from <span className="font-semibold text-accent">{utilities.length}+ major US utilities</span>{' '}
          worth $100–$1,000.
        </p>
      </div>

      {/* Federal charger credit callout */}
      <div className="mb-10 rounded-xl border border-accent/20 bg-accent/5 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display font-semibold text-text-primary">
              Stack Utility + Federal 30% Charger Tax Credit
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              The federal §30C credit covers 30% of charger + installation costs (up to $1,000).
              Combine it with your utility rebate for maximum savings.
            </p>
          </div>
          <Link
            href="/home-charger-wizard"
            className="whitespace-nowrap rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg-primary transition-all hover:bg-accent-dim"
          >
            Find My Charger →
          </Link>
        </div>
      </div>

      {/* Top rebates */}
      {topUtilities.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 font-display text-xl font-bold text-text-primary">Highest Utility Rebates</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topUtilities.map((u) => (
              <Link
                key={u.utility_slug}
                href={`/ev-rebates/${u.utility_slug}`}
                className="group rounded-xl border border-border bg-bg-secondary p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-display font-semibold text-text-primary group-hover:text-accent transition-colors">
                      {u.utility_name}
                    </div>
                    <div className="mt-0.5 text-xs text-text-tertiary">{STATE_NAMES[u.state] ?? u.state}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl font-bold text-green-400">
                      ${u.amount?.toLocaleString() ?? '—'}
                    </div>
                    <div className="text-xs text-text-tertiary">rebate</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* By state */}
      <section>
        <h2 className="mb-4 font-display text-xl font-bold text-text-primary">All Utilities by State</h2>
        <div className="space-y-6">
          {sortedStates.map((stateCode) => (
            <div key={stateCode}>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-text-tertiary">
                {STATE_NAMES[stateCode] ?? stateCode}
              </h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {byState[stateCode].map((u) => (
                  <Link
                    key={u.utility_slug}
                    href={`/ev-rebates/${u.utility_slug}`}
                    className="group flex items-center justify-between rounded-lg border border-border bg-bg-secondary px-4 py-3 transition-all hover:border-accent/30 hover:bg-bg-tertiary"
                  >
                    <span className="text-sm text-text-primary group-hover:text-accent transition-colors">
                      {u.utility_name}
                    </span>
                    <span className="text-xs font-semibold text-accent">
                      {u.amount ? `$${u.amount.toLocaleString()}` : '→'}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related tools */}
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="mb-4 font-display text-lg font-bold text-text-primary">Related Tools</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/home-charger-wizard" className="text-sm text-accent hover:underline">Home Charger Setup Wizard</Link>
          <Link href="/charger-installation-cost" className="text-sm text-accent hover:underline">Installation Cost Calculator</Link>
          <Link href="/ev-incentives" className="text-sm text-accent hover:underline">State EV Incentives</Link>
          <Link href="/tax-credit-checker" className="text-sm text-accent hover:underline">Federal Tax Credit Checker</Link>
          <Link href="/best-ev-chargers" className="text-sm text-accent hover:underline">Best EV Chargers</Link>
        </div>
      </section>
    </div>
  );
}
