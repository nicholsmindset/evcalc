'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

// ---- Types ----
type CreditType = 'new' | 'used';
type FilingStatus = 'single' | 'married_joint' | 'married_separate' | 'head_household';
type PurchaseType = 'buy' | 'lease';

interface TaxCreditRow {
  id: string;
  make: string;
  model: string;
  year_min: number;
  year_max: number;
  credit_amount: number;
  credit_type: string;
  msrp_cap: number | null;
  vehicle_class: string | null;
  income_limit_single: number | null;
  income_limit_joint: number | null;
  assembly_location: string | null;
  notes: string | null;
}

interface EligibilityResult {
  eligible: 'full' | 'partial' | 'not_eligible' | 'lease_eligible';
  creditAmount: number;
  reasons: { pass: boolean; label: string; detail: string }[];
  alternatives: { label: string; href: string }[];
}

const INCOME_LIMITS: Record<FilingStatus, { section30D: number; label: string }> = {
  single: { section30D: 150000, label: 'Single' },
  married_joint: { section30D: 300000, label: 'Married Filing Jointly' },
  married_separate: { section30D: 150000, label: 'Married Filing Separately' },
  head_household: { section30D: 225000, label: 'Head of Household' },
};

const MSRP_CAPS = {
  sedan: 55000,
  suv: 80000,
  truck: 80000,
};

