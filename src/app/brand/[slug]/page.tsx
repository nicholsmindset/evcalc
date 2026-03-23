import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getVehicles } from '@/lib/supabase/queries/vehicles';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { generateBreadcrumbSchema } from '@/lib/utils/seo';
import type { Vehicle } from '@/lib/supabase/types';

export const revalidate = 604800;

interface BrandConfig {
  displayName: string;
  description: string;
  headquarters: string;
  evStrategy: string;
}

const BRANDS: Record<string, BrandConfig> = {
  // === Original brands ===
  tesla: {
    displayName: 'Tesla',
    description: 'Tesla pioneered the modern electric vehicle market. From the Model S to the Cybertruck, Tesla offers the widest range of EVs with industry-leading software and the Supercharger network.',
    headquarters: 'Austin, TX',
    evStrategy: 'Pure EV manufacturer since 2003. Vertically integrated with proprietary battery cells, Supercharger network, and Autopilot/FSD software.',
  },
  hyundai: {
    displayName: 'Hyundai',
    description: 'Hyundai has rapidly become a top EV manufacturer with the Ioniq lineup built on the advanced 800V E-GMP platform, delivering class-leading charging speeds.',
    headquarters: 'Seoul, South Korea',
    evStrategy: '800V E-GMP dedicated platform. Targeting 17 EV models by 2030 with industry-best charging speeds and competitive pricing.',
  },
  kia: {
    displayName: 'Kia',
    description: 'Kia shares Hyundai\'s E-GMP platform and delivers sporty, well-designed EVs. The EV6 won World Car of the Year, and the EV9 brings electric three-row luxury.',
    headquarters: 'Seoul, South Korea',
    evStrategy: 'Shares 800V E-GMP platform with Hyundai. Plans 14 EV models by 2027 with a focus on design and performance.',
  },
  ford: {
    displayName: 'Ford',
    description: 'Ford brings American muscle to the EV era with the Mustang Mach-E crossover and F-150 Lightning pickup, combining familiar nameplates with electric performance.',
    headquarters: 'Dearborn, MI',
    evStrategy: 'Leveraging iconic nameplates (Mustang, F-150) for EV transition. Investing $50B+ in EVs through 2026.',
  },
  chevrolet: {
    displayName: 'Chevrolet',
    description: 'Chevrolet is making EVs accessible with the affordable Equinox EV and Blazer EV built on GM\'s Ultium platform, targeting mainstream buyers.',
    headquarters: 'Detroit, MI',
    evStrategy: 'GM\'s Ultium platform powers a wide range of EVs across price points. Focus on affordable, high-volume EVs.',
  },
  bmw: {
    displayName: 'BMW',
    description: 'BMW combines traditional luxury craftsmanship with electric performance. The iX and i4 deliver premium driving dynamics with impressive efficiency.',
    headquarters: 'Munich, Germany',
    evStrategy: 'Flexible CLAR platform supports both ICE and EV. Neue Klasse dedicated EV platform launching 2025-2026.',
  },
  rivian: {
    displayName: 'Rivian',
    description: 'Rivian builds adventure-ready electric trucks and SUVs. The R1T and R1S combine off-road capability with premium EV technology.',
    headquarters: 'Irvine, CA',
    evStrategy: 'Adventure-focused pure EV manufacturer. R1 platform for premium models, R2 platform for mass market launching 2026.',
  },
  mercedes: {
    displayName: 'Mercedes-Benz',
    description: 'Mercedes-Benz brings S-Class luxury to the electric era with the EQS, EQE, and EQB lineup, featuring the MBUX Hyperscreen and industry-leading interiors.',
    headquarters: 'Stuttgart, Germany',
    evStrategy: 'EVA2 platform for current models, MMA platform for next-generation. Targeting fully electric lineup by 2030.',
  },
  volkswagen: {
    displayName: 'Volkswagen',
    description: 'Volkswagen is making EVs accessible globally with the ID lineup built on the dedicated MEB platform, offering practical range and competitive pricing.',
    headquarters: 'Wolfsburg, Germany',
    evStrategy: 'Dedicated MEB EV platform. Massive investment in EV production with goal of becoming #1 EV brand globally.',
  },
  nissan: {
    displayName: 'Nissan',
    description: 'Nissan was an EV pioneer with the Leaf and continues with the Ariya crossover, bringing decades of electric driving experience to modern designs.',
    headquarters: 'Yokohama, Japan',
    evStrategy: 'EV pioneer since 2010 Leaf launch. CMF-EV platform for new models, targeting 15 EVs by 2030.',
  },
  polestar: {
    displayName: 'Polestar',
    description: 'Polestar is Volvo\'s performance EV brand, delivering Scandinavian design with exhilarating driving dynamics and cutting-edge safety technology.',
    headquarters: 'Gothenburg, Sweden',
    evStrategy: 'Pure performance EV brand. Built on Volvo platforms with focus on sustainability and driving engagement.',
  },
  // === Existing brands that were missing configs ===
  audi: {
    displayName: 'Audi',
    description: 'Audi brings quattro heritage to the electric era with the e-tron lineup, combining Vorsprung durch Technik engineering with premium luxury and all-wheel-drive capability.',
    headquarters: 'Ingolstadt, Germany',
    evStrategy: 'PPE platform co-developed with Porsche for next-gen models. Targeting 20+ EV models by 2025.',
  },
  cadillac: {
    displayName: 'Cadillac',
    description: 'Cadillac leads GM\'s luxury EV push with the stunning LYRIQ crossover and the massive Escalade IQ, built on the Ultium platform.',
    headquarters: 'Detroit, MI',
    evStrategy: 'GM Ultium platform. First luxury brand to go all-electric by 2030. LYRIQ, Escalade IQ, and CELESTIQ flagship.',
  },
  genesis: {
    displayName: 'Genesis',
    description: 'Genesis combines Korean engineering with luxury design in the Electrified lineup, sharing Hyundai\'s 800V E-GMP platform with premium refinement.',
    headquarters: 'Seoul, South Korea',
    evStrategy: '800V E-GMP platform shared with Hyundai/Kia. Entire lineup to be electric or hydrogen by 2030.',
  },
  honda: {
    displayName: 'Honda',
    description: 'Honda enters the EV market with the Prologue, co-developed with GM on the Ultium platform, bringing Honda reliability to electric driving.',
    headquarters: 'Tokyo, Japan',
    evStrategy: 'GM Ultium-based Prologue as bridge. Developing own 0 Series EV platform launching 2026.',
  },
  lexus: {
    displayName: 'Lexus',
    description: 'Lexus brings Toyota\'s hybrid expertise to full electric with the RZ, delivering signature Lexus craftsmanship in a battery-electric SUV.',
    headquarters: 'Nagoya, Japan',
    evStrategy: 'e-TNGA platform shared with Toyota. Planning full EV lineup by 2030 with focus on luxury and performance.',
  },
  lucid: {
    displayName: 'Lucid',
    description: 'Lucid Motors builds the most efficient luxury EVs on the market. The Lucid Air holds the longest EPA range of any EV at 516 miles.',
    headquarters: 'Newark, CA',
    evStrategy: 'In-house powertrain technology delivers industry-leading efficiency. Lucid Air and Gravity SUV on proprietary platform.',
  },
  mini: {
    displayName: 'MINI',
    description: 'MINI electrifies its iconic city car heritage with the Cooper SE, bringing fun-to-drive character to zero-emission urban mobility.',
    headquarters: 'Oxford, UK',
    evStrategy: 'Transitioning to all-electric by 2030. Compact EVs focused on urban driving and brand heritage.',
  },
  porsche: {
    displayName: 'Porsche',
    description: 'Porsche proves performance and electric power are a perfect match. The Taycan delivers supercar acceleration with daily usability.',
    headquarters: 'Stuttgart, Germany',
    evStrategy: 'PPE platform with Audi. Taycan platform for sports cars, Macan Electric for SUVs. Over 80% of sales to be electric by 2030.',
  },
  subaru: {
    displayName: 'Subaru',
    description: 'Subaru brings its all-wheel-drive expertise to electric with the Solterra, co-developed with Toyota for adventure-ready EV capability.',
    headquarters: 'Tokyo, Japan',
    evStrategy: 'e-Subaru Global Platform co-developed with Toyota. Solterra as first BEV, more models planned through 2028.',
  },
  toyota: {
    displayName: 'Toyota',
    description: 'Toyota, the hybrid pioneer, enters the BEV market with the bZ4X crossover, bringing decades of electrification experience to battery-electric vehicles.',
    headquarters: 'Toyota City, Japan',
    evStrategy: 'Multi-pathway approach: BEV, PHEV, FCEV. bZ series on e-TNGA platform. 10 BEV models by 2026.',
  },
  volvo: {
    displayName: 'Volvo',
    description: 'Volvo combines Scandinavian design with industry-leading safety in the EX30 and EX90, aiming to be a fully electric brand by 2030.',
    headquarters: 'Gothenburg, Sweden',
    evStrategy: 'Fully electric by 2030. SPA2 platform for large EVs, SEA platform for compact. Safety-first approach to EVs.',
  },
  acura: {
    displayName: 'Acura',
    description: 'Acura enters the EV space with the ZDX, co-developed with GM on the Ultium platform, bringing precision-crafted performance to electric luxury.',
    headquarters: 'Tokyo, Japan',
    evStrategy: 'GM Ultium-based ZDX as first BEV. Developing own dedicated EV platform for future models.',
  },
  fiat: {
    displayName: 'FIAT',
    description: 'FIAT electrifies its beloved 500 with the 500e, delivering Italian style and urban agility in a fun, zero-emission city car.',
    headquarters: 'Turin, Italy',
    evStrategy: 'Part of Stellantis EV push. 500e leads the transition. Full lineup to be electric by 2030 in Europe.',
  },
  // === New international brands ===
  byd: {
    displayName: 'BYD',
    description: 'BYD is the world\'s largest electric vehicle manufacturer, offering a wide range of affordable to premium EVs with proprietary Blade Battery technology.',
    headquarters: 'Shenzhen, China',
    evStrategy: 'Vertically integrated: own batteries (Blade Battery), chips, and motors. Global expansion into 70+ markets. Ocean and Dynasty series.',
  },
  mg: {
    displayName: 'MG',
    description: 'MG (owned by SAIC Motor) has become Europe\'s best-selling Chinese EV brand, offering compelling value with the MG4 EV and ZS EV.',
    headquarters: 'Shanghai, China',
    evStrategy: 'Aggressive global expansion with affordable EVs. MEB-competitive pricing on MSP platform. Targeting volume EV leadership in Europe.',
  },
  nio: {
    displayName: 'NIO',
    description: 'NIO is a premium Chinese EV maker pioneering Battery-as-a-Service (BaaS) with battery swap technology, offering flagship sedans and SUVs.',
    headquarters: 'Shanghai, China',
    evStrategy: 'Battery swap stations for instant "recharging". Premium positioning with NIO House community. Expanding into Europe.',
  },
  xpeng: {
    displayName: 'XPeng',
    description: 'XPeng builds smart electric vehicles with industry-leading autonomous driving technology, combining cutting-edge tech with attractive design.',
    headquarters: 'Guangzhou, China',
    evStrategy: 'AI and autonomous driving focus. XNGP advanced driver assistance. Ultra-fast 800V charging on S4 platform.',
  },
  vinfast: {
    displayName: 'VinFast',
    description: 'VinFast is Vietnam\'s first global automaker, rapidly expanding into North America and Europe with a full lineup of electric SUVs.',
    headquarters: 'Hai Phong, Vietnam',
    evStrategy: 'All-electric from inception. Manufacturing in Vietnam and North Carolina. VF lineup from compact to full-size SUV.',
  },
  jaguar: {
    displayName: 'Jaguar',
    description: 'Jaguar was an early luxury EV entrant with the I-PACE and is relaunching as an all-electric ultra-luxury brand with dramatic new designs.',
    headquarters: 'Coventry, UK',
    evStrategy: 'Complete brand relaunch as all-electric ultra-luxury. New JEA platform for 2025+ models. I-PACE as current offering.',
  },
  lotus: {
    displayName: 'Lotus',
    description: 'Lotus brings legendary lightweight sports car engineering to the electric era with the Eletre hyper-SUV, combining performance with everyday usability.',
    headquarters: 'Hethel, UK',
    evStrategy: 'Geely-backed transformation. Eletre SUV, Emeya GT sedan, and future electric sports cars on EPA platform.',
  },
  'rolls-royce': {
    displayName: 'Rolls-Royce',
    description: 'Rolls-Royce enters the electric era with the Spectre, delivering the signature "magic carpet ride" with the effortless torque of electric power.',
    headquarters: 'Goodwood, UK',
    evStrategy: 'Fully electric by 2030. Spectre as first BEV. Architecture of Luxury platform designed for electrification.',
  },
  cupra: {
    displayName: 'Cupra',
    description: 'Cupra is SEAT\'s performance brand, offering the Born as a sporty, driver-focused electric hatchback built on VW\'s MEB platform.',
    headquarters: 'Martorell, Spain',
    evStrategy: 'VW MEB platform for Born. Developing Tavascan SUV. Positioning as accessible performance EV brand in Europe.',
  },
  smart: {
    displayName: 'Smart',
    description: 'Smart has been reborn as a Geely-Mercedes joint venture, producing stylish compact electric SUVs designed for modern urban lifestyles.',
    headquarters: 'Hangzhou, China',
    evStrategy: 'Geely SEA platform. Transitioned from microcars to compact electric SUVs. Smart #1 and #3 models.',
  },
};

