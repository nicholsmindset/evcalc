'use client';

import { useState, useMemo } from 'react';

interface WinterCity {
  city: string;
  state: string;
  stateCode: string;
  decF: number;
  janF: number;
  febF: number;
  recordLow: number;
}

// Static winter temps (from migration 014 seed)
const CITIES: WinterCity[] = [
  { city: 'Anchorage', state: 'Alaska', stateCode: 'AK', decF: 13.8, janF: 8.8, febF: 13.6, recordLow: -38 },
  { city: 'Fairbanks', state: 'Alaska', stateCode: 'AK', decF: -12.2, janF: -16.9, febF: -6.6, recordLow: -66 },
  { city: 'Birmingham', state: 'Alabama', stateCode: 'AL', decF: 45.0, janF: 43.0, febF: 46.8, recordLow: -10 },
  { city: 'Phoenix', state: 'Arizona', stateCode: 'AZ', decF: 54.2, janF: 52.3, febF: 55.9, recordLow: 17 },
  { city: 'Flagstaff', state: 'Arizona', stateCode: 'AZ', decF: 29.0, janF: 26.6, febF: 29.5, recordLow: -22 },
  { city: 'Little Rock', state: 'Arkansas', stateCode: 'AR', decF: 42.7, janF: 40.5, febF: 45.2, recordLow: -12 },
  { city: 'Los Angeles', state: 'California', stateCode: 'CA', decF: 57.0, janF: 56.1, febF: 57.4, recordLow: 23 },
  { city: 'San Francisco', state: 'California', stateCode: 'CA', decF: 51.1, janF: 49.4, febF: 51.8, recordLow: 20 },
  { city: 'Sacramento', state: 'California', stateCode: 'CA', decF: 46.6, janF: 44.5, febF: 48.4, recordLow: 17 },
  { city: 'San Diego', state: 'California', stateCode: 'CA', decF: 60.4, janF: 58.8, febF: 60.0, recordLow: 29 },
  { city: 'Denver', state: 'Colorado', stateCode: 'CO', decF: 29.9, janF: 28.8, febF: 33.2, recordLow: -29 },
  { city: 'Hartford', state: 'Connecticut', stateCode: 'CT', decF: 30.1, janF: 25.7, febF: 28.9, recordLow: -26 },
  { city: 'Washington DC', state: 'District of Columbia', stateCode: 'DC', decF: 38.5, janF: 35.2, febF: 38.4, recordLow: -15 },
  { city: 'Miami', state: 'Florida', stateCode: 'FL', decF: 69.4, janF: 67.4, febF: 68.4, recordLow: 30 },
  { city: 'Orlando', state: 'Florida', stateCode: 'FL', decF: 61.0, janF: 59.3, febF: 60.8, recordLow: 18 },
  { city: 'Jacksonville', state: 'Florida', stateCode: 'FL', decF: 54.6, janF: 52.4, febF: 55.1, recordLow: 7 },
  { city: 'Atlanta', state: 'Georgia', stateCode: 'GA', decF: 45.3, janF: 42.7, febF: 46.3, recordLow: -8 },
  { city: 'Honolulu', state: 'Hawaii', stateCode: 'HI', decF: 72.7, janF: 72.6, febF: 72.6, recordLow: 52 },
  { city: 'Chicago', state: 'Illinois', stateCode: 'IL', decF: 27.2, janF: 22.0, febF: 26.5, recordLow: -27 },
  { city: 'Des Moines', state: 'Iowa', stateCode: 'IA', decF: 22.5, janF: 18.2, febF: 22.7, recordLow: -30 },
  { city: 'Boise', state: 'Idaho', stateCode: 'ID', decF: 31.2, janF: 30.5, febF: 36.1, recordLow: -25 },
  { city: 'Indianapolis', state: 'Indiana', stateCode: 'IN', decF: 31.6, janF: 26.4, febF: 30.4, recordLow: -27 },
  { city: 'Wichita', state: 'Kansas', stateCode: 'KS', decF: 32.5, janF: 29.8, febF: 35.0, recordLow: -22 },
  { city: 'Louisville', state: 'Kentucky', stateCode: 'KY', decF: 37.0, janF: 33.8, febF: 37.1, recordLow: -22 },
  { city: 'New Orleans', state: 'Louisiana', stateCode: 'LA', decF: 54.0, janF: 51.9, febF: 55.2, recordLow: 11 },
  { city: 'Boston', state: 'Massachusetts', stateCode: 'MA', decF: 32.7, janF: 28.3, febF: 30.1, recordLow: -18 },
  { city: 'Baltimore', state: 'Maryland', stateCode: 'MD', decF: 37.7, janF: 32.8, febF: 35.9, recordLow: -7 },
  { city: 'Portland', state: 'Maine', stateCode: 'ME', decF: 24.3, janF: 20.8, febF: 23.9, recordLow: -39 },
  { city: 'Detroit', state: 'Michigan', stateCode: 'MI', decF: 26.9, janF: 22.4, febF: 25.7, recordLow: -21 },
  { city: 'Minneapolis', state: 'Minnesota', stateCode: 'MN', decF: 15.4, janF: 10.5, febF: 16.4, recordLow: -41 },
  { city: 'Kansas City', state: 'Missouri', stateCode: 'MO', decF: 32.4, janF: 28.5, febF: 33.3, recordLow: -23 },
  { city: 'St. Louis', state: 'Missouri', stateCode: 'MO', decF: 35.8, janF: 30.6, febF: 35.4, recordLow: -18 },
  { city: 'Jackson', state: 'Mississippi', stateCode: 'MS', decF: 47.5, janF: 44.5, febF: 48.9, recordLow: -5 },
  { city: 'Billings', state: 'Montana', stateCode: 'MT', decF: 26.6, janF: 22.7, febF: 27.3, recordLow: -43 },
  { city: 'Charlotte', state: 'North Carolina', stateCode: 'NC', decF: 43.5, janF: 40.5, febF: 44.0, recordLow: -5 },
  { city: 'Raleigh', state: 'North Carolina', stateCode: 'NC', decF: 40.8, janF: 38.2, febF: 41.5, recordLow: -9 },
  { city: 'Bismarck', state: 'North Dakota', stateCode: 'ND', decF: 11.0, janF: 6.0, febF: 11.4, recordLow: -44 },
  { city: 'Omaha', state: 'Nebraska', stateCode: 'NE', decF: 22.3, janF: 17.7, febF: 23.1, recordLow: -23 },
  { city: 'Concord', state: 'New Hampshire', stateCode: 'NH', decF: 22.4, janF: 18.1, febF: 22.1, recordLow: -37 },
  { city: 'Newark', state: 'New Jersey', stateCode: 'NJ', decF: 36.4, janF: 30.2, febF: 33.2, recordLow: -14 },
  { city: 'Albuquerque', state: 'New Mexico', stateCode: 'NM', decF: 36.0, janF: 34.6, febF: 39.4, recordLow: -17 },
  { city: 'Las Vegas', state: 'Nevada', stateCode: 'NV', decF: 44.3, janF: 42.3, febF: 47.8, recordLow: 8 },
  { city: 'Reno', state: 'Nevada', stateCode: 'NV', decF: 32.2, janF: 30.2, febF: 35.5, recordLow: -19 },
  { city: 'New York City', state: 'New York', stateCode: 'NY', decF: 36.8, janF: 31.7, febF: 34.3, recordLow: -15 },
  { city: 'Buffalo', state: 'New York', stateCode: 'NY', decF: 28.1, janF: 23.5, febF: 25.1, recordLow: -20 },
  { city: 'Columbus', state: 'Ohio', stateCode: 'OH', decF: 34.0, janF: 28.3, febF: 32.0, recordLow: -20 },
  { city: 'Cleveland', state: 'Ohio', stateCode: 'OH', decF: 31.2, janF: 26.3, febF: 28.3, recordLow: -19 },
  { city: 'Oklahoma City', state: 'Oklahoma', stateCode: 'OK', decF: 40.1, janF: 36.6, febF: 41.8, recordLow: -17 },
  { city: 'Portland', state: 'Oregon', stateCode: 'OR', decF: 41.2, janF: 39.6, febF: 43.3, recordLow: -3 },
  { city: 'Philadelphia', state: 'Pennsylvania', stateCode: 'PA', decF: 38.9, janF: 33.2, febF: 35.9, recordLow: -11 },
  { city: 'Pittsburgh', state: 'Pennsylvania', stateCode: 'PA', decF: 33.2, janF: 27.6, febF: 30.4, recordLow: -22 },
  { city: 'Providence', state: 'Rhode Island', stateCode: 'RI', decF: 31.0, janF: 26.9, febF: 29.3, recordLow: -17 },
  { city: 'Columbia', state: 'South Carolina', stateCode: 'SC', decF: 46.7, janF: 44.0, febF: 48.0, recordLow: -1 },
  { city: 'Sioux Falls', state: 'South Dakota', stateCode: 'SD', decF: 16.3, janF: 12.2, febF: 17.8, recordLow: -36 },
  { city: 'Nashville', state: 'Tennessee', stateCode: 'TN', decF: 40.5, janF: 37.1, febF: 41.8, recordLow: -17 },
  { city: 'Dallas', state: 'Texas', stateCode: 'TX', decF: 46.9, janF: 44.1, febF: 48.8, recordLow: -2 },
  { city: 'Houston', state: 'Texas', stateCode: 'TX', decF: 54.1, janF: 52.1, febF: 55.5, recordLow: 7 },
  { city: 'Austin', state: 'Texas', stateCode: 'TX', decF: 50.9, janF: 48.7, febF: 52.8, recordLow: 2 },
  { city: 'Salt Lake City', state: 'Utah', stateCode: 'UT', decF: 30.0, janF: 28.5, febF: 34.5, recordLow: -22 },
  { city: 'Richmond', state: 'Virginia', stateCode: 'VA', decF: 40.6, janF: 36.3, febF: 39.5, recordLow: -12 },
  { city: 'Burlington', state: 'Vermont', stateCode: 'VT', decF: 22.1, janF: 17.3, febF: 20.2, recordLow: -30 },
  { city: 'Seattle', state: 'Washington', stateCode: 'WA', decF: 41.5, janF: 40.3, febF: 43.0, recordLow: 0 },
  { city: 'Spokane', state: 'Washington', stateCode: 'WA', decF: 27.5, janF: 25.2, febF: 30.5, recordLow: -30 },
  { city: 'Milwaukee', state: 'Wisconsin', stateCode: 'WI', decF: 23.0, janF: 18.5, febF: 22.8, recordLow: -26 },
  { city: 'Madison', state: 'Wisconsin', stateCode: 'WI', decF: 19.0, janF: 14.4, febF: 20.0, recordLow: -37 },
  { city: 'Charleston', state: 'West Virginia', stateCode: 'WV', decF: 36.0, janF: 32.1, febF: 35.5, recordLow: -16 },
  { city: 'Cheyenne', state: 'Wyoming', stateCode: 'WY', decF: 25.5, janF: 25.0, febF: 27.8, recordLow: -38 },
];

