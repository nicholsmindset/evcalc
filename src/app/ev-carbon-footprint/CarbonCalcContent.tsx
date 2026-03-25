'use client';

import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

// Grid emissions by state — CO2 lbs/kWh from EPA eGRID2023
const GRID = [
  { state: 'AL', name: 'Alabama', co2: 0.762 }, { state: 'AK', name: 'Alaska', co2: 0.877 },
  { state: 'AZ', name: 'Arizona', co2: 0.604 }, { state: 'AR', name: 'Arkansas', co2: 0.748 },
  { state: 'CA', name: 'California', co2: 0.397 }, { state: 'CO', name: 'Colorado', co2: 0.702 },
  { state: 'CT', name: 'Connecticut', co2: 0.451 }, { state: 'DE', name: 'Delaware', co2: 0.629 },
  { state: 'FL', name: 'Florida', co2: 0.682 }, { state: 'GA', name: 'Georgia', co2: 0.668 },
  { state: 'HI', name: 'Hawaii', co2: 1.147 }, { state: 'ID', name: 'Idaho', co2: 0.157 },
  { state: 'IL', name: 'Illinois', co2: 0.481 }, { state: 'IN', name: 'Indiana', co2: 0.901 },
  { state: 'IA', name: 'Iowa', co2: 0.549 }, { state: 'KS', name: 'Kansas', co2: 0.608 },
  { state: 'KY', name: 'Kentucky', co2: 0.903 }, { state: 'LA', name: 'Louisiana', co2: 0.706 },
  { state: 'ME', name: 'Maine', co2: 0.328 }, { state: 'MD', name: 'Maryland', co2: 0.554 },
  { state: 'MA', name: 'Massachusetts', co2: 0.560 }, { state: 'MI', name: 'Michigan', co2: 0.726 },
  { state: 'MN', name: 'Minnesota', co2: 0.607 }, { state: 'MS', name: 'Mississippi', co2: 0.750 },
  { state: 'MO', name: 'Missouri', co2: 0.854 }, { state: 'MT', name: 'Montana', co2: 0.578 },
  { state: 'NE', name: 'Nebraska', co2: 0.700 }, { state: 'NV', name: 'Nevada', co2: 0.540 },
  { state: 'NH', name: 'New Hampshire', co2: 0.397 }, { state: 'NJ', name: 'New Jersey', co2: 0.430 },
  { state: 'NM', name: 'New Mexico', co2: 0.829 }, { state: 'NY', name: 'New York', co2: 0.370 },
  { state: 'NC', name: 'North Carolina', co2: 0.620 }, { state: 'ND', name: 'North Dakota', co2: 0.870 },
  { state: 'OH', name: 'Ohio', co2: 0.780 }, { state: 'OK', name: 'Oklahoma', co2: 0.699 },
  { state: 'OR', name: 'Oregon', co2: 0.259 }, { state: 'PA', name: 'Pennsylvania', co2: 0.589 },
  { state: 'RI', name: 'Rhode Island', co2: 0.560 }, { state: 'SC', name: 'South Carolina', co2: 0.529 },
  { state: 'SD', name: 'South Dakota', co2: 0.290 }, { state: 'TN', name: 'Tennessee', co2: 0.534 },
  { state: 'TX', name: 'Texas', co2: 0.670 }, { state: 'UT', name: 'Utah', co2: 0.819 },
  { state: 'VT', name: 'Vermont', co2: 0.026 }, { state: 'VA', name: 'Virginia', co2: 0.548 },
  { state: 'WA', name: 'Washington', co2: 0.132 }, { state: 'WV', name: 'West Virginia', co2: 1.010 },
  { state: 'WI', name: 'Wisconsin', co2: 0.760 }, { state: 'WY', name: 'Wyoming', co2: 1.035 },
  { state: 'DC', name: 'Washington DC', co2: 0.370 },
];

