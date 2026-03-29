import type { Metadata } from 'next';
import Link from 'next/link';
import ChargingNetworksTool from './components/ChargingNetworksTool';

// ─── Metadata ────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'EV Charging Network Comparison 2026 — Pricing, Coverage & Reliability',
  description:
    'Compare Tesla Supercharger, Electrify America, ChargePoint, EVgo, and more. Side-by-side pricing, reliability, app ratings, and EV connector compatibility.',
  alternates: { canonical: '/charging-networks' },
  openGraph: {
    title: 'EV Charging Network Comparison 2026 — Pricing, Coverage & Reliability',
    description:
      'Compare Tesla Supercharger, Electrify America, ChargePoint, EVgo, and more. Side-by-side pricing, reliability, app ratings, and EV connector compatibility.',
    url: '/charging-networks',
    type: 'article',
  },
};

// ─── Static network data ─────────────────────────────────────────────────────
interface Network {
  name: string;
  slug: string;
  pricingL2: number | null;
  pricingDcfc: number | null;
  pricingPerMin: number | null;
  pricingNotes: string;
  membershipName: string | null;
  membershipMonthly: number | null;
  connectors: string[];
  usStations: number;
  usPorts: number;
  reliability: number;
  maxSpeedKw: number;
  appIos: number | null;
  appAndroid: number | null;
  plugAndCharge: boolean;
  url: string;
}

const NETWORKS: Network[] = [
  {
    name: 'Tesla Supercharger',
    slug: 'tesla-supercharger',
    pricingL2: null, pricingDcfc: 0.28, pricingPerMin: null,
    pricingNotes: 'Tesla owners: $0.25–0.35/kWh. Non-Tesla: $0.35–0.50/kWh. Magic Dock (CCS) at select locations.',
    membershipName: null, membershipMonthly: null,
    connectors: ['NACS', 'CCS1 (Magic Dock)'],
    usStations: 2200, usPorts: 26000,
    reliability: 9.2, maxSpeedKw: 250,
    appIos: 4.8, appAndroid: 4.6,
    plugAndCharge: true,
    url: 'https://www.tesla.com/supercharger',
  },
  {
    name: 'Electrify America',
    slug: 'electrify-america',
    pricingL2: 0.48, pricingDcfc: 0.43, pricingPerMin: null,
    pricingNotes: 'Pass+ members: $0.36/kWh. Free sessions included with some VW/Audi/Porsche EVs.',
    membershipName: 'Pass+', membershipMonthly: 4.00,
    connectors: ['CCS1', 'CHAdeMO', 'J1772'],
    usStations: 900, usPorts: 4000,
    reliability: 7.4, maxSpeedKw: 350,
    appIos: 3.9, appAndroid: 3.7,
    plugAndCharge: false,
    url: 'https://www.electrifyamerica.com',
  },
  {
    name: 'ChargePoint',
    slug: 'chargepoint',
    pricingL2: 0.30, pricingDcfc: 0.35, pricingPerMin: 0.10,
    pricingNotes: 'Pricing set by station owner. Widest L2 network in North America.',
    membershipName: 'ChargePoint+', membershipMonthly: 4.99,
    connectors: ['J1772', 'CCS1', 'CHAdeMO'],
    usStations: 38000, usPorts: 68000,
    reliability: 7.8, maxSpeedKw: 62,
    appIos: 4.4, appAndroid: 4.2,
    plugAndCharge: false,
    url: 'https://www.chargepoint.com',
  },
  {
    name: 'EVgo',
    slug: 'evgo',
    pricingL2: 0.35, pricingDcfc: 0.36, pricingPerMin: null,
    pricingNotes: 'EVgo Plus: $0.26/kWh. Largest public DCFC-only network in US. NACS adapters at select sites.',
    membershipName: 'EVgo Plus', membershipMonthly: 7.99,
    connectors: ['CCS1', 'CHAdeMO', 'NACS'],
    usStations: 1000, usPorts: 3200,
    reliability: 7.6, maxSpeedKw: 350,
    appIos: 4.2, appAndroid: 4.0,
    plugAndCharge: true,
    url: 'https://www.evgo.com',
  },
  {
    name: 'Blink',
    slug: 'blink',
    pricingL2: 0.39, pricingDcfc: 0.48, pricingPerMin: null,
    pricingNotes: 'IQ 200 members: $0.20/kWh L2, $0.30/kWh DCFC. Non-member rates are high.',
    membershipName: 'Blink Plus', membershipMonthly: 4.99,
    connectors: ['J1772', 'CCS1', 'CHAdeMO'],
    usStations: 6500, usPorts: 15000,
    reliability: 6.2, maxSpeedKw: 80,
    appIos: 3.5, appAndroid: 3.3,
    plugAndCharge: false,
    url: 'https://www.blinkcharging.com',
  },
  {
    name: 'Volta',
    slug: 'volta',
    pricingL2: 0.00, pricingDcfc: null, pricingPerMin: null,
    pricingNotes: 'Free L2 charging at retail/grocery locations (ad-supported). Limited locations.',
    membershipName: null, membershipMonthly: null,
    connectors: ['J1772'],
    usStations: 3000, usPorts: 5000,
    reliability: 6.8, maxSpeedKw: 25,
    appIos: 3.8, appAndroid: 3.6,
    plugAndCharge: false,
    url: 'https://www.voltacharging.com',
  },
  {
    name: 'FLO',
    slug: 'flo',
    pricingL2: 0.29, pricingDcfc: 0.39, pricingPerMin: null,
    pricingNotes: 'FLO+ members: $0.18/kWh L2. Primarily northeastern US and Canada.',
    membershipName: 'FLO+', membershipMonthly: 4.99,
    connectors: ['J1772', 'CCS1'],
    usStations: 100, usPorts: 400,
    reliability: 7.5, maxSpeedKw: 62,
    appIos: 4.1, appAndroid: 3.9,
    plugAndCharge: false,
    url: 'https://www.flo.com',
  },
  {
    name: 'Rivian Adventure Network',
    slug: 'rivian-adventure',
    pricingL2: null, pricingDcfc: 0.32, pricingPerMin: null,
    pricingNotes: 'Rivian R1T/R1S owners only. Key destination charging at national parks, trailheads.',
    membershipName: 'Rivian Membership', membershipMonthly: null,
    connectors: ['NACS'],
    usStations: 100, usPorts: 600,
    reliability: 8.8, maxSpeedKw: 200,
    appIos: 4.5, appAndroid: 4.3,
    plugAndCharge: true,
    url: 'https://stories.rivian.com/adventure-network',
  },
  {
    name: 'Shell Recharge',
    slug: 'shell-recharge',
    pricingL2: 0.30, pricingDcfc: 0.40, pricingPerMin: null,
    pricingNotes: 'Shell Recharge membership available. Located at Shell gas stations.',
    membershipName: 'Shell Recharge', membershipMonthly: 4.00,
    connectors: ['J1772', 'CCS1', 'CHAdeMO'],
    usStations: 400, usPorts: 1200,
    reliability: 6.5, maxSpeedKw: 62,
    appIos: 3.8, appAndroid: 3.7,
    plugAndCharge: false,
    url: 'https://shellrecharge.com/en-us',
  },
];

