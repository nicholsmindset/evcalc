'use client';

import { useState } from 'react';

const CHARGER_LEVELS = [
  { id: 'level1', label: 'Level 1 (120V)', kw: 1.4, desc: 'Standard household outlet' },
  { id: 'level2_32', label: 'Level 2 — 32A (7.7 kW)', kw: 7.7, desc: 'Most home chargers' },
  { id: 'level2_48', label: 'Level 2 — 48A (11.5 kW)', kw: 11.5, desc: 'High-power home charger' },
  { id: 'dc50', label: 'DC Fast — 50 kW', kw: 50, desc: 'Older public fast chargers' },
  { id: 'dc150', label: 'DC Fast — 150 kW', kw: 150, desc: 'Standard fast charger' },
  { id: 'dc350', label: 'DC Fast — 350 kW', kw: 350, desc: 'High-power fast charger' },
];

export function ChargingTimeTool() {
  const [batteryKwh, setBatteryKwh] = useState(75);
  const [currentSoc, setCurrentSoc] = useState(20);
  const [targetSoc, setTargetSoc] = useState(80);
  const [chargerId, setChargerId] = useState('level2_48');

  const charger = CHARGER_LEVELS.find((c) => c.id === chargerId)!;
  const kwhNeeded = (batteryKwh * (targetSoc - currentSoc)) / 100;
  const chargingEfficiency = charger.kw >= 50 ? 0.92 : 0.88;
  const effectiveKw = Math.min(charger.kw, batteryKwh * 1.5);
  const hoursRaw = kwhNeeded / (effectiveKw * chargingEfficiency);
  const hours = Math.max(0, hoursRaw);
  const hoursInt = Math.floor(hours);
  const minutesInt = Math.round((hours - hoursInt) * 60);
  const timeStr = hoursInt > 0 ? `${hoursInt}h ${minutesInt}m` : `${minutesInt} min`;

  const milesAdded = Math.round(kwhNeeded * 3.5);

  return (
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
  );
}
