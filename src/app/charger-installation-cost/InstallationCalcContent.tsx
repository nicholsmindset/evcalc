'use client';

import { useState, useMemo } from 'react';
import { INSTALLATION_STATES as STATES, calcInstallationCosts, type InstallationInputs as Inputs } from '@/lib/calculations/installation';
type ChargerAmperage = Inputs['chargerAmperage'];
type ExistingElectrical = Inputs['existingElectrical'];
type GarageType = Inputs['garageType'];

function getElectricianGuidance(amperage: ChargerAmperage): {
  awg: string;
  breaker: string;
  outlet: string;
  nec: string;
} {
  const circuitAmps = Math.ceil(amperage * 1.25 / 10) * 10;
  return {
    awg: 'Installer to size for wire type, terminals and route',
    breaker: `${circuitAmps}A circuit planning allowance`,
    outlet: amperage > 40 ? 'Hardwired equipment; confirm manufacturer requirements' : 'Manufacturer-approved connection on a suitably rated circuit',
    nec: `Planning rule: ${amperage}A charging × 125% = ${amperage * 1.25}A minimum circuit capacity. An electrician must verify the equipment instructions, load calculation and locally adopted code.`,
  };
}

function fmt(n: number) {
  return '$' + n.toLocaleString();
}

export default function InstallationCalcContent() {
  const [inputs, setInputs] = useState<Inputs>({
    stateCode: 'CA',
    existingElectrical: 'has_200a_panel',
    garageType: 'attached',
    panelDistance: 25,
    chargerAmperage: 48,
  });

  const [showResults, setShowResults] = useState(false);
  const costs = useMemo(() => calcInstallationCosts(inputs), [inputs]);
  const guidance = useMemo(() => getElectricianGuidance(inputs.chargerAmperage), [inputs.chargerAmperage]);

  const ELECTRICAL_OPTIONS: { value: ExistingElectrical; label: string; desc: string }[] = [
    { value: 'has_240v_outlet', label: 'I have a 240V outlet in my garage', desc: 'Requires installer approval; above 40A budgets a new circuit' },
    { value: 'has_200a_panel', label: '200A panel, no 240V outlet yet', desc: 'New circuit budget; installer must confirm capacity' },
    { value: 'needs_panel_upgrade', label: 'Electrician has confirmed a panel upgrade is needed', desc: 'Includes an additional upgrade budget' },
    { value: 'unsure', label: 'Not sure', desc: 'We\'ll estimate the most common scenario' },
  ];

  const GARAGE_OPTIONS: { value: GarageType; label: string }[] = [
    { value: 'attached', label: 'Attached garage' },
    { value: 'detached', label: 'Detached garage' },
    { value: 'carport', label: 'Carport / open parking' },
    { value: 'street', label: 'Street / no garage' },
  ];

  const AMP_OPTIONS: { value: ChargerAmperage; label: string }[] = [
    { value: 24, label: '24A — 5.7 kW (basic Level 2)' },
    { value: 32, label: '32A — 7.7 kW (popular)' },
    { value: 40, label: '40A — 9.6 kW' },
    { value: 48, label: '48A — 11.5 kW' },
    { value: 60, label: '60A — 14.4 kW (compatible equipment only)' },
  ];

  return (
    <div className="space-y-6">
      {/* Inputs */}
      {/* State */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-text-primary">
          Your State
        </label>
        <select
          aria-label="Your State"
          value={inputs.stateCode}
          onChange={(e) => setInputs({ ...inputs, stateCode: e.target.value, laborRate: undefined, permitCost: undefined })}
          className="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          {STATES.map((s) => (
            <option key={s.code} value={s.code}>{s.name}</option>
          ))}
        </select>
        <p className="mt-1 text-xs text-text-tertiary">
          Budget assumption for {STATES.find(s => s.code === inputs.stateCode)?.name}: ${STATES.find(s => s.code === inputs.stateCode)?.rate}/hr
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-text-secondary">Electrician quote per hour ($)
          <input type="number" min="0" max="1000" value={inputs.laborRate ?? STATES.find(s => s.code === inputs.stateCode)?.rate ?? 135} onChange={e => setInputs({ ...inputs, laborRate: Math.max(0, Math.min(1000, Number(e.target.value))) })} className="mt-2 w-full rounded-lg border border-border bg-bg-tertiary p-3" />
        </label>
        <label className="text-sm text-text-secondary">Permit budget ($)
          <input type="number" min="0" max="10000" value={inputs.permitCost ?? STATES.find(s => s.code === inputs.stateCode)?.permit ?? 200} onChange={e => setInputs({ ...inputs, permitCost: Math.max(0, Math.min(10000, Number(e.target.value))) })} className="mt-2 w-full rounded-lg border border-border bg-bg-tertiary p-3" />
        </label>
        <p className="text-xs text-text-tertiary sm:col-span-2">Replace the illustrative defaults with your local quote. The estimate excludes charger hardware, sales tax, trenching, wall repairs and utility service work.</p>
      </div>

      {/* Existing electrical */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-text-primary">
          Current Electrical Setup
        </label>
        <div className="space-y-2">
          {ELECTRICAL_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all ${
                inputs.existingElectrical === opt.value
                  ? 'border-accent/50 bg-accent/5'
                  : 'border-border bg-bg-tertiary hover:border-accent/30'
              }`}
            >
              <input
                type="radio"
                name="electrical"
                value={opt.value}
                checked={inputs.existingElectrical === opt.value}
                onChange={() => setInputs({ ...inputs, existingElectrical: opt.value })}
                className="mt-0.5 accent-accent"
              />
              <div>
                <div className="text-sm font-medium text-text-primary">{opt.label}</div>
                <div className="text-xs text-text-tertiary">{opt.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Garage type */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-text-primary">
          Where Will You Charge?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {GARAGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              aria-pressed={inputs.garageType === opt.value}
              type="button"
              onClick={() => setInputs({ ...inputs, garageType: opt.value })}
              className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                inputs.garageType === opt.value
                  ? 'border-accent/50 bg-accent/10 text-accent'
                  : 'border-border bg-bg-tertiary text-text-secondary hover:border-accent/30'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charger amperage */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-text-primary">
          Charger Amperage
        </label>
        <select
          aria-label="Charger Amperage"
          value={inputs.chargerAmperage}
          onChange={(e) => setInputs({ ...inputs, chargerAmperage: Number(e.target.value) as ChargerAmperage })}
          className="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          {AMP_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Panel distance */}
      {(inputs.existingElectrical !== 'has_240v_outlet' || inputs.chargerAmperage > 40) && (
        <div>
          <label className="mb-2 block text-sm font-semibold text-text-primary">
            Distance from Panel to Charger Location: <span className="text-accent">{inputs.panelDistance} ft</span>
          </label>
          <input
            type="range"
            aria-label="Distance from panel to charger in feet"
            min={10}
            max={150}
            step={5}
            value={inputs.panelDistance}
            onChange={(e) => setInputs({ ...inputs, panelDistance: Number(e.target.value) })}
            className="w-full accent-accent"
          />
          <div className="mt-1 flex justify-between text-xs text-text-tertiary">
            <span>10 ft</span><span>150 ft</span>
          </div>
        </div>
      )}

      {/* Calculate button */}
      <button
        type="button"
        onClick={() => setShowResults(true)}
        className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-bg-primary transition-all hover:bg-accent-dim"
      >
        Calculate Installation Cost
      </button>

      {/* Results */}
      {showResults && (
        <div className="space-y-4 pt-2">
          {/* Total */}
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 text-center">
            <div className="text-sm text-text-secondary">Estimated Installation Cost</div>
            <div className="mt-1 font-display text-4xl font-bold text-accent">
              {fmt(costs.total.low)} – {fmt(costs.total.high)}
            </div>
            <div className="mt-2 text-xs text-text-tertiary">Before any current utility rebate; confirm offers with your utility.</div>
          </div>

          {/* Breakdown */}
          <div className="rounded-xl border border-border bg-bg-secondary p-5">
            <h3 className="mb-4 font-display font-semibold text-text-primary">Cost Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: 'Electrician Labor', low: costs.labor.low, high: costs.labor.high },
                ...(costs.wire.low > 0 ? [{ label: `Wire & Conduit (${inputs.panelDistance}ft)`, low: costs.wire.low, high: costs.wire.high }] : []),
                ...(costs.breaker.low > 0 ? [{ label: 'Breaker & Materials', low: costs.breaker.low, high: costs.breaker.high }] : []),
                ...(costs.permit.low > 0 ? [{ label: 'Permit', low: costs.permit.low, high: costs.permit.high }] : []),
                ...(costs.panelUpgrade ? [{ label: 'Panel Upgrade', low: costs.panelUpgrade.low, high: costs.panelUpgrade.high }] : []),
              ].map(({ label, low, high }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">{label}</span>
                  <span className="font-medium text-text-primary">{fmt(low)} – {fmt(high)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 flex items-center justify-between font-semibold">
                <span className="text-text-primary">Total Estimate</span>
                <span className="text-accent">{fmt(costs.total.low)} – {fmt(costs.total.high)}</span>
              </div>
            </div>
          </div>

          {/* Electrician guidance */}
          <div className="rounded-xl border border-border bg-bg-secondary p-5">
            <h3 className="mb-3 font-display font-semibold text-text-primary">What to Tell Your Electrician</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: 'Wire Gauge', value: guidance.awg },
                { label: 'Breaker Size', value: guidance.breaker },
                { label: 'Outlet / Connection', value: guidance.outlet },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg bg-bg-tertiary p-3">
                  <div className="text-xs text-text-tertiary">{label}</div>
                  <div className="mt-0.5 text-sm font-semibold text-text-primary">{value}</div>
                </div>
              ))}
            </div>
            <p className="mt-3 rounded-lg bg-bg-tertiary p-3 text-xs text-text-tertiary">
              📋 <strong className="text-text-secondary">Circuit planning:</strong> {guidance.nec}
            </p>
          </div>

          {/* Federal credit deadline */}
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
            <div className="text-sm font-semibold text-text-primary">Federal charger credit deadline</div>
            <p className="mt-1 text-xs text-text-secondary">The residential §30C credit applied only to qualifying property placed in service by June 30, 2026. No federal credit is included in this estimate.</p>
            <a
              href="https://www.irs.gov/credits-deductions/alternative-fuel-vehicle-refueling-property-credit"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-xs text-accent hover:underline"
            >
              IRS Form 8911 — Alternative Fuel Vehicle Refueling Property Credit →
            </a>
          </div>

          {/* Find utility rebate */}
          <div className="rounded-xl border border-border bg-bg-secondary p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-text-primary">Check Your Utility Rebate</div>
              <div className="text-xs text-text-secondary mt-0.5">Check current eligibility and amounts with your utility</div>
            </div>
            <a href="/ev-rebates" className="whitespace-nowrap rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-secondary hover:text-accent hover:border-accent/30 transition-colors">
              Find My Utility →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
