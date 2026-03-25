'use client';

import { useState, useCallback } from 'react';
import type { ChargerProduct, InstallationCost } from '@/lib/supabase/queries/chargers';
import { ChargerProductCard } from '@/components/chargers/ChargerProductCard';

// ---- US States list ----
const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }, { code: 'DC', name: 'DC' },
];

// ---- Types ----
interface WizardState {
  step: number;
  ev: string;
  electricalSetup: 'has_240v' | 'no_240v' | 'unsure';
  ownership: 'own' | 'rent';
  panelAmps: '100a' | '200a' | 'unsure';
  wantSmart: boolean;
  stateCode: string;
  maxBudget: number;
}

interface WizardResults {
  chargers: ChargerProduct[];
  installCost: InstallationCost | null;
}

const TOTAL_STEPS = 5;

// ---- Calculation helpers ----
function calcInstallEstimate(
  setup: WizardState['electricalSetup'],
  installCost: InstallationCost,
  distanceToPanel: number = 20,
): { low: number; high: number; scenario: string } {
  const laborRate = installCost.avg_labor_rate_per_hour;
  const permit = installCost.requires_permit ? installCost.avg_permit_cost : 0;
  const wireCost = distanceToPanel * installCost.avg_wire_cost_per_foot;

  if (setup === 'has_240v') {
    const labor = installCost.avg_hours_simple_install * laborRate;
    const total = Math.round(labor + 50); // just charger mounting + wiring
    return { low: total - 50, high: total + 100, scenario: 'Simple install (existing 240V outlet)' };
  } else {
    const laborHrs = installCost.avg_hours_new_circuit;
    const labor = laborHrs * laborRate;
    const breaker = installCost.avg_breaker_cost;
    const total = Math.round(labor + wireCost + breaker + permit);
    return {
      low: Math.round(total * 0.85),
      high: Math.round(total * 1.25),
      scenario: 'New 240V circuit from panel',
    };
  }
}

// ---- Electrician card data ----
function getElectricianCard(maxAmps: number) {
  const awg = maxAmps <= 30 ? '10 AWG' : maxAmps <= 40 ? '8 AWG' : '6 AWG';
  const breaker = maxAmps <= 30 ? '30A' : maxAmps <= 40 ? '50A' : '60A';
  return {
    wireGauge: awg,
    breakerSize: breaker,
    outlet: maxAmps <= 32 ? 'NEMA 14-50 or hardwired' : 'Hardwired required',
    necCode: 'NEC 625.44 — EVSE circuit must be rated at 125% of EVSE continuous load',
  };
}

// ---- Step components ----
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-text-secondary">Step {current} of {total}</span>
        <span className="text-text-tertiary">{Math.round((current / total) * 100)}% complete</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-tertiary">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