// EVs with efficiency kWh/100mi
const EV_MODELS = [
  { id: 'model3-lr', name: 'Tesla Model 3 Long Range', kwh100: 24.5, manuf_co2_tons: 9.0 },
  { id: 'modely-lr', name: 'Tesla Model Y Long Range', kwh100: 26.0, manuf_co2_tons: 10.0 },
  { id: 'models-plaid', name: 'Tesla Model S Plaid', kwh100: 30.0, manuf_co2_tons: 11.0 },
  { id: 'modelx-lr', name: 'Tesla Model X Long Range', kwh100: 34.0, manuf_co2_tons: 12.0 },
  { id: 'ioniq5-awd', name: 'Hyundai IONIQ 5 AWD', kwh100: 31.3, manuf_co2_tons: 9.5 },
  { id: 'ioniq6-lr', name: 'Hyundai IONIQ 6 LR AWD', kwh100: 25.0, manuf_co2_tons: 9.0 },
  { id: 'ev6-awd', name: 'Kia EV6 AWD', kwh100: 31.0, manuf_co2_tons: 9.5 },
  { id: 'ev9-awd', name: 'Kia EV9 AWD', kwh100: 35.5, manuf_co2_tons: 11.0 },
  { id: 'mustang-mach-e', name: 'Ford Mustang Mach-E AWD', kwh100: 31.4, manuf_co2_tons: 10.0 },
  { id: 'f150-lightning', name: 'Ford F-150 Lightning', kwh100: 44.5, manuf_co2_tons: 14.0 },
  { id: 'silverado-ev', name: 'Chevy Silverado EV', kwh100: 40.0, manuf_co2_tons: 14.5 },
  { id: 'bolt-euv', name: 'Chevy Bolt EUV', kwh100: 28.0, manuf_co2_tons: 8.5 },
  { id: 'r1t', name: 'Rivian R1T', kwh100: 43.5, manuf_co2_tons: 13.5 },
  { id: 'r1s', name: 'Rivian R1S', kwh100: 42.0, manuf_co2_tons: 13.0 },
  { id: 'leaf-plus', name: 'Nissan LEAF Plus', kwh100: 30.5, manuf_co2_tons: 8.5 },
  { id: 'id4-awd', name: 'VW ID.4 AWD Pro', kwh100: 31.3, manuf_co2_tons: 9.5 },
  { id: 'q8-etron', name: 'Audi Q8 e-tron', kwh100: 40.0, manuf_co2_tons: 12.0 },
  { id: 'ix-50', name: 'BMW iX xDrive50', kwh100: 37.0, manuf_co2_tons: 11.5 },
  { id: 'cybertruck', name: 'Tesla Cybertruck AWD', kwh100: 38.6, manuf_co2_tons: 13.0 },
  { id: 'eqb', name: 'Mercedes EQB 350', kwh100: 36.0, manuf_co2_tons: 10.5 },
];

// Gas car CO2: 19.6 lbs CO2/gallon (EPA), 8.887 kg/gallon
// EV CO2 = kwh_per_mile * grid_co2_lbs_per_kwh * annual_miles

