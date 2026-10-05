import { LEASE_PAGE_REVIEWS } from '@/lib/data/lease-page-reviews';
import Link from 'next/link';
import type { Vehicle } from '@/lib/supabase/types';
import type { VehicleReview } from '@/lib/data/vehicle-reviews';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { FAQSection } from '@/components/seo/FAQSection';
import { generateBreadcrumbSchema, generateVehicleSchema } from '@/lib/utils/seo';

export function ReviewedVehicleDetail({ vehicle, review }: { vehicle: Vehicle; review: VehicleReview }) {
  const name = `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}`;
  const primary = review.correction ? review.variants[0] : undefined;
  const isPhev = vehicle.slug.includes('phev');
  const rangeSummary = review.variants.map(v => `${v.name}: ${v.rangeText ?? `${v.rangeMi} miles`}`).join('; ');
  const faqs = [
    { question: `What range should I use for the ${name}?`, answer: `${rangeSummary}. Reference: ${review.standard}, ${review.market}. ${review.summary}` },
    { question: `What should I check before buying this ${vehicle.make} ${vehicle.model}?`, answer: review.decision },
    { question: `How should I plan charging for this ${vehicle.make} ${vehicle.model}?`, answer: review.charging },
  ];
  const schema = { ...generateVehicleSchema({ name, make: vehicle.make, model: vehicle.model, year: vehicle.year, slug: vehicle.slug, epaRangeMi: vehicle.epa_range_mi, msrp: null }), fuelType: isPhev ? ['Electricity', 'Petrol'] : 'Electricity' };
  return <article className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
    <SchemaMarkup schema={generateBreadcrumbSchema([{ name: 'Home', href: '/' }, { name: 'Vehicles', href: '/vehicles' }, { name, href: `/vehicles/${vehicle.slug}` }])} />
    <SchemaMarkup schema={schema} />
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-text-secondary"><Link href="/vehicles" className="text-accent hover:underline">All vehicles</Link> / {name}</nav>
    <header className="mb-8">
      <p className="mb-2 text-sm font-semibold text-accent">{review.market} · {review.standard}</p>
      <h1 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">{name}: range and charging guide</h1>
      <p className="mt-4 text-lg leading-relaxed text-text-secondary">{review.summary}</p>
      <p className="mt-3 text-xs text-text-tertiary">Sources reviewed October 5, 2026. Model year: {vehicle.year}. Ratings apply only to the configurations identified below.</p>
    </header>
    <section className="mb-8 rounded-xl border border-border bg-bg-secondary p-5 sm:p-6">
      <h2 className="mb-4 text-2xl font-display font-bold text-text-primary">Range by configuration</h2>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm">
        <caption className="sr-only">{name} configuration-specific {review.standard} reference ratings</caption>
        <thead><tr className="border-b border-border text-text-tertiary"><th scope="col" className="p-3">Configuration</th><th scope="col" className="p-3">{review.standard} range</th>{review.standard === 'EPA' && <><th scope="col" className="p-3">Energy use</th><th scope="col" className="p-3">240V charge time</th></>}</tr></thead>
        <tbody>{review.variants.map(v => <tr key={v.name} className="border-b border-border last:border-0">
          <th scope="row" className="p-3 font-medium text-text-primary">{v.source ? <a href={v.source} className="text-accent hover:underline">{v.name}</a> : v.name}</th>
          <td className="p-3 font-mono text-text-primary">{v.rangeText ?? `${v.rangeMi} mi / ${Math.round(v.rangeMi! * 1.609344)} km`}</td>
          {review.standard === 'EPA' && <><td className="p-3 text-text-secondary">{v.consumption?.toFixed(1)} kWh/100 mi</td><td className="p-3 text-text-secondary">{v.chargeHours} hours</td></>}
        </tr>)}</tbody>
      </table></div>
      <p className="mt-4 text-sm text-text-secondary">EPA and WLTP use different test procedures. A miles-to-kilometres conversion changes the unit only; it does not convert one test cycle into another. Neither rating is a guaranteed motorway or winter range.</p>
    </section>
    <div className="mb-8 grid gap-6 md:grid-cols-2">
      <section className="rounded-xl border border-border p-6"><h2 className="mb-3 text-xl font-display font-bold text-text-primary">Which version should you compare?</h2><p className="leading-relaxed text-text-secondary">{review.decision}</p></section>
      <section className="rounded-xl border border-border p-6"><h2 className="mb-3 text-xl font-display font-bold text-text-primary">Charging this vehicle</h2><p className="leading-relaxed text-text-secondary">{review.charging}</p></section>
    </div>
    <section className="mb-8 rounded-xl border border-border bg-bg-secondary p-6">
      <h2 className="mb-3 text-xl font-display font-bold text-text-primary">Planning your daily use</h2>
      {primary?.rangeMi ? <>
        <p className="mb-3 text-text-secondary">Using the first listed configuration&apos;s {primary.rangeMi}-mile rating, an illustrative 80% to 20% charge window contains 60% of the rated range: about <strong className="text-text-primary">{Math.round(primary.rangeMi * 0.6)} miles</strong>. This is arithmetic for planning a reserve, not a road-test result or a model-specific charging recommendation.</p>
        <p className="text-text-secondary">Temperature, speed, elevation, wind, tire pressure and battery condition can reduce the distance available. Follow the owner&apos;s manual for charging limits and use the car&apos;s route planner for longer trips.</p>
      </> : <p className="text-text-secondary">Start with the exact configuration&apos;s certified range and leave an arrival reserve. {isPhev ? 'For this plug-in hybrid, also consider how often you can recharge and how much driving will use petrol.' : 'Where the trim or certification is unresolved, confirm the vehicle documents before using a numerical range estimate.'} Road speed, weather, load and battery condition can all change the distance between stops.</p>}
      <div className="mt-4 flex flex-wrap gap-4 text-sm"><Link href="/calculator#methodology" className="text-accent hover:underline">Range calculation method</Link><Link href="/charging-networks" className="text-accent hover:underline">Check charging compatibility and costs</Link><Link href="/charging-cost-calculator" className="text-accent hover:underline">Estimate charging cost</Link></div>
    </section>
    <section className="mb-8">
      <h2 className="mb-3 text-xl font-display font-bold text-text-primary">Battery, price and ownership checks</h2>
      <p className="mb-3 text-text-secondary">A battery specification should state whether it is gross or usable capacity. EPA wall-energy consumption includes charging losses, so multiplying it by range does not establish battery size. We do not present an unverified catalog pack estimate as a manufacturer specification.</p>
      <p className="text-text-secondary">For a {vehicle.year} vehicle, compare the actual purchase or lease quote, condition, remaining warranty and equipment. Historical launch prices do not establish a current offer. Ask for the complete out-the-door price and review charging access where you live.</p>
      {LEASE_PAGE_REVIEWS[vehicle.slug] && <Link href={`/vehicles/${vehicle.slug}/lease-deals`} className="mt-4 inline-block text-accent hover:underline">Compare written lease quotes for this vehicle →</Link>}
    </section>
    <section className="mb-10 rounded-xl border border-border p-6">
      <h2 className="mb-3 text-xl font-display font-bold text-text-primary">Sources and scope</h2>
      <ul className="list-disc space-y-2 pl-5 text-sm">{review.sources.map(s => <li key={s.url}><a href={s.url} className="text-accent hover:underline">{s.title}</a></li>)}</ul>
      <p className="mt-4 text-sm text-text-secondary">These references support the named configurations and dates. A current manufacturer page may describe another model year; use the vehicle&apos;s certification label and original documentation to resolve a mismatch.</p>
    </section>
    <FAQSection faqs={faqs} title={`${vehicle.make} ${vehicle.model} questions`} />
  </article>;
}
