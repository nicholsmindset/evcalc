import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getVehicleBySlug, getAllVehicleSlugs } from '@/lib/supabase/queries/vehicles';
import {
  getVehicleTaxCredit,
  getAllLeaseEstimates,
} from '@/lib/supabase/queries/lease';
import {
  calculateLease,
  calculateFinance,
  calculateCash,
} from '@/lib/calculations/lease';
import { STATE_SALES_TAX } from '@/lib/utils/lease-constants';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';

export const revalidate = 604800; // 7 days

export async function generateStaticParams() {
  const slugs = await getAllVehicleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let vehicle = null;
  try { vehicle = await getVehicleBySlug(slug); } catch { return {}; }
  if (!vehicle) return {};

  const name = `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}`;
  return {
    title: `${name} Lease Deals & Calculator ${vehicle.year} | EV Range Tools`,
    description: `Compare ${name} lease vs. buy options. See estimated monthly payments, the $7,500 federal tax credit breakdown, and money factor details.`,
    openGraph: {
      title: `${name} Lease Deals ${vehicle.year}`,
      description: `Find the best ${name} lease deal. Estimated payments, residual value, money factor, and full lease vs. buy comparison.`,
      url: `/vehicles/${slug}/lease-deals`,
      type: 'website',
    },
    alternates: { canonical: `/vehicles/${slug}/lease-deals` },
  };
}

