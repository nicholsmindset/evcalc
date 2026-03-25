'use client';

import { useState } from 'react';

interface Statelaw {
  code: string;
  name: string;
  hasLaw: boolean;
  summary: string;
  coversRenters: boolean;
  coversCondos: boolean;
  coversHoa: boolean;
}

const STATE_LAWS: Statelaw[] = [
  { code: 'CA', name: 'California', hasLaw: true, summary: 'Landlords cannot unreasonably deny EV charging requests. HOAs cannot prohibit charging stations. Tenant pays for installation.', coversRenters: true, coversCondos: true, coversHoa: true },
  { code: 'CO', name: 'Colorado', hasLaw: true, summary: 'HOAs may not prohibit EV charging. Renters have the right to request Level 2 EVSE. Owner may require reasonable conditions.', coversRenters: true, coversCondos: false, coversHoa: true },
  { code: 'CT', name: 'Connecticut', hasLaw: true, summary: 'Common interest communities may not prohibit EV charging. Unit owner bears all costs.', coversRenters: false, coversCondos: true, coversHoa: true },
  { code: 'FL', name: 'Florida', hasLaw: true, summary: 'Condominium and HOA associations cannot prohibit EV charging. Applies to parking areas. Unit owners bear cost.', coversRenters: false, coversCondos: true, coversHoa: true },
  { code: 'HI', name: 'Hawaii', hasLaw: true, summary: 'Landlords may not prohibit tenants from installing EV charging. HOAs may not prohibit. Tenant pays all costs.', coversRenters: true, coversCondos: true, coversHoa: true },
  { code: 'IL', name: 'Illinois', hasLaw: true, summary: 'Condo associations must allow EV charging in deeded parking spaces. Cost borne by unit owner.', coversRenters: false, coversCondos: true, coversHoa: false },
  { code: 'MA', name: 'Massachusetts', hasLaw: true, summary: 'Condo trustees cannot unreasonably withhold approval for EV charging. Unit owner bears all costs.', coversRenters: false, coversCondos: true, coversHoa: false },
  { code: 'MD', name: 'Maryland', hasLaw: true, summary: 'Electric vehicle charging rights for renters, condo owners, and HOA members. Cannot be unreasonably denied.', coversRenters: true, coversCondos: true, coversHoa: true },
  { code: 'NV', name: 'Nevada', hasLaw: true, summary: 'HOAs may not prohibit EV charging stations. Unit owner bears cost of installation and electricity.', coversRenters: false, coversCondos: false, coversHoa: true },
  { code: 'NY', name: 'New York', hasLaw: true, summary: 'Prohibits landlords from preventing EV charging in tenant-controlled parking. Tenant bears costs.', coversRenters: true, coversCondos: false, coversHoa: false },
  { code: 'OR', name: 'Oregon', hasLaw: true, summary: 'HOAs may not prohibit EV charging. Landlords cannot prohibit tenants from charging in designated parking spots.', coversRenters: true, coversCondos: false, coversHoa: true },
  { code: 'VA', name: 'Virginia', hasLaw: true, summary: 'HOAs may not prohibit EV charging stations in unit owner parking. Associations can set reasonable standards.', coversRenters: false, coversCondos: false, coversHoa: true },
  { code: 'AZ', name: 'Arizona', hasLaw: false, summary: 'No statewide right-to-charge law. Some HOA reform efforts ongoing. Recommend direct negotiation with cost-sharing proposal.', coversRenters: false, coversCondos: false, coversHoa: false },
  { code: 'GA', name: 'Georgia', hasLaw: false, summary: 'No statewide right-to-charge law. Atlanta and other cities may have local protections. Check municipal codes.', coversRenters: false, coversCondos: false, coversHoa: false },
  { code: 'MI', name: 'Michigan', hasLaw: false, summary: 'No statewide right-to-charge law. DTE and Consumers Energy have apartment EV programs. Negotiate with landlord.', coversRenters: false, coversCondos: false, coversHoa: false },
  { code: 'MN', name: 'Minnesota', hasLaw: false, summary: 'No statewide right-to-charge law. Some utilities offer apartment programs. Check with local utility.', coversRenters: false, coversCondos: false, coversHoa: false },
  { code: 'NC', name: 'North Carolina', hasLaw: false, summary: 'No statewide right-to-charge law. Duke Energy has incentive programs for multifamily properties.', coversRenters: false, coversCondos: false, coversHoa: false },
  { code: 'NJ', name: 'New Jersey', hasLaw: false, summary: 'No statewide right-to-charge law. Some municipalities have local ordinances. Check with your city or township.', coversRenters: false, coversCondos: false, coversHoa: false },
  { code: 'OH', name: 'Ohio', hasLaw: false, summary: 'No statewide right-to-charge law. AEP Ohio and other utilities may have EV programs for multifamily housing.', coversRenters: false, coversCondos: false, coversHoa: false },
  { code: 'PA', name: 'Pennsylvania', hasLaw: false, summary: 'No statewide right-to-charge law. PECO, PPL, and other utilities have apartment EV programs.', coversRenters: false, coversCondos: false, coversHoa: false },
  { code: 'TX', name: 'Texas', hasLaw: false, summary: 'No statewide right-to-charge law. HOA and landlord policies vary widely. Negotiate directly with property owner.', coversRenters: false, coversCondos: false, coversHoa: false },
  { code: 'WA', name: 'Washington', hasLaw: false, summary: 'No statewide right-to-charge law, but several bills proposed. Utilities may have programs to assist.', coversRenters: false, coversCondos: false, coversHoa: false },
];

