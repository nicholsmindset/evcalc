import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getVehicles } from '@/lib/supabase/queries/vehicles';
import { generateMetadata as genMeta, generateBreadcrumbSchema } from '@/lib/utils/seo';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { FAQSection } from '@/components/seo/FAQSection';
import type { Vehicle } from '@/lib/supabase/types';

export const revalidate = 604800;

interface UseCaseConfig {
  title: string;
  description: string;
  metaDescription: string;
  filter: (v: Vehicle) => boolean;
  sort: (a: Vehicle, b: Vehicle) => number;
  badges: string[];
  faqs: Array<{ question: string; answer: string }>;
}

const USE_CASES: Record<string, UseCaseConfig> = {
  'long-range': {
    title: 'Best EVs for Long Range',
    description: 'Electric vehicles with the most range per charge, ideal for long commutes and road trips.',
    metaDescription: 'Top EVs with the longest range. Compare models with 300+ miles of EPA range for road trips and long commutes.',
    filter: (v) => v.epa_range_mi >= 250,
    sort: (a, b) => b.epa_range_mi - a.epa_range_mi,
    badges: ['Longest Range', 'Road Trip Ready'],
    faqs: [
      { question: 'Which EV has the longest range?', answer: 'As of 2025, several EVs offer 300+ miles of EPA range, with models from Tesla, Lucid, Mercedes, and BMW leading the pack. The Lucid Air tops the charts at over 500 miles.' },
      { question: 'How much range do I need?', answer: 'Most people drive less than 40 miles per day. A 250+ mile range EV covers daily driving plus weekend trips easily. For frequent long road trips, 300+ miles is ideal.' },
      { question: 'Does long range mean a bigger battery?', answer: 'Not always. Efficiency matters too — a highly efficient EV with a smaller battery can match or beat a less efficient EV with a larger pack.' },
    ],
  },
  'budget': {
    title: 'Best Budget EVs',
    description: 'Affordable electric vehicles under $45,000 that deliver great value with solid range and features.',
    metaDescription: 'Best affordable EVs under $45K. Compare budget-friendly electric cars with the best range-per-dollar ratio.',
    filter: (v) => v.msrp_usd !== null && v.msrp_usd <= 45000,
    sort: (a, b) => (a.msrp_usd || Infinity) - (b.msrp_usd || Infinity),
    badges: ['Best Value', 'Affordable'],
    faqs: [
      { question: 'What is the cheapest EV available?', answer: 'Several EVs start under $30,000 before federal tax credits of up to $7,500. After incentives, some models cost under $22,000.' },
      { question: 'Are cheap EVs worth it?', answer: 'Yes — budget EVs still save significantly on fuel and maintenance costs. Even a 200-mile range EV covers most daily driving needs.' },
      { question: 'Do budget EVs qualify for tax credits?', answer: 'Many do, but eligibility depends on manufacturing location and price caps. Check the IRS website for the latest qualified vehicles.' },
    ],
  },
  'road-trips': {
    title: 'Best EVs for Road Trips',
    description: 'EVs with the best combination of range, fast charging speed, and charging network access for long-distance travel.',
    metaDescription: 'Best EVs for road trips ranked by range, DC fast charging speed, and network access. Plan your next EV road trip with confidence.',
    filter: (v) => v.epa_range_mi >= 250 && v.dc_fast_max_kw !== null && v.dc_fast_max_kw >= 100,
    sort: (a, b) => {
      const scoreA = a.epa_range_mi + (a.dc_fast_max_kw || 0) * 2;
      const scoreB = b.epa_range_mi + (b.dc_fast_max_kw || 0) * 2;
      return scoreB - scoreA;
    },
    badges: ['Fast Charging', 'Long Range'],
    faqs: [
      { question: 'Can I road trip in an EV?', answer: 'Absolutely. With 85,000+ charging stations in the US and modern EVs offering 300+ miles of range, cross-country EV road trips are practical and increasingly common.' },
      { question: 'How fast can EVs charge on a road trip?', answer: 'Modern DC fast chargers can add 200+ miles of range in 20-30 minutes. Some vehicles support 250+ kW charging for even faster stops.' },
      { question: 'What charging network is best for road trips?', answer: 'Tesla Superchargers (now open to non-Tesla via NACS adapters), Electrify America, and ChargePoint offer the most highway coverage.' },
    ],
  },
  'families': {
    title: 'Best EVs for Families',
    description: 'Spacious electric vehicles with room for the whole family, cargo space, and safety features.',
    metaDescription: 'Best family EVs with 5+ seats, cargo space, and top safety ratings. Find the perfect electric SUV or minivan for your family.',
    filter: (v) => v.seating_capacity !== null && v.seating_capacity >= 5,
    sort: (a, b) => {
      const scoreA = (a.seating_capacity || 0) * 50 + (a.cargo_volume_cu_ft || 0) + a.epa_range_mi;
      const scoreB = (b.seating_capacity || 0) * 50 + (b.cargo_volume_cu_ft || 0) + b.epa_range_mi;
      return scoreB - scoreA;
    },
    badges: ['Family Friendly', 'Spacious'],
    faqs: [
      { question: 'Are EVs good for families?', answer: 'Yes — EVs offer smooth, quiet rides, instant torque for safe merging, lower running costs, and many SUV/crossover models with generous cargo space.' },
      { question: 'Which EV has the most cargo space?', answer: 'Electric SUVs and crossovers typically offer 60-80+ cubic feet with seats folded. Some models also include a front trunk (frunk) for additional storage.' },
      { question: 'Are 7-seat EVs available?', answer: 'Yes, several models offer 3-row seating with 6-7 seats, including options from Tesla, Rivian, Mercedes, and others.' },
    ],
  },
  'commuting': {
    title: 'Best EVs for Commuting',
    description: 'Efficient electric vehicles perfect for daily commuting with low running costs and easy charging.',
    metaDescription: 'Best EVs for daily commuting. Most efficient electric cars ranked by kWh/100mi for the lowest cost per mile.',
    filter: (v) => v.efficiency_kwh_per_100mi <= 32,
    sort: (a, b) => a.efficiency_kwh_per_100mi - b.efficiency_kwh_per_100mi,
    badges: ['Most Efficient', 'Low Cost/Mile'],
    faqs: [
      { question: 'How much does it cost to commute in an EV?', answer: 'At the national average of $0.16/kWh, an efficient EV costs about $0.04-0.05 per mile — roughly 1/4 the cost of a gas car averaging 30 MPG at $3.50/gallon.' },
      { question: 'Can I charge at home overnight for my commute?', answer: 'Yes — a Level 2 (240V) home charger adds 25-30 miles of range per hour, more than enough to fully charge overnight for any commute.' },
      { question: 'What range do I need for commuting?', answer: 'Most commutes are under 40 miles round-trip. Even a 150-mile range EV provides a comfortable buffer. Charge at home every night and you\'ll rarely need public charging.' },
    ],
  },
  'cold-weather': {
    title: 'Best EVs for Cold Weather',
    description: 'EVs with heat pumps, battery preconditioning, and strong cold-weather range retention.',
    metaDescription: 'Best EVs for cold climates. Models with heat pumps, battery preconditioning, and AWD that retain the most range in winter.',
    filter: (v) => v.epa_range_mi >= 230,
    sort: (a, b) => b.epa_range_mi - a.epa_range_mi,
    badges: ['Cold Weather Ready', 'Heat Pump'],
    faqs: [
      { question: 'How much range do EVs lose in cold weather?', answer: 'Typically 20-40% at temperatures below 20°F, depending on the vehicle and heating use. Heat pump-equipped EVs lose significantly less than resistive-heat models.' },
      { question: 'What features help EVs in cold weather?', answer: 'Heat pumps (50% more efficient than resistive heating), battery preconditioning, heated seats/steering wheel (more efficient than cabin heating), and AWD for traction.' },
      { question: 'Can I still road trip in winter with an EV?', answer: 'Yes — plan for 25-35% less range and slightly more frequent charging stops. Pre-condition the battery before arriving at a DC fast charger for faster charge speeds.' },
    ],
  },
  'suvs': {
    title: 'Best Electric SUVs',
    description: 'Top electric SUVs and crossovers ranked by range, space, and capability.',
    metaDescription: 'Best electric SUVs ranked by range, cargo space, and features. Compare EV crossovers and full-size electric SUVs.',
    filter: (v) => v.vehicle_class !== null && /suv|crossover|sport utility/i.test(v.vehicle_class),
    sort: (a, b) => b.epa_range_mi - a.epa_range_mi,
    badges: ['SUV', 'Crossover'],
    faqs: [
      { question: 'Are electric SUVs worth it?', answer: 'Yes — electric SUVs combine the practicality of an SUV with lower fuel costs, instant torque, and a smooth, quiet driving experience. Many offer 280+ miles of range.' },
      { question: 'Which electric SUV has the most range?', answer: 'Range varies by model year and trim, but several electric SUVs now offer 300+ miles of EPA range.' },
      { question: 'Are electric SUVs good in snow?', answer: 'Many electric SUVs offer AWD with precise torque control for each wheel, providing excellent traction in snow and rain.' },
    ],
  },
  'sedans': {
    title: 'Best Electric Sedans',
    description: 'Top electric sedans ranked by range, efficiency, performance, and value.',
    metaDescription: 'Best electric sedans compared by range, efficiency, and price. Find the perfect EV sedan for your needs.',
    filter: (v) => v.vehicle_class !== null && /sedan|car|hatchback/i.test(v.vehicle_class),
    sort: (a, b) => b.epa_range_mi - a.epa_range_mi,
    badges: ['Sedan', 'Efficient'],
    faqs: [
      { question: 'Are electric sedans more efficient than SUVs?', answer: 'Generally yes — sedans have lower aerodynamic drag and weigh less, resulting in better efficiency (fewer kWh per mile) and often more range from the same battery.' },
      { question: 'Which electric sedan has the best range?', answer: 'The Lucid Air leads with 500+ miles, followed by several Tesla Model S and BMW i-series variants with 300+ miles.' },
    ],
  },
  'trucks': {
    title: 'Best Electric Trucks',
    description: 'Electric pickup trucks ranked by range, towing capacity, payload, and bed utility.',
    metaDescription: 'Best electric trucks compared: range, towing, payload, and price. Find the right EV truck for work and play.',
    filter: (v) => v.vehicle_class !== null && /truck|pickup/i.test(v.vehicle_class),
    sort: (a, b) => b.epa_range_mi - a.epa_range_mi,
    badges: ['Truck', 'Towing'],
    faqs: [
      { question: 'Can electric trucks tow?', answer: 'Yes — electric trucks like the Ford F-150 Lightning and Rivian R1T can tow 7,700-11,000+ lbs. However, towing significantly reduces range (30-50% reduction is common).' },
      { question: 'How much range do electric trucks have?', answer: 'Most electric trucks offer 250-400 miles of EPA range depending on battery size and configuration.' },
    ],
  },
  'fast-charging': {
    title: 'Best EVs for Fast Charging',
    description: 'EVs with the fastest DC charging speeds, ranked by peak charging rate in kW.',
    metaDescription: 'Fastest charging EVs ranked by DC fast charging speed (kW). See which EVs charge from 10-80% the quickest.',
    filter: (v) => v.dc_fast_max_kw !== null && v.dc_fast_max_kw >= 150,
    sort: (a, b) => (b.dc_fast_max_kw || 0) - (a.dc_fast_max_kw || 0),
    badges: ['Fastest Charging', 'Road Trip Ready'],
    faqs: [
      { question: 'Which EV charges the fastest?', answer: 'Several models support 250-350 kW DC fast charging, enabling 10-80% charges in under 20 minutes at compatible stations.' },
      { question: 'Does faster charging damage the battery?', answer: 'Modern EV battery management systems protect the battery during fast charging. Frequent DC fast charging may cause slightly faster degradation over many years, but the effect is minimal with modern battery chemistry.' },
    ],
  },
};