export default async function VehicleLeasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const [taxCredit, allLeaseTerms] = await Promise.all([
    getVehicleTaxCredit(vehicle.make, vehicle.model, vehicle.year),
    getAllLeaseEstimates(vehicle.make, vehicle.model, vehicle.year),
  ]);

  const msrp = vehicle.msrp_usd ?? 50000;
  const downPayment = 2000;
  const salesTaxRate = STATE_SALES_TAX['California'] ?? 0.0725; // example state for display
  const creditAmount = taxCredit?.credit_amount ?? 0;

  // Pre-calculate 36-month lease as primary example
  const lease36 = allLeaseTerms.find((t) => t.lease_term_months === 36)
    ?? allLeaseTerms[0]
    ?? null;

  const leaseResult = lease36
    ? calculateLease({
        msrp,
        downPayment,
        tradeIn: 0,
        taxCreditAmount: creditAmount,
        applyCredit: true,
        moneyFactor: lease36.money_factor,
        residualPct: lease36.residual_value_pct,
        termMonths: lease36.lease_term_months,
        acquisitionFee: lease36.acquisition_fee,
        salesTaxRate,
      })
    : null;

  const financeResult = calculateFinance({
    msrp,
    downPayment,
    tradeIn: 0,
    taxCreditAmount: creditAmount,
    applyCredit: true,
    apr: 0.07,
    termMonths: 60,
    salesTaxRate,
  });

  const cashResult = calculateCash({
    msrp,
    tradeIn: 0,
    taxCreditAmount: creditAmount,
    applyCredit: true,
    salesTaxRate,
  });

  const name = `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}`;

  const FAQ_ITEMS = [
    {
      q: `What is the monthly lease payment on a ${name}?`,
      a: leaseResult
        ? `A ${name} with $${downPayment.toLocaleString()} down and the $${creditAmount.toLocaleString()} federal tax credit applied costs approximately $${leaseResult.monthlyPayment.toLocaleString()}/month on a ${lease36!.lease_term_months}-month lease in California (before local taxes). Your actual payment will vary based on your state, negotiated selling price, and current manufacturer incentives.`
        : `Monthly lease payments for a ${name} depend on the current money factor and residual value offered by the manufacturer. Use our calculator above for an estimate based on your state and down payment.`,
    },
    {
      q: `Can I get the $7,500 federal tax credit when leasing a ${vehicle.make} ${vehicle.model}?`,
      a: creditAmount > 0
        ? `Yes — when you lease a ${name}, the dealer typically applies the full $${creditAmount.toLocaleString()} IRS §45W Commercial Clean Vehicle Credit as a capital cost reduction, lowering your monthly payment. There is no income limit on you as the lessee. When purchasing, the §30D credit is limited to buyers earning under $150,000 (single) or $300,000 (married filing jointly).`
        : `The ${name} may not currently qualify for the federal clean vehicle tax credit. Check IRS.gov or fueleconomy.gov for current eligibility, as the list of qualified vehicles changes when manufacturer volumes exceed thresholds.`,
    },
    {
      q: `Should I lease or buy the ${vehicle.make} ${vehicle.model}?`,
      a: `Leasing makes sense if you want lower monthly payments, prefer to drive a new EV every 2–3 years as technology advances, or want the simplest path to the $7,500 tax credit (no income limit). Buying makes more sense if you drive high mileage (>15,000/yr), plan to keep the vehicle 5+ years, or want to maximize equity. Our break-even calculator shows exactly when buying becomes cheaper.`,
    },
    {
      q: `What mileage limits apply to a ${vehicle.make} ${vehicle.model} lease?`,
      a: `Most leases include 10,000–15,000 miles per year. Excess mileage typically costs $0.15–$0.25/mile at lease end. If you drive more than 15,000 miles/year, consider a higher-mileage lease or financing. EV owners often drive fewer miles than gas car owners due to home charging convenience.`,
    },
    {
      q: `How does the ${vehicle.make} ${vehicle.model} residual value affect my lease?`,
      a: lease36
        ? `The ${name} has an estimated ${lease36.residual_value_pct}% residual value on a ${lease36.lease_term_months}-month lease, meaning the leasing company projects it will be worth ${lease36.residual_value_pct}% of MSRP ($${Math.round(msrp * lease36.residual_value_pct / 100).toLocaleString()}) at lease end. A higher residual reduces your monthly payment.`
        : `The residual value determines how much of the vehicle's value you finance during the lease term. A higher residual means lower payments. ${vehicle.make} publishes monthly residual values through their captive finance arm.`,
    },
  ];

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name,
      description: `${vehicle.year} ${vehicle.make} ${vehicle.model} — ${vehicle.epa_range_mi} mile EPA range, ${vehicle.battery_kwh} kWh battery.`,
      brand: { '@type': 'Brand', name: vehicle.make },
      ...(vehicle.msrp_usd ? {
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: vehicle.msrp_usd,
          highPrice: vehicle.msrp_usd,
        },
      } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
        { '@type': 'ListItem', position: 2, name: 'Vehicles', item: '/vehicles' },
        { '@type': 'ListItem', position: 3, name, item: `/vehicles/${slug}` },
        { '@type': 'ListItem', position: 4, name: 'Lease Deals', item: `/vehicles/${slug}/lease-deals` },
      ],
    },
  ];

  return (
    <>
      {schemas.map((s, i) => (
        <SchemaMarkup key={i} schema={s} />
      ))}

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <Link href="/vehicles" className="hover:text-text-secondary">Vehicles</Link>
          <span>/</span>
          <Link href={`/vehicles/${slug}`} className="hover:text-text-secondary">{name}</Link>
          <span>/</span>
          <span className="text-text-primary">Lease Deals</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {name} Lease Deals & Calculator
          </h1>
          <p className="mt-2 max-w-2xl text-text-secondary">
            Compare leasing vs. buying the {name}. See estimated monthly payments,
            how the ${creditAmount > 0 ? creditAmount.toLocaleString() : '7,500'} federal tax credit applies,
            and a full break-even analysis.
          </p>
        </div>

        {/* AdSense: Leaderboard */}
        <div className="mb-8 flex h-16 items-center justify-center rounded-lg border border-dashed border-border bg-bg-secondary text-xs text-text-tertiary">
          [Ad: Leaderboard 728×90]
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-8">
            {/* Summary Cards */}
            {leaseResult && (
              <section className="rounded-xl border border-border bg-bg-secondary p-6">
                <h2 className="mb-4 font-display text-lg font-semibold text-text-primary">
                  Payment Estimates — {name}
                </h2>
                <p className="mb-4 text-xs text-text-tertiary">
                  Based on ${downPayment.toLocaleString()} down · California (7.25% tax) · Good credit (7% APR) · {creditAmount > 0 ? `$${creditAmount.toLocaleString()} tax credit applied` : 'no federal credit'}
                </p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Lease */}
                  <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-accent">
                      {lease36?.lease_term_months ?? 36}-Month Lease
                    </p>
                    <p className="mt-1 font-mono text-2xl font-bold text-text-primary">
                      ${leaseResult.monthlyPayment.toLocaleString()}<span className="text-sm text-text-tertiary">/mo</span>
                    </p>
                    <p className="mt-1 text-xs text-text-tertiary">Total: ${leaseResult.totalCost.toLocaleString()}</p>
                    <p className="mt-0.5 text-xs text-success">No income limit for tax credit</p>
                  </div>

                  {/* Finance */}
                  <div className="rounded-lg border border-border bg-bg-tertiary p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">60-Month Finance</p>
                    <p className="mt-1 font-mono text-2xl font-bold text-text-primary">
                      ${financeResult.monthlyPayment.toLocaleString()}<span className="text-sm text-text-tertiary">/mo</span>
                    </p>
                    <p className="mt-1 text-xs text-text-tertiary">Total: ${financeResult.totalCost.toLocaleString()}</p>
                    <p className="mt-0.5 text-xs text-text-tertiary">Income limits apply (§30D)</p>
                  </div>

                  {/* Cash */}
                  <div className="rounded-lg border border-border bg-bg-tertiary p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">Cash Purchase</p>
                    <p className="mt-1 font-mono text-2xl font-bold text-text-primary">
                      ${cashResult.totalCost.toLocaleString()}
                    </p>
                    <p className="mt-1 text-xs text-text-tertiary">
                      ~${cashResult.effectiveMonthlyCost.toLocaleString()}/mo over 5 yrs
                    </p>
                    <p className="mt-0.5 text-xs text-success">Own outright — no payments</p>
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    href={`/lease-vs-buy?make=${encodeURIComponent(vehicle.make)}&model=${encodeURIComponent(vehicle.model)}&msrp=${msrp}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-bg-primary transition-all hover:bg-accent-dim"
                  >
                    Customize My Calculation →
                  </Link>
                </div>
              </section>
            )}

            {/* Lease Terms Table */}
            {allLeaseTerms.length > 0 && (
              <section className="rounded-xl border border-border bg-bg-secondary p-6">
                <h2 className="mb-4 font-display text-lg font-semibold text-text-primary">
                  Available Lease Terms
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-text-tertiary">
                        <th className="pb-3 pr-4 font-medium">Term</th>
                        <th className="pb-3 pr-4 font-medium">Money Factor</th>
                        <th className="pb-3 pr-4 font-medium">Equiv. APR</th>
                        <th className="pb-3 pr-4 font-medium">Residual</th>
                        <th className="pb-3 font-medium">Acq. Fee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {allLeaseTerms.map((t) => {
                        const apr = (t.money_factor * 2400).toFixed(1);
                        return (
                          <tr key={t.id}>
                            <td className="py-3 pr-4 font-mono text-text-primary">{t.lease_term_months} mo</td>
                            <td className="py-3 pr-4 font-mono text-text-secondary">{t.money_factor.toFixed(5)}</td>
                            <td className="py-3 pr-4 font-mono text-text-secondary">{apr}%</td>
                            <td className="py-3 pr-4 font-mono text-text-secondary">{t.residual_value_pct}%</td>
                            <td className="py-3 font-mono text-text-secondary">${t.acquisition_fee.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-text-tertiary">
                  * Lease estimates based on typical manufacturer programs. Actual terms set monthly and vary by dealer.
                </p>
              </section>
            )}

            {/* Tax Credit Callout */}
            {creditAmount > 0 && (
              <section className="rounded-xl border border-accent/20 bg-accent/5 p-6">
                <h2 className="mb-2 font-display text-lg font-semibold text-accent">
                  ${creditAmount.toLocaleString()} Federal Tax Credit — Lease vs. Buy
                </h2>
                <div className="grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <h3 className="font-semibold text-text-primary">When Leasing (§45W)</h3>
                    <ul className="mt-2 space-y-1 text-text-secondary">
                      <li>✓ Full ${creditAmount.toLocaleString()} applied as cap cost reduction</li>
                      <li>✓ No income limit on you as lessee</li>
                      <li>✓ Lowers monthly payment immediately</li>
                      <li>✓ Dealer handles the paperwork</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">When Purchasing (§30D)</h3>
                    <ul className="mt-2 space-y-1 text-text-secondary">
                      <li>Income limit: $150k single / $300k joint</li>
                      <li>MSRP cap: $55k sedan / $80k SUV/truck</li>
                      <li>Vehicle must meet battery mineral rules</li>
                      <li>Claimed on federal tax return</li>
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {/* FAQ */}
            <section>
              <h2 className="mb-5 font-display text-xl font-bold text-text-primary">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {FAQ_ITEMS.map(({ q, a }) => (
                  <div key={q} className="rounded-xl border border-border bg-bg-secondary p-5">
                    <h3 className="font-display font-semibold text-text-primary">{q}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Related Links */}
            <section className="border-t border-border pt-6">
              <h2 className="mb-3 font-display text-base font-semibold text-text-primary">Related</h2>
              <div className="flex flex-wrap gap-3 text-sm">
                <Link href={`/vehicles/${slug}`} className="text-accent hover:underline">
                  {vehicle.make} {vehicle.model} Range & Specs
                </Link>
                <Link href="/lease-vs-buy" className="text-accent hover:underline">Lease vs Buy Calculator</Link>
                <Link href="/ev-vs-gas" className="text-accent hover:underline">EV vs Gas Savings</Link>
                <Link href="/tco-calculator" className="text-accent hover:underline">Total Cost of Ownership</Link>
                <Link href={`/compare?a=${slug}`} className="text-accent hover:underline">
                  Compare {vehicle.make} {vehicle.model} vs. Another EV
                </Link>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Vehicle Quick Stats */}
            <div className="rounded-xl border border-border bg-bg-secondary p-5">
              <h3 className="mb-3 font-display font-semibold text-text-primary">{name} Quick Stats</h3>
              <div className="space-y-2.5 text-sm">
                {[
                  ['EPA Range', `${vehicle.epa_range_mi} mi`],
                  ['Battery', `${vehicle.battery_kwh} kWh`],
                  ['Efficiency', `${vehicle.efficiency_kwh_per_100mi} kWh/100mi`],
                  ...(vehicle.msrp_usd ? [['MSRP', `$${vehicle.msrp_usd.toLocaleString()}`] as [string,string]] : []),
                  ...(vehicle.vehicle_class ? [[vehicle.vehicle_class.charAt(0).toUpperCase() + vehicle.vehicle_class.slice(1), ''] as [string,string]] : []),
                ].map(([label, val]) => val ? (
                  <div key={label} className="flex justify-between">
                    <span className="text-text-tertiary">{label}</span>
                    <span className="font-mono font-medium text-text-primary">{val}</span>
                  </div>
                ) : null)}
              </div>
              <Link
                href={`/vehicles/${slug}`}
                className="mt-4 block text-center text-sm text-accent hover:underline"
              >
                Full specs & range analysis →
              </Link>
            </div>

            {/* Affiliate CTAs */}
            <div className="rounded-xl border border-border bg-bg-secondary p-5">
              <h3 className="mb-3 font-display font-semibold text-text-primary">Find Your {vehicle.make} Deal</h3>
              <div className="space-y-3">
                <a
                  href={`https://www.carvana.com/cars/${vehicle.make.toLowerCase()}-${vehicle.model.toLowerCase().replace(/\s+/g, '-')}`}
                  rel="sponsored noopener"
                  target="_blank"
                  className="block rounded-lg border border-border bg-bg-tertiary px-4 py-3 text-sm transition-all hover:border-accent/30"
                >
                  <span className="font-medium text-text-primary">Browse on Carvana</span>
                  <p className="mt-0.5 text-xs text-text-tertiary">Used & certified {vehicle.make} {vehicle.model}</p>
                </a>
                <a
                  href={`https://www.truecar.com/prices-new/${vehicle.make.toLowerCase()}/${vehicle.model.toLowerCase().replace(/\s+/g, '-')}/`}
                  rel="sponsored noopener"
                  target="_blank"
                  className="block rounded-lg border border-border bg-bg-tertiary px-4 py-3 text-sm transition-all hover:border-accent/30"
                >
                  <span className="font-medium text-text-primary">Get Price on TrueCar</span>
                  <p className="mt-0.5 text-xs text-text-tertiary">See what others paid for new {vehicle.make} {vehicle.model}</p>
                </a>
              </div>
              <p className="mt-3 text-xs text-text-tertiary">Affiliate links — we may earn a commission</p>
            </div>

            {/* AdSense: Medium Rectangle */}
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border bg-bg-secondary text-xs text-text-tertiary">
              [Ad: Medium Rectangle 300×250]
            </div>

            {/* Charging Cost Teaser */}
            <div className="rounded-xl border border-border bg-bg-secondary p-5">
              <h3 className="mb-2 font-display text-sm font-semibold text-text-primary">
                What does it cost to charge?
              </h3>
              <p className="text-sm text-text-secondary">
                {vehicle.battery_kwh} kWh battery × avg. $0.14/kWh ≈{' '}
                <strong className="text-accent">${(vehicle.battery_kwh * 0.14).toFixed(2)} per full charge</strong>
              </p>
              <Link href="/charging-cost-calculator" className="mt-2 block text-sm text-accent hover:underline">
                Calculate your charging cost →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
