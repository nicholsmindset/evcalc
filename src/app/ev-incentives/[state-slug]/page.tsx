import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { POPULAR_VEHICLES } from '@/lib/utils/constants';
import {
  getAllStateIncentiveSlugs,
  getStateIncentivesBySlug,
  getStateMetaBySlug,
  type StateIncentive,
} from '@/lib/supabase/queries/incentives';

export const revalidate = 2592000; // 30 days

interface Props {
  params: Promise<{ 'state-slug': string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllStateIncentiveSlugs();
    return slugs.map((s) => ({ 'state-slug': s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { 'state-slug': slug } = await params;
  const meta = await getStateMetaBySlug(slug);
  if (!meta) return {};

  const { state_name } = meta;
  const year = 2025;

  return {
    title: `${state_name} EV Incentives, Tax Credits & Rebates ${year} | EV Range Tools`,
    description: `Complete guide to ${state_name} electric vehicle incentives in ${year}. State EV rebates, tax credits, charger rebates, HOV access, and how to stack them with the $7,500 federal credit.`,
    alternates: { canonical: `/ev-incentives/${slug}` },
    openGraph: {
      title: `${state_name} EV Incentives ${year}`,
      description: `${state_name} EV rebates, tax credits, and charger incentives — stacked with federal $7,500 credit.`,
      url: `/ev-incentives/${slug}`,
      type: 'article',
    },
  };
}

// ---- Incentive type display helpers ----
const INCENTIVE_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  purchase_rebate: { label: 'Purchase Rebate', color: 'text-green-400 bg-green-500/10' },
  income_tax_credit: { label: 'Tax Credit', color: 'text-blue-400 bg-blue-500/10' },
  sales_tax_exemption: { label: 'Sales Tax Exempt', color: 'text-purple-400 bg-purple-500/10' },
  hov_access: { label: 'HOV Access', color: 'text-yellow-400 bg-yellow-500/10' },
  registration_discount: { label: 'Registration Discount', color: 'text-orange-400 bg-orange-500/10' },
  charger_rebate: { label: 'Charger Rebate', color: 'text-accent bg-accent/10' },
  utility_tou_rate: { label: 'Utility TOU Rate', color: 'text-text-secondary bg-bg-tertiary' },
  tax_credit: { label: 'Tax Credit', color: 'text-blue-400 bg-blue-500/10' },
};

function IncentiveCard({ incentive }: { incentive: StateIncentive }) {
  const typeConfig = INCENTIVE_TYPE_LABELS[incentive.incentive_type] ?? {
    label: incentive.incentive_type,
    color: 'text-text-secondary bg-bg-tertiary',
  };
  const isActive = incentive.funding_status === 'active';

  return (
    <div className={`rounded-xl border p-5 ${isActive ? 'border-border bg-bg-secondary' : 'border-border/50 bg-bg-secondary/50 opacity-75'}`}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeConfig.color}`}>
            {typeConfig.label}
          </span>
          {!isActive && (
            <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold capitalize text-red-400">
              {incentive.funding_status}
            </span>
          )}
        </div>
        <div className="font-display text-xl font-bold text-accent">{incentive.amount_or_value}</div>
      </div>

      <h3 className="mb-2 font-display font-semibold text-text-primary">{incentive.incentive_name}</h3>
      <p className="text-sm leading-relaxed text-text-secondary">{incentive.description}</p>

      <div className="mt-3 space-y-1.5 text-xs">
        {incentive.eligibility_requirements && (
          <div className="flex gap-2">
            <span className="shrink-0 text-text-tertiary">Eligibility:</span>
            <span className="text-text-secondary">{incentive.eligibility_requirements}</span>
          </div>
        )}
        {incentive.income_limit && (
          <div className="flex gap-2">
            <span className="shrink-0 text-text-tertiary">Income limit:</span>
            <span className="text-text-secondary">{incentive.income_limit}</span>
          </div>
        )}
        {incentive.msrp_cap && (
          <div className="flex gap-2">
            <span className="shrink-0 text-text-tertiary">MSRP cap:</span>
            <span className="text-text-secondary">{incentive.msrp_cap}</span>
          </div>
        )}
        {incentive.vehicle_types_eligible && (
          <div className="flex gap-2">
            <span className="shrink-0 text-text-tertiary">Vehicle types:</span>
            <span className="text-text-secondary">{incentive.vehicle_types_eligible.join(', ')}</span>
          </div>
        )}
        {incentive.expiration_date && (
          <div className="flex gap-2">
            <span className="shrink-0 text-text-tertiary">Expires:</span>
            <span className="text-text-secondary">{new Date(incentive.expiration_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
        )}
      </div>

      {incentive.application_url && (
        <a
          href={incentive.application_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
        >
          Apply / Learn More
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      )}
    </div>
  );
}

export default async function StateIncentivesPage({ params }: Props) {
  const { 'state-slug': slug } = await params;
  const [incentives, meta] = await Promise.all([
    getStateIncentivesBySlug(slug),
    getStateMetaBySlug(slug),
  ]);

  if (!meta) notFound();

  const { state_name } = meta;
  const year = 2025;

  // Separate by type
  const purchaseIncentives = incentives.filter(
    (i) => ['purchase_rebate', 'income_tax_credit', 'tax_credit', 'sales_tax_exemption'].includes(i.incentive_type),
  );
  const chargerIncentives = incentives.filter((i) => i.incentive_type === 'charger_rebate');
  const otherIncentives = incentives.filter(
    (i) => !['purchase_rebate', 'income_tax_credit', 'tax_credit', 'sales_tax_exemption', 'charger_rebate'].includes(i.incentive_type),
  );

  const totalStateSavings = incentives
    .filter((i) => i.funding_status === 'active' && i.amount_usd)
    .reduce((sum, i) => sum + (i.amount_usd ?? 0), 0);

  // Schema markup
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.evrangetools.com/' },
      { '@type': 'ListItem', position: 2, name: 'EV Incentives', item: 'https://www.evrangetools.com/ev-incentives' },
      { '@type': 'ListItem', position: 3, name: `${state_name} EV Incentives`, item: `https://www.evrangetools.com/ev-incentives/${slug}` },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What EV incentives are available in ${state_name} in ${year}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${state_name} offers ${incentives.length} EV incentives in ${year}, including ${purchaseIncentives.length > 0 ? `vehicle purchase rebates/credits` : 'utility and charger programs'}${chargerIncentives.length > 0 ? ` and charger installation rebates` : ''}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Can I combine ${state_name} EV incentives with the federal $7,500 tax credit?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes — ${state_name} incentives can be stacked on top of the federal §30D $7,500 New Clean Vehicle Credit. The federal credit has income limits ($150k single / $300k joint). ${state_name} incentives may have separate eligibility requirements.`,
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex flex-wrap gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <Link href="/ev-incentives" className="hover:text-text-secondary">EV Incentives</Link>
          <span>/</span>
          <span className="text-text-primary">{state_name}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {state_name} EV Incentives {year}
          </h1>
          <p className="mt-3 max-w-2xl text-text-secondary">
            Complete guide to {state_name} electric vehicle rebates, tax credits, charger incentives, and how to
            stack them with the{' '}
            <span className="font-semibold text-accent">$7,500 federal EV credit</span>.
          </p>
        </div>

        {/* Savings summary */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-5">
            <div className="text-sm text-text-secondary">Federal Credit</div>
            <div className="font-display text-3xl font-bold text-accent">$7,500</div>
            <div className="mt-1 text-xs text-text-tertiary">§30D New EV (income-limited)</div>
          </div>
          <div className="rounded-xl border border-border bg-bg-secondary p-5">
            <div className="text-sm text-text-secondary">{state_name} Max Incentives</div>
            <div className="font-display text-3xl font-bold text-text-primary">
              {totalStateSavings > 0 ? `$${totalStateSavings.toLocaleString()}` : 'Varies'}
            </div>
            <div className="mt-1 text-xs text-text-tertiary">{incentives.length} program{incentives.length !== 1 ? 's' : ''} available</div>
          </div>
          <div className="rounded-xl border border-border bg-bg-secondary p-5">
            <div className="text-sm text-text-secondary">Combined Potential</div>
            <div className="font-display text-3xl font-bold text-green-400">
              {totalStateSavings > 0 ? `$${(7500 + totalStateSavings).toLocaleString()}` : 'Up to $7,500+'}
            </div>
            <div className="mt-1 text-xs text-text-tertiary">Federal + {state_name} stacked</div>
          </div>
        </div>

        {/* Purchase incentives */}
        {purchaseIncentives.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 font-display text-xl font-bold text-text-primary">
              {state_name} Vehicle Purchase Incentives
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {purchaseIncentives.map((i) => (
                <IncentiveCard key={i.id} incentive={i} />
              ))}
            </div>
          </section>
        )}

        {/* Federal credit reminder */}
        <section className="mb-10 rounded-xl border border-accent/20 bg-accent/5 p-6">
          <h2 className="mb-2 font-display text-lg font-bold text-text-primary">
            Federal §30D New Clean Vehicle Credit
          </h2>
          <p className="mb-4 text-sm text-text-secondary">
            Stackable with all {state_name} incentives above. Up to{' '}
            <span className="font-semibold text-accent">$7,500</span> for qualifying new EVs.
          </p>
          <div className="mb-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg bg-bg-primary/50 px-3 py-2">
              <span className="text-text-tertiary">Income limit (single): </span>
              <span className="font-semibold text-text-primary">$150,000 AGI</span>
            </div>
            <div className="rounded-lg bg-bg-primary/50 px-3 py-2">
              <span className="text-text-tertiary">Income limit (joint): </span>
              <span className="font-semibold text-text-primary">$300,000 AGI</span>
            </div>
            <div className="rounded-lg bg-bg-primary/50 px-3 py-2">
              <span className="text-text-tertiary">Car MSRP cap: </span>
              <span className="font-semibold text-text-primary">$55,000</span>
            </div>
            <div className="rounded-lg bg-bg-primary/50 px-3 py-2">
              <span className="text-text-tertiary">SUV/truck MSRP cap: </span>
              <span className="font-semibold text-text-primary">$80,000</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/tax-credit-checker"
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg-primary transition-all hover:bg-accent-dim"
            >
              Check Your Eligibility
            </Link>
            <Link
              href="/lease-vs-buy"
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-secondary transition-all hover:border-accent/30 hover:text-accent"
            >
              Leasing Gets Credit with No Income Limit
            </Link>
          </div>
        </section>

        {/* Charger rebates */}
        {chargerIncentives.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 font-display text-xl font-bold text-text-primary">
              {state_name} EV Charger Rebates
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {chargerIncentives.map((i) => (
                <IncentiveCard key={i.id} incentive={i} />
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-border bg-bg-secondary p-4 text-sm text-text-secondary">
              Also claim the federal{' '}
              <span className="font-semibold text-accent">30% tax credit (up to $1,000)</span> on charger purchase
              and installation (IRS Form 8911). No income limit.{' '}
              <Link href="/home-charger-wizard" className="text-accent hover:underline">
                Find the best charger for your home →
              </Link>
            </div>
          </section>
        )}

        {/* Other incentives */}
        {otherIncentives.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 font-display text-xl font-bold text-text-primary">
              Other {state_name} EV Benefits
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {otherIncentives.map((i) => (
                <IncentiveCard key={i.id} incentive={i} />
              ))}
            </div>
          </section>
        )}

        {/* No incentives fallback */}
        {incentives.length === 0 && (
          <section className="mb-10 rounded-xl border border-border bg-bg-secondary p-6 text-center">
            <p className="text-text-secondary">
              {state_name} doesn&apos;t currently have state-level EV purchase incentives, but you can still qualify
              for the federal <span className="font-semibold text-accent">$7,500 §30D credit</span> and the{' '}
              <span className="font-semibold">30% charger installation credit</span>.
            </p>
            <Link href="/tax-credit-checker" className="mt-4 inline-block text-sm text-accent hover:underline">
              Check federal credit eligibility →
            </Link>
          </section>
        )}

        {/* Popular EVs */}
        <section className="mb-10">
          <h2 className="mb-4 font-display text-xl font-bold text-text-primary">
            Popular EVs in {state_name}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_VEHICLES.slice(0, 3).map((vehicle) => (
              <Link
                key={vehicle.slug}
                href={`/vehicles/${vehicle.slug}`}
                className="group rounded-xl border border-border bg-bg-secondary p-4 transition-all hover:border-accent/30"
              >
                <div className="font-display font-semibold text-text-primary group-hover:text-accent">
                  {vehicle.name}
                </div>
                <div className="mt-1 text-xs text-text-tertiary">{vehicle.year}</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-mono text-lg font-bold text-accent">{vehicle.epaRangeMi} mi</span>
                  <span className="text-xs text-text-secondary">from ${vehicle.msrp.toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-10 rounded-xl border border-border bg-bg-secondary p-6">
          <h2 className="mb-2 font-display text-lg font-bold text-text-primary">
            Calculate Your {state_name} EV Savings
          </h2>
          <p className="mb-4 text-sm text-text-secondary">
            Use our Total Cost of Ownership calculator to see exactly how much you&apos;ll save after federal
            + {state_name} incentives vs. your current gas car.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/tco-calculator?state=${meta.state_code}`}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg-primary transition-all hover:bg-accent-dim"
            >
              Calculate My Savings →
            </Link>
            <Link
              href="/ev-vs-gas"
              className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-secondary transition-all hover:border-accent/30 hover:text-accent"
            >
              EV vs Gas Savings
            </Link>
          </div>
        </section>

        {/* Related tools */}
        <section className="border-t border-border pt-8">
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">Related Tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/tax-credit-checker" className="text-sm text-accent hover:underline">Federal Tax Credit Checker</Link>
            <Link href="/home-charger-wizard" className="text-sm text-accent hover:underline">Home Charger Wizard</Link>
            <Link href="/lease-vs-buy" className="text-sm text-accent hover:underline">Lease vs Buy Calculator</Link>
            <Link href="/tco-calculator" className="text-sm text-accent hover:underline">Total Cost Calculator</Link>
            <Link href="/ev-incentives" className="text-sm text-accent hover:underline">All State Incentives</Link>
          </div>
        </section>
      </div>
    </>
  );
}
