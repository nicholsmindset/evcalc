import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 604800; // 7 days

// Static towing data — mirrors ev-towing/page.tsx TOW_EVS
const TOW_EVS = [
  { slug: 'ford-f-150-lightning-pro-2024', make: 'Ford', model: 'F-150 Lightning', year: 2024, towLbs: 10000, payloadLbs: 2000, epaRange: 240, msrp: 49995, dcFastKw: 150, batteryKwh: 98, note: 'Max tow package required. Range with trailer varies significantly by weight and speed.' },
  { slug: 'rivian-r1t-quad-2024', make: 'Rivian', model: 'R1T', year: 2024, towLbs: 11000, payloadLbs: 1760, epaRange: 314, msrp: 69900, dcFastKw: 200, batteryKwh: 135, note: 'Best-in-class EV towing. Max Pack required for 11,000 lb rating.' },
  { slug: 'rivian-r1s-quad-2024', make: 'Rivian', model: 'R1S', year: 2024, towLbs: 7700, payloadLbs: 1625, epaRange: 321, msrp: 79900, dcFastKw: 200, batteryKwh: 135, note: '3-row SUV with serious towing capability and excellent range.' },
  { slug: 'tesla-cybertruck-awd-2024', make: 'Tesla', model: 'Cybertruck', year: 2024, towLbs: 11000, payloadLbs: 2200, epaRange: 318, msrp: 79990, dcFastKw: 250, batteryKwh: 123, note: 'Tri-Motor version tows up to 11,000 lbs. Range-extender available.' },
  { slug: 'gmc-hummer-ev-3x-2024', make: 'GMC', model: 'Hummer EV', year: 2024, towLbs: 7500, payloadLbs: 1300, epaRange: 329, msrp: 105595, dcFastKw: 350, batteryKwh: 212, note: 'Heavy weight limits payload; ultra-fast 350 kW charging.' },
  { slug: 'chevrolet-silverado-ev-rst-2024', make: 'Chevrolet', model: 'Silverado EV', year: 2024, towLbs: 10000, payloadLbs: 1300, epaRange: 450, msrp: 74800, dcFastKw: 350, batteryKwh: 200, note: 'Best EPA range of any EV truck at 450 miles. 350 kW charging.' },
  { slug: 'tesla-model-x-long-range-2024', make: 'Tesla', model: 'Model X', year: 2024, towLbs: 5000, payloadLbs: 1170, epaRange: 335, msrp: 79990, dcFastKw: 250, batteryKwh: 100, note: 'Requires hitch receiver. Best suited for boat trailers, pop-ups.' },
  { slug: 'audi-q8-e-tron-quattro-2024', make: 'Audi', model: 'Q8 e-tron', year: 2024, towLbs: 4000, payloadLbs: 1058, epaRange: 285, msrp: 74400, dcFastKw: 170, batteryKwh: 114, note: 'European tow hitch standard. Suitable for light trailers and campers.' },
  { slug: 'bmw-ix-xdrive50-2024', make: 'BMW', model: 'iX', year: 2024, towLbs: 5500, payloadLbs: 1323, epaRange: 305, msrp: 87100, dcFastKw: 195, batteryKwh: 111, note: 'European towing standards. Tongue weight limit 550 lbs.' },
  { slug: 'kia-ev9-gt-line-awd-2024', make: 'Kia', model: 'EV9', year: 2024, towLbs: 5000, payloadLbs: 1168, epaRange: 270, msrp: 73900, dcFastKw: 239, batteryKwh: 99, note: '3-row family SUV. 800V architecture enables fast charging stops during trips.' },
  { slug: 'hyundai-ioniq-5-awd-2024', make: 'Hyundai', model: 'IONIQ 5', year: 2024, towLbs: 3500, payloadLbs: 1014, epaRange: 266, msrp: 46450, dcFastKw: 239, batteryKwh: 77, note: 'Most affordable towing EV. 800V charging gets you back on the road fast.' },
  { slug: 'volkswagen-id4-pro-awd-2024', make: 'Volkswagen', model: 'ID.4', year: 2024, towLbs: 2700, payloadLbs: 1058, epaRange: 255, msrp: 41190, dcFastKw: 135, batteryKwh: 82, note: 'Suitable for small trailers and PWC. AWD Pro required for towing.' },
  { slug: 'polestar-3-long-range-dual-2024', make: 'Polestar', model: 'Polestar 3', year: 2024, towLbs: 4900, payloadLbs: 1135, epaRange: 270, msrp: 73400, dcFastKw: 250, batteryKwh: 111, note: 'Performance SUV with solid towing for its class.' },
  { slug: 'mercedes-eqv-300-2024', make: 'Mercedes-Benz', model: 'EQV', year: 2024, towLbs: 3500, payloadLbs: 1000, epaRange: 221, msrp: 68000, dcFastKw: 110, batteryKwh: 90, note: 'Minivan configuration. Lower range offset by passenger capacity.' },
  { slug: 'ram-1500-rev-2024', make: 'Ram', model: '1500 REV', year: 2024, towLbs: 14000, payloadLbs: 2700, epaRange: 350, msrp: 58995, dcFastKw: 350, batteryKwh: 229, note: 'Highest EV tow rating at 14,000 lbs. Extended-Range battery required.' },
];