// ---- Step indicator ----
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-text-secondary">Step {current} of {total}</span>
        <span className="text-text-tertiary">{Math.round((current / total) * 100)}%</span>
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
}: {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
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
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className={`font-semibold ${selected ? 'text-accent' : 'text-text-primary'}`}>{label}</div>
          {description && <div className="mt-0.5 text-sm text-text-secondary">{description}</div>}
        </div>
        {selected && (
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent">
            <svg className="h-3 w-3 text-bg-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}

// ---- Main component ----
export default function TaxCreditContent() {
  const [step, setStep] = useState(1);
  const [creditType, setCreditType] = useState<CreditType>('new');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<TaxCreditRow | null>(null);
  const [searchResults, setSearchResults] = useState<TaxCreditRow[]>([]);
  const [searching, setSearching] = useState(false);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [agi, setAgi] = useState<string>('');
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('buy');
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const TOTAL_STEPS = 5;

  const searchVehicles = useCallback(async (query: string) => {
    if (query.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const res = await fetch(`/api/vehicle-search?q=${encodeURIComponent(query)}&type=${creditType}`);
      if (res.ok) {
        const data = await res.json() as TaxCreditRow[];
        setSearchResults(data.slice(0, 8));
      }
    } finally {
      setSearching(false);
    }
  }, [creditType]);

  const computeEligibility = useCallback(() => {
    const agiNum = parseInt(agi.replace(/,/g, '')) || 0;
    const incomeLimit = INCOME_LIMITS[filingStatus].section30D;
    const creditAmount = selectedVehicle?.credit_amount ?? 7500;
    const vehicle = selectedVehicle;

    if (purchaseType === 'lease') {
      setResult({
        eligible: 'lease_eligible',
        creditAmount: 7500,
        reasons: [
          {
            pass: true,
            label: 'Leasing: Dealer Qualifies for §45W Credit',
            detail:
              'When you lease, the dealer (as commercial buyer) claims the §45W Commercial Clean Vehicle Credit and typically passes the full $7,500 as a reduction to your capitalized cost — lowering your monthly payment.',
          },
          {
            pass: true,
            label: 'No Income Limit on You as Lessee',
            detail: 'The income limits on §30D only apply to the buyer. Lessees have no income restriction.',
          },
          {
            pass: true,
            label: 'No MSRP Cap on Leases',
            detail:
              'MSRP caps ($55k/$80k) apply only to §30D purchases, not to leases under §45W.',
          },
        ],
        alternatives: [
          { label: 'Lease vs Buy Calculator', href: '/lease-vs-buy' },
          { label: 'Browse All EVs', href: '/vehicles' },
        ],
      });
      return;
    }

    // Purchase path
    const reasons: EligibilityResult['reasons'] = [];

    // 1. Income check
    const incomePass = agiNum === 0 || agiNum <= incomeLimit;
    reasons.push({
      pass: incomePass,
      label: `Income Limit (${INCOME_LIMITS[filingStatus].label})`,
      detail: incomePass
        ? `Your AGI (${agiNum > 0 ? `$${agiNum.toLocaleString()}` : 'not entered'}) is within the $${incomeLimit.toLocaleString()} limit for ${creditType === 'new' ? '§30D new EV' : '§25E used EV'} credits.`
        : `Your AGI of $${agiNum.toLocaleString()} exceeds the $${incomeLimit.toLocaleString()} limit for ${INCOME_LIMITS[filingStatus].label} filers.`,
    });

    // 2. MSRP cap check
    if (vehicle?.msrp_cap) {
      const msrpClass = vehicle.vehicle_class?.toLowerCase().includes('truck') ||
        vehicle.vehicle_class?.toLowerCase().includes('suv') ||
        vehicle.vehicle_class?.toLowerCase().includes('van') ? 'suv' : 'sedan';
      const cap = MSRP_CAPS[msrpClass];
      const msrpPass = vehicle.msrp_cap <= cap;
      reasons.push({
        pass: msrpPass,
        label: `MSRP Cap ($${cap.toLocaleString()})`,
        detail: msrpPass
          ? `The ${vehicle.make} ${vehicle.model} MSRP is within the $${cap.toLocaleString()} cap for ${msrpClass === 'sedan' ? 'cars' : 'SUVs/trucks'}.`
          : `The ${vehicle.make} ${vehicle.model} MSRP of $${vehicle.msrp_cap.toLocaleString()} exceeds the $${cap.toLocaleString()} cap.`,
      });
    } else {
      reasons.push({
        pass: true,
        label: 'MSRP Cap',
        detail: 'Vehicle meets MSRP requirements for the §30D credit.',
      });
    }

    // 3. Assembly location
    if (vehicle?.assembly_location) {
      const assemblyPass = vehicle.assembly_location.toLowerCase().includes('north america') ||
        vehicle.assembly_location.toLowerCase().includes('usa') ||
        vehicle.assembly_location.toLowerCase().includes('united states') ||
        vehicle.assembly_location.toLowerCase().includes('mexico') ||
        vehicle.assembly_location.toLowerCase().includes('canada');
      reasons.push({
        pass: assemblyPass,
        label: 'North American Assembly',
        detail: assemblyPass
          ? `The ${vehicle.make} ${vehicle.model} is assembled in ${vehicle.assembly_location}, meeting the North American assembly requirement.`
          : `The ${vehicle.make} ${vehicle.model} is assembled in ${vehicle.assembly_location}, which does not meet the §30D North American assembly requirement.`,
      });
    } else {
      reasons.push({
        pass: true,
        label: 'North American Assembly',
        detail: 'Vehicle assembly location meets §30D requirements.',
      });
    }

    // 4. Credit amount
    reasons.push({
      pass: true,
      label: `Credit Amount: $${creditAmount.toLocaleString()}`,
      detail: `This vehicle qualifies for a $${creditAmount.toLocaleString()} §30D New Clean Vehicle Credit.`,
    });

    const allPass = reasons.every((r) => r.pass);
    const somePass = reasons.some((r) => r.pass);

    let eligible: EligibilityResult['eligible'] = 'not_eligible';
    if (allPass) eligible = 'full';
    else if (somePass) eligible = 'partial';

    const alternatives: EligibilityResult['alternatives'] = [];
    if (!incomePass) {
      alternatives.push({ label: 'Try Leasing — No Income Limit', href: '/lease-vs-buy' });
    }
    alternatives.push(
      { label: 'Check State Incentives', href: '/ev-incentives' },
      { label: 'EV vs Gas Savings Calculator', href: '/ev-vs-gas' },
    );

    setResult({ eligible, creditAmount: allPass ? creditAmount : 0, reasons, alternatives });
  }, [agi, filingStatus, purchaseType, selectedVehicle, creditType]);

  const next = () => {
    if (step === TOTAL_STEPS) {
      computeEligibility();
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS + 1));
  };

  const back = () => setStep((s) => Math.max(1, s - 1));
  const reset = () => { setStep(1); setResult(null); setSelectedVehicle(null); setVehicleSearch(''); };

  // ---- Results ----
  if (step > TOTAL_STEPS && result) {
    const verdictConfig = {
      full: { label: 'You Likely Qualify!', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', icon: '✓' },
      partial: { label: 'Partial Eligibility', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: '~' },
      not_eligible: { label: 'Does Not Qualify', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: '✗' },
      lease_eligible: { label: 'Lease to Get $7,500!', color: 'text-accent', bg: 'bg-accent/10 border-accent/20', icon: '✓' },
    }[result.eligible];

    return (
      <div className="space-y-6">
        {/* Verdict */}
        <div className={`rounded-2xl border p-6 ${verdictConfig.bg}`}>
          <div className="flex items-center gap-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold ${verdictConfig.color} border-2 border-current`}>
              {verdictConfig.icon}
            </div>
            <div>
              <div className={`font-display text-2xl font-bold ${verdictConfig.color}`}>
                {verdictConfig.label}
              </div>
              {result.creditAmount > 0 && (
                <div className="mt-0.5 text-text-secondary">
                  Estimated credit: <span className={`font-semibold ${verdictConfig.color}`}>${result.creditAmount.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="rounded-xl border border-border bg-bg-secondary p-5">
          <h3 className="mb-4 font-display font-semibold text-text-primary">Eligibility Checklist</h3>
          <div className="space-y-3">
            {result.reasons.map((reason) => (
              <div key={reason.label} className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${reason.pass ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {reason.pass ? '✓' : '✗'}
                </div>
                <div>
                  <div className={`text-sm font-semibold ${reason.pass ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {reason.label}
                  </div>
                  <div className="text-xs text-text-secondary">{reason.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alternatives */}
        {result.alternatives.length > 0 && (
          <div className="rounded-xl border border-border bg-bg-secondary p-5">
            <h3 className="mb-3 font-display font-semibold text-text-primary">Next Steps</h3>
            <div className="flex flex-wrap gap-2">
              {result.alternatives.map((alt) => (
                <Link
                  key={alt.href}
                  href={alt.href}
                  className="rounded-lg border border-accent/30 px-4 py-2 text-sm font-medium text-accent transition-all hover:bg-accent/5"
                >
                  {alt.label} →
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Important disclaimer */}
        <p className="text-xs text-text-tertiary">
          This tool provides an estimate based on publicly available IRS guidelines. Actual eligibility depends on your complete tax situation. Consult a tax professional or visit{' '}
          <a href="https://www.irs.gov/credits-deductions/individuals/plug-in-electric-vehicles-credit-section-30-d" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">irs.gov</a>{' '}
          for official guidance.
        </p>

        <button onClick={reset} className="text-sm text-accent hover:underline">
          ← Start over
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <StepIndicator current={step} total={TOTAL_STEPS} />

      {/* Step 1: New or Used */}
      {step === 1 && (
        <div>
          <h2 className="mb-2 font-display text-2xl font-bold text-text-primary">Are you buying new or used?</h2>
          <p className="mb-6 text-text-secondary">The §30D credit applies to new EVs; §25E applies to used EVs with different amounts.</p>
          <div className="space-y-3">
            <OptionCard
              label="New EV (§30D Credit)"
              description="Up to $7,500 credit. Income limits: $150k single / $300k joint. MSRP caps apply."
              selected={creditType === 'new'}
              onClick={() => setCreditType('new')}
            />
            <OptionCard
              label="Used EV (§25E Credit)"
              description="Up to $4,000 or 30% of sale price (whichever is less). Income limit: $75k single / $150k joint."
              selected={creditType === 'used'}
              onClick={() => setCreditType('used')}
            />
          </div>
        </div>
      )}

      {/* Step 2: Select Vehicle */}
      {step === 2 && (
        <div>
          <h2 className="mb-2 font-display text-2xl font-bold text-text-primary">Which EV are you considering?</h2>
          <p className="mb-6 text-text-secondary">We&apos;ll check if it meets assembly and MSRP requirements.</p>
          <div className="relative">
            <input
              type="text"
              placeholder="Search: Tesla Model 3, Chevy Bolt, Ioniq 5…"
              value={vehicleSearch}
              onChange={(e) => {
                setVehicleSearch(e.target.value);
                searchVehicles(e.target.value);
              }}
              className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
            />
            {searching && (
              <div className="absolute right-3 top-3 h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            )}
          </div>

          {/* Search results */}
          {searchResults.length > 0 && !selectedVehicle && (
            <div className="mt-2 overflow-hidden rounded-xl border border-border bg-bg-secondary">
              {searchResults.map((v) => (
                <button
                  key={v.id}
                  onClick={() => { setSelectedVehicle(v); setSearchResults([]); setVehicleSearch(`${v.make} ${v.model} (${v.year_min}–${v.year_max})`); }}
                  className="flex w-full items-center justify-between border-b border-border px-4 py-3 text-left last:border-b-0 hover:bg-bg-tertiary"
                >
                  <span className="text-sm text-text-primary">{v.make} {v.model}</span>
                  <span className="text-sm font-semibold text-accent">${v.credit_amount.toLocaleString()}</span>
                </button>
              ))}
            </div>
          )}

          {selectedVehicle && (
            <div className="mt-3 flex items-center justify-between rounded-xl border border-accent/30 bg-accent/5 px-4 py-3">
              <span className="text-sm font-semibold text-accent">✓ {selectedVehicle.make} {selectedVehicle.model}</span>
              <button onClick={() => { setSelectedVehicle(null); setVehicleSearch(''); }} className="text-xs text-text-tertiary hover:text-text-secondary">Clear</button>
            </div>
          )}

          <p className="mt-3 text-xs text-text-tertiary">
            Don&apos;t see your vehicle?{' '}
            <button onClick={() => { setSelectedVehicle(null); next(); }} className="text-accent hover:underline">Skip this step</button>
            {' '}and we&apos;ll check your income eligibility.
          </p>
        </div>
      )}

      {/* Step 3: Filing Status */}
      {step === 3 && (
        <div>
          <h2 className="mb-2 font-display text-2xl font-bold text-text-primary">What&apos;s your tax filing status?</h2>
          <p className="mb-6 text-text-secondary">Income limits vary by filing status.</p>
          <div className="space-y-3">
            {(Object.entries(INCOME_LIMITS) as [FilingStatus, { section30D: number; label: string }][]).map(([key, val]) => (
              <OptionCard
                key={key}
                label={val.label}
                description={`Income limit: $${(creditType === 'new' ? val.section30D : val.section30D / 2).toLocaleString()} AGI`}
                selected={filingStatus === key}
                onClick={() => setFilingStatus(key)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 4: AGI */}
      {step === 4 && (
        <div>
          <h2 className="mb-2 font-display text-2xl font-bold text-text-primary">What&apos;s your Adjusted Gross Income?</h2>
          <p className="mb-6 text-text-secondary">
            Your AGI is line 11 of Form 1040. Income limit for {INCOME_LIMITS[filingStatus].label}:{' '}
            <span className="font-semibold text-accent">${INCOME_LIMITS[filingStatus].section30D.toLocaleString()}</span>.
          </p>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-text-tertiary">$</span>
            <input
              type="text"
              placeholder="e.g. 85,000"
              value={agi}
              onChange={(e) => setAgi(e.target.value)}
              className="w-full rounded-xl border border-border bg-bg-secondary py-3 pl-8 pr-4 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
            />
          </div>
          <p className="mt-2 text-xs text-text-tertiary">Skip if you prefer not to enter income — we&apos;ll show the general result.</p>
        </div>
      )}

      {/* Step 5: Buy or Lease */}
      {step === 5 && (
        <div>
          <h2 className="mb-2 font-display text-2xl font-bold text-text-primary">Are you planning to buy or lease?</h2>
          <p className="mb-6 text-text-secondary">This affects which tax credit applies and how you receive it.</p>
          <div className="space-y-3">
            <OptionCard
              label="Purchase (Finance or Cash)"
              description="§30D credit applied on your federal tax return. Subject to income and MSRP limits."
              selected={purchaseType === 'buy'}
              onClick={() => setPurchaseType('buy')}
            />
            <OptionCard
              label="Lease"
              description="Dealer claims §45W credit with NO income limit on you. Usually passed as $7,500 cap reduction."
              selected={purchaseType === 'lease'}
              onClick={() => setPurchaseType('lease')}
            />
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={back}
          className={`rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-accent/30 hover:text-text-primary ${step === 1 ? 'invisible' : ''}`}
        >
          ← Back
        </button>
        <button
          onClick={next}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-bg-primary shadow-lg shadow-accent/25 transition-all hover:bg-accent-dim"
        >
          {step === TOTAL_STEPS ? 'Check My Eligibility →' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
