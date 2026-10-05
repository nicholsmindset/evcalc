import Link from 'next/link';
import { VEHICLE_REVIEWS } from '@/lib/data/vehicle-reviews';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { generateBreadcrumbSchema } from '@/lib/utils/seo';

export const REVIEWED_BRANDS: Record<string, { name: string; intro: string; checks: string[] }> = {
  subaru: {
    name: 'Subaru',
    intro: 'Start with the exact model year and trim when comparing a Subaru electric SUV. These reviewed 2025 Solterra references cover Limited and Touring configurations; they are not a complete list of today’s Subaru models.',
    checks: ['The reviewed Limited and Touring records share a 222-mile EPA rating. That figure alone does not justify paying more for one trim: compare equipment, condition and the actual purchase quote.', 'For a used Solterra, ask for charging history, remaining warranty documentation and a battery-health inspection. Confirm the charging connector and any adapter requirements on the specific vehicle.', 'For a newer model year, obtain its own EPA label. Do not carry the 2025 range or charging figures over to a different year.'],
  },
  vinfast: {
    name: 'VinFast',
    intro: 'Our reviewed VinFast reference covers the US-market 2025 VF 9 Plus. Check the market, trim and model year before using a range figure: the guide below does not represent every VinFast vehicle or every regional specification.',
    checks: ['The reviewed 2025 VF 9 Plus has a 287-mile EPA rating. Use the Plus configuration when comparing it with another three-row EV; a different trim needs its own reference.', 'Before buying, locate the service center you would actually use and obtain written warranty and roadside-assistance terms for your vehicle and market.', 'For a family vehicle, test the third row with your passengers and measure luggage space with every seat in use. Compare the complete financing or lease quote, including mileage and end-of-term charges.'],
  },
};

export function ReviewedBrand({ slug }: { slug: string }) {
  const brand = REVIEWED_BRANDS[slug];
  const reviews = Object.entries(VEHICLE_REVIEWS).filter(([key]) => key.startsWith(`${slug}-`));
  return <article className="mx-auto max-w-5xl space-y-8 px-4 py-10 text-text-secondary">
    <SchemaMarkup schema={generateBreadcrumbSchema([{ name: 'Home', href: '/' }, { name: `${brand.name} EVs`, href: `/brand/${slug}` }])} />
    <header><p className="text-sm text-accent">US-market reference guide · Reviewed October 6, 2026</p><h1 className="mt-2 text-3xl font-bold text-text-primary">{brand.name} electric vehicles: reviewed range and buying checks</h1><p className="mt-4">{brand.intro}</p></header>
    <section><h2 className="mb-4 text-2xl font-semibold text-text-primary">Reviewed vehicle guides</h2><div className="grid gap-4 sm:grid-cols-2">{reviews.map(([key, review]) => <div key={key} className="space-y-3 rounded-xl border border-border bg-bg-secondary p-5"><h3 className="text-xl font-semibold text-text-primary"><Link className="hover:text-accent" href={`/vehicles/${key}`}>{review.variants[0].name}</Link></h3><p>{review.summary}</p><p className="text-sm">Market: {review.market} · Test standard: {review.standard}</p><Link className="text-accent underline" href={`/vehicles/${key}`}>Read trim details and source references</Link></div>)}</div></section>
    <section><h2 className="mb-4 text-2xl font-semibold text-text-primary">What to check before choosing</h2><ul className="list-disc space-y-4 pl-5">{brand.checks.map(check => <li key={check}>{check}</li>)}</ul></section>
    <section className="space-y-4"><h2 className="text-2xl font-semibold text-text-primary">Compare range on the same basis</h2><p>EPA range is a standardized comparison figure. Your route, speed, temperature and charging stops determine whether a vehicle fits your trips. Keep EPA and WLTP results separate, and use the same assumptions when estimating costs for two vehicles.</p><p>Record the exact year, trim, wheels and drivetrain on both quotes. Ask whether a quoted battery capacity is usable or gross before comparing it. A peak charging-power number alone does not describe the full charging stop.</p><div className="flex flex-wrap gap-4"><Link href="/compare" className="text-accent underline">Compare EVs</Link><Link href="/charging-cost-calculator" className="text-accent underline">Estimate charging costs</Link><Link href="/vehicles" className="text-accent underline">Browse vehicle guides</Link></div></section>
    <section><h2 className="mb-3 text-xl font-semibold text-text-primary">Sources and scope</h2><p>Vehicle figures come from the EPA references linked inside each guide. The review date records our source check; the figures remain specific to the listed model year.</p><ul className="mt-3 list-disc space-y-2 pl-5">{Array.from(new Map(reviews.flatMap(([, review]) => review.sources).map(source => [source.url, source])).values()).map(source => <li key={source.url}><a className="text-accent underline" href={source.url}>{source.title}</a></li>)}</ul></section>
  </article>;
}
