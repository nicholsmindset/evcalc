'use client';

import { useState, useMemo } from 'react';

const STATES = [
  { code: 'AL', name: 'Alabama', rate: 75, permit: 75 },
  { code: 'AK', name: 'Alaska', rate: 100, permit: 150 },
  { code: 'AZ', name: 'Arizona', rate: 90, permit: 100 },
  { code: 'AR', name: 'Arkansas', rate: 70, permit: 75 },
  { code: 'CA', name: 'California', rate: 135, permit: 200 },
  { code: 'CO', name: 'Colorado', rate: 100, permit: 150 },
  { code: 'CT', name: 'Connecticut', rate: 110, permit: 175 },
  { code: 'DE', name: 'Delaware', rate: 95, permit: 125 },
  { code: 'FL', name: 'Florida', rate: 85, permit: 100 },
  { code: 'GA', name: 'Georgia', rate: 80, permit: 100 },
  { code: 'HI', name: 'Hawaii', rate: 130, permit: 200 },
  { code: 'ID', name: 'Idaho', rate: 80, permit: 75 },
  { code: 'IL', name: 'Illinois', rate: 105, permit: 150 },
  { code: 'IN', name: 'Indiana', rate: 80, permit: 100 },
  { code: 'IA', name: 'Iowa', rate: 75, permit: 75 },
  { code: 'KS', name: 'Kansas', rate: 75, permit: 75 },
  { code: 'KY', name: 'Kentucky', rate: 75, permit: 75 },
  { code: 'LA', name: 'Louisiana', rate: 75, permit: 75 },
  { code: 'ME', name: 'Maine', rate: 90, permit: 125 },
  { code: 'MD', name: 'Maryland', rate: 105, permit: 150 },
  { code: 'MA', name: 'Massachusetts', rate: 115, permit: 175 },
  { code: 'MI', name: 'Michigan', rate: 90, permit: 125 },
  { code: 'MN', name: 'Minnesota', rate: 95, permit: 125 },
  { code: 'MS', name: 'Mississippi', rate: 70, permit: 75 },
  { code: 'MO', name: 'Missouri', rate: 80, permit: 100 },
  { code: 'MT', name: 'Montana', rate: 80, permit: 75 },
  { code: 'NE', name: 'Nebraska', rate: 80, permit: 75 },
  { code: 'NV', name: 'Nevada', rate: 100, permit: 150 },
  { code: 'NH', name: 'New Hampshire', rate: 95, permit: 125 },
  { code: 'NJ', name: 'New Jersey', rate: 110, permit: 175 },
  { code: 'NM', name: 'New Mexico', rate: 85, permit: 100 },
  { code: 'NY', name: 'New York', rate: 120, permit: 200 },
  { code: 'NC', name: 'North Carolina', rate: 80, permit: 100 },
  { code: 'ND', name: 'North Dakota', rate: 75, permit: 75 },
  { code: 'OH', name: 'Ohio', rate: 85, permit: 100 },
  { code: 'OK', name: 'Oklahoma', rate: 75, permit: 75 },
  { code: 'OR', name: 'Oregon', rate: 100, permit: 150 },
  { code: 'PA', name: 'Pennsylvania', rate: 95, permit: 125 },
  { code: 'RI', name: 'Rhode Island', rate: 105, permit: 150 },
  { code: 'SC', name: 'South Carolina', rate: 75, permit: 100 },
  { code: 'SD', name: 'South Dakota', rate: 75, permit: 75 },
  { code: 'TN', name: 'Tennessee', rate: 75, permit: 100 },
  { code: 'TX', name: 'Texas', rate: 85, permit: 100 },
  { code: 'UT', name: 'Utah', rate: 85, permit: 100 },
  { code: 'VT', name: 'Vermont', rate: 95, permit: 125 },
  { code: 'VA', name: 'Virginia', rate: 95, permit: 125 },
  { code: 'WA', name: 'Washington', rate: 110, permit: 150 },
  { code: 'WV', name: 'West Virginia', rate: 75, permit: 75 },
  { code: 'WI', name: 'Wisconsin', rate: 90, permit: 125 },
  { code: 'WY', name: 'Wyoming', rate: 80, permit: 75 },
  { code: 'DC', name: 'District of Columbia', rate: 130, permit: 200 },
];