export async function generateStaticParams() {
  return Object.keys(BRANDS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = BRANDS[slug];
  if (!brand) return { title: 'EV Brands' };

  return {
    title: `${brand.displayName} Electric Vehicles — Range, Specs & Pricing`,
    description: `Browse all ${brand.displayName} electric vehicles. Compare EPA range, charging speeds, pricing, and specs across the full ${brand.displayName} EV lineup.`,
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = BRANDS[slug];

  if (!brand) notFound();

  let vehicles: Vehicle[] = [];
  try {
    const all = await getVehicles();
    // Map slugs to make names where they differ
    const slugToMake: Record<string, string> = {
      mercedes: 'mercedes-benz',
      'rolls-royce': 'rolls-royce',
    };
    const makeLower = slugToMake[slug] || slug;
    vehicles = all
      .filter((v) => v.make.toLowerCase() === makeLower)
      .sort((a, b) => b.epa_range_mi - a.epa_range_mi);
  } catch {
    // Build-time safety
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SchemaMarkup
        schema={generateBreadcrumbSchema([
          { name: 'Home', href: '/' },
          { name: 'Vehicles', href: '/vehicles' },
          { name: brand.displayName, href: `/brand/${slug}` },
        ])}
      />

      <nav className="mb-8 flex items-center gap-2 text-sm text-text-tertiary">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <span>/</span>
        <Link href="/vehicles" className="hover:text-accent transition-colors">Vehicles</Link>
        <span>/</span>
        <span className="text-text-secondary">{brand.displayName}</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          {brand.displayName} Electric Vehicles
        </h1>
        <p className="mt-2 max-w-2xl text-text-secondary">{brand.description}</p>
      </div>

      {/* Brand Info */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-bg-secondary p-6 text-center">
          <p className="font-mono text-3xl font-bold text-accent">{vehicles.length}</p>
          <p className="mt-1 text-xs text-text-secondary">EV Models</p>
        </div>
        <div className="rounded-xl border border-border bg-bg-secondary p-6 text-center">
          <p className="font-mono text-3xl font-bold text-text-primary">
            {vehicles.length > 0 ? `${Math.max(...vehicles.map(v => v.epa_range_mi))} mi` : '—'}
          </p>
          <p className="mt-1 text-xs text-text-secondary">Best Range</p>
        </div>
        <div className="rounded-xl border border-border bg-bg-secondary p-6 text-center">
          <p className="text-sm font-medium text-text-primary">{brand.headquarters}</p>
          <p className="mt-1 text-xs text-text-secondary">Headquarters</p>
        </div>
      </div>

      {/* Vehicle Grid */}
      {vehicles.length > 0 ? (
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-display font-bold text-text-primary">
            All {brand.displayName} EVs
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v) => (
              <Link
                key={v.slug}
                href={`/vehicles/${v.slug}`}
                className="group rounded-xl border border-border bg-bg-secondary p-5 transition-all hover:border-accent/30"
              >
                <h3 className="font-display font-semibold text-text-primary group-hover:text-accent transition-colors">
                  {v.year} {v.make} {v.model}
                </h3>
                {v.trim && <p className="text-xs text-text-tertiary">{v.trim}</p>}
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">EPA Range</span>
                    <span className="font-mono font-semibold text-accent">{v.epa_range_mi} mi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Battery</span>
                    <span className="font-mono text-text-secondary">{v.battery_kwh} kWh</span>
                  </div>
                  {v.msrp_usd && (
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">MSRP</span>
                      <span className="font-mono font-semibold text-text-primary">{fmt(v.msrp_usd)}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <div className="mb-12 rounded-xl border border-border bg-bg-secondary p-12 text-center">
          <p className="text-text-secondary">Vehicle data loads from the database at runtime.</p>
          <Link href="/vehicles" className="mt-4 inline-block text-sm text-accent hover:underline">
            Browse all vehicles
          </Link>
        </div>
      )}

      {/* EV Strategy */}
      <section className="mb-12 rounded-xl border border-border bg-bg-secondary p-6">
        <h2 className="mb-3 text-lg font-display font-bold text-text-primary">
          {brand.displayName} EV Strategy
        </h2>
        <p className="text-sm text-text-secondary">{brand.evStrategy}</p>
      </section>

      {/* Browse More Brands */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-display font-bold text-text-primary">More EV Brands</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(BRANDS)
            .filter(([s]) => s !== slug)
            .map(([s, b]) => (
              <Link
                key={s}
                href={`/brand/${s}`}
                className="rounded-full border border-border bg-bg-secondary px-4 py-2 text-sm text-text-primary transition-all hover:border-accent/30 hover:text-accent"
              >
                {b.displayName}
              </Link>
            ))}
        </div>
      </section>

      {/* Related */}
      <section className="border-t border-border pt-12">
        <div className="flex flex-wrap gap-3">
          <Link href="/calculator" className="text-sm text-accent hover:underline">Range Calculator</Link>
          <Link href="/compare" className="text-sm text-accent hover:underline">Compare EVs</Link>
          <Link href="/vehicles" className="text-sm text-accent hover:underline">All Vehicles</Link>
          <Link href="/category/ev-suvs" className="text-sm text-accent hover:underline">Electric SUVs</Link>
          <Link href="/category/ev-sedans" className="text-sm text-accent hover:underline">Electric Sedans</Link>
        </div>
      </section>
    </div>
  );
}