interface EVModel {
  slug: string;
  label: string;
  epaRange: number;
  hasHeatPump: boolean;
  heatPumpBrand?: string;
}

const EVS: EVModel[] = [
  { slug: 'tesla-model-3-lr-2024', label: 'Tesla Model 3 Long Range', epaRange: 358, hasHeatPump: true, heatPumpBrand: 'Tesla' },
  { slug: 'tesla-model-y-lr-2024', label: 'Tesla Model Y Long Range', epaRange: 330, hasHeatPump: true, heatPumpBrand: 'Tesla' },
  { slug: 'tesla-model-x-2024', label: 'Tesla Model X', epaRange: 335, hasHeatPump: true, heatPumpBrand: 'Tesla' },
  { slug: 'hyundai-ioniq-5-lr-2024', label: 'Hyundai IONIQ 5 Long Range', epaRange: 266, hasHeatPump: true, heatPumpBrand: 'Hyundai' },
  { slug: 'hyundai-ioniq-6-lr-2024', label: 'Hyundai IONIQ 6 Long Range', epaRange: 361, hasHeatPump: true, heatPumpBrand: 'Hyundai' },
  { slug: 'kia-ev6-lr-2024', label: 'Kia EV6 Long Range', epaRange: 310, hasHeatPump: true, heatPumpBrand: 'Kia' },
  { slug: 'chevy-equinox-ev-2024', label: 'Chevrolet Equinox EV', epaRange: 319, hasHeatPump: true, heatPumpBrand: 'Ultium' },
  { slug: 'vw-id4-pro-2024', label: 'Volkswagen ID.4 Pro', epaRange: 291, hasHeatPump: true, heatPumpBrand: 'VW' },
  { slug: 'ford-f150-lightning-ext-2024', label: 'Ford F-150 Lightning Extended', epaRange: 320, hasHeatPump: false },
  { slug: 'rivian-r1t-2024', label: 'Rivian R1T', epaRange: 270, hasHeatPump: false },
  { slug: 'nissan-leaf-plus-2024', label: 'Nissan LEAF Plus', epaRange: 212, hasHeatPump: false },
  { slug: 'chevy-bolt-2023', label: 'Chevrolet Bolt EV', epaRange: 259, hasHeatPump: false },
  { slug: 'bmw-i4-2024', label: 'BMW i4 eDrive40', epaRange: 301, hasHeatPump: true, heatPumpBrand: 'BMW' },
  { slug: 'lucid-air-2024', label: 'Lucid Air Grand Touring', epaRange: 516, hasHeatPump: true, heatPumpBrand: 'Lucid' },
  { slug: 'mercedes-eqs-2024', label: 'Mercedes EQS 450+', epaRange: 350, hasHeatPump: true, heatPumpBrand: 'Mercedes' },
];