const CHARGING_OPTIONS = [
  {
    rank: 1,
    title: 'Negotiate Level 2 in Your Parking Spot',
    cost: '$0.10–0.17/mi',
    feasibility: 'Best if allowed',
    badge: 'Cheapest option',
    badgeColor: 'bg-accent/20 text-accent',
    icon: '🏠',
    description: 'A dedicated Level 2 EVSE in your assigned parking spot is the gold standard. You pay electricity cost only (at home rates), and it\'s ready every morning.',
    pros: ['Cheapest long-term — $30-50/month for most drivers', 'Most convenient — charge while you sleep', 'Adds value to the property'],
    cons: ['Requires landlord/HOA approval', 'Upfront installation cost ($500–2,000)', 'May require electrical panel work'],
    tips: 'Use cost-sharing proposals — offer to pay for installation AND let other residents use it. Many landlords respond well to "property upgrade" framing.',
  },
  {
    rank: 2,
    title: 'Free Workplace Charging',
    cost: '$0/mi',
    feasibility: 'If available',
    badge: 'Free where offered',
    badgeColor: 'bg-info/20 text-info',
    icon: '🏢',
    description: 'Many employers offer free Level 2 charging as a benefit. If yours does, this fully covers most drivers\' needs without any home charging.',
    pros: ['Completely free in many cases', 'Charges during work hours — no schedule needed', 'No installation required'],
    cons: ['Only works if employer offers it', 'May compete with coworkers for spots', 'Doesn\'t work if you WFH'],
    tips: 'Ask your facilities or sustainability team. Many EV incentive programs (Inflation Reduction Act, state programs) subsidize workplace charger installation.',
  },
  {
    rank: 3,
    title: 'Level 2 Public Charging + Network Plan',
    cost: '$0.25–0.45/mi',
    feasibility: 'Works everywhere',
    badge: 'Most common solution',
    badgeColor: 'bg-bg-tertiary text-text-secondary',
    icon: '⚡',
    description: 'ChargePoint, EVgo, Blink, and Electrify America have Level 2 stations in parking garages, grocery stores, and retail. Get a monthly plan for lower rates.',
    pros: ['No installation needed', 'Available in most urban areas', 'Plans reduce cost to ~$0.25/kWh'],
    cons: ['2-3x more expensive than home charging', 'Requires planning and detours', 'Stations can be occupied'],
    tips: 'ChargePoint Pass plan: $7.99/month for lower rates. Many supermarkets (Whole Foods, Trader Joe\'s) have free L2 chargers.',
  },
  {
    rank: 4,
    title: 'Level 1 (120V) from Existing Outlet',
    cost: '$0.10–0.17/mi',
    feasibility: 'If outlet accessible',
    badge: 'Simplest setup',
    badgeColor: 'bg-bg-tertiary text-text-secondary',
    icon: '🔌',
    description: 'If you have access to a regular 120V outlet in your parking spot, carport, or garage — you can charge at home rates with zero installation.',
    pros: ['Home electricity rates — very cheap', 'No installation required', 'Charges 35-45 miles overnight (10 hrs)'],
    cons: ['Only works for <40 mi/day commuters', 'Very slow (~3-5 miles/hour)', 'May need extension cord (use heavy-duty 12 gauge)'],
    tips: 'Works great for Nissan LEAF, Chevy Bolt, and most EVs with moderate commutes. Add ~35 miles per 10-hour overnight charge.',
  },
  {
    rank: 5,
    title: 'DC Fast Charging (Emergency/Supplemental)',
    cost: '$0.40–0.70/mi',
    feasibility: 'Available in cities',
    badge: 'Last resort for daily use',
    badgeColor: 'bg-warning/20 text-warning',
    icon: '🚀',
    description: 'Tesla Supercharger, Electrify America, EVgo, and ChargePoint Express stations can add 100-200 miles in 20-30 minutes. Too expensive for daily use.',
    pros: ['Very fast — 100+ miles in 20 minutes', 'Available highway and urban'],
    cons: ['3-5x more expensive than home charging', 'Frequent use accelerates battery degradation', 'Tesla Superchargers restricted to Tesla (with adapter for others)'],
    tips: 'Budget: plan on $50-80/month for 1,000 miles if relying primarily on DCFC. Consider a cheaper EV or a plug-in hybrid instead.',
  },
];

