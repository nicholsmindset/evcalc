import type { Metadata } from 'next';
import Link from 'next/link';
import InstallationCalcContent from './InstallationCalcContent';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { FAQSection } from '@/components/seo/FAQSection';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { generateWebApplicationSchema, generateBreadcrumbSchema } from '@/lib/utils/seo';
import { calcInstallationCosts, type InstallationInputs } from '@/lib/calculations/installation';

export const metadata: Metadata = {
  title: 'EV Charger Installation Cost Calculator | Labor, Permit & Panel',
  description: 'Estimate home EV charger installation costs with editable labor and permit budgets. Compare wiring distance and panel upgrades, with clear hardware exclusions.',
  alternates: { canonical: '/charger-installation-cost' },
  openGraph: {
    title: 'EV Charger Installation Cost Calculator',
    description: 'Build an itemized installation budget using your electrician rate, wiring distance and electrical setup.',
    url: '/charger-installation-cost',
    type: 'website',
  },
};

const FAQS = [
  { question: 'How much does home EV charger installation cost?', answer: 'The price depends on the wiring route, available electrical capacity, permits and local labor. Tesla publishes an installation estimate of $750–$1,500 for its Wall Connector, excluding the separately listed charger. Complex work can cost more. This tool produces an illustrative budget; use an electrician quote for your property.' },
  { question: 'Does this estimate include the charger itself?', answer: 'No. It includes modeled circuit labor, wire and conduit, breaker materials, permits and an optional panel-upgrade allowance. Add charger hardware, sales tax, trenching, wall repairs and any utility service work separately. Check whether these are included in an installer package.' },
  { question: 'Do I need a 200-amp panel?', answer: 'Panel rating alone does not determine whether an EV charger will fit. An electrician must assess existing loads, service capacity, the charger setting and any approved load-management equipment. A lower charging current may be sufficient for overnight charging.' },
  { question: 'Can I use an existing 240V outlet?', answer: 'Only if the equipment manufacturer permits that connection and an electrician confirms the outlet, circuit and wiring are suitable. For charger settings above 40A, this estimator budgets new hardwired circuit work instead of a simple plug-in installation.' },
  { question: 'Is a federal charger credit deducted?', answer: 'No. The residential federal credit applied only to qualifying property placed in service by June 30, 2026. Check the IRS rules for a historical claim, and verify any current utility rebate with the program administrator.' },
];

const EXAMPLES: Array<{ name: string; inputs: InstallationInputs }> = [
  { name: 'Short new circuit', inputs: { stateCode: 'TX', laborRate: 85, permitCost: 100, existingElectrical: 'has_200a_panel', garageType: 'attached', panelDistance: 25, chargerAmperage: 40 } },
  { name: 'Longer wiring run', inputs: { stateCode: 'CA', laborRate: 135, permitCost: 200, existingElectrical: 'has_200a_panel', garageType: 'attached', panelDistance: 75, chargerAmperage: 48 } },
  { name: 'Confirmed panel upgrade', inputs: { stateCode: 'CA', laborRate: 135, permitCost: 200, existingElectrical: 'needs_panel_upgrade', garageType: 'attached', panelDistance: 25, chargerAmperage: 48 } },
];

