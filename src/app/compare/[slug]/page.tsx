import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getComparisonBySlug } from '@/lib/supabase/queries/comparisons';
import { getVehicles } from '@/lib/supabase/queries/vehicles';
import { calculateRange } from '@/lib/calculations/range';
import { generateMetadata as genMeta, generateBreadcrumbSchema } from '@/lib/utils/seo';
import { SITE_URL } from '@/lib/utils/constants';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { FAQSection } from '@/components/seo/FAQSection';
import nextDynamic from 'next/dynamic';
import type { Vehicle } from '@/lib/supabase/types';

// Disable SSR — Recharts uses browser-only ResizeObserver/SVG APIs
const ComparisonRadar = nextDynamic(
  () => import('@/components/charts/ComparisonRadar').then((m) => m.ComparisonRadar),
  { ssr: false }
);

export const revalidate = 604800; // 7 days

export async function generateStaticParams() {
  const COMPARISON_SLUGS = [
    'tesla-model-3-vs-hyundai-ioniq-5',
    'tesla-model-y-vs-kia-ev6',
    'tesla-model-y-vs-ford-mustang-mach-e',
    'hyundai-ioniq-5-vs-kia-ev6',
    'tesla-model-3-vs-chevrolet-equinox-ev',
    'rivian-r1s-vs-tesla-model-x',
    'bmw-ix-vs-mercedes-eqe',
    'volkswagen-id4-vs-nissan-ariya',
  ];
  return COMPARISON_SLUGS.map((slug) => ({ slug }));
}

function vName(v: Vehicle): string {
  return `${v.year} ${v.make} ${v.model}${v.trim ? ` ${v.trim}` : ''}`;
}