function OptionCard({
  label,
  description,
  selected,
  onClick,
  icon,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border p-4 text-left transition-all ${
        selected
          ? 'border-accent bg-accent/5 shadow-md shadow-accent/10'
          : 'border-border bg-bg-secondary hover:border-accent/30 hover:bg-bg-tertiary'
      }`}
    >
      <div className="flex items-start gap-3">
        {icon && <div className="mt-0.5 text-accent">{icon}</div>}
        <div>
          <div className={`font-semibold ${selected ? 'text-accent' : 'text-text-primary'}`}>{label}</div>
          {description && <div className="mt-0.5 text-sm text-text-secondary">{description}</div>}
        </div>
        {selected && (
          <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent">
            <svg className="h-3 w-3 text-bg-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}

// ---- Main wizard ----
export function ChargerWizard() {
  const [wizard, setWizard] = useState<WizardState>({
    step: 1,
    ev: '',
    electricalSetup: 'no_240v',
    ownership: 'own',
    panelAmps: '200a',
    wantSmart: true,
    stateCode: 'CA',
    maxBudget: 700,
  });
  const [results, setResults] = useState<WizardResults | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (patch: Partial<WizardState>) => setWizard((w) => ({ ...w, ...patch }));

  const fetchResults = useCallback(async (w: WizardState) => {
    setLoading(true);
    try {
      const hardwired = w.ownership === 'rent' || w.electricalSetup === 'has_240v' ? '0' : '1';
      const params = new URLSearchParams({
        state: w.stateCode,
        chargerLevel: '2',
        hardwired,
        wifiRequired: w.wantSmart ? '1' : '0',
        maxBudget: String(w.maxBudget),
      });
      const res = await fetch(`/api/charger-wizard?${params}`);
      const data = await res.json() as WizardResults;
      setResults(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const next = () => {
    const newStep = wizard.step + 1;
    if (newStep > TOTAL_STEPS) {
      fetchResults(wizard);
    }
    update({ step: newStep });
  };

  const back = () => update({ step: Math.max(1, wizard.step - 1) });
  const reset = () => { setResults(null); setWizard((w) => ({ ...w, step: 1 })); };

  // Show results
  if (wizard.step > TOTAL_STEPS) {
    const installCost = results?.installCost;
    const installEstimate = installCost
      ? calcInstallEstimate(wizard.electricalSetup, installCost)
      : null;
    const topCharger = results?.chargers?.[0];
    const electricianCard = topCharger ? getElectricianCard(topCharger.max_amps) : null;

    // Monthly charging cost estimate (assume 1,200 mi/month, 3.5 mi/kWh, $0.15/kWh average)
    const monthlyKwh = 1200 / 3.5;
    const monthlyChargeCost = Math.round(monthlyKwh * 0.15);

    return (
      <div className="space-y-8">
        {/* Summary banner */}
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6">
          <h2 className="mb-1 font-display text-xl font-bold text-text-primary">
            Your Home Charging Setup
          </h2>
          <p className="text-text-secondary">
            Based on your answers, here&apos;s what we recommend for your{' '}
            {wizard.ev || 'EV'} in {US_STATES.find((s) => s.code === wizard.stateCode)?.name ?? wizard.stateCode}.
          </p>
        </div>

        {/* Cost summary cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {installEstimate && (
            <div className="rounded-xl border border-border bg-bg-secondary p-5">
              <div className="mb-1 text-sm text-text-secondary">Installation Cost</div>
              <div className="font-display text-2xl font-bold text-text-primary">
                ${installEstimate.low}–${installEstimate.high}
              </div>
              <div className="mt-1 text-xs text-text-tertiary">{installEstimate.scenario}</div>
            </div>
          )}
          <div className="rounded-xl border border-border bg-bg-secondary p-5">
            <div className="mb-1 text-sm text-text-secondary">Monthly Charging</div>
            <div className="font-display text-2xl font-bold text-accent">≈${monthlyChargeCost}</div>
            <div className="mt-1 text-xs text-text-tertiary">1,200 mi/mo at avg US rates</div>
          </div>
          <div className="rounded-xl border border-border bg-bg-secondary p-5">
            <div className="mb-1 text-sm text-text-secondary">vs Gas (30 MPG)</div>
            <div className="font-display text-2xl font-bold text-green-400">
              Save ≈${Math.round(1200 / 30 * 3.6 - monthlyChargeCost)}/mo
            </div>
            <div className="mt-1 text-xs text-text-tertiary">vs $3.60/gal avg gas</div>
          </div>
        </div>

        {/* Electrician card */}
        {electricianCard && (
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
            <h3 className="mb-3 flex items-center gap-2 font-display font-semibold text-text-primary">
              <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
              What to Tell Your Electrician
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div>
                <span className="text-text-secondary">Wire gauge needed: </span>
                <span className="font-semibold text-text-primary">{electricianCard.wireGauge}</span>
              </div>
              <div>
                <span className="text-text-secondary">Breaker size: </span>
                <span className="font-semibold text-text-primary">{electricianCard.breakerSize} double-pole</span>
              </div>
              <div>
                <span className="text-text-secondary">Outlet type: </span>
                <span className="font-semibold text-text-primary">{electricianCard.outlet}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-text-secondary">Code reference: </span>
                <span className="font-mono text-xs text-accent">{electricianCard.necCode}</span>
              </div>
            </div>
            <a
              href="https://www.homeadvisor.com/cost/electrical/ev-charger-installation/"
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-yellow-500/30 px-4 py-2 text-sm font-semibold text-yellow-400 transition-all hover:bg-yellow-500/10"
            >
              Get Free Electrician Quotes via HomeAdvisor
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        )}

        {/* Charger recommendations */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-bg-secondary" />
            ))}
          </div>
        ) : results?.chargers && results.chargers.length > 0 ? (
          <>
            <h3 className="font-display text-lg font-bold text-text-primary">Recommended Chargers for You</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.chargers.slice(0, 6).map((charger, i) => (
                <ChargerProductCard
                  key={charger.id}
                  charger={charger}
                  rank={i + 1}
                  showBadge={i === 0 ? 'Best Match' : undefined}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-text-secondary">No chargers found matching your filters. Try adjusting your budget.</p>
        )}

        {/* Solar CTA */}
        <div className="rounded-xl border border-border bg-bg-secondary p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="font-display font-semibold text-text-primary">Power Your EV with Solar?</h4>
              <p className="mt-1 text-sm text-text-secondary">
                The average EV owner saves an additional $900/year by pairing solar with home charging.
              </p>
            </div>
            <a
              href="https://www.energysage.com/market/?referral=ev-range-tools"
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="whitespace-nowrap rounded-lg border border-border px-4 py-2 text-sm font-semibold text-accent transition-all hover:border-accent/30"
            >
              Get Free Solar Quotes →
            </a>
          </div>
        </div>

        <button
          onClick={reset}
          className="text-sm text-accent hover:underline"
        >
          ← Start over
        </button>
      </div>
    );
  }

  // ---- Wizard steps ----
  return (
    <div className="mx-auto max-w-2xl">
      <StepIndicator current={wizard.step} total={TOTAL_STEPS} />

      {/* Step 1: EV selection */}
      {wizard.step === 1 && (
        <div>
          <h2 className="mb-2 font-display text-2xl font-bold text-text-primary">Which EV do you have?</h2>
          <p className="mb-6 text-text-secondary">This helps us recommend the right charger speed.</p>
          <input
            type="text"
            placeholder="e.g. Tesla Model 3, Chevy Bolt, Ford F-150 Lightning"
            value={wizard.ev}
            onChange={(e) => update({ ev: e.target.value })}
            className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
          />
          <p className="mt-2 text-xs text-text-tertiary">All EVs work with the same Level 2 J1772 connector (except Tesla NACS).</p>
        </div>
      )}

      {/* Step 2: Electrical setup */}
      {wizard.step === 2 && (
        <div>
          <h2 className="mb-2 font-display text-2xl font-bold text-text-primary">What&apos;s your electrical situation?</h2>
          <p className="mb-6 text-text-secondary">This determines installation complexity and cost.</p>
          <div className="space-y-3">
            <OptionCard
              label="I already have a 240V outlet in my garage"
              description="NEMA 14-50, NEMA 6-50, or dryer outlet nearby. Lowest cost, fastest install."
              selected={wizard.electricalSetup === 'has_240v'}
              onClick={() => update({ electricalSetup: 'has_240v' })}
              icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>}
            />
            <OptionCard
              label="I need a new 240V circuit installed"
              description="Electrician will run new wire from your electrical panel. Most common scenario."
              selected={wizard.electricalSetup === 'no_240v'}
              onClick={() => update({ electricalSetup: 'no_240v' })}
              icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></svg>}
            />
            <OptionCard
              label="I&apos;m not sure"
              description="We&apos;ll recommend options for both scenarios."
              selected={wizard.electricalSetup === 'unsure'}
              onClick={() => update({ electricalSetup: 'unsure' })}
            />
          </div>
        </div>
      )}

      {/* Step 3: Own/Rent */}
      {wizard.step === 3 && (
        <div>
          <h2 className="mb-2 font-display text-2xl font-bold text-text-primary">Do you own or rent your home?</h2>
          <p className="mb-6 text-text-secondary">Renters have different options for home charging.</p>
          <div className="space-y-3">
            <OptionCard
              label="I own my home"
              description="You can install any hardwired Level 2 charger — best performance and value."
              selected={wizard.ownership === 'own'}
              onClick={() => update({ ownership: 'own' })}
            />
            <OptionCard
              label="I rent or live in an apartment"
              description="We&apos;ll recommend plug-in chargers and help you understand your rights."
              selected={wizard.ownership === 'rent'}
              onClick={() => update({ ownership: 'rent' })}
            />
          </div>
        </div>
      )}

      {/* Step 4: Smart features */}
      {wizard.step === 4 && (
        <div>
          <h2 className="mb-2 font-display text-2xl font-bold text-text-primary">Do you want smart charging features?</h2>
          <p className="mb-6 text-text-secondary">Smart chargers let you schedule charging during off-peak hours to save money.</p>
          <div className="space-y-3">
            <OptionCard
              label="Yes — WiFi scheduling and app control"
              description="Schedule charging during off-peak hours. Worth it if your utility has TOU rates."
              selected={wizard.wantSmart}
              onClick={() => update({ wantSmart: true })}
            />
            <OptionCard
              label="No — just fast and reliable"
              description="Dumb chargers are cheaper, simpler, and often more reliable. Recommended for most."
              selected={!wizard.wantSmart}
              onClick={() => update({ wantSmart: false })}
            />
          </div>
        </div>
      )}

      {/* Step 5: Location + Budget */}
      {wizard.step === 5 && (
        <div>
          <h2 className="mb-2 font-display text-2xl font-bold text-text-primary">Your location and budget</h2>
          <p className="mb-6 text-text-secondary">Used to calculate installation costs and check local incentives.</p>
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">State</label>
              <select
                value={wizard.stateCode}
                onChange={(e) => update({ stateCode: e.target.value })}
                className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-3 text-text-primary focus:border-accent focus:outline-none"
              >
                {US_STATES.map((s) => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                Max charger budget: <span className="text-accent">${wizard.maxBudget}</span>
              </label>
              <input
                type="range"
                min={100}
                max={1000}
                step={50}
                value={wizard.maxBudget}
                onChange={(e) => update({ maxBudget: parseInt(e.target.value) })}
                className="w-full accent-accent"
              />
              <div className="mt-1 flex justify-between text-xs text-text-tertiary">
                <span>$100</span>
                <span>$1,000</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={back}
          className={`rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-accent/30 hover:text-text-primary ${wizard.step === 1 ? 'invisible' : ''}`}
        >
          ← Back
        </button>
        <button
          onClick={next}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-bg-primary shadow-lg shadow-accent/25 transition-all hover:bg-accent-dim hover:shadow-accent/40"
        >
          {wizard.step === TOTAL_STEPS ? 'See My Recommendations →' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