// Wire cost per foot (AWG 6 = ~$2.50/ft installed, AWG 8 = ~$2.00/ft)
const WIRE_COST_PER_FOOT = 2.5;
const BREAKER_COST = 75;

type ExistingElectrical = 'has_240v_outlet' | 'has_200a_panel' | 'needs_panel_upgrade' | 'unsure';
type GarageType = 'attached' | 'detached' | 'carport' | 'street';
type ChargerAmperage = 24 | 32 | 40 | 48 | 60;

interface Inputs {
  stateCode: string;
  existingElectrical: ExistingElectrical;
  garageType: GarageType;
  panelDistance: number;
  chargerAmperage: ChargerAmperage;
}

interface CostBreakdown {
  labor: { low: number; high: number };
  wire: { low: number; high: number };
  breaker: { low: number; high: number };
  permit: { low: number; high: number };
  panelUpgrade?: { low: number; high: number };
  total: { low: number; high: number };
}

function calcCosts(inputs: Inputs): CostBreakdown {
  const state = STATES.find((s) => s.code === inputs.stateCode) ?? STATES[4]; // CA default
  const rate = state.rate;
  const permit = state.permit;

  const distanceFt = inputs.panelDistance;
  const wireCost = Math.round(distanceFt * WIRE_COST_PER_FOOT);

  // Detached garage adds 20–50ft wire run estimate
  const extraWire = inputs.garageType === 'detached' ? Math.round(30 * WIRE_COST_PER_FOOT) : 0;

  let laborHoursLow: number;
  let laborHoursHigh: number;
  let needsBreaker = true;
  let panelUpgrade: { low: number; high: number } | undefined;

  switch (inputs.existingElectrical) {
    case 'has_240v_outlet':
      // Plug-in install: just mount charger, no new circuit
      laborHoursLow = 1;
      laborHoursHigh = 2;
      needsBreaker = false;
      break;
    case 'has_200a_panel':
      // New circuit needed, panel has capacity
      laborHoursLow = 2;
      laborHoursHigh = 4;
      break;
    case 'needs_panel_upgrade':
      // New circuit + panel upgrade
      laborHoursLow = 6;
      laborHoursHigh = 10;
      panelUpgrade = { low: 1500, high: 3000 };
      break;
    case 'unsure':
    default:
      // Mid estimate: assume new circuit
      laborHoursLow = 2;
      laborHoursHigh = 5;
      break;
  }

  const laborLow = Math.round(laborHoursLow * rate);
  const laborHigh = Math.round(laborHoursHigh * rate);
  const breakerLow = needsBreaker ? BREAKER_COST : 0;
  const breakerHigh = needsBreaker ? Math.round(BREAKER_COST * 1.3) : 0;
  const wireLow = needsBreaker ? wireCost + extraWire : 0;
  const wireHigh = needsBreaker ? Math.round((wireCost + extraWire) * 1.2) : 0;
  const permitLow = needsBreaker ? permit : 0;
  const permitHigh = needsBreaker ? Math.round(permit * 1.3) : 0;

  const panelLow = panelUpgrade?.low ?? 0;
  const panelHigh = panelUpgrade?.high ?? 0;

  return {
    labor: { low: laborLow, high: laborHigh },
    wire: { low: wireLow, high: wireHigh },
    breaker: { low: breakerLow, high: breakerHigh },
    permit: { low: permitLow, high: permitHigh },
    panelUpgrade: panelUpgrade,
    total: {
      low: laborLow + wireLow + breakerLow + permitLow + panelLow,
      high: laborHigh + wireHigh + breakerHigh + permitHigh + panelHigh,
    },
  };
}