export default function ChargerInstallationCostPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <SchemaMarkup schema={[
        generateWebApplicationSchema('EV Charger Installation Cost Calculator', 'Estimate a home charger installation budget with editable local costs.', 'https://www.evrangetools.com/charger-installation-cost'),
        generateBreadcrumbSchema([{ name: 'Home', href: '/' }, { name: 'EV Charger Installation Cost', href: '/charger-installation-cost' }]),
      ]} />
      <nav className="mb-4 text-sm text-text-tertiary"><Link href="/" className="hover:text-accent">Home</Link> / EV Charger Installation Cost</nav>
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-text-primary sm:text-4xl">EV Charger Installation Cost Calculator</h1>
        <p className="mt-3 max-w-3xl text-text-secondary">Build an itemized budget for a home Level 2 charger installation. Set your electrician rate, permit budget, wire distance and electrical setup. Charger hardware is priced separately.</p>
      </header>
      <InstallationCalcContent />
      <section className="my-12 space-y-4 text-text-secondary">
        <h2 className="text-2xl font-display font-bold text-text-primary">What should you budget?</h2>
        <p><a href="https://www.tesla.com/support/charging/home-charging" className="text-accent hover:underline">Tesla’s home-charging guide</a> lists $750–$1,500 as an estimated Wall Connector installation cost, with equipment priced separately. This is a manufacturer benchmark, not a national average or a quote for your home. Longer wiring runs, trenching and electrical upgrades can increase the cost.</p>
        <h2 className="pt-4 text-2xl font-display font-bold text-text-primary">Three example installation budgets</h2>
        <p>These examples use the calculator’s assumptions and are not completed-project quotes. All assume an attached garage. Each total excludes charger hardware and the additional work listed below.</p>
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr><th className="py-3 text-left">Scenario</th><th className="text-left">Inputs</th><th className="text-right">Modeled installation</th></tr></thead><tbody>{EXAMPLES.map(({ name, inputs }) => {
          const cost = calcInstallationCosts(inputs);
          return <tr key={name} className="border-t border-border"><td className="py-4 pr-4">{name}</td><td className="pr-4">{inputs.panelDistance} ft; ${inputs.laborRate}/hr; ${inputs.permitCost} permit</td><td className="text-right">${cost.total.low.toLocaleString()}–${cost.total.high.toLocaleString()}</td></tr>;
        })}</tbody></table></div>
      </section>
      <section id="methodology" className="my-12 space-y-4 text-text-secondary">
        <h2 className="text-2xl font-display font-bold text-text-primary">Assumptions and exclusions</h2>
        <p>State defaults are illustrative budget inputs, not verified local market averages. Replace them with your installer rate and local permit fee. The model allows 2–4 labor hours for a new circuit; unknown electrical setups allow 2–5. A suitable existing connection at up to 40A allows 1–2 hours.</p>
        <p>Materials start at $2.50 per foot for a wire-and-conduit allowance, with a 20% upper buffer, and $75–$98 for breaker materials. Detached garages add a 30-foot wiring allowance. Actual wire size and routing are determined by your installer; these are budgeting assumptions, not a materials shopping list.</p>
        <p>A confirmed panel upgrade adds a $1,500–$3,000 allowance to the circuit installation budget. This is not automatically required for a 100A panel. The estimate does not model utility service upgrades, trench excavation, wall repairs, pedestal installation, taxes or charger hardware.</p>
        <p>Ask for a written quote showing hardware, permits and inspections, the wiring route, electrical capacity assessment, any load management, and the scope of panel work. Compare the same scope across quotes.</p>
        <p>Electrical compatibility should be checked against the equipment instructions. <a href="https://www.tesla.com/support/charging/wall-connector" className="text-accent hover:underline">Tesla’s Wall Connector table</a>, for example, pairs a 60A circuit with a maximum 48A charging output.</p>
        <p className="text-sm">Source guidance reviewed October 5, 2026. See <a href="https://www.irs.gov/credits-deductions/alternative-fuel-vehicle-refueling-property-credit" className="text-accent hover:underline">IRS residential charger-credit rules</a> for historical eligibility and deadlines.</p>
      </section>
      <FAQSection faqs={FAQS} />
      <RelatedTools tools={[
        { href: '/ev-rebates', emoji: '💵', label: 'Utility Rebates', desc: 'Check utility program details and current terms' },
        { href: '/calculator', emoji: '📊', label: 'EV Range Calculator', desc: 'Estimate driving range under different conditions' },
        { href: '/charging-cost-calculator', emoji: '🔋', label: 'Charging Cost Calculator', desc: 'Estimate electricity costs for charging' },
      ]} />
    </div>
  );
}