// ─── EV compatibility data ───────────────────────────────────────────────────
type ConnectorType = 'NACS' | 'CCS1' | 'CHAdeMO' | 'J1772';
interface EVCompat {
  name: string;
  native: ConnectorType;
  canUseNacs: boolean;
  canUseCcs: boolean;
  canUseChademo: boolean;
}

const EV_COMPAT: EVCompat[] = [
  { name: 'Tesla (all models)',     native: 'NACS',    canUseNacs: true,  canUseCcs: true,  canUseChademo: false },
  { name: 'Ford (2023+)',           native: 'NACS',    canUseNacs: true,  canUseCcs: true,  canUseChademo: false },
  { name: 'Rivian (2025+)',         native: 'NACS',    canUseNacs: true,  canUseCcs: true,  canUseChademo: false },
  { name: 'GM / Chevy / GMC 2025+',native: 'NACS',    canUseNacs: true,  canUseCcs: true,  canUseChademo: false },
  { name: 'Hyundai IONIQ 5/6 (2024+)', native: 'NACS', canUseNacs: true, canUseCcs: true,  canUseChademo: false },
  { name: 'Kia EV6/EV9 (2024+)',   native: 'NACS',    canUseNacs: true,  canUseCcs: true,  canUseChademo: false },
  { name: 'VW ID.4',               native: 'CCS1',    canUseNacs: false, canUseCcs: true,  canUseChademo: false },
  { name: 'BMW i4 / iX',           native: 'CCS1',    canUseNacs: false, canUseCcs: true,  canUseChademo: false },
  { name: 'Audi e-tron / Q8',      native: 'CCS1',    canUseNacs: false, canUseCcs: true,  canUseChademo: false },
  { name: 'Nissan LEAF (40/62 kWh)',native: 'CHAdeMO', canUseNacs: false, canUseCcs: false, canUseChademo: true },
  { name: 'Lucid Air',             native: 'CCS1',    canUseNacs: false, canUseCcs: true,  canUseChademo: false },
  { name: 'Polestar 2',            native: 'CCS1',    canUseNacs: false, canUseCcs: true,  canUseChademo: false },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function reliabilityColor(r: number): string {
  if (r >= 8.5) return 'text-green-400';
  if (r >= 7.0) return 'text-yellow-400';
  return 'text-red-400';
}

// ─── JSON-LD ─────────────────────────────────────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'EV Charging Network Comparison 2026 — Pricing, Coverage & Reliability',
      url: 'https://evrangetools.com/charging-networks',
      author: { '@type': 'Organization', name: 'EV Range Tools' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://evrangetools.com' },
        { '@type': 'ListItem', position: 2, name: 'Charging Networks', item: 'https://evrangetools.com/charging-networks' },
      ],
    },
  ],
};