function getElectricianGuidance(amperage: ChargerAmperage): {
  awg: string;
  breaker: string;
  outlet: string;
  nec: string;
} {
  // NEC 625.44: EVSE branch circuit = 125% of continuous load
  // 40A charger → needs 50A circuit (40 * 1.25 = 50)
  const circuitAmps = Math.ceil(amperage * 1.25 / 10) * 10;
  let awg = '6 AWG copper';
  if (circuitAmps <= 30) awg = '10 AWG copper';
  else if (circuitAmps <= 40) awg = '8 AWG copper';
  else if (circuitAmps <= 60) awg = '6 AWG copper';
  else awg = '4 AWG copper';

  let outlet = 'Hardwired (no outlet)';
  if (amperage <= 24) outlet = 'NEMA 6-20 or hardwired';
  else if (amperage <= 32) outlet = 'NEMA 14-30 or hardwired';
  else if (amperage <= 40) outlet = 'NEMA 14-50 or hardwired';
  else outlet = 'Hardwired recommended';

  return {
    awg,
    breaker: `${circuitAmps}A double-pole breaker`,
    outlet,
    nec: `NEC 625.44 — EVSE branch circuit must be rated at 125% of charger load (${amperage}A × 1.25 = ${amperage * 1.25}A → ${circuitAmps}A circuit)`,
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
  const costs = useMemo(() => calcCosts(inputs), [inputs]);
  const guidance = useMemo(() => getElectricianGuidance(inputs.chargerAmperage), [inputs.chargerAmperage]);

  const federalCredit = Math.min(Math.round((costs.total.low + costs.total.high) / 2 * 0.3), 1000);

  const ELECTRICAL_OPTIONS: { value: ExistingElectrical; label: string; desc: string }[] = [
    { value: 'has_240v_outlet', label: 'I have a 240V outlet in my garage', desc: 'Fastest/cheapest — plug-in install only' },
    { value: 'has_200a_panel', label: '200A panel, no 240V outlet yet', desc: 'New circuit needed, most common' },
    { value: 'needs_panel_upgrade', label: 'Need panel upgrade (100A panel or full)', desc: 'Panel upgrade required first' },
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
    { value: 40, label: '40A — 9.6 kW (most common)' },
    { value: 48, label: '48A — 11.5 kW (recommended)' },
    { value: 60, label: '60A — 14.4 kW (maximum)' },
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
          value={inputs.stateCode}
          onChange={(e) => setInputs({ ...inputs, stateCode: e.target.value })}
          className="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          {STATES.map((s) => (
            <option key={s.code} value={s.code}>{s.name}</option>
          ))}
        </select>
        <p className="mt-1 text-xs text-text-tertiary">
          Average electrician rate in {STATES.find(s => s.code === inputs.stateCode)?.name}: ${STATES.find(s => s.code === inputs.stateCode)?.rate}/hr
        </p>
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
      {inputs.existingElectrical !== 'has_240v_outlet' && (
        <div>
          <label className="mb-2 block text-sm font-semibold text-text-primary">
            Distance from Panel to Charger Location: <span className="text-accent">{inputs.panelDistance} ft</span>
          </label>
          <input
            type="range"
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
            <div className="mt-2 text-xs text-text-tertiary">
              After 30% federal tax credit: ~{fmt(costs.total.low - federalCredit)} – {fmt(costs.total.high - federalCredit)}
            </div>
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
              📋 <strong className="text-text-secondary">NEC Code:</strong> {guidance.nec}
            </p>
          </div>

          {/* Federal credit callout */}
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-text-primary">Federal §30C Tax Credit</div>
                <div className="text-xs text-text-secondary mt-0.5">30% of charger + installation (up to $1,000)</div>
              </div>
              <div className="text-right">
                <div className="font-display text-xl font-bold text-accent">~{fmt(federalCredit)}</div>
                <div className="text-xs text-text-tertiary">estimated credit</div>
              </div>
            </div>
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
              <div className="text-xs text-text-secondary mt-0.5">35+ utilities offer $100–$1,000 for Level 2 installation</div>
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
