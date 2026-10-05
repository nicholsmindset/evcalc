import type { Metadata } from 'next';
import Link from 'next/link';
import ChargingNetworksTool from './components/ChargingNetworksTool';
import { FAQSection } from '@/components/seo/FAQSection';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { generateBreadcrumbSchema } from '@/lib/utils/seo';

export const metadata: Metadata = {
  title: 'EV Charging Network Comparison — Prices, Plans & Compatibility',
  description: 'Compare Tesla Supercharger, Electrify America, ChargePoint and EVgo. Check official station prices, compare membership costs, and verify vehicle compatibility.',
  alternates: { canonical: '/charging-networks' },
  openGraph: {
    title: 'EV Charging Network Comparison — Prices, Plans & Compatibility',
    description: 'Compare your local charging prices and membership costs, with official network sources and compatibility checks.',
    url: '/charging-networks', type: 'article',
  },
};

const NETWORKS = [
  { name: 'Tesla Supercharger', href: 'https://www.tesla.com/support/charging/supercharging-other-evs', pricing: 'Enter your vehicle in the Tesla app and inspect the eligible station’s session price and membership terms.', compatibility: 'Tesla distinguishes Tesla-only, Magic Dock and NACS-access sites. Access depends on the vehicle and location; use manufacturer-provided adapters where required.' },
  { name: 'Electrify America', href: 'https://www.electrifyamerica.com/pricing/', pricing: 'Prices depend on location, plan and energy delivered. Some stations use time-of-use rates. Check the app or charger screen for the session price and Pass+ terms.', compatibility: 'Check the selected station’s connector and equipment details before departure.' },
  { name: 'ChargePoint', href: 'https://www.chargepoint.com/drivers/support/faqs/what-are-pricing-policies-and-fees-i-should-be-aware', pricing: 'Station owners set charging policies. Check the full fee schedule: prices may change with time spent charging or parking.', compatibility: 'Use the individual station listing to check connector, power and site access.' },
  { name: 'EVgo', href: 'https://www.evgo.com/pricing/', pricing: 'Compare the plan options in the EVgo app. Include the monthly subscription and any session fees when evaluating a discount.', compatibility: 'Confirm the station connector and your vehicle’s supported activation method in the operator and vehicle apps.' },
];
const FAQS = [
  { question: 'Which EV charging network is cheapest?', answer: 'Compare the stations you can actually use, at the time you expect to charge. Include energy charges, session fees, monthly membership, parking, taxes and idle fees. A network-wide price cannot determine the cheapest stop for every driver.' },
  { question: 'Is a charging membership worth it?', answer: 'It depends on the energy and sessions you will use on that plan. Compare your monthly total with and without membership. In a hypothetical example, a $6 monthly fee with a $0.10/kWh discount breaks even at 60 kWh, assuming all other charges are equal.' },
  { question: 'Can a non-Tesla EV use every Supercharger?', answer: 'No. Check Tesla’s current vehicle eligibility and station map. Connector shape alone does not confirm access. Some vehicles need an approved adapter, and some sites remain restricted.' },
  { question: 'Does the comparison show live station prices?', answer: 'No. The calculator uses the values you enter. Its defaults are examples. Open the linked network source and check the selected station before charging.' },
];

export default function ChargingNetworksPage() {
  return <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
    <SchemaMarkup schema={generateBreadcrumbSchema([{ name: 'Home', href: '/' }, { name: 'Charging Networks', href: '/charging-networks' }])} />
    <nav className="mb-4 text-sm text-text-secondary"><Link href="/" className="text-accent hover:underline">Home</Link> / Charging Networks</nav>
    <h1 className="text-3xl font-display font-bold text-text-primary sm:text-4xl">EV Charging Network Comparison</h1>
    <p className="mt-3 max-w-3xl text-text-secondary">Compare the total cost and compatibility of public charging options for your route. Start with the station price in the operator’s app, then use the calculator to compare a second network or membership plan.</p>
    <p className="mt-3 text-sm text-text-tertiary">US guide · Official source guidance reviewed October 5, 2026.</p>
    <ChargingNetworksTool />
    <section className="my-10">
      <h2 className="mb-4 text-2xl font-display font-bold text-text-primary">Where to check prices and access</h2>
      <div className="overflow-x-auto rounded-xl border border-border"><table className="w-full text-sm text-text-secondary"><thead className="bg-bg-secondary"><tr><th className="p-4 text-left">Network and official source</th><th className="p-4 text-left">Price and plan checks</th><th className="p-4 text-left">Vehicle and station checks</th></tr></thead><tbody>
        {NETWORKS.map(network => <tr key={network.name} className="border-t border-border"><th className="p-4 text-left align-top"><a href={network.href} className="text-accent hover:underline">{network.name}</a></th><td className="p-4 align-top">{network.pricing}</td><td className="p-4 align-top">{network.compatibility}</td></tr>)}
      </tbody></table></div>
    </section>
    <section className="my-10 space-y-4 text-text-secondary">
      <h2 className="text-2xl font-display font-bold text-text-primary">Worked example: when a membership pays off</h2>
      <p>Suppose the same station offers $0.50/kWh without a subscription or $0.40/kWh with a $6 monthly fee. Four 50-kWh sessions cost $100 without membership and $86 with it. One session costs $25 versus $26 including that month’s fee. These are illustrative prices.</p>
      <p>With equal session fees, divide the extra monthly fee by the energy-price saving to find the break-even volume: $6 ÷ $0.10/kWh = 60 kWh per month. If the discounted rate is equal to or higher than the alternative, an added membership fee does not produce energy-cost savings.</p>
      <h2 className="pt-4 text-2xl font-display font-bold text-text-primary">Check compatibility before comparing cost</h2>
      <ol className="list-decimal space-y-2 pl-6"><li>Identify your exact model year, charge port and AC/DC charging capability from the vehicle manual.</li><li>Confirm that the chosen site supports your vehicle. Check adapter approval and network access separately.</li><li>Check cable reach, opening hours, parking rules and the payment or activation method.</li><li>Review current station status and recent driver reports, then choose a backup stop on your route.</li></ol>
      <p>A charger’s advertised peak kW does not predict your whole session. Vehicle limits, battery temperature, state of charge and power sharing affect charging speed.</p>
      <h2 className="pt-4 text-2xl font-display font-bold text-text-primary">How to compare reliability</h2>
      <p>Review the specific station and recent sessions. A useful network-wide reliability comparison needs a stated sample, measurement period and definition, such as successful charging attempts. This guide does not assign numerical reliability ratings or treat station counts as a measure of successful charging.</p>
      <p>For coverage, use the <Link href="/charging-stations" className="text-accent hover:underline">charging station finder</Link> and confirm your stops in the operator’s app. For home-versus-public costs, use the <Link href="/charging-cost-calculator" className="text-accent hover:underline">charging cost calculator</Link>.</p>
    </section>
    <FAQSection faqs={FAQS} />
  </div>;
}