const ALL_USE_CASES = Object.keys(USE_CASES);

export function generateStaticParams() {
  return ALL_USE_CASES.map((usecase) => ({ usecase }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ usecase: string }>;
}): Promise<Metadata> {
  const { usecase } = await params;
  const config = USE_CASES[usecase];
  if (!config) return {};

  return genMeta({
    title: `${config.title} (2025) — Top Picks & Rankings`,
    description: config.metaDescription,
    path: `/best-ev-for/${usecase}`,
  });
}

export default async function BestEvForPage({
  params,
}: {
  params: Promise<{ usecase: string }>;
}) {
  const { usecase } = await params;
  const config = USE_CASES[usecase];

  if (!config) notFound();

  const allVehicles = await getVehicles();
  const filtered = allVehicles.filter(config.filter).sort(config.sort);

  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Best EV For', href: '/best-ev-for/long-range' },
    { name: config.title, href: `/best-ev-for/${usecase}` },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SchemaMarkup schema={breadcrumbs} />

      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-text-tertiary">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <span>/</span>
        <span className="text-text-secondary">{config.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          {config.title}
        </h1>
        <p className="mt-2 text-text-secondary">{config.description}</p>
      </div>

      {/* Category Navigation */}
      <div className="mb-8 flex flex-wrap gap-2">
        {ALL_USE_CASES.map((uc) => (
          <Link
            key={uc}
            href={`/best-ev-for/${uc}`}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              uc === usecase
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border bg-bg-secondary text-text-secondary hover:border-accent/30 hover:text-accent'
            }`}
          >
            {USE_CASES[uc].title.replace('Best ', '').replace('EVs for ', '').replace('Electric ', '')}
          </Link>
        ))}
      </div>

      {/* Vehicle Rankings */}
      {filtered.length > 0 ? (
        <div className="mb-12 space-y-4">
          {filtered.map((vehicle, index) => (
            <Link
              key={vehicle.id}
              href={`/vehicles/${vehicle.slug}`}
              className="group flex items-center gap-4 rounded-xl border border-border bg-bg-secondary p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
            >
              {/* Rank */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-tertiary">
                <span className={`font-mono text-lg font-bold ${index < 3 ? 'text-accent' : 'text-text-secondary'}`}>
                  {index + 1}
                </span>
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <h3 className="font-display font-semibold text-text-primary group-hover:text-accent transition-colors">
                  {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim || ''}
                </h3>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
                  <span>{vehicle.battery_kwh} kWh</span>
                  <span>{vehicle.efficiency_kwh_per_100mi} kWh/100mi</span>
                  {vehicle.dc_fast_max_kw && <span>{vehicle.dc_fast_max_kw} kW DC</span>}
                  {vehicle.drivetrain && <span>{vehicle.drivetrain}</span>}
                </div>
              </div>

              {/* Key Metric */}
              <div className="shrink-0 text-right">
                <p className="font-mono text-xl font-bold text-accent">{vehicle.epa_range_mi}</p>
                <p className="text-xs text-text-tertiary">mi EPA</p>
              </div>

              {/* Price */}
              {vehicle.msrp_usd && (
                <div className="hidden shrink-0 text-right sm:block">
                  <p className="font-mono text-sm font-semibold text-text-primary">
                    ${(vehicle.msrp_usd / 1000).toFixed(0)}k
                  </p>
                  <p className="text-xs text-text-tertiary">MSRP</p>
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="mb-12 flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold text-text-primary">No vehicles match this category</p>
          <p className="mt-2 text-sm text-text-tertiary">
            Vehicle data will appear once the database is seeded.
          </p>
        </div>
      )}

      {/* Related Tools */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-display font-bold text-text-primary">
          EV Tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/calculator" className="rounded-xl border border-border bg-bg-secondary p-5 hover:border-accent/30 transition-colors">
            <h3 className="font-display font-semibold text-text-primary">Range Calculator</h3>
            <p className="mt-1 text-sm text-text-secondary">See real-world range under any conditions.</p>
          </Link>
          <Link href="/compare" className="rounded-xl border border-border bg-bg-secondary p-5 hover:border-accent/30 transition-colors">
            <h3 className="font-display font-semibold text-text-primary">Compare EVs</h3>
            <p className="mt-1 text-sm text-text-secondary">Side-by-side spec comparisons.</p>
          </Link>
          <Link href="/ev-vs-gas" className="rounded-xl border border-border bg-bg-secondary p-5 hover:border-accent/30 transition-colors">
            <h3 className="font-display font-semibold text-text-primary">EV vs Gas Savings</h3>
            <p className="mt-1 text-sm text-text-secondary">How much you&apos;ll save switching to electric.</p>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection faqs={config.faqs} />
    </div>
  );
}