// ─── Page (Server Component) ─────────────────────────────────────────────────
export default function ChargingNetworksPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-text-secondary">Home</Link>
          <span>/</span>
          <span className="text-text-primary">Charging Networks</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            EV Charging Network Comparison
          </h1>
          <p className="mt-3 text-text-secondary">
            Side-by-side pricing, coverage, reliability, and app ratings for every major US public charging network —
            plus a cost-to-charge calculator and connector compatibility guide.
          </p>
        </div>

        {/* ─── Interactive cost-to-charge calculator (client component) ──── */}
        <ChargingNetworksTool />

        {/* ─── Full comparison table (static, server-rendered) ─────────── */}
        <h2 className="mb-4 font-display text-lg font-bold text-text-primary">Full Network Comparison</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-tertiary text-xs text-text-secondary">
                <th className="px-4 py-3 text-left">Network</th>
                <th className="px-4 py-3 text-right">L2 $/kWh</th>
                <th className="px-4 py-3 text-right">DCFC $/kWh</th>
                <th className="px-4 py-3 text-right">US Stations</th>
                <th className="px-4 py-3 text-right">US Ports</th>
                <th className="px-4 py-3 text-center">Reliability</th>
                <th className="px-4 py-3 text-right">Max kW</th>
                <th className="px-4 py-3 text-center">App (iOS)</th>
                <th className="px-4 py-3 text-center">Connectors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {NETWORKS.map(n => (
                <tr key={n.slug} className="hover:bg-bg-secondary/50">
                  <td className="px-4 py-3">
                    <a href={n.url} target="_blank" rel="noopener noreferrer"
                      className="font-semibold text-text-primary hover:text-accent">{n.name}</a>
                    {n.membershipName && (
                      <div className="text-xs text-text-tertiary">
                        {n.membershipName}{n.membershipMonthly !== null ? ` $${n.membershipMonthly}/mo` : ' (free)'}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-text-secondary">
                    {n.pricingL2 !== null ? (n.pricingL2 === 0 ? <span className="text-green-400">FREE</span> : `$${n.pricingL2.toFixed(2)}`) : '\u2014'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-text-secondary">
                    {n.pricingDcfc !== null ? `$${n.pricingDcfc.toFixed(2)}` : '\u2014'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{n.usStations.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-text-secondary">{n.usPorts.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-mono font-bold ${reliabilityColor(n.reliability)}`}>{n.reliability}/10</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-text-secondary">{n.maxSpeedKw}</td>
                  <td className="px-4 py-3 text-center font-mono text-text-secondary">
                    {n.appIos !== null ? `${n.appIos}\u2605` : '\u2014'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {n.connectors.map(c => (
                        <span key={c} className="rounded bg-bg-tertiary px-1.5 py-0.5 text-xs text-text-secondary">{c}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-text-tertiary">
          Pricing as of 2026. Reliability scores based on PlugShare user reports and network uptime data. App ratings from App Store/Google Play.
        </p>

        {/* ─── Compatibility matrix (static, server-rendered) ──────────── */}
        <div className="mt-10">
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">
            EV Connector Compatibility Guide
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-tertiary text-xs text-text-secondary">
                  <th className="px-4 py-3 text-left">Vehicle</th>
                  <th className="px-4 py-3 text-center">Native Port</th>
                  <th className="px-4 py-3 text-center">Tesla / NACS</th>
                  <th className="px-4 py-3 text-center">CCS1 (EA, EVgo, Blink)</th>
                  <th className="px-4 py-3 text-center">CHAdeMO</th>
                  <th className="px-4 py-3 text-center">J1772 (L2)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {EV_COMPAT.map(ev => (
                  <tr key={ev.name} className="hover:bg-bg-secondary/50">
                    <td className="px-4 py-3 font-medium text-text-primary">{ev.name}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="rounded bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">{ev.native}</span>
                    </td>
                    <td className="px-4 py-3 text-center">{ev.canUseNacs ? '\u2705' : '\u274C'}</td>
                    <td className="px-4 py-3 text-center">{ev.canUseCcs ? '\u2705' : '\u274C'}</td>
                    <td className="px-4 py-3 text-center">{ev.canUseChademo ? '\u2705' : '\u274C'}</td>
                    <td className="px-4 py-3 text-center">{'\u2705'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-text-tertiary">
            All EVs can use J1772 L2 stations natively or via included adapter. NACS-native vehicles use a CCS1 adapter (often included or available from manufacturer) at CCS-only DCFC stations.
          </p>
        </div>

        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-3 font-display text-lg font-bold text-text-primary">Related Tools</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/charging-cost-calculator" className="text-sm text-accent hover:underline">Charging Cost Calculator</Link>
            <Link href="/charging-schedule" className="text-sm text-accent hover:underline">Optimal Charging Schedule</Link>
            <Link href="/apartment-ev-charging" className="text-sm text-accent hover:underline">Apartment EV Charging Guide</Link>
            <Link href="/find-my-ev" className="text-sm text-accent hover:underline">Find My EV</Link>
          </div>
        </section>
      </div>
    </>
  );
}
