import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getElectricityRate, getUSElectricityRates } from '@/lib/supabase/queries/rates';
import { generateMetadata as genMeta, generateBreadcrumbSchema } from '@/lib/utils/seo';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { FAQSection } from '@/components/seo/FAQSection';

export const revalidate = 2592000; // 30 days — electricity rates update monthly

const STATES = [
  'california', 'texas', 'florida', 'new-york', 'washington',
  'colorado', 'oregon', 'arizona', 'illinois', 'georgia',
  'massachusetts', 'new-jersey', 'virginia', 'north-carolina', 'pennsylvania',
];

export async function generateStaticParams() {
  return STATES.map((state) => ({ state }));
}

function stateSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

function stateName(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const name = stateName(state);

  return genMeta({
    title: `EV Charging Cost in ${name} — Electricity Rates & Savings`,
    description: `How much does it cost to charge an EV in ${name}? Current electricity rates, cost per mile, monthly charging costs, and EV vs gas savings for ${name} drivers.`,
    path: `/ev-charging-cost/${state}`,
  });
}

// Average EV efficiency for cost estimates
const AVG_EFFICIENCY_KWH_PER_100MI = 28;
const AVG_ANNUAL_MILES = 12000;
const AVG_GAS_MPG = 28;

export default async function StateChargingCostPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const name = stateName(state);

  const [rate, allRates] = await Promise.all([
    getElectricityRate('US', name),
    getUSElectricityRates(),
  ]);

  if (!rate) notFound();

  // Calculate costs
  const costPer100Mi = rate.rate_per_kwh * AVG_EFFICIENCY_KWH_PER_100MI;
  const costPerMile = costPer100Mi / 100;
  const monthlyCost = (AVG_ANNUAL_MILES / 12 / 100) * costPer100Mi;
  const annualCost = (AVG_ANNUAL_MILES / 100) * costPer100Mi;
  const fullChargeKwh60 = rate.rate_per_kwh * 60; // 60 kWh average battery
  const fullChargeKwh80 = rate.rate_per_kwh * 80; // 80 kWh large battery

  // Gas comparison
  const nationalAvgGas = 3.5; // approximate
  const gasCostPerMile = nationalAvgGas / AVG_GAS_MPG;
  const annualGasCost = AVG_ANNUAL_MILES * gasCostPerMile;
  const annualSavings = annualGasCost - annualCost;

  // Rank among states
  const sortedRates = [...allRates].sort((a, b) => a.rate_per_kwh - b.rate_per_kwh);
  const rank = sortedRates.findIndex((r) => r.state_or_region === name) + 1;
  const cheapest = sortedRates[0];
  const mostExpensive = sortedRates[sortedRates.length - 1];
  const nationalAvg = allRates.length > 0
    ? allRates.reduce((sum, r) => sum + r.rate_per_kwh, 0) / allRates.length
    : rate.rate_per_kwh;

  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Charging Cost', href: '/charging-cost-calculator' },
    { name: name, href: `/ev-charging-cost/${state}` },
  ]);

  const faqs = [
    {
      question: `How much does it cost to charge an EV in ${name}?`,
      answer: `At ${name}'s average residential electricity rate of $${rate.rate_per_kwh.toFixed(3)}/kWh, charging an average EV (28 kWh/100mi efficiency) costs about $${costPer100Mi.toFixed(2)} per 100 miles, or roughly $${monthlyCost.toFixed(0)} per month for 12,000 annual miles.`,
    },
    {
      question: `What is the electricity rate in ${name}?`,
      answer: `The average residential electricity rate in ${name} is $${rate.rate_per_kwh.toFixed(3)} per kWh. This ranks #${rank} out of ${allRates.length} states (lower is better). The national average is approximately $${nationalAvg.toFixed(3)}/kWh.`,
    },
    {
      question: `How much do you save with an EV vs gas in ${name}?`,
      answer: `In ${name}, an EV driver saves approximately $${annualSavings.toFixed(0)} per year compared to a gas car averaging ${AVG_GAS_MPG} MPG at $${nationalAvgGas.toFixed(2)}/gallon. That's $${(annualSavings * 5).toFixed(0)} over 5 years.`,
    },
    {
      question: `How much does a full EV charge cost in ${name}?`,
      answer: `A full charge costs $${fullChargeKwh60.toFixed(2)} for a 60 kWh battery (typical compact EV) or $${fullChargeKwh80.toFixed(2)} for an 80 kWh battery (typical SUV/truck). DC fast charging at public stations costs roughly 2-3x more.`,
    },
    {
      question: `Is ${name} a good state for EV ownership?`,
      answer: rate.rate_per_kwh <= nationalAvg
        ? `Yes — ${name}'s electricity rate is below the national average, making EV charging more affordable here. Combined with potential state incentives, ${name} is a cost-effective state for EV ownership.`
        : `${name}'s electricity rate is above the national average, but EVs still save significantly compared to gas cars. The savings are roughly $${annualSavings.toFixed(0)}/year even at ${name}'s rates.`,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SchemaMarkup schema={breadcrumbs} />

      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-text-tertiary">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <span>/</span>
        <Link href="/charging-cost-calculator" className="hover:text-accent transition-colors">Charging Cost</Link>
        <span>/</span>
        <span className="text-text-secondary">{name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          EV Charging Cost in {name}
        </h1>
        <p className="mt-2 text-text-secondary">
          Current electricity rates, charging costs, and EV vs gas savings for {name} drivers.
        </p>
      </div>

      {/* Key Stats */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Electricity Rate" value={`$${rate.rate_per_kwh.toFixed(3)}`} unit="/kWh" />
        <StatCard label="Cost per Mile" value={`$${costPerMile.toFixed(3)}`} unit="/mile" />
        <StatCard label="Monthly Cost" value={`$${monthlyCost.toFixed(0)}`} unit="/month" highlight />
        <StatCard label="Annual Savings vs Gas" value={`$${annualSavings.toFixed(0)}`} unit="/year" highlight />
      </div>

      {/* Detailed Breakdown */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-display font-bold text-text-primary">
          Charging Cost Breakdown
        </h2>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <tbody className="divide-y divide-border">
              <tr className="odd:bg-bg-secondary/30">
                <td className="px-4 py-3 text-sm text-text-secondary">Electricity Rate</td>
                <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-text-primary">
                  ${rate.rate_per_kwh.toFixed(3)}/kWh
                </td>
              </tr>
              <tr className="odd:bg-bg-secondary/30">
                <td className="px-4 py-3 text-sm text-text-secondary">Cost per 100 Miles (EV)</td>
                <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-accent">
                  ${costPer100Mi.toFixed(2)}
                </td>
              </tr>
              <tr className="odd:bg-bg-secondary/30">
                <td className="px-4 py-3 text-sm text-text-secondary">Cost per Mile (EV)</td>
                <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-text-primary">
                  ${costPerMile.toFixed(3)}
                </td>
              </tr>
              <tr className="odd:bg-bg-secondary/30">
                <td className="px-4 py-3 text-sm text-text-secondary">Cost per Mile (Gas @ ${nationalAvgGas}/gal, {AVG_GAS_MPG} MPG)</td>
                <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-text-primary">
                  ${gasCostPerMile.toFixed(3)}
                </td>
              </tr>
              <tr className="odd:bg-bg-secondary/30">
                <td className="px-4 py-3 text-sm text-text-secondary">Full Charge (60 kWh battery)</td>
                <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-text-primary">
                  ${fullChargeKwh60.toFixed(2)}
                </td>
              </tr>
              <tr className="odd:bg-bg-secondary/30">
                <td className="px-4 py-3 text-sm text-text-secondary">Full Charge (80 kWh battery)</td>
                <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-text-primary">
                  ${fullChargeKwh80.toFixed(2)}
                </td>
              </tr>
              <tr className="bg-accent/5">
                <td className="px-4 py-3 text-sm font-medium text-accent">Monthly Charging Cost</td>
                <td className="px-4 py-3 text-right font-mono text-sm font-bold text-accent">
                  ${monthlyCost.toFixed(2)}
                </td>
              </tr>
              <tr className="bg-accent/5">
                <td className="px-4 py-3 text-sm font-medium text-accent">Annual Charging Cost</td>
                <td className="px-4 py-3 text-right font-mono text-sm font-bold text-accent">
                  ${annualCost.toFixed(2)}
                </td>
              </tr>
              <tr className="odd:bg-bg-secondary/30">
                <td className="px-4 py-3 text-sm text-text-secondary">Annual Gas Cost ({AVG_GAS_MPG} MPG)</td>
                <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-text-primary">
                  ${annualGasCost.toFixed(2)}
                </td>
              </tr>
              <tr className="bg-accent/5">
                <td className="px-4 py-3 text-sm font-medium text-accent">Annual Savings (EV vs Gas)</td>
                <td className="px-4 py-3 text-right font-mono text-sm font-bold text-accent">
                  ${annualSavings.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-text-tertiary">
          Based on {AVG_ANNUAL_MILES.toLocaleString()} annual miles, {AVG_EFFICIENCY_KWH_PER_100MI} kWh/100mi average EV efficiency, Level 2 home charging.
          Source: EIA residential electricity rates.
        </p>
      </section>

      {/* State Ranking */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-display font-bold text-text-primary">
          How {name} Compares
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-bg-secondary p-5 text-center">
            <p className="text-xs text-text-tertiary">State Rank</p>
            <p className="mt-1 font-mono text-3xl font-bold text-accent">#{rank}</p>
            <p className="text-xs text-text-tertiary">of {allRates.length} states</p>
          </div>
          <div className="rounded-xl border border-border bg-bg-secondary p-5 text-center">
            <p className="text-xs text-text-tertiary">Cheapest State</p>
            <p className="mt-1 font-display font-semibold text-text-primary">{cheapest?.state_or_region}</p>
            <p className="font-mono text-sm text-text-secondary">${cheapest?.rate_per_kwh.toFixed(3)}/kWh</p>
          </div>
          <div className="rounded-xl border border-border bg-bg-secondary p-5 text-center">
            <p className="text-xs text-text-tertiary">Most Expensive</p>
            <p className="mt-1 font-display font-semibold text-text-primary">{mostExpensive?.state_or_region}</p>
            <p className="font-mono text-sm text-text-secondary">${mostExpensive?.rate_per_kwh.toFixed(3)}/kWh</p>
          </div>
        </div>
      </section>

      {/* Other States */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-display font-bold text-text-primary">
          Other States
        </h2>
        <div className="flex flex-wrap gap-2">
          {allRates.slice(0, 20).map((r) => (
            <Link
              key={r.state_or_region}
              href={`/ev-charging-cost/${stateSlug(r.state_or_region)}`}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                r.state_or_region === name
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-bg-secondary text-text-secondary hover:border-accent/30 hover:text-accent'
              }`}
            >
              {r.state_or_region}
            </Link>
          ))}
          {allRates.length > 20 && (
            <span className="rounded-full border border-border bg-bg-secondary px-3 py-1.5 text-xs text-text-tertiary">
              +{allRates.length - 20} more
            </span>
          )}
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-display font-bold text-text-primary">
          EV Cost Tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/charging-cost-calculator" className="rounded-xl border border-border bg-bg-secondary p-5 hover:border-accent/30 transition-colors">
            <h3 className="font-display font-semibold text-text-primary">Charging Cost Calculator</h3>
            <p className="mt-1 text-sm text-text-secondary">Calculate exact charging costs for your EV.</p>
          </Link>
          <Link href="/ev-vs-gas" className="rounded-xl border border-border bg-bg-secondary p-5 hover:border-accent/30 transition-colors">
            <h3 className="font-display font-semibold text-text-primary">EV vs Gas Savings</h3>
            <p className="mt-1 text-sm text-text-secondary">Full savings comparison over time.</p>
          </Link>
          <Link href="/vehicles" className="rounded-xl border border-border bg-bg-secondary p-5 hover:border-accent/30 transition-colors">
            <h3 className="font-display font-semibold text-text-primary">All Electric Vehicles</h3>
            <p className="mt-1 text-sm text-text-secondary">Browse EVs with range and efficiency data.</p>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection faqs={faqs} title={`EV Charging in ${name} FAQ`} />
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  highlight,
}: {
  label: string;
  value: string;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-5 text-center ${highlight ? 'border-accent/20 bg-accent/5' : 'border-border bg-bg-secondary'}`}>
      <p className="text-xs text-text-tertiary">{label}</p>
      <p className={`mt-1 font-mono text-2xl font-bold ${highlight ? 'text-accent' : 'text-text-primary'}`}>
        {value}
      </p>
      <p className="text-xs text-text-tertiary">{unit}</p>
    </div>
  );
}