// Temperature coefficients from CLAUDE.md
function tempCoefficient(tempF: number): number {
  if (tempF >= 60 && tempF <= 80) return 0;
  if (tempF > 80) return -(tempF - 80) * 0.003;
  if (tempF >= 40) return -(60 - tempF) * 0.005;
  if (tempF >= 20) return -0.10 - (40 - tempF) * 0.008;
  return -0.26 - (20 - tempF) * 0.012;
}

// HVAC coefficients
const HVAC_COEFF = { heat_pump: -0.08, resistive: -0.17, none: 0 };

function calcRange(epaRange: number, tempF: number, hvac: keyof typeof HVAC_COEFF): number {
  const tCoeff = tempCoefficient(tempF);
  const hCoeff = HVAC_COEFF[hvac];
  return Math.round(epaRange * (1 + tCoeff) * (1 + hCoeff));
}

const WINTER_CHECKLIST = [
  'Pre-condition the battery while still plugged in',
  'Keep battery above 20% — cold reduces regen braking effectiveness',
  'Use seat heaters instead of cabin heat where possible',
  'Set departure time in the app for pre-warming',
  'Keep tire pressure at recommended levels (cold air reduces pressure)',
  'Know your nearest DC fast charger along your route',
  'Carry an emergency Level 1 cord as backup',
];