function fmt(n: number, decimals = 1): string {
  return n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export default function CarbonCalcContent() {
  const [evId, setEvId] = useState('model3-lr');
  const [stateCode, setStateCode] = useState('CA');
  const [annualMiles, setAnnualMiles] = useState(12000);
  const [gasMpg, setGasMpg] = useState(28);
  const [yearsOwned, setYearsOwned] = useState(10);

  const ev = EV_MODELS.find((e) => e.id === evId) ?? EV_MODELS[0];
  const grid = GRID.find((g) => g.state === stateCode) ?? GRID[4]; // default CA

  const results = useMemo(() => {
    // Annual EV CO2 — operational (lbs)
    const evCo2PerMile = (ev.kwh100 / 100) * grid.co2; // lbs CO2 / mile
    const evAnnualCo2Lbs = evCo2PerMile * annualMiles;
    const evAnnualCo2Tons = evAnnualCo2Lbs / 2204.6;

    // Annual gas CO2 (lbs)
    const gasGallons = annualMiles / gasMpg;
    const gasAnnualCo2Lbs = gasGallons * 19.6;
    const gasAnnualCo2Tons = gasAnnualCo2Lbs / 2204.6;

    // Lifetime operational CO2
    const evLifetimeCo2Tons = evAnnualCo2Tons * yearsOwned;
    const gasLifetimeCo2Tons = gasAnnualCo2Tons * yearsOwned;

    // Manufacturing CO2 (approx — gas car ~6 tons, EV varies by battery)
    const gasManufCo2Tons = 6.5;
    const evManufCo2Tons = ev.manuf_co2_tons;

    // Total lifecycle CO2
    const evTotalCo2Tons = evLifetimeCo2Tons + evManufCo2Tons;
    const gasTotalCo2Tons = gasLifetimeCo2Tons + gasManufCo2Tons;

    // Annual savings tons
    const annualSavingsTons = gasAnnualCo2Tons - evAnnualCo2Tons;
    const lifetimeSavingsTons = gasTotalCo2Tons - evTotalCo2Tons;

    // Breakeven year (when cumulative EV CO2 < gas CO2)
    let breakevenYear: number | null = null;
    if (annualSavingsTons > 0) {
      const yearsToBreakeven = (evManufCo2Tons - gasManufCo2Tons) / annualSavingsTons;
      if (yearsToBreakeven > 0 && yearsToBreakeven <= 20) {
        breakevenYear = Math.ceil(yearsToBreakeven);
      } else if (yearsToBreakeven <= 0) {
        breakevenYear = 0; // EV is better from day 1
      }
    }

    // Chart data — cumulative CO2 over yearsOwned
    const chartData = Array.from({ length: Math.min(yearsOwned, 15) + 1 }, (_, yr) => ({
      year: yr,
      ev: parseFloat((evManufCo2Tons + evAnnualCo2Tons * yr).toFixed(2)),
      gas: parseFloat((gasManufCo2Tons + gasAnnualCo2Tons * yr).toFixed(2)),
    }));

    // Equivalencies
    const treesPerYear = Math.round(annualSavingsTons * 40); // ~1 tree absorbs 25 kg/yr
    const flightsEquiv = Math.round(lifetimeSavingsTons / 0.255); // avg US domestic flight 0.255 tons
    const milesNotDriven = Math.round(lifetimeSavingsTons * 2204.6 / 19.6 * gasMpg);

    return {
      evAnnualCo2Tons,
      gasAnnualCo2Tons,
      evTotalCo2Tons,
      gasTotalCo2Tons,
      evManufCo2Tons,
      gasManufCo2Tons,
      annualSavingsTons,
      lifetimeSavingsTons,
      breakevenYear,
      chartData,
      treesPerYear,
      flightsEquiv,
      milesNotDriven,
    };
  }, [ev, grid, annualMiles, gasMpg, yearsOwned]);

  const isBetter = results.annualSavingsTons > 0;

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="rounded-lg border border-border bg-bg-secondary p-6">
        <h2 className="mb-5 font-display text-lg font-bold text-text-primary">Your Details</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {/* EV Model */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Your EV</label>
            <select
              value={evId}
              onChange={(e) => setEvId(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
            >
              {EV_MODELS.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-text-tertiary">{ev.kwh100} kWh/100mi efficiency</p>
          </div>

          {/* State */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">Your State</label>
            <select
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
            >
              {GRID.map((g) => (
                <option key={g.state} value={g.state}>{g.name}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-text-tertiary">Grid: {grid.co2} lbs CO₂/kWh</p>
          </div>

          {/* Annual Miles */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Annual Miles: <span className="text-accent">{annualMiles.toLocaleString()}</span>
            </label>
            <input
              type="range" min={3000} max={30000} step={1000}
              value={annualMiles}
              onChange={(e) => setAnnualMiles(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="mt-1 flex justify-between text-xs text-text-tertiary">
              <span>3,000</span><span>30,000</span>
            </div>
          </div>

          {/* Comparison Gas MPG */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Compare to gas car: <span className="text-accent">{gasMpg} MPG</span>
            </label>
            <input
              type="range" min={15} max={50} step={1}
              value={gasMpg}
              onChange={(e) => setGasMpg(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="mt-1 flex justify-between text-xs text-text-tertiary">
              <span>15 MPG (truck)</span><span>50 MPG (hybrid)</span>
            </div>
          </div>

          {/* Years Owned */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              Years owned: <span className="text-accent">{yearsOwned} years</span>
            </label>
            <input
              type="range" min={1} max={15} step={1}
              value={yearsOwned}
              onChange={(e) => setYearsOwned(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="mt-1 flex justify-between text-xs text-text-tertiary">
              <span>1 year</span><span>15 years</span>
            </div>
          </div>
        </div>
      </div>

      {/* Annual Comparison */}
      <div className={`rounded-lg border p-6 ${isBetter ? 'border-accent/30 bg-accent/5' : 'border-warning/30 bg-warning/5'}`}>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-2xl">{isBetter ? '🌱' : '⚠️'}</span>
          <h2 className="font-display text-xl font-bold text-text-primary">
            {isBetter
              ? `Your EV saves ${fmt(results.annualSavingsTons)} tons of CO₂ per year`
              : `Your EV emits ${fmt(Math.abs(results.annualSavingsTons))} more tons of CO₂ per year`}
          </h2>
        </div>
        <p className="text-sm text-text-secondary">
          {isBetter
            ? `In ${stateCode}, the ${ev.name} produces ${fmt(results.evAnnualCo2Tons)} tons CO₂/year vs ${fmt(results.gasAnnualCo2Tons)} tons for a ${gasMpg}-MPG gas car.`
            : `${stateCode} has a high-carbon grid (${grid.co2} lbs CO₂/kWh). Your EV is still better over time as renewables expand, and produces no tailpipe emissions.`}
        </p>
        {results.breakevenYear !== null && results.breakevenYear > 0 && (
          <p className="mt-2 text-sm text-text-secondary">
            Lifecycle breakeven (including manufacturing): <span className="font-semibold text-text-primary">year {results.breakevenYear}</span>
          </p>
        )}
        {results.breakevenYear === 0 && (
          <p className="mt-2 text-sm text-text-secondary">
            Your EV has a lower carbon footprint than this gas car from <span className="font-semibold text-text-primary">day one</span> — even including manufacturing.
          </p>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'EV annual CO₂', value: `${fmt(results.evAnnualCo2Tons)} tons`, sub: 'operational' },
          { label: 'Gas annual CO₂', value: `${fmt(results.gasAnnualCo2Tons)} tons`, sub: 'operational' },
          { label: `EV ${yearsOwned}-yr total`, value: `${fmt(results.evTotalCo2Tons)} tons`, sub: 'incl. manufacturing' },
          { label: `Gas ${yearsOwned}-yr total`, value: `${fmt(results.gasTotalCo2Tons)} tons`, sub: 'incl. manufacturing' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-bg-secondary p-4 text-center">
            <div className="font-display text-xl font-bold text-text-primary">{stat.value}</div>
            <div className="mt-0.5 text-xs font-medium text-text-secondary">{stat.label}</div>
            <div className="text-xs text-text-tertiary">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Cumulative CO2 Chart */}
      <div className="rounded-lg border border-border bg-bg-secondary p-5">
        <h2 className="mb-4 font-display text-lg font-bold text-text-primary">
          Cumulative CO₂ Over Time (tons)
        </h2>
        <p className="mb-4 text-xs text-text-tertiary">
          Includes manufacturing CO₂ at year 0 — EV: {fmt(results.evManufCo2Tons)} tons, Gas: {fmt(results.gasManufCo2Tons)} tons.
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={results.chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
            <XAxis
              dataKey="year"
              tick={{ fill: '#8888a0', fontSize: 11 }}
              tickFormatter={(v) => `Yr ${v}`}
            />
            <YAxis tick={{ fill: '#8888a0', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: '#12121a', border: '1px solid #2a2a3e', borderRadius: '8px' }}
              labelStyle={{ color: '#f0f0f5' }}
              formatter={(value, name) => [
                `${Number(value ?? 0).toFixed(1)} tons`,
                name === 'ev' ? `${ev.name}` : `${gasMpg} MPG Gas Car`,
              ]}
              labelFormatter={(label) => `Year ${label}`}
            />
            <Legend
              formatter={(value) => value === 'ev' ? ev.name : `${gasMpg} MPG Gas Car`}
              wrapperStyle={{ fontSize: '12px', color: '#8888a0' }}
            />
            <Bar dataKey="ev" fill="#00e676" radius={[2, 2, 0, 0]} />
            <Bar dataKey="gas" fill="#ff5252" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Equivalencies */}
      {isBetter && results.lifetimeSavingsTons > 0 && (
        <div className="rounded-lg border border-border bg-bg-secondary p-5">
          <h2 className="mb-4 font-display text-lg font-bold text-text-primary">
            What Your {yearsOwned}-Year CO₂ Savings Equals
          </h2>
          <p className="mb-4 text-sm text-text-secondary">
            Over {yearsOwned} years, your EV saves <strong className="text-text-primary">{fmt(results.lifetimeSavingsTons)} tons</strong> of CO₂ vs a {gasMpg}-MPG gas car.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                emoji: '🌳',
                headline: `${results.treesPerYear.toLocaleString()} trees`,
                sub: `planted per year`,
                detail: `Equivalent to planting and growing ${results.treesPerYear.toLocaleString()} trees annually for ${yearsOwned} years`,
              },
              {
                emoji: '✈️',
                headline: `${results.flightsEquiv.toLocaleString()} flights`,
                sub: 'avoided',
                detail: `Equivalent to skipping ${results.flightsEquiv.toLocaleString()} average US domestic round trips`,
              },
              {
                emoji: '⛽',
                headline: `${Math.round(results.annualSavingsTons * 2204.6 / 19.6 * gasMpg / 1000).toLocaleString()}K miles`,
                sub: 'of gas driving saved/year',
                detail: `Your annual CO₂ savings equals ${Math.round(results.annualSavingsTons * 2204.6 / 19.6 * gasMpg / 1000).toLocaleString()}K miles of gas car driving`,
              },
            ].map((eq) => (
              <div key={eq.emoji} className="rounded-lg border border-border bg-bg-tertiary p-4 text-center">
                <div className="text-3xl">{eq.emoji}</div>
                <div className="mt-2 font-display text-xl font-bold text-accent">{eq.headline}</div>
                <div className="text-sm text-text-secondary">{eq.sub}</div>
                <div className="mt-1 text-xs text-text-tertiary">{eq.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Methodology */}
      <div className="rounded-lg border border-border bg-bg-secondary p-5">
        <h2 className="mb-3 font-display text-lg font-bold text-text-primary">Methodology</h2>
        <div className="space-y-2 text-sm text-text-secondary">
          <p><strong className="text-text-primary">EV emissions:</strong> kWh/100mi ÷ 100 × state grid CO₂ intensity (lbs CO₂/kWh) × annual miles. Grid data from EPA eGRID2023.</p>
          <p><strong className="text-text-primary">Gas emissions:</strong> Annual miles ÷ MPG × 19.6 lbs CO₂/gallon (EPA combustion factor, doesn&apos;t include upstream extraction).</p>
          <p><strong className="text-text-primary">Manufacturing CO₂:</strong> EPA lifecycle estimates. EV battery manufacturing adds 4–8 tons vs gas vehicles; larger batteries = more manufacturing emissions. Source: Argonne National Laboratory GREET model.</p>
          <p><strong className="text-text-primary">Tree equivalency:</strong> 1 tree absorbs ~55 lbs (25 kg) CO₂/year. Source: US Forest Service.</p>
          <p><strong className="text-text-primary">Flight equivalency:</strong> Average US domestic round trip emits ~0.255 metric tons CO₂. Source: ICAO Carbon Emissions Calculator.</p>
        </div>
      </div>
    </div>
  );
}
