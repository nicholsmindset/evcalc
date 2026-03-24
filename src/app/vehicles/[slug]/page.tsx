import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getVehicleBySlug, getAllVehicleSlugs, getVehicles } from '@/lib/supabase/queries/vehicles';
import { calculateRange, calculateRangeBySpeed } from '@/lib/calculations/range';
import { generateMetadata as genMeta, generateVehicleSchema, generateBreadcrumbSchema } from '@/lib/utils/seo';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { FAQSection } from '@/components/seo/FAQSection';

import type { Vehicle } from '@/lib/supabase/types';

export const revalidate = 604800; // 7 days

export async function generateStaticParams() {
  try {
    const slugs = await getAllVehicleSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
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
  return genMeta({
    title: `${name} Range, Specs & Charging — EV Range Tools`,
    description: `${name}: ${vehicle.epa_range_mi} miles EPA range, ${vehicle.battery_kwh} kWh battery, ${vehicle.efficiency_kwh_per_100mi} kWh/100mi. See real-world range under different conditions.`,
    path: `/vehicles/${slug}`,
  });
}

// Precomputed range conditions table
const CONDITIONS = [
  { label: 'Highway 70°F', temp: 70, speed: 70, terrain: 'highway' as const, hvac: 'off' as const },
  { label: 'Highway 30°F', temp: 30, speed: 70, terrain: 'highway' as const, hvac: 'heat_pump' as const },
  { label: 'Highway 95°F', temp: 95, speed: 70, terrain: 'highway' as const, hvac: 'ac' as const },
  { label: 'City 70°F', temp: 70, speed: 30, terrain: 'city' as const, hvac: 'off' as const },
  { label: 'City 30°F', temp: 30, speed: 30, terrain: 'city' as const, hvac: 'heat_pump' as const },
  { label: 'Mixed 70°F', temp: 70, speed: 45, terrain: 'mixed' as const, hvac: 'off' as const },
  { label: 'Highway 70 mph', temp: 70, speed: 70, terrain: 'highway' as const, hvac: 'off' as const },
  { label: 'Highway 80 mph', temp: 70, speed: 80, terrain: 'highway' as const, hvac: 'off' as const },
];

function getCompetitors(vehicle: Vehicle, allVehicles: Vehicle[]): Vehicle[] {
  return allVehicles
    .filter(
      (v) =>
        v.id !== vehicle.id &&
        v.vehicle_class === vehicle.vehicle_class &&
        Math.abs(v.epa_range_mi - vehicle.epa_range_mi) < 100
    )
    .sort((a, b) => Math.abs(a.epa_range_mi - vehicle.epa_range_mi) - Math.abs(b.epa_range_mi - vehicle.epa_range_mi))
    .slice(0, 3);
}

function generateVehicleFAQs(vehicle: Vehicle, name: string) {
  const faqs = [
    {
      question: `What is the range of the ${name}?`,
      answer: `The ${name} has an EPA-rated range of ${vehicle.epa_range_mi} miles (${vehicle.epa_range_km} km) on a full charge. Real-world range varies based on temperature, speed, terrain, and HVAC usage.`,
    },
    {
      question: `How long does it take to charge the ${name}?`,
      answer: vehicle.dc_fast_max_kw
        ? `The ${name} supports DC fast charging at up to ${vehicle.dc_fast_max_kw} kW${vehicle.charge_time_dc_fast_mins ? `, reaching 80% in approximately ${vehicle.charge_time_dc_fast_mins} minutes` : ''}. On a Level 2 (240V) home charger, a full charge takes ${vehicle.charge_time_240v_hrs ? `approximately ${vehicle.charge_time_240v_hrs} hours` : 'several hours depending on the charger'}.`
        : `On a Level 2 (240V) home charger, the ${name} takes ${vehicle.charge_time_240v_hrs ? `approximately ${vehicle.charge_time_240v_hrs} hours` : 'several hours'} for a full charge.`,
    },
    {
      question: `How does cold weather affect the ${name}'s range?`,
      answer: `At 30°F (-1°C) with heating on, the ${name} can lose approximately 25-35% of its EPA range, bringing real-world range to roughly ${Math.round(vehicle.epa_range_mi * 0.68)} miles. Pre-conditioning the battery while plugged in helps minimize cold-weather range loss.`,
    },
    {
      question: `What is the battery size of the ${name}?`,
      answer: `The ${name} has a ${vehicle.battery_kwh} kWh battery pack with an efficiency rating of ${vehicle.efficiency_kwh_per_100mi} kWh per 100 miles.`,
    },
    {
      question: `How much does the ${name} cost?`,
      answer: vehicle.msrp_usd
        ? `The ${name} starts at $${vehicle.msrp_usd.toLocaleString()} MSRP before any federal or state EV tax credits. Check with local dealers for current pricing and available incentives.`
        : `Pricing for the ${name} varies by configuration and dealer. Check the manufacturer's website or local dealers for current MSRP.`,
    },
    {
      question: `What connector type does the ${name} use?`,
      answer: vehicle.connector_type
        ? `The ${name} uses a ${vehicle.connector_type} connector. ${vehicle.connector_type.includes('NACS') || vehicle.connector_type.includes('Tesla') ? 'This gives access to the Tesla Supercharger network in addition to CCS stations with an adapter.' : 'CCS is the most widely supported DC fast charging standard in the US.'}`
        : `Check the manufacturer's specifications for the exact connector type used by the ${name}.`,
    },
  ];
  return faqs;
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let vehicle: Vehicle | null = null;
  let allVehicles: Vehicle[] = [];
  try {
    [vehicle, allVehicles] = await Promise.all([
      getVehicleBySlug(slug),
      getVehicles(),
    ]);
  } catch {
    notFound();
  }

  if (!vehicle) notFound();

  const name = `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}`;
  const competitors = getCompetitors(vehicle, allVehicles);
  const faqs = generateVehicleFAQs(vehicle, name);

  // Precompute range under different conditions
  const conditionsData = CONDITIONS.map((c) => {
    const result = calculateRange({
      epaRangeMi: vehicle.epa_range_mi,
      temperatureF: c.temp,
      speedMph: c.speed,
      terrain: c.terrain,
      hvacMode: c.hvac,
      cargoLbs: 0,
      batteryHealthPct: 100,
    });
    return { ...c, range: result.adjustedRangeMi, pct: result.pctOfEpa };
  });

  // Range by speed data
  const speedData = calculateRangeBySpeed({
    epaRangeMi: vehicle.epa_range_mi,
    temperatureF: 70,
    terrain: 'highway',
    hvacMode: 'off',
    cargoLbs: 0,
    batteryHealthPct: 100,
  });

  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Vehicles', href: '/vehicles' },
    { name: `${vehicle.make} ${vehicle.model}`, href: `/vehicles/${slug}` },
  ]);

  const vehicleSchema = generateVehicleSchema({
    name,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    slug: vehicle.slug,
    epaRangeMi: vehicle.epa_range_mi,
    msrp: vehicle.msrp_usd,
    imageUrl: vehicle.image_url,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SchemaMarkup schema={breadcrumbs} />
      <SchemaMarkup schema={vehicleSchema} />

      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-text-tertiary">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <span>/</span>
        <Link href="/vehicles" className="hover:text-accent transition-colors">Vehicles</Link>
        <span>/</span>
        <span className="text-text-secondary">{vehicle.make} {vehicle.model}</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-12 grid gap-8 lg:grid-cols-2">
        {/* Left: Title + Key Stats */}
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
            {name}
          </h1>
          <p className="mt-3 text-lg text-text-secondary">
            {vehicle.epa_range_mi} miles EPA range &middot; {vehicle.battery_kwh} kWh battery
            {vehicle.drivetrain ? ` \u00B7 ${vehicle.drivetrain}` : ''}
          </p>

          {/* Key Stats Grid */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-bg-secondary p-4 text-center">
              <p className="text-xs text-text-tertiary">EPA Range</p>
              <p className="mt-1 font-mono text-2xl font-bold text-accent">{vehicle.epa_range_mi}</p>
              <p className="text-xs text-text-tertiary">miles</p>
            </div>
            <div className="rounded-xl border border-border bg-bg-secondary p-4 text-center">
              <p className="text-xs text-text-tertiary">Battery</p>
              <p className="mt-1 font-mono text-2xl font-bold text-text-primary">{vehicle.battery_kwh}</p>
              <p className="text-xs text-text-tertiary">kWh</p>
            </div>
            <div className="rounded-xl border border-border bg-bg-secondary p-4 text-center">
              <p className="text-xs text-text-tertiary">Efficiency</p>
              <p className="mt-1 font-mono text-2xl font-bold text-text-primary">{vehicle.efficiency_kwh_per_100mi}</p>
              <p className="text-xs text-text-tertiary">kWh/100mi</p>
            </div>
            {vehicle.dc_fast_max_kw && (
              <div className="rounded-xl border border-border bg-bg-secondary p-4 text-center">
                <p className="text-xs text-text-tertiary">DC Fast</p>
                <p className="mt-1 font-mono text-2xl font-bold text-text-primary">{vehicle.dc_fast_max_kw}</p>
                <p className="text-xs text-text-tertiary">kW max</p>
              </div>
            )}
            {vehicle.msrp_usd && (
              <div className="rounded-xl border border-border bg-bg-secondary p-4 text-center">
                <p className="text-xs text-text-tertiary">MSRP</p>
                <p className="mt-1 font-mono text-2xl font-bold text-text-primary">
                  ${(vehicle.msrp_usd / 1000).toFixed(0)}k
                </p>
                <p className="text-xs text-text-tertiary">starting</p>
              </div>
            )}
            {vehicle.drivetrain && (
              <div className="rounded-xl border border-border bg-bg-secondary p-4 text-center">
                <p className="text-xs text-text-tertiary">Drivetrain</p>
                <p className="mt-1 font-mono text-lg font-bold text-text-primary">{vehicle.drivetrain}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Vehicle Image placeholder */}
        <div className="flex items-center justify-center overflow-hidden rounded-2xl border border-border bg-bg-secondary p-12">
          <svg className="h-24 w-24 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
        </div>
      </div>

      {/* Full Specs Table */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-display font-bold text-text-primary">
          Full Specifications
        </h2>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <tbody className="divide-y divide-border">
              <SpecRow label="Make" value={vehicle.make} />
              <SpecRow label="Model" value={vehicle.model} />
              <SpecRow label="Year" value={vehicle.year.toString()} />
              {vehicle.trim && <SpecRow label="Trim" value={vehicle.trim} />}
              <SpecRow label="EPA Range" value={`${vehicle.epa_range_mi} mi / ${vehicle.epa_range_km} km`} highlight />
              <SpecRow label="Battery Capacity" value={`${vehicle.battery_kwh} kWh`} />
              <SpecRow label="Efficiency" value={`${vehicle.efficiency_kwh_per_100mi} kWh/100mi (${vehicle.efficiency_wh_per_km} Wh/km)`} />
              {vehicle.dc_fast_max_kw && <SpecRow label="DC Fast Charging" value={`${vehicle.dc_fast_max_kw} kW max`} />}
              {vehicle.charge_time_dc_fast_mins && <SpecRow label="DC Fast Charge Time" value={`~${vehicle.charge_time_dc_fast_mins} min to 80%`} />}
              {vehicle.charge_time_240v_hrs && <SpecRow label="Level 2 Charge Time" value={`~${vehicle.charge_time_240v_hrs} hours`} />}
              {vehicle.connector_type && <SpecRow label="Connector" value={vehicle.connector_type} />}
              {vehicle.drivetrain && <SpecRow label="Drivetrain" value={vehicle.drivetrain} />}
              {vehicle.vehicle_class && <SpecRow label="Vehicle Class" value={vehicle.vehicle_class} />}
              {vehicle.curb_weight_lbs && <SpecRow label="Curb Weight" value={`${vehicle.curb_weight_lbs.toLocaleString()} lbs`} />}
              {vehicle.cargo_volume_cu_ft && <SpecRow label="Cargo Volume" value={`${vehicle.cargo_volume_cu_ft} cu ft`} />}
              {vehicle.seating_capacity && <SpecRow label="Seating" value={`${vehicle.seating_capacity} passengers`} />}
              {vehicle.msrp_usd && <SpecRow label="MSRP" value={`$${vehicle.msrp_usd.toLocaleString()}`} />}
            </tbody>
          </table>
        </div>
      </section>

      {/* Range Under Different Conditions */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-display font-bold text-text-primary">
          Range Under Different Conditions
        </h2>
        <p className="mb-4 text-sm text-text-secondary">
          Real-world range varies significantly based on driving conditions. Here&apos;s how the {vehicle.make} {vehicle.model} performs in common scenarios.
        </p>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-secondary">
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-tertiary">Condition</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-text-tertiary">Est. Range</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-text-tertiary">% of EPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="bg-bg-secondary/50">
                <td className="px-4 py-3 text-sm font-medium text-accent">EPA Rated</td>
                <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-accent">
                  {vehicle.epa_range_mi} mi
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm text-accent">100%</td>
              </tr>
              {conditionsData.map((c, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-bg-secondary/30' : ''}>
                  <td className="px-4 py-3 text-sm text-text-primary">{c.label}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-text-primary">
                    {c.range} mi
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm">
                    <span
                      className={
                        c.pct >= 90
                          ? 'text-range-full'
                          : c.pct >= 70
                          ? 'text-range-good'
                          : c.pct >= 50
                          ? 'text-range-caution'
                          : 'text-range-low'
                      }
                    >
                      {c.pct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-text-tertiary">
          Estimates based on physics-based modeling. Actual results vary by driving style, elevation, wind, and vehicle condition.
          <Link href="/calculator" className="ml-1 text-accent hover:underline">
            Try the full calculator &rarr;
          </Link>
        </p>
      </section>

      {/* Range by Speed */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-display font-bold text-text-primary">
          Range by Speed
        </h2>
        <p className="mb-4 text-sm text-text-secondary">
          Aerodynamic drag increases with the square of speed. Here&apos;s how speed affects the {vehicle.make} {vehicle.model}&apos;s range at 70&deg;F on the highway.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {speedData.map((d) => (
            <div
              key={d.speed}
              className="rounded-lg border border-border bg-bg-secondary p-3 text-center"
            >
              <p className="text-xs text-text-tertiary">{d.speed} mph</p>
              <p className="mt-1 font-mono text-lg font-bold text-text-primary">{d.range}</p>
              <p className="text-[10px] text-text-tertiary">miles</p>
            </div>
          ))}
        </div>
      </section>

      {/* Charging Guide */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-display font-bold text-text-primary">
          Charging Guide
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-bg-secondary p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-text-primary">DC Fast Charging</h3>
            {vehicle.dc_fast_max_kw ? (
              <p className="mt-2 text-sm text-text-secondary">
                Up to <span className="font-mono font-semibold text-text-primary">{vehicle.dc_fast_max_kw} kW</span>
                {vehicle.charge_time_dc_fast_mins && (
                  <> &middot; ~{vehicle.charge_time_dc_fast_mins} min to 80%</>
                )}
              </p>
            ) : (
              <p className="mt-2 text-sm text-text-secondary">DC fast charging specs not available.</p>
            )}
          </div>
          <div className="rounded-xl border border-border bg-bg-secondary p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
              <svg className="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-text-primary">Level 2 (Home)</h3>
            <p className="mt-2 text-sm text-text-secondary">
              240V outlet &middot;{' '}
              {vehicle.charge_time_240v_hrs ? (
                <span className="font-mono font-semibold text-text-primary">~{vehicle.charge_time_240v_hrs} hours</span>
              ) : (
                'Check manufacturer specs'
              )}{' '}
              for a full charge
            </p>
          </div>
          <div className="rounded-xl border border-border bg-bg-secondary p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <svg className="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-text-primary">Connector</h3>
            <p className="mt-2 text-sm text-text-secondary">
              {vehicle.connector_type || 'Check manufacturer specs'}
            </p>
          </div>
        </div>
      </section>

      {/* Competitors Comparison */}
      {competitors.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-display font-bold text-text-primary">
            Compare with Similar EVs
          </h2>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-bg-secondary">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-tertiary">Vehicle</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-text-tertiary">Range</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-text-tertiary">Battery</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-text-tertiary">Efficiency</th>
                  <th className="hidden px-4 py-3 text-right text-xs font-semibold text-text-tertiary sm:table-cell">MSRP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {/* Current vehicle row */}
                <tr className="bg-accent/5">
                  <td className="px-4 py-3 text-sm font-semibold text-accent">
                    {vehicle.make} {vehicle.model} {vehicle.trim || ''}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-accent">
                    {vehicle.epa_range_mi} mi
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-text-primary">
                    {vehicle.battery_kwh} kWh
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-text-primary">
                    {vehicle.efficiency_kwh_per_100mi}
                  </td>
                  <td className="hidden px-4 py-3 text-right font-mono text-sm text-text-primary sm:table-cell">
                    {vehicle.msrp_usd ? `$${(vehicle.msrp_usd / 1000).toFixed(0)}k` : '—'}
                  </td>
                </tr>
                {/* Competitor rows */}
                {competitors.map((comp) => (
                  <tr key={comp.id}>
                    <td className="px-4 py-3 text-sm">
                      <Link
                        href={`/vehicles/${comp.slug}`}
                        className="text-text-primary hover:text-accent transition-colors"
                      >
                        {comp.make} {comp.model} {comp.trim || ''}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-text-primary">
                      {comp.epa_range_mi} mi
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-text-primary">
                      {comp.battery_kwh} kWh
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-text-primary">
                      {comp.efficiency_kwh_per_100mi}
                    </td>
                    <td className="hidden px-4 py-3 text-right font-mono text-sm text-text-primary sm:table-cell">
                      {comp.msrp_usd ? `$${(comp.msrp_usd / 1000).toFixed(0)}k` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Internal Links */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-display font-bold text-text-primary">
          EV Tools &amp; Resources
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ToolLink
            href="/calculator"
            title="Range Calculator"
            description={`Calculate the ${vehicle.make} ${vehicle.model}'s real-world range under any conditions.`}
          />
          <ToolLink
            href="/road-trip-planner"
            title="Road Trip Planner"
            description={`Plan a road trip with the ${vehicle.make} ${vehicle.model} and find charging stops.`}
          />
          <ToolLink
            href="/charging-cost-calculator"
            title="Charging Cost Calculator"
            description={`Estimate how much it costs to charge the ${vehicle.make} ${vehicle.model}.`}
          />
          <ToolLink
            href="/ev-vs-gas"
            title="EV vs Gas Savings"
            description={`Compare the ${vehicle.make} ${vehicle.model} to a gas car on total fuel costs.`}
          />
          <ToolLink
            href="/charging-stations"
            title="Find Charging Stations"
            description="Find DC fast chargers and Level 2 stations near you."
          />
          <ToolLink
            href="/vehicles"
            title="All Electric Vehicles"
            description="Browse all EVs with range, specs, and charging data."
          />
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection faqs={faqs} title={`${vehicle.make} ${vehicle.model} FAQ`} />
    </div>
  );
}

function SpecRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <tr className={highlight ? 'bg-accent/5' : 'odd:bg-bg-secondary/50'}>
      <td className="px-4 py-3 text-sm text-text-secondary">{label}</td>
      <td className={`px-4 py-3 text-right font-mono text-sm font-semibold ${highlight ? 'text-accent' : 'text-text-primary'}`}>
        {value}
      </td>
    </tr>
  );
}

function ToolLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-border bg-bg-secondary p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
    >
      <h3 className="font-display font-semibold text-text-primary group-hover:text-accent transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-sm text-text-secondary">{description}</p>
    </Link>
  );
}