type TempScenario = { label: string; tempF: number; color: string };

export default function WinterCalcContent() {
  const [evSlug, setEvSlug] = useState(EVS[0].slug);
  const [cityKey, setCityKey] = useState('Minneapolis,MN');
  const [showChecklist, setShowChecklist] = useState(false);

  const ev = EVS.find(e => e.slug === evSlug) ?? EVS[0];
  const city = CITIES.find(c => `${c.city},${c.stateCode}` === cityKey) ?? CITIES[0];
  const coldestAvg = Math.min(city.decF, city.janF, city.febF);

  const results = useMemo(() => {
    const scenarios: TempScenario[] = [
      { label: `Avg coldest month (${Math.round(coldestAvg)}°F)`, tempF: coldestAvg, color: 'text-accent' },
      { label: '20°F cold day', tempF: 20, color: 'text-warning' },
      { label: '0°F extreme cold', tempF: 0, color: 'text-error' },
      { label: `Record low (${city.recordLow}°F)`, tempF: city.recordLow, color: 'text-error' },
    ];
    return scenarios.map(s => ({
      ...s,
      withHeatPump: ev.hasHeatPump ? calcRange(ev.epaRange, s.tempF, 'heat_pump') : null,
      withResistive: calcRange(ev.epaRange, s.tempF, 'resistive'),
      noHvac: calcRange(ev.epaRange, s.tempF, 'none'),
      pctOfEpa: {
        heatPump: ev.hasHeatPump ? Math.round((calcRange(ev.epaRange, s.tempF, 'heat_pump') / ev.epaRange) * 100) : null,
        resistive: Math.round((calcRange(ev.epaRange, s.tempF, 'resistive') / ev.epaRange) * 100),
      },
    }));
  }, [ev, coldestAvg, city.recordLow]);

  const heatPumpSaving = ev.hasHeatPump
    ? calcRange(ev.epaRange, coldestAvg, 'heat_pump') - calcRange(ev.epaRange, coldestAvg, 'resistive')
    : 0;

  return (
    <div>
      {/* Selectors */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Your EV</label>
          <select
            value={evSlug}
            onChange={(e) => setEvSlug(e.target.value)}
            className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-3 text-text-primary outline-none focus:border-accent/60"
          >
            {EVS.map(e => (
              <option key={e.slug} value={e.slug}>
                {e.label} ({e.epaRange} mi EPA)
              </option>
            ))}
          </select>
          <div className="mt-1 flex gap-2 text-xs">
            <span className="text-text-tertiary">{ev.epaRange} mi EPA ·</span>
            <span className={ev.hasHeatPump ? 'text-accent' : 'text-text-tertiary'}>
              {ev.hasHeatPump ? `✓ Heat pump (${ev.heatPumpBrand})` : '✗ No heat pump'}
            </span>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Your City</label>
          <select
            value={cityKey}
            onChange={(e) => setCityKey(e.target.value)}
            className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-3 text-text-primary outline-none focus:border-accent/60"
          >
            {CITIES.sort((a, b) => a.city.localeCompare(b.city)).map(c => (
              <option key={`${c.city},${c.stateCode}`} value={`${c.city},${c.stateCode}`}>
                {c.city}, {c.stateCode} (avg Jan: {Math.round(c.janF)}°F)
              </option>
            ))}
          </select>
          <div className="mt-1 text-xs text-text-tertiary">
            Dec: {Math.round(city.decF)}°F · Jan: {Math.round(city.janF)}°F · Feb: {Math.round(city.febF)}°F · Record low: {city.recordLow}°F
          </div>
        </div>
      </div>

      {/* Results table */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-secondary">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-tertiary">Temperature</th>
                {ev.hasHeatPump && (
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-tertiary">With Heat Pump</th>
                )}
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                  {ev.hasHeatPump ? 'Without Heat Pump' : 'With Heater On'}
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-tertiary">No Heat (max range)</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} className={`border-b border-border last:border-0 ${i === 0 ? 'bg-accent/5' : ''}`}>
                  <td className="px-4 py-3">
                    <div className={`font-medium ${r.color}`}>{r.label}</div>
                  </td>
                  {ev.hasHeatPump && (
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono font-bold text-text-primary">{r.withHeatPump} mi</span>
                      <span className="ml-1 text-xs text-text-tertiary">({r.pctOfEpa.heatPump}%)</span>
                    </td>
                  )}
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono font-bold text-text-primary">{r.withResistive} mi</span>
                    <span className="ml-1 text-xs text-text-tertiary">({r.pctOfEpa.resistive}%)</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono text-text-secondary">{r.noHvac} mi</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Heat pump callout */}
      {ev.hasHeatPump ? (
        <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">✅</span>
            <div>
              <div className="font-semibold text-text-primary">
                Heat pump saves ~{heatPumpSaving} miles vs resistive heat in {city.city}
              </div>
              <p className="mt-1 text-sm text-text-secondary">
                The {ev.heatPumpBrand} heat pump moves heat rather than generating it, using 50-70% less energy
                than a resistive heater. This is the single biggest factor in winter range retention.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-xl border border-warning/20 bg-warning/5 p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <div className="font-semibold text-text-primary">
                No heat pump — winter range impact is more significant
              </div>
              <p className="mt-1 text-sm text-text-secondary">
                Without a heat pump, the resistive heater draws significant battery power in cold weather.
                Pre-conditioning while plugged in, using seat heaters, and setting a departure time
                are your best strategies to maximize winter range.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Winter checklist */}
      <div className="rounded-xl border border-border bg-bg-secondary p-5">
        <button
          onClick={() => setShowChecklist(!showChecklist)}
          className="flex w-full items-center justify-between text-left"
        >
          <h2 className="font-display text-base font-bold text-text-primary">
            ❄️ Winter EV Prep Checklist
          </h2>
          <span className="text-text-tertiary">{showChecklist ? '▲' : '▼'}</span>
        </button>
        {showChecklist && (
          <ul className="mt-4 space-y-2">
            {WINTER_CHECKLIST.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="mt-0.5 text-accent">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* How it works */}
      <section className="mt-8 border-t border-border pt-6">
        <h2 className="mb-3 font-display text-base font-bold text-text-primary">How Winter Range Is Calculated</h2>
        <p className="text-sm text-text-secondary">
          Range calculations use a physics-based temperature coefficient model. Cold temperatures affect range in two ways:
          (1) the battery itself has higher internal resistance, reducing capacity — this effect steepens below 32°F and
          becomes severe below 20°F; (2) cabin heating draws power directly from the traction battery.
          A heat pump reduces (2) by 50-70% vs resistive heat by moving heat from outside rather than generating it.
          The model is calibrated against Recurrent Auto and Geotab real-world EV fleet data.
        </p>
      </section>
    </div>
  );
}