function calcTowRange(epaRange: number, towWeightLbs: number): number {
  return Math.round(epaRange * (1 - 0.003 * (towWeightLbs / 100)));
}

export async function generateStaticParams() {
  return TOW_EVS.map((ev) => ({ slug: ev.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ev = TOW_EVS.find((e) => e.slug === slug);
  if (!ev) return {};

  const name = `${ev.year} ${ev.make} ${ev.model}`;
  return {
    title: `${name} Towing Capacity & Range — EV Towing Guide`,
    description: `${name} tows up to ${ev.towLbs.toLocaleString()} lbs. See real towing range estimates at different trailer weights, payload capacity (${ev.payloadLbs.toLocaleString()} lbs), and charging strategy tips.`,
    openGraph: {
      title: `${name} Towing Capacity & Range Guide`,
      description: `How far can a ${name} go while towing? See range estimates for every trailer weight up to ${ev.towLbs.toLocaleString()} lbs plus tips for maximizing towing range.`,
      url: `/vehicles/${slug}/towing`,
      type: 'website',
    },
    alternates: { canonical: `/vehicles/${slug}/towing` },
  };
}

export default async function VehicleTowingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ev = TOW_EVS.find((e) => e.slug === slug);
  if (!ev) notFound();

  const name = `${ev.year} ${ev.make} ${ev.model}`;

  // Towing range table — key weight increments
  const towWeights = [500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, ev.towLbs].filter(
    (w, i, arr) => w <= ev.towLbs && arr.indexOf(w) === i
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: `${name} Towing Capacity & Range Guide`,
        description: `Detailed towing range analysis for the ${name}, including range at different trailer weights, payload capacity, and charging strategy.`,
        url: `https://evrangetools.com/vehicles/${slug}/towing`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': `https://evrangetools.com/vehicles/${slug}/towing` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evrangetools.com' },
          { '@type': 'ListItem', position: 2, name: 'EV Towing', item: 'https://evrangetools.com/ev-towing' },
          { '@type': 'ListItem', position: 3, name: `${name} Towing`, item: `https://evrangetools.com/vehicles/${slug}/towing` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `How much can a ${name} tow?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The ${name} has a maximum towing capacity of ${ev.towLbs.toLocaleString()} lbs and a payload capacity of ${ev.payloadLbs.toLocaleString()} lbs. ${ev.note}`,
            },
          },
          {
            '@type': 'Question',
            name: `How far can a ${name} go while towing?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Towing significantly reduces EV range. A ${name} towing ${Math.round(ev.towLbs * 0.5).toLocaleString()} lbs (half max) gets an estimated ${calcTowRange(ev.epaRange, Math.round(ev.towLbs * 0.5))} miles — about ${Math.round((1 - calcTowRange(ev.epaRange, Math.round(ev.towLbs * 0.5)) / ev.epaRange) * 100)}% less than its ${ev.epaRange}-mile EPA rating. At max tow weight the range drops to approximately ${calcTowRange(ev.epaRange, ev.towLbs)} miles.`,
            },
          },
          {
            '@type': 'Question',
            name: `How fast does the ${name} charge while towing?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The ${name} supports up to ${ev.dcFastKw} kW DC fast charging. When towing, plan stops every ${calcTowRange(ev.epaRange, Math.round(ev.towLbs * 0.5))} miles or so. A 20–80% charge adds roughly ${Math.round((ev.batteryKwh * 0.6) / (ev.dcFastKw * 0.85) * 60)} minutes at a ${ev.dcFastKw} kW charger.`,
            },
          },
        ],
      },
    ],
  };

  const halfTow = Math.round(ev.towLbs * 0.5);
  const halfRange = calcTowRange(ev.epaRange, halfTow);
  const maxRange = calcTowRange(ev.epaRange, ev.towLbs);
  const rangeLossHalf = Math.round((1 - halfRange / ev.epaRange) * 100);
  const rangeLossMax = Math.round((1 - maxRange / ev.epaRange) * 100);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4 flex flex-wrap gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <Link href="/ev-towing" className="hover:text-text-secondary">EV Towing</Link>
          <span>/</span>
          <Link href={`/vehicles/${slug}`} className="hover:text-text-secondary">{name}</Link>
          <span>/</span>
          <span className="text-text-primary">Towing</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {name} Towing Capacity & Range
          </h1>
          <p className="mt-3 text-text-secondary">
            How far can a {name} go while towing? Estimated range at every trailer weight,
            payload limits, and charging strategy — everything you need to plan a towing trip.
          </p>
        </div>

        {/* Key Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Max Tow', value: `${ev.towLbs.toLocaleString()} lbs` },
            { label: 'Payload', value: `${ev.payloadLbs.toLocaleString()} lbs` },
            { label: 'EPA Range', value: `${ev.epaRange} mi` },
            { label: 'DC Fast', value: `${ev.dcFastKw} kW` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-bg-secondary p-4 text-center">
              <div className="font-display text-2xl font-bold text-accent">{stat.value}</div>
              <div className="mt-1 text-xs text-text-tertiary">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Note */}
        {ev.note && (
          <div className="mb-8 rounded-lg border border-border bg-bg-secondary p-4">
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">Note: </span>{ev.note}
            </p>
          </div>
        )}

        {/* Range Impact Summary */}
        <section className="mb-8">
          <h2 className="mb-4 font-display text-xl font-bold text-text-primary">
            How Much Does Towing Reduce Range?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-bg-secondary p-5">
              <div className="mb-1 text-sm text-text-tertiary">Half max weight ({halfTow.toLocaleString()} lbs)</div>
              <div className="font-display text-3xl font-bold text-text-primary">{halfRange} mi</div>
              <div className="mt-1 text-sm text-warning">−{rangeLossHalf}% vs EPA</div>
              <div className="mt-2 text-xs text-text-tertiary">
                Typical for small/medium boat, camper, or utility trailer
              </div>
            </div>
            <div className="rounded-lg border border-border bg-bg-secondary p-5">
              <div className="mb-1 text-sm text-text-tertiary">Max weight ({ev.towLbs.toLocaleString()} lbs)</div>
              <div className="font-display text-3xl font-bold text-text-primary">{maxRange} mi</div>
              <div className="mt-1 text-sm text-error">−{rangeLossMax}% vs EPA</div>
              <div className="mt-2 text-xs text-text-tertiary">
                Maximum rated capacity — plan more frequent charging stops
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-text-tertiary">
            Formula: EPA range × (1 − 0.003 × trailer_weight_per_100_lbs). Based on SAE J2807 research
            and real-world EV towing data. Actual range varies with speed (highway towing at 65 mph
            loses more), terrain, temperature, and aerodynamics of the trailer.
          </p>
        </section>

        {/* Range Table */}
        <section className="mb-8">
          <h2 className="mb-4 font-display text-xl font-bold text-text-primary">
            Towing Range by Trailer Weight
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-secondary text-left text-xs text-text-tertiary">
                  <th className="px-4 py-3">Trailer Weight</th>
                  <th className="px-4 py-3">Est. Range</th>
                  <th className="px-4 py-3">Range Loss</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Typical Use</th>
                </tr>
              </thead>
              <tbody>
                {towWeights.map((w, i) => {
                  const range = calcTowRange(ev.epaRange, w);
                  const loss = Math.round((1 - range / ev.epaRange) * 100);
                  const useCase =
                    w <= 1000 ? 'Small utility / PWC' :
                    w <= 2000 ? 'Small pop-up camper / jet ski' :
                    w <= 3500 ? 'Mid-size boat / travel trailer' :
                    w <= 5000 ? 'Large boat / 5th wheel' :
                    w <= 7500 ? 'Horse trailer / large camper' :
                    'Heavy-duty / max capacity';
                  return (
                    <tr
                      key={w}
                      className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-bg-secondary/50'}`}
                    >
                      <td className="px-4 py-3 font-medium text-text-primary">
                        {w.toLocaleString()} lbs
                        {w === ev.towLbs && (
                          <span className="ml-2 rounded bg-accent/10 px-1.5 py-0.5 text-xs text-accent">Max</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-text-primary">{range} mi</td>
                      <td className={`px-4 py-3 ${loss >= 50 ? 'text-error' : loss >= 30 ? 'text-warning' : 'text-text-secondary'}`}>
                        −{loss}%
                      </td>
                      <td className="px-4 py-3 text-text-tertiary hidden sm:table-cell">{useCase}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Charging Strategy */}
        <section className="mb-8">
          <h2 className="mb-4 font-display text-xl font-bold text-text-primary">
            Charging Strategy While Towing
          </h2>
          <div className="space-y-4">
            {[
              {
                title: 'Plan for 30–40% shorter legs',
                body: `If your typical charging stop is every 150–200 miles, plan for 90–130 miles when towing. The ${name} with a trailer is carrying more weight and producing more aerodynamic drag.`,
              },
              {
                title: 'Charge to 80%, not 100%',
                body: 'EV charging slows significantly above 80%. For towing trips, stop at 80% and charge more frequently rather than waiting for a full charge — it\'s faster and easier on the battery.',
              },
              {
                title: `Use ${ev.dcFastKw} kW DC fast chargers when available`,
                body: `The ${name} supports up to ${ev.dcFastKw} kW charging. A 20–80% top-up takes roughly ${Math.round((ev.batteryKwh * 0.6) / (ev.dcFastKw * 0.85) * 60)} minutes. Plan breaks around meal stops to make the time useful.`,
              },
              {
                title: 'Keep speed at or below 65 mph',
                body: 'Aerodynamic drag increases with the square of speed. Towing at 75 mph vs 65 mph can reduce range by an additional 15–20%. If you\'re range-anxious on a towing trip, slowing down is the most effective strategy.',
              },
              {
                title: 'Watch gross vehicle weight (GVW)',
                body: `The ${ev.payloadLbs.toLocaleString()}-lb payload includes passengers, cargo, and tongue weight of the trailer (typically 10–15% of trailer weight). Staying under GVW is both a legal and safety requirement.`,
              },
            ].map((tip) => (
              <div key={tip.title} className="rounded-lg border border-border bg-bg-secondary p-4">
                <h3 className="mb-1 font-semibold text-text-primary">{tip.title}</h3>
                <p className="text-sm text-text-secondary">{tip.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Compare with other towable EVs */}
        <section className="mb-8">
          <h2 className="mb-4 font-display text-xl font-bold text-text-primary">
            Compare to Other Towable EVs
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-secondary text-left text-xs text-text-tertiary">
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Max Tow</th>
                  <th className="px-4 py-3">EPA Range</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Tow Range (50%)</th>
                </tr>
              </thead>
              <tbody>
                {TOW_EVS.filter((e) => Math.abs(e.towLbs - ev.towLbs) <= 3000 || e.slug === slug)
                  .slice(0, 6)
                  .map((e, i) => (
                    <tr
                      key={e.slug}
                      className={`border-b border-border last:border-0 ${e.slug === slug ? 'bg-accent/5' : i % 2 === 0 ? '' : 'bg-bg-secondary/50'}`}
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/vehicles/${e.slug}/towing`}
                          className={`font-medium hover:underline ${e.slug === slug ? 'text-accent' : 'text-text-primary'}`}
                        >
                          {e.year} {e.make} {e.model}
                          {e.slug === slug && <span className="ml-1 text-xs text-text-tertiary">(this vehicle)</span>}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-text-primary">{e.towLbs.toLocaleString()} lbs</td>
                      <td className="px-4 py-3 text-text-primary">{e.epaRange} mi</td>
                      <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">
                        ~{calcTowRange(e.epaRange, Math.round(e.towLbs * 0.5))} mi
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-right">
            <Link href="/ev-towing" className="text-sm text-accent hover:underline">
              See all towable EVs →
            </Link>
          </p>
        </section>

        {/* Related tools */}
        <section className="border-t border-border pt-8">
          <h2 className="mb-3 font-display text-lg font-bold text-text-primary">Related Tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/ev-towing" className="text-sm text-accent hover:underline">EV Towing Guide</Link>
            <Link href={`/vehicles/${slug}`} className="text-sm text-accent hover:underline">{name} Full Specs</Link>
            <Link href="/calculator" className="text-sm text-accent hover:underline">EV Range Calculator</Link>
            <Link href="/ev-depreciation-calculator" className="text-sm text-accent hover:underline">EV Depreciation</Link>
            <Link href="/tco-calculator" className="text-sm text-accent hover:underline">Total Cost of Ownership</Link>
          </div>
        </section>
      </div>
    </>
  );
}
