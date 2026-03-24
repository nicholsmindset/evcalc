'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FAQSection } from '@/components/seo/FAQSection';

const CHARGER_LEVELS = [
  { id: 'level1', label: 'Level 1 (120V)', kw: 1.4, desc: 'Standard household outlet' },
  { id: 'level2_32', label: 'Level 2 — 32A (7.7 kW)', kw: 7.7, desc: 'Most home chargers' },
  { id: 'level2_48', label: 'Level 2 — 48A (11.5 kW)', kw: 11.5, desc: 'High-power home charger' },
  { id: 'dc50', label: 'DC Fast — 50 kW', kw: 50, desc: 'Older public fast chargers' },
  { id: 'dc150', label: 'DC Fast — 150 kW', kw: 150, desc: 'Standard fast charger' },
  { id: 'dc350', label: 'DC Fast — 350 kW', kw: 350, desc: 'High-power fast charger' },
];

const CHARGING_FAQS = [
  { question: 'How long does it take to charge an electric car?', answer: 'Charging time depends on battery size and charger speed. Level 1 (120V): 40-60 hours for a full charge. Level 2 at home: 8-12 hours. DC fast charger (50 kW): 1-2 hours from near-empty to 80%. Ultra-fast DC (150-350 kW): 20-45 minutes from 10% to 80%.' },
  { question: 'How long does it take to charge a Tesla?', answer: 'Tesla charging times: Level 2 at 48A: 6-9 hours for a full charge. Tesla Supercharger (250 kW): 15-25 minutes for 80% on Model 3/Y. Model S/X at a V3 Supercharger can add up to 1,000 miles per hour of charging at peak rates.' },
  { question: 'Why do EVs only charge to 80% at fast chargers?', answer: "DC fast chargers slow significantly above 80% to protect battery longevity. The last 20% (80-100%) can take as long as the first 80%. For road trips, it's most efficient to stop at 10-20% and charge to 80% rather than waiting for 100%. Most EVs show this charging curve in their navigation systems." },
  { question: 'How many kWh does it take to charge an EV?', answer: 'It depends on battery size and current state of charge. Most EVs have 40-100 kWh batteries. Charging from empty to full requires the full battery capacity minus charging losses (typically 10-15%). A 75 kWh battery needs about 83 kWh of grid electricity for a complete charge.' },
  { question: 'Does charging speed damage EV batteries?', answer: 'Frequent DC fast charging can slightly accelerate battery degradation — typically an additional 1-2% per year for daily fast chargers. Level 2 charging is gentler on the battery. Most manufacturers recommend using DC fast charging only when needed on trips, and relying on Level 2 for daily charging.' },
];