const LANDLORD_LETTER = `Subject: Request to Install Electric Vehicle Charging Station

Dear [Landlord/Property Manager Name],

I am writing to request permission to install an electric vehicle (EV) Level 2 charging station at my parking space at [Address], Unit [Number].

I am committed to covering all costs associated with this project, including:
• Installation by a licensed, insured electrician
• The cost of the EVSE unit itself
• All permit fees
• Ongoing electricity costs (metered separately or added to my utility bill)

I propose the following terms to address any concerns:
• I will obtain all necessary permits before installation
• The installation will be done by a licensed electrician and meet all NEC code requirements
• I agree to restore the parking space to its original condition upon move-out
• I carry renter's insurance that covers the equipment

[IF APPLICABLE: Under [State] law [cite law], landlords may not unreasonably deny this request.]

The charger will be a standard [ChargePoint/JuiceBox/etc.] Level 2 unit and will not create any hazards or interfere with other tenants. I am happy to share the charger with other EV-owning tenants if that would be beneficial to the property.

Please let me know if you have any questions or concerns. I am happy to meet in person to discuss this further.

Thank you for your consideration,
[Your Name]
[Unit Number]
[Phone / Email]`;

export default function ApartmentContent() {
  const [selectedState, setSelectedState] = useState('');
  const [showLetter, setShowLetter] = useState(false);
  const [copied, setCopied] = useState(false);

  const stateInfo = STATE_LAWS.find(s => s.code === selectedState);

  const copyLetter = () => {
    navigator.clipboard.writeText(LANDLORD_LETTER).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      {/* State law lookup */}
      <div className="mb-8 rounded-2xl border border-border bg-bg-secondary p-5">
        <h2 className="mb-3 font-display text-lg font-bold text-text-primary">
          Check Your State&apos;s Right-to-Charge Law
        </h2>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full rounded-xl border border-border bg-bg-tertiary px-4 py-3 text-text-primary outline-none focus:border-accent/60"
        >
          <option value="">Select your state...</option>
          {STATE_LAWS.sort((a, b) => a.name.localeCompare(b.name)).map(s => (
            <option key={s.code} value={s.code}>{s.name}</option>
          ))}
        </select>

        {stateInfo && (
          <div className={`mt-4 rounded-xl border p-4 ${stateInfo.hasLaw ? 'border-accent/30 bg-accent/5' : 'border-border'}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{stateInfo.hasLaw ? '✅' : '⚠️'}</span>
              <div className="flex-1">
                <div className={`font-semibold ${stateInfo.hasLaw ? 'text-accent' : 'text-text-primary'}`}>
                  {stateInfo.hasLaw ? `${stateInfo.name} has a right-to-charge law` : `${stateInfo.name} has no statewide right-to-charge law`}
                </div>
                <p className="mt-1 text-sm text-text-secondary">{stateInfo.summary}</p>
                {stateInfo.hasLaw && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {stateInfo.coversRenters && <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs text-accent">✓ Renters</span>}
                    {stateInfo.coversCondos && <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs text-accent">✓ Condos</span>}
                    {stateInfo.coversHoa && <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs text-accent">✓ HOAs</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charging options */}
      <h2 className="mb-4 font-display text-xl font-bold text-text-primary">
        Your 5 Charging Options, Ranked
      </h2>
      <div className="space-y-4 mb-8">
        {CHARGING_OPTIONS.map((opt) => (
          <div key={opt.rank} className={`rounded-2xl border p-5 ${opt.rank === 1 ? 'border-accent/30 bg-accent/5' : 'border-border bg-bg-secondary'}`}>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg-tertiary text-lg">
                {opt.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-xs text-text-tertiary">#{opt.rank}</span>
                  <h3 className="font-display font-semibold text-text-primary">{opt.title}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${opt.badgeColor}`}>{opt.badge}</span>
                </div>

                <div className="mt-1 flex flex-wrap gap-3 text-xs text-text-tertiary">
                  <span>Cost: <strong className="text-text-secondary">{opt.cost}</strong></span>
                  <span>Feasibility: <strong className="text-text-secondary">{opt.feasibility}</strong></span>
                </div>

                <p className="mt-2 text-sm text-text-secondary">{opt.description}</p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-tertiary">Pros</div>
                    <ul className="space-y-0.5">
                      {opt.pros.map(p => <li key={p} className="text-xs text-text-secondary flex gap-1"><span className="text-accent">+</span>{p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-text-tertiary">Cons</div>
                    <ul className="space-y-0.5">
                      {opt.cons.map(c => <li key={c} className="text-xs text-text-secondary flex gap-1"><span className="text-text-tertiary">–</span>{c}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="mt-3 rounded-lg bg-bg-tertiary px-3 py-2 text-xs text-text-secondary">
                  <span className="text-accent font-medium">💡 Tip: </span>{opt.tips}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cost comparison table */}
      <div className="mb-8 rounded-xl border border-border bg-bg-secondary p-5">
        <h2 className="mb-4 font-display text-base font-bold text-text-primary">
          Monthly Cost Comparison (1,000 miles/month)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wide text-text-tertiary">Method</th>
                <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wide text-text-tertiary">$/kWh</th>
                <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wide text-text-tertiary">Cost/Month</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { label: 'Home L2 (25 kWh/100mi)', rate: '$0.16', monthly: '$40', highlight: true },
                { label: 'Workplace (free)', rate: '$0.00', monthly: '$0', highlight: false },
                { label: 'Public L2 + plan', rate: '$0.29', monthly: '$72', highlight: false },
                { label: 'L1 from outlet (same as home)', rate: '$0.16', monthly: '$40', highlight: false },
                { label: 'DC Fast Charging', rate: '$0.52', monthly: '$130', highlight: false },
                { label: 'Gasoline (30 MPG @ $3.40)', rate: '—', monthly: '$113', highlight: false },
              ].map(row => (
                <tr key={row.label} className={row.highlight ? 'bg-accent/5' : ''}>
                  <td className="py-2 text-text-primary">{row.label}</td>
                  <td className="py-2 text-right font-mono text-text-secondary">{row.rate}</td>
                  <td className={`py-2 text-right font-mono font-semibold ${row.highlight ? 'text-accent' : 'text-text-primary'}`}>{row.monthly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Landlord letter */}
      <div className="rounded-xl border border-border bg-bg-secondary p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-text-primary">
            📄 Landlord Request Letter Template
          </h2>
          <button
            onClick={() => setShowLetter(!showLetter)}
            className="text-sm text-accent hover:underline"
          >
            {showLetter ? 'Hide' : 'Show'}
          </button>
        </div>
        <p className="mt-1 text-sm text-text-secondary">
          A professional, legally-aware letter for requesting EV charger installation from your landlord.
        </p>

        {showLetter && (
          <div className="mt-4">
            <pre className="overflow-auto whitespace-pre-wrap rounded-lg bg-bg-tertiary p-4 text-xs text-text-secondary leading-relaxed">
              {LANDLORD_LETTER}
            </pre>
            <button
              onClick={copyLetter}
              className="mt-3 rounded-lg border border-border bg-bg-tertiary px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent/30 hover:text-accent"
            >
              {copied ? '✓ Copied!' : 'Copy to clipboard'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
