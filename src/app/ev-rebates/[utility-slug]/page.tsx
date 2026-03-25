import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getUtilityRebateBySlug,
  getAllUtilitySlugs,
} from '@/lib/supabase/queries/utilities';
import { getAllChargers } from '@/lib/supabase/queries/chargers';
import { POPULAR_VEHICLES } from '@/lib/utils/constants';

export const revalidate = 2592000; // 30 days

export async function generateStaticParams() {
  const slugs = await getAllUtilitySlugs();
  return slugs.map((s) => ({ 'utility-slug': s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ 'utility-slug': string }>;
}): Promise<Metadata> {
  const { 'utility-slug': slug } = await params;
  const utility = await getUtilityRebateBySlug(slug);
  if (!utility) return { title: 'Utility Rebate Not Found' };

  const title = `${utility.utility_name} EV Charger Rebate 2025: Get $${utility.amount?.toLocaleString() ?? utility.amount_text} Back`;
  const description = `${utility.utility_name} offers a ${utility.amount_text} rebate for Level 2 home EV charger installation. ${utility.service_area_description ?? ''} Stack with the federal 30% charger tax credit.`;

  return {
    title,
    description,
    alternates: { canonical: `/ev-rebates/${slug}` },
    openGraph: { title, description, url: `/ev-rebates/${slug}`, type: 'website' },
  };
}

const REBATE_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  charger_purchase:    { label: 'Charger Purchase Rebate', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  charger_installation:{ label: 'Installation Rebate',     color: 'text-accent bg-accent/10 border-accent/20' },
  ev_purchase:         { label: 'EV Purchase Rebate',       color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  tou_rate:            { label: 'TOU Rate Program',         color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  combined:            { label: 'Charger + Rate Program',   color: 'text-green-400 bg-green-400/10 border-green-400/20' },
};

export default async function UtilityRebatePage({
  params,
}: {
  params: Promise<{ 'utility-slug': string }>;
}) {
  const { 'utility-slug': slug } = await params;
  const [utility, chargers] = await Promise.all([
    getUtilityRebateBySlug(slug),
    getAllChargers(2),
  ]);

  if (!utility) notFound();

  const typeInfo = REBATE_TYPE_LABELS[utility.rebate_type] ?? {
    label: utility.rebate_type,
    color: 'text-text-secondary bg-bg-tertiary border-border',
  };

  // Qualifying chargers (L2 only, top 3)
  const qualifyingChargers = chargers.filter((c) => c.charger_level === 2).slice(0, 3);

  const SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: utility.rebate_name,
    provider: {
      '@type': 'Organization',
      name: utility.utility_name,
    },
    description: utility.description,
    serviceType: 'EV Charger Rebate',
    areaServed: utility.service_area_description ?? utility.state,
  };

  const BREADCRUMB_SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.evrangetools.com/' },
      { '@type': 'ListItem', position: 2, name: 'EV Rebates', item: 'https://www.evrangetools.com/ev-rebates' },
      { '@type': 'ListItem', position: 3, name: utility.utility_name, item: `https://www.evrangetools.com/ev-rebates/${slug}` },
    ],
  };

  const FAQ_SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How much is the ${utility.utility_name} EV charger rebate?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${utility.utility_name} offers ${utility.amount_text} for qualifying Level 2 home EV charger installation. ${utility.requirements ?? ''}`,
        },
      },
      {
        '@type': 'Question',
        name: `Who qualifies for the ${utility.utility_name} EV charger rebate?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: utility.eligibility ?? `${utility.utility_name} residential electric customers who purchase and install a qualifying Level 2 EV charger.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Can I stack this utility rebate with the federal tax credit?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The federal §30C Alternative Fuel Vehicle Refueling Property Credit covers 30% of EV charger and installation costs (up to $1,000 for homeowners). You can claim this federal credit AND your utility rebate together for maximum savings.',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <Link href="/ev-rebates" className="hover:text-text-secondary">EV Rebates</Link>
          <span>/</span>
          <span className="text-text-primary">{utility.utility_name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${typeInfo.color}`}>
            {typeInfo.label}
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {utility.utility_name} EV Charger Rebate
          </h1>
          <p className="mt-2 text-sm text-text-tertiary">
            {utility.service_area_description} · Last verified {new Date(utility.last_verified).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Key stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-bg-secondary p-5 text-center">
            <div className="font-display text-3xl font-bold text-accent">
              {utility.amount ? `$${utility.amount.toLocaleString()}` : utility.amount_text}
            </div>
            <div className="mt-1 text-xs text-text-secondary">Rebate Amount</div>
          </div>
          <div className="rounded-xl border border-border bg-bg-secondary p-5 text-center">
            <div className="font-display text-3xl font-bold text-text-primary">L2</div>
            <div className="mt-1 text-xs text-text-secondary">Level 2 Charger</div>
          </div>
          <div className="rounded-xl border border-border bg-bg-secondary p-5 text-center">
            <div className={`font-display text-lg font-bold ${utility.program_status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
              {utility.program_status === 'active' ? 'Active' : utility.program_status === 'paused' ? 'Paused' : utility.program_status === 'upcoming' ? 'Coming Soon' : 'Ended'}
            </div>
            <div className="mt-1 text-xs text-text-secondary">Program Status</div>
          </div>
        </div>

        {/* Description + eligibility */}
        <div className="mb-6 rounded-xl border border-border bg-bg-secondary p-6">
          <h2 className="mb-3 font-display text-lg font-bold text-text-primary">About This Rebate</h2>
          <p className="text-text-secondary">{utility.description}</p>

          {utility.eligibility && (
            <div className="mt-4 border-t border-border pt-4">
              <h3 className="mb-2 text-sm font-semibold text-text-primary">Who Qualifies</h3>
              <p className="text-sm text-text-secondary">{utility.eligibility}</p>
            </div>
          )}

          {utility.requirements && (
            <div className="mt-4 border-t border-border pt-4">
              <h3 className="mb-2 text-sm font-semibold text-text-primary">Requirements</h3>
              <p className="text-sm text-text-secondary">{utility.requirements}</p>
            </div>
          )}
        </div>

        {/* How to apply */}
        <div className="mb-6 rounded-xl border border-border bg-bg-secondary p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">How to Apply</h2>
          <ol className="space-y-3">
            {[
              'Purchase a qualifying Level 2 (240V) EV charger.',
              'Have it installed by a licensed electrician.',
              'Save your purchase receipts and installation invoice.',
              `Visit the ${utility.utility_name} rebate portal and submit your application.`,
              `Receive ${utility.amount_text} rebate via check or bill credit (typically 4–8 weeks).`,
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                  {i + 1}
                </span>
                <span className="text-sm text-text-secondary">{step}</span>
              </li>
            ))}
          </ol>

          {utility.application_url && (
            <a
              href={utility.application_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-bg-primary transition-all hover:bg-accent-dim"
            >
              Apply for Rebate at {utility.utility_name}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>

        {/* Stack savings */}
        <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 p-5">
          <h2 className="mb-3 font-display font-semibold text-text-primary">Stack Your Savings</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">{utility.utility_name} rebate</span>
              <span className="font-semibold text-text-primary">{utility.amount_text}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Federal §30C charger tax credit (30%)</span>
              <span className="font-semibold text-text-primary">up to $1,000</span>
            </div>
            {utility.state && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">State EV incentives</span>
                <Link href={`/ev-incentives`} className="text-accent hover:underline text-xs">Check →</Link>
              </div>
            )}
            <div className="mt-3 border-t border-accent/20 pt-3 flex items-center justify-between">
              <span className="font-semibold text-text-primary">Total potential savings</span>
              <span className="font-bold text-accent text-lg">
                ${utility.amount ? Math.min(utility.amount + 1000, 2000).toLocaleString() : '1,000+'}+
              </span>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/home-charger-wizard"
              className="rounded-lg border border-accent/30 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/10 transition-colors"
            >
              Get Charger Recommendations →
            </Link>
            <Link
              href="/charger-installation-cost"
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-secondary hover:text-accent hover:border-accent/30 transition-colors"
            >
              Estimate Install Cost →
            </Link>
          </div>
        </div>

        {/* Qualifying chargers */}
        {qualifyingChargers.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 font-display text-xl font-bold text-text-primary">
              Chargers That Qualify for This Rebate
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {qualifyingChargers.map((charger) => (
                <div key={charger.id} className="rounded-xl border border-border bg-bg-secondary p-4">
                  <div className="font-semibold text-text-primary">{charger.brand} {charger.model}</div>
                  <div className="mt-1 text-sm text-text-secondary">{charger.max_kw} kW · {charger.max_amps}A</div>
                  <div className="mt-2 text-sm font-semibold text-accent">
                    ${(charger.price_usd / 100).toFixed(0)}
                  </div>
                  {charger.amazon_asin && (
                    <a
                      href={`https://www.amazon.com/dp/${charger.amazon_asin}?tag=evrangetools-20`}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="mt-2 block text-center rounded-md bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors"
                    >
                      View on Amazon
                    </a>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-text-tertiary">
              Always confirm charger eligibility with {utility.utility_name} before purchasing.
            </p>
          </section>
        )}

        {/* FAQ */}
        <section className="mt-10 border-t border-border pt-8">
          <h2 className="mb-5 font-display text-xl font-bold text-text-primary">
            {utility.utility_name} EV Rebate FAQs
          </h2>
          <div className="space-y-4">
            {[
              {
                q: `How much is the ${utility.utility_name} EV charger rebate?`,
                a: `${utility.utility_name} offers ${utility.amount_text} for qualifying Level 2 home EV charger installation. ${utility.requirements ?? ''}`,
              },
              {
                q: `Who qualifies for the ${utility.utility_name} rebate?`,
                a: utility.eligibility ?? `${utility.utility_name} residential electric customers who purchase and install a qualifying Level 2 EV charger.`,
              },
              {
                q: 'Can I stack this rebate with the federal charger tax credit?',
                a: 'Yes. The federal §30C credit covers 30% of EV charger + installation costs (up to $1,000). You can claim both — the utility rebate reduces your out-of-pocket cost, and you claim the federal credit on the net amount paid.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-xl border border-border bg-bg-secondary p-5">
                <h3 className="font-display font-semibold text-text-primary">{q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related tools */}
        <section className="mt-10 border-t border-border pt-8">
          <h2 className="mb-3 font-display text-lg font-bold text-text-primary">Related Tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/home-charger-wizard" className="text-sm text-accent hover:underline">Home Charger Setup Wizard</Link>
            <Link href="/charger-installation-cost" className="text-sm text-accent hover:underline">Installation Cost Calculator</Link>
            <Link href="/ev-incentives" className="text-sm text-accent hover:underline">State EV Incentives</Link>
            <Link href="/best-ev-chargers" className="text-sm text-accent hover:underline">Best EV Chargers</Link>
            <Link href="/tax-credit-checker" className="text-sm text-accent hover:underline">Federal Tax Credit Checker</Link>
          </div>
        </section>
      </div>
    </>
  );
}
