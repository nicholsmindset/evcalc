'use client';

import { useState } from 'react';
import { calculateRange } from '@/lib/calculations/range';

const PRESET_VEHICLES = [
  { label: 'Tesla Model 3 LR', epaRange: 341 },
  { label: 'Tesla Model Y LR', epaRange: 310 },
  { label: 'Hyundai Ioniq 5 LR', epaRange: 303 },
  { label: 'Kia EV6 LR', epaRange: 310 },
  { label: 'Ford Mach-E SR', epaRange: 250 },
  { label: 'Chevy Equinox EV', epaRange: 319 },
  { label: 'BMW iX xDrive50', epaRange: 324 },
  { label: 'Nissan Ariya', epaRange: 304 },
];

export default function EmbedCalculator() {
  const [selectedVehicle, setSelectedVehicle] = useState(0);
  const [tempF, setTempF] = useState(70);
  const [speedMph, setSpeedMph] = useState(65);
  const [terrain, setTerrain] = useState<'city' | 'mixed' | 'highway'>('mixed');

  const vehicle = PRESET_VEHICLES[selectedVehicle];
  const result = calculateRange({
    epaRangeMi: vehicle.epaRange,
    temperatureF: tempF,
    speedMph: speedMph,
    terrain,
    hvacMode: tempF < 50 ? 'heat_pump' : tempF > 85 ? 'ac' : 'off',
    cargoLbs: 0,
    batteryHealthPct: 100,
  });

  const pctColor =
    result.pctOfEpa >= 80 ? 'text-[#00e676]' :
    result.pctOfEpa >= 50 ? 'text-[#66bb6a]' :
    result.pctOfEpa >= 30 ? 'text-[#ffc107]' : 'text-[#ff5252]';

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-4 font-sans text-[#f0f0f5]">
      <div className="mx-auto max-w-md rounded-xl border border-[#2a2a3e] bg-[#12121a] p-5">
        <h2 className="text-center text-lg font-bold">EV Range Calculator</h2>

        {/* Vehicle Select */}
        <div className="mt-4">
          <label className="block text-xs text-[#8888a0]">Vehicle</label>
          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-[#2a2a3e] bg-[#1a1a2e] px-3 py-2 text-sm text-[#f0f0f5] focus:border-[#00e676]/50 focus:outline-none"
          >
            {PRESET_VEHICLES.map((v, i) => (
              <option key={i} value={i}>{v.label} ({v.epaRange} mi EPA)</option>
            ))}
          </select>
        </div>

        {/* Temperature */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-[#8888a0]">
            <span>Temperature</span>
            <span className="font-mono text-[#f0f0f5]">{tempF}°F</span>
          </div>
          <input
            type="range"
            min={-10}
            max={110}
            value={tempF}
            onChange={(e) => setTempF(Number(e.target.value))}
            className="mt-1 w-full accent-[#00e676]"
          />
        </div>

        {/* Speed */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-[#8888a0]">
            <span>Speed</span>
            <span className="font-mono text-[#f0f0f5]">{speedMph} mph</span>
          </div>
          <input
            type="range"
            min={25}
            max={85}
            value={speedMph}
            onChange={(e) => setSpeedMph(Number(e.target.value))}
            className="mt-1 w-full accent-[#00e676]"
          />
        </div>

        {/* Terrain */}
        <div className="mt-4">
          <label className="block text-xs text-[#8888a0]">Terrain</label>
          <div className="mt-1 grid grid-cols-3 gap-2">
            {(['city', 'mixed', 'highway'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTerrain(t)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-colors ${
                  terrain === t
                    ? 'border-[#00e676]/50 bg-[#00e676]/10 text-[#00e676]'
                    : 'border-[#2a2a3e] bg-[#1a1a2e] text-[#8888a0] hover:text-[#f0f0f5]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        <div className="mt-6 rounded-xl border border-[#2a2a3e] bg-[#1a1a2e] p-5 text-center">
          <p className="text-xs text-[#8888a0]">Estimated Range</p>
          <p className="mt-1 font-mono text-4xl font-bold text-[#00e676]">
            {result.adjustedRangeMi} mi
          </p>
          <p className={`mt-1 text-sm font-mono ${pctColor}`}>
            {result.pctOfEpa}% of EPA range
          </p>
          <div className="mt-3 h-2 rounded-full bg-[#2a2a3e]">
            <div
              className="h-2 rounded-full bg-[#00e676] transition-all"
              style={{ width: `${Math.min(result.pctOfEpa, 100)}%` }}
            />
          </div>
        </div>

        {/* Attribution */}
        <div className="mt-4 text-center">
          <a
            href="https://www.evrangetools.com/calculator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#00e676] hover:underline"
          >
            Full calculator at EVRangeCalculator.com
          </a>
        </div>
      </div>
    </div>
  );
}