function shortName(v: Vehicle): string {
  return `${v.make} ${v.model}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let result = null;
  try { result = await getComparisonBySlug(slug); } catch { return {}; }
  if (!result) return {};

  const { vehicleA, vehicleB } = result;
  const nameA = shortName(vehicleA);
  const nameB = shortName(vehicleB);

  return genMeta({
    title: `${nameA} vs ${nameB} — Range, Specs & Cost Comparison`,
    description: `Compare the ${nameA} (${vehicleA.epa_range_mi} mi) vs ${nameB} (${vehicleB.epa_range_mi} mi). Side-by-side specs, real-world range, charging speed, efficiency, and pricing.`,
    path: `/compare/${slug}`,
  });
}

const COMPARISON_CONDITIONS = [
  { label: 'EPA Rated', temp: 70, speed: 55, terrain: 'mixed' as const, hvac: 'off' as const, isEpa: true },
  { label: 'Highway 70°F', temp: 70, speed: 70, terrain: 'highway' as const, hvac: 'off' as const },
  { label: 'Highway 30°F', temp: 30, speed: 70, terrain: 'highway' as const, hvac: 'heat_pump' as const },
  { label: 'City 70°F', temp: 70, speed: 30, terrain: 'city' as const, hvac: 'off' as const },
  { label: 'Highway 80 mph', temp: 70, speed: 80, terrain: 'highway' as const, hvac: 'off' as const },
];

function getRangeForCondition(vehicle: Vehicle, condition: typeof COMPARISON_CONDITIONS[0]) {
  if (condition.isEpa) return { range: vehicle.epa_range_mi, pct: 100 };
  const result = calculateRange({
    epaRangeMi: vehicle.epa_range_mi,
    temperatureF: condition.temp,
    speedMph: condition.speed,
    terrain: condition.terrain,
    hvacMode: condition.hvac,
    cargoLbs: 0,
    batteryHealthPct: 100,
  });
  return { range: result.adjustedRangeMi, pct: result.pctOfEpa };
}

function generateComparisonFAQs(a: Vehicle, b: Vehicle) {
  const nA = shortName(a);
  const nB = shortName(b);
  return [
    {
      question: `Which has more range, the ${nA} or ${nB}?`,
      answer: a.epa_range_mi > b.epa_range_mi
        ? `The ${nA} has more range at ${a.epa_range_mi} miles EPA vs ${b.epa_range_mi} miles for the ${nB}, a difference of ${a.epa_range_mi - b.epa_range_mi} miles.`
        : a.epa_range_mi < b.epa_range_mi
        ? `The ${nB} has more range at ${b.epa_range_mi} miles EPA vs ${a.epa_range_mi} miles for the ${nA}, a difference of ${b.epa_range_mi - a.epa_range_mi} miles.`
        : `Both vehicles have the same EPA range of ${a.epa_range_mi} miles.`,
    },
    {
      question: `Which is more efficient, the ${nA} or ${nB}?`,
      answer: a.efficiency_kwh_per_100mi < b.efficiency_kwh_per_100mi
        ? `The ${nA} is more efficient at ${a.efficiency_kwh_per_100mi} kWh/100mi vs ${b.efficiency_kwh_per_100mi} kWh/100mi for the ${nB}. Lower is better — it means less energy used per mile.`
        : a.efficiency_kwh_per_100mi > b.efficiency_kwh_per_100mi
        ? `The ${nB} is more efficient at ${b.efficiency_kwh_per_100mi} kWh/100mi vs ${a.efficiency_kwh_per_100mi} kWh/100mi for the ${nA}. Lower is better — it means less energy used per mile.`
        : `Both vehicles have the same efficiency rating of ${a.efficiency_kwh_per_100mi} kWh/100mi.`,
    },
    {
      question: `Which charges faster, the ${nA} or ${nB}?`,
      answer: (() => {
        if (a.dc_fast_max_kw && b.dc_fast_max_kw) {
          return a.dc_fast_max_kw > b.dc_fast_max_kw
            ? `The ${nA} supports faster DC charging at ${a.dc_fast_max_kw} kW vs ${b.dc_fast_max_kw} kW for the ${nB}.`
            : `The ${nB} supports faster DC charging at ${b.dc_fast_max_kw} kW vs ${a.dc_fast_max_kw} kW for the ${nA}.`;
        }
        return `DC fast charging comparison depends on available specs. ${a.dc_fast_max_kw ? `The ${nA} supports up to ${a.dc_fast_max_kw} kW.` : ''} ${b.dc_fast_max_kw ? `The ${nB} supports up to ${b.dc_fast_max_kw} kW.` : ''}`;
      })(),
    },
    {
      question: `Which is cheaper, the ${nA} or ${nB}?`,
      answer: (() => {
        if (a.msrp_usd && b.msrp_usd) {
          const diff = Math.abs(a.msrp_usd - b.msrp_usd);
          return a.msrp_usd < b.msrp_usd
            ? `The ${nA} starts at $${a.msrp_usd.toLocaleString()}, which is $${diff.toLocaleString()} less than the ${nB} at $${b.msrp_usd.toLocaleString()}.`
            : `The ${nB} starts at $${b.msrp_usd.toLocaleString()}, which is $${diff.toLocaleString()} less than the ${nA} at $${a.msrp_usd.toLocaleString()}.`;
        }
        return `Pricing varies by configuration. Check manufacturer websites for current MSRP.`;
      })(),
    },
    {
      question: `How does cold weather affect the ${nA} vs ${nB}?`,
      answer: `At 30°F with heating, both vehicles lose significant range. The ${nA} drops to approximately ${Math.round(a.epa_range_mi * 0.68)} miles and the ${nB} to approximately ${Math.round(b.epa_range_mi * 0.68)} miles. More efficient vehicles tend to handle cold weather slightly better.`,
    },
  ];
}

export default async function ComparisonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let result: Awaited<ReturnType<typeof getComparisonBySlug>> = null;
  try {
    result = await getComparisonBySlug(slug);
  } catch {
    // DB error — try slug-based fallback
  }

  // Fallback: parse slug like "tesla-model-3-vs-hyundai-ioniq-5" and look up vehicles
  if (!result) {
    const parts = slug.split('-vs-');
    if (parts.length === 2) {
      try {
        const allVehicles = await getVehicles();
        const [prefixA, prefixB] = parts;
        const vehicleA = allVehicles
          .filter((v) => v.slug.startsWith(prefixA + '-') || v.slug === prefixA)
          .sort((a, b) => b.epa_range_mi - a.epa_range_mi)[0];
        const vehicleB = allVehicles
          .filter((v) => v.slug.startsWith(prefixB + '-') || v.slug === prefixB)
          .sort((a, b) => b.epa_range_mi - a.epa_range_mi)[0];
        if (vehicleA && vehicleB) {
          result = { comparison: { id: '', vehicle_a_id: vehicleA.id, vehicle_b_id: vehicleB.id, slug, generated_content: null, created_at: '', updated_at: '' }, vehicleA, vehicleB };
        }
      } catch {
        // ignore
      }
    }
  }

  if (!result) notFound();

  const { vehicleA, vehicleB } = result;
  const nameA = vName(vehicleA);
  const nameB = vName(vehicleB);
  const shortA = shortName(vehicleA);
  const shortB = shortName(vehicleB);
  const faqs = generateComparisonFAQs(vehicleA, vehicleB);

  // Compute range under conditions for both vehicles
  const conditionsData = COMPARISON_CONDITIONS.map((c) => ({
    ...c,
    a: getRangeForCondition(vehicleA, c),
    b: getRangeForCondition(vehicleB, c),
  }));

  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Compare', href: '/compare' },
    { name: `${shortA} vs ${shortB}`, href: `/compare/${slug}` },
  ]);

  // Determine winners in key categories
  const rangeWinner = vehicleA.epa_range_mi >= vehicleB.epa_range_mi ? 'A' : 'B';
  const efficiencyWinner = vehicleA.efficiency_kwh_per_100mi <= vehicleB.efficiency_kwh_per_100mi ? 'A' : 'B';
  const chargingWinner = (vehicleA.dc_fast_max_kw || 0) >= (vehicleB.dc_fast_max_kw || 0) ? 'A' : 'B';
  const priceWinner = vehicleA.msrp_usd && vehicleB.msrp_usd
    ? (vehicleA.msrp_usd <= vehicleB.msrp_usd ? 'A' : 'B')
    : null;

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${shortA} vs ${shortB} Comparison`,
    itemListElement: [vehicleA, vehicleB].map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: vName(v),
      url: `${SITE_URL}/vehicles/${v.slug}`,
    })),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SchemaMarkup schema={breadcrumbs} />
      <SchemaMarkup schema={itemListSchema} />

      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-text-tertiary">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <span>/</span>
        <Link href="/compare" className="hover:text-accent transition-colors">Compare</Link>
        <span>/</span>
        <span className="text-text-secondary">{shortA} vs {shortB}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          {shortA} vs {shortB}
        </h1>
        <p className="mt-2 text-text-secondary">
          Side-by-side comparison of range, specs, charging, and pricing.
        </p>
      </div>

      {/* Quick Verdict Cards */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <VerdictCard
          label="More Range"
          winner={rangeWinner === 'A' ? shortA : shortB}
          detail={`${Math.max(vehicleA.epa_range_mi, vehicleB.epa_range_mi)} mi EPA`}
        />
        <VerdictCard
          label="More Efficient"
          winner={efficiencyWinner === 'A' ? shortA : shortB}
          detail={`${Math.min(vehicleA.efficiency_kwh_per_100mi, vehicleB.efficiency_kwh_per_100mi)} kWh/100mi`}
        />
        <VerdictCard
          label="Faster Charging"
          winner={chargingWinner === 'A' ? shortA : shortB}
          detail={`${Math.max(vehicleA.dc_fast_max_kw || 0, vehicleB.dc_fast_max_kw || 0)} kW`}
        />
        {priceWinner && (
          <VerdictCard
            label="Lower Price"
            winner={priceWinner === 'A' ? shortA : shortB}
            detail={`$${Math.min(vehicleA.msrp_usd!, vehicleB.msrp_usd!).toLocaleString()}`}
          />
        )}
      </div>

      {/* Radar Chart */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-display font-bold text-text-primary">
          Head-to-Head Overview
        </h2>
        <div className="rounded-xl border border-border bg-bg-secondary p-6">
          <ComparisonRadar vehicles={[vehicleA, vehicleB]} />
          <p className="mt-2 text-center text-xs text-text-tertiary">
            Normalized 0–100 scale across 5 dimensions. Higher is always better.
          </p>
        </div>
      </section>

      {/* Side-by-Side Specs Table */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-display font-bold text-text-primary">
          Specifications
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-border bg-bg-secondary">
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-tertiary">Spec</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-accent">{shortA}</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-accent">{shortB}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <CompareRow label="Year" a={vehicleA.year.toString()} b={vehicleB.year.toString()} />
              {(vehicleA.trim || vehicleB.trim) && (
                <CompareRow label="Trim" a={vehicleA.trim || '—'} b={vehicleB.trim || '—'} />
              )}
              <CompareRow
                label="EPA Range"
                a={`${vehicleA.epa_range_mi} mi`}
                b={`${vehicleB.epa_range_mi} mi`}
                highlightHigher
                aVal={vehicleA.epa_range_mi}
                bVal={vehicleB.epa_range_mi}
              />
              <CompareRow label="Battery" a={`${vehicleA.battery_kwh} kWh`} b={`${vehicleB.battery_kwh} kWh`} />
              <CompareRow
                label="Efficiency"
                a={`${vehicleA.efficiency_kwh_per_100mi} kWh/100mi`}
                b={`${vehicleB.efficiency_kwh_per_100mi} kWh/100mi`}
                highlightLower
                aVal={vehicleA.efficiency_kwh_per_100mi}
                bVal={vehicleB.efficiency_kwh_per_100mi}
              />
              <CompareRow
                label="DC Fast Max"
                a={vehicleA.dc_fast_max_kw ? `${vehicleA.dc_fast_max_kw} kW` : '—'}
                b={vehicleB.dc_fast_max_kw ? `${vehicleB.dc_fast_max_kw} kW` : '—'}
                highlightHigher
                aVal={vehicleA.dc_fast_max_kw || 0}
                bVal={vehicleB.dc_fast_max_kw || 0}
              />
              <CompareRow
                label="DC Fast Time"
                a={vehicleA.charge_time_dc_fast_mins ? `~${vehicleA.charge_time_dc_fast_mins} min` : '—'}
                b={vehicleB.charge_time_dc_fast_mins ? `~${vehicleB.charge_time_dc_fast_mins} min` : '—'}
              />
              <CompareRow
                label="Level 2 Time"
                a={vehicleA.charge_time_240v_hrs ? `~${vehicleA.charge_time_240v_hrs} hrs` : '—'}
                b={vehicleB.charge_time_240v_hrs ? `~${vehicleB.charge_time_240v_hrs} hrs` : '—'}
              />
              <CompareRow
                label="Connector"
                a={vehicleA.connector_type || '—'}
                b={vehicleB.connector_type || '—'}
              />
              <CompareRow
                label="Drivetrain"
                a={vehicleA.drivetrain || '—'}
                b={vehicleB.drivetrain || '—'}
              />
              <CompareRow
                label="Class"
                a={vehicleA.vehicle_class || '—'}
                b={vehicleB.vehicle_class || '—'}
              />
              <CompareRow
                label="Curb Weight"
                a={vehicleA.curb_weight_lbs ? `${vehicleA.curb_weight_lbs.toLocaleString()} lbs` : '—'}
                b={vehicleB.curb_weight_lbs ? `${vehicleB.curb_weight_lbs.toLocaleString()} lbs` : '—'}
              />
              <CompareRow
                label="Seating"
                a={vehicleA.seating_capacity ? `${vehicleA.seating_capacity}` : '—'}
                b={vehicleB.seating_capacity ? `${vehicleB.seating_capacity}` : '—'}
              />
              <CompareRow
                label="MSRP"
                a={vehicleA.msrp_usd ? `$${vehicleA.msrp_usd.toLocaleString()}` : '—'}
                b={vehicleB.msrp_usd ? `$${vehicleB.msrp_usd.toLocaleString()}` : '—'}
                highlightLower
                aVal={vehicleA.msrp_usd || Infinity}
                bVal={vehicleB.msrp_usd || Infinity}
              />
            </tbody>
          </table>
        </div>
      </section>

      {/* Range Under Conditions */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-display font-bold text-text-primary">
          Range Comparison by Condition
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-border bg-bg-secondary">
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-tertiary">Condition</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-accent">{shortA}</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-accent">{shortB}</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-text-tertiary">Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {conditionsData.map((c, i) => {
                const diff = c.a.range - c.b.range;
                return (
                  <tr key={i} className={c.isEpa ? 'bg-accent/5' : i % 2 === 0 ? 'bg-bg-secondary/30' : ''}>
                    <td className="px-4 py-3 text-sm text-text-primary">{c.label}</td>
                    <td className={`px-4 py-3 text-right font-mono text-sm font-semibold ${c.a.range >= c.b.range ? 'text-accent' : 'text-text-primary'}`}>
                      {c.a.range} mi
                    </td>
                    <td className={`px-4 py-3 text-right font-mono text-sm font-semibold ${c.b.range >= c.a.range ? 'text-accent' : 'text-text-primary'}`}>
                      {c.b.range} mi
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-text-secondary">
                      {diff > 0 ? '+' : ''}{diff} mi
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Links to Individual Vehicle Pages */}
      <section className="mb-12 grid gap-4 sm:grid-cols-2">
        <Link
          href={`/vehicles/${vehicleA.slug}`}
          className="group rounded-xl border border-border bg-bg-secondary p-6 text-center transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
        >
          <p className="text-lg font-display font-bold text-text-primary group-hover:text-accent transition-colors">
            {nameA}
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-accent">
            {vehicleA.epa_range_mi} mi
          </p>
          <p className="mt-2 text-sm text-text-secondary">View full specs &rarr;</p>
        </Link>
        <Link
          href={`/vehicles/${vehicleB.slug}`}
          className="group rounded-xl border border-border bg-bg-secondary p-6 text-center transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
        >
          <p className="text-lg font-display font-bold text-text-primary group-hover:text-accent transition-colors">
            {nameB}
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-accent">
            {vehicleB.epa_range_mi} mi
          </p>
          <p className="mt-2 text-sm text-text-secondary">View full specs &rarr;</p>
        </Link>
      </section>

      {/* Related Tools */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-display font-bold text-text-primary">
          Related Tools
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/calculator" className="rounded-full border border-border bg-bg-secondary px-4 py-2 text-sm text-text-secondary hover:border-accent/30 hover:text-accent transition-colors">
            Range Calculator
          </Link>
          <Link href="/charging-cost-calculator" className="rounded-full border border-border bg-bg-secondary px-4 py-2 text-sm text-text-secondary hover:border-accent/30 hover:text-accent transition-colors">
            Charging Cost Calculator
          </Link>
          <Link href="/ev-vs-gas" className="rounded-full border border-border bg-bg-secondary px-4 py-2 text-sm text-text-secondary hover:border-accent/30 hover:text-accent transition-colors">
            EV vs Gas Savings
          </Link>
          <Link href="/road-trip-planner" className="rounded-full border border-border bg-bg-secondary px-4 py-2 text-sm text-text-secondary hover:border-accent/30 hover:text-accent transition-colors">
            Road Trip Planner
          </Link>
          <Link href="/vehicles" className="rounded-full border border-border bg-bg-secondary px-4 py-2 text-sm text-text-secondary hover:border-accent/30 hover:text-accent transition-colors">
            All Vehicles
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection faqs={faqs} title={`${shortA} vs ${shortB} FAQ`} />
    </div>
  );
}

function VerdictCard({ label, winner, detail }: { label: string; winner: string; detail: string }) {
  return (
    <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-accent/70">{label}</p>
      <p className="mt-1 font-display font-bold text-text-primary">{winner}</p>
      <p className="mt-0.5 font-mono text-sm text-text-secondary">{detail}</p>
    </div>
  );
}

function CompareRow({
  label,
  a,
  b,
  highlightHigher,
  highlightLower,
  aVal,
  bVal,
}: {
  label: string;
  a: string;
  b: string;
  highlightHigher?: boolean;
  highlightLower?: boolean;
  aVal?: number;
  bVal?: number;
}) {
  let aClass = 'text-text-primary';
  let bClass = 'text-text-primary';

  if (aVal !== undefined && bVal !== undefined) {
    if (highlightHigher) {
      if (aVal > bVal) aClass = 'text-accent';
      else if (bVal > aVal) bClass = 'text-accent';
    }
    if (highlightLower) {
      if (aVal < bVal && aVal !== Infinity) aClass = 'text-accent';
      else if (bVal < aVal && bVal !== Infinity) bClass = 'text-accent';
    }
  }

  return (
    <tr className="odd:bg-bg-secondary/30">
      <td className="px-4 py-3 text-sm text-text-secondary">{label}</td>
      <td className={`px-4 py-3 text-right font-mono text-sm font-semibold ${aClass}`}>{a}</td>
      <td className={`px-4 py-3 text-right font-mono text-sm font-semibold ${bClass}`}>{b}</td>
    </tr>
  );
}