export default function EvChargingTimeCalculatorPage() {
  const [batteryKwh, setBatteryKwh] = useState(75);
  const [currentSoc, setCurrentSoc] = useState(20);
  const [targetSoc, setTargetSoc] = useState(80);
  const [chargerId, setChargerId] = useState('level2_48');

  const charger = CHARGER_LEVELS.find((c) => c.id === chargerId)!;
  const kwhNeeded = (batteryKwh * (targetSoc - currentSoc)) / 100;
  const chargingEfficiency = charger.kw >= 50 ? 0.92 : 0.88;
  const effectiveKw = Math.min(charger.kw, batteryKwh * 1.5); // cap at vehicle's max charge rate
  const hoursRaw = kwhNeeded / (effectiveKw * chargingEfficiency);
  const hours = Math.max(0, hoursRaw);
  const hoursInt = Math.floor(hours);
  const minutesInt = Math.round((hours - hoursInt) * 60);
  const timeStr = hoursInt > 0 ? `${hoursInt}h ${minutesInt}m` : `${minutesInt} min`;

  const milesAdded = Math.round(kwhNeeded * 3.5); // rough estimate

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          EV Charging Time Calculator — How Long to Charge?
        </h1>
        <p className="mt-3 max-w-2xl text-text-secondary">
          Calculate exactly how long it takes to charge any electric vehicle based on battery size,
          current charge level, and charger type.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Inputs */}
        <div className="space-y-6">
          {/* Battery Size */}
          <div className="rounded-xl border border-border bg-bg-secondary p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-text-primary">Battery Size</h3>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={20}
                max={130}
                step={1}
                value={batteryKwh}
                onChange={(e) => setBatteryKwh(Number(e.target.value))}
                className="flex-1 accent-accent"
              />
              <span className="w-20 text-right font-mono text-lg font-bold text-accent">{batteryKwh} kWh</span>
            </div>
            <p className="mt-2 text-xs text-text-tertiary">Common sizes: Leaf 40 kWh, Model 3 75 kWh, Model S 100 kWh, Hummer EV 212 kWh</p>
          </div>

          {/* State of Charge */}
          <div className="rounded-xl border border-border bg-bg-secondary p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-text-primary">Charge Range</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="w-28 text-sm text-text-secondary">Starting at</label>
                <input
                  type="range"
                  min={0}
                  max={90}
                  step={5}
                  value={currentSoc}
                  onChange={(e) => setCurrentSoc(Number(e.target.value))}
                  className="flex-1 accent-accent"
                />
                <span className="w-12 text-right font-mono font-bold text-text-primary">{currentSoc}%</span>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-28 text-sm text-text-secondary">Charging to</label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={targetSoc}
                  onChange={(e) => setTargetSoc(Number(e.target.value))}
                  className="flex-1 accent-accent"
                />
                <span className="w-12 text-right font-mono font-bold text-accent">{targetSoc}%</span>
              </div>
            </div>
          </div>

          {/* Charger Type */}
          <div className="rounded-xl border border-border bg-bg-secondary p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-text-primary">Charger Type</h3>
            <div className="space-y-2">
              {CHARGER_LEVELS.map((c) => (
                <label
                  key={c.id}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
                    chargerId === c.id
                      ? 'border-accent/50 bg-accent/5'
                      : 'border-border hover:bg-bg-tertiary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="charger"
                      value={c.id}
                      checked={chargerId === c.id}
                      onChange={() => setChargerId(c.id)}
                      className="accent-accent"
                    />
                    <div>
                      <div className="text-sm font-medium text-text-primary">{c.label}</div>
                      <div className="text-xs text-text-tertiary">{c.desc}</div>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-semibold text-accent">{c.kw} kW</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="rounded-xl border border-accent/30 bg-bg-secondary p-6 text-center">
            <div className="text-sm text-text-secondary">Estimated Charge Time</div>
            <div className="mt-2 font-mono text-5xl font-bold text-accent">{timeStr}</div>
            <div className="mt-3 text-sm text-text-tertiary">
              Adding ~{milesAdded} miles of range
            </div>
          </div>

          <div className="rounded-xl border border-border bg-bg-secondary p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-tertiary">Energy needed</span>
              <span className="font-mono font-semibold text-text-primary">{kwhNeeded.toFixed(1)} kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-tertiary">Charger output</span>
              <span className="font-mono font-semibold text-text-primary">{charger.kw} kW</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-tertiary">Charging efficiency</span>
              <span className="font-mono font-semibold text-text-primary">{Math.round(chargingEfficiency * 100)}%</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-bg-secondary p-4 text-sm text-text-secondary">
            <strong className="text-text-primary">Tip:</strong> For road trips, charging from 10% to 80% is most efficient — the last 20% charges at half speed to protect your battery.
          </div>
        </div>
      </div>

      {/* All Charger Speed Reference */}
      <section className="mt-12 mb-12">
        <h2 className="mb-6 text-xl font-display font-bold text-text-primary">
          Charging Speed Reference Guide
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-secondary text-left text-xs text-text-tertiary">
                <th className="px-4 py-3">Charger Type</th>
                <th className="px-4 py-3">Power</th>
                <th className="px-4 py-3">Miles / Hour</th>
                <th className="px-4 py-3">Best For</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: 'Level 1 (120V)', power: '1.4 kW', mph: '3-5 mi', use: 'PHEVs, overnight trickle charge' },
                { type: 'Level 2 — 32A', power: '7.7 kW', mph: '25-30 mi', use: 'Daily home charging' },
                { type: 'Level 2 — 48A', power: '11.5 kW', mph: '35-45 mi', use: 'Fast home or destination charging' },
                { type: 'DC Fast 50 kW', power: '50 kW', mph: '100-150 mi', use: 'Older public stations' },
                { type: 'DC Fast 150 kW', power: '150 kW', mph: '200-300 mi', use: 'Highway charging stops' },
                { type: 'DC Fast 350 kW', power: '350 kW', mph: '400-600 mi', use: 'Ultra-fast road trip charging' },
              ].map((row) => (
                <tr key={row.type} className="border-b border-border/50">
                  <td className="px-4 py-3 font-medium text-text-primary">{row.type}</td>
                  <td className="px-4 py-3 font-mono text-accent">{row.power}</td>
                  <td className="px-4 py-3 font-mono text-text-secondary">{row.mph}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Related Tools */}
      <section className="mb-12 rounded-xl border border-border bg-bg-secondary p-6">
        <h2 className="mb-4 text-lg font-display font-semibold text-text-primary">Related Tools</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/charging-cost-calculator" className="text-sm text-accent hover:underline">Charging Cost Calculator</Link>
          <Link href="/charging-stations" className="text-sm text-accent hover:underline">Find Charging Stations</Link>
          <Link href="/home-charger" className="text-sm text-accent hover:underline">Home Charger Guide</Link>
          <Link href="/road-trip-planner" className="text-sm text-accent hover:underline">Road Trip Planner</Link>
          <Link href="/calculator" className="text-sm text-accent hover:underline">Range Calculator</Link>
          <Link href="/ev-vs-gas" className="text-sm text-accent hover:underline">EV vs Gas Savings</Link>
        </div>
      </section>

      <FAQSection faqs={CHARGING_FAQS} />
    </div>
  );
}
