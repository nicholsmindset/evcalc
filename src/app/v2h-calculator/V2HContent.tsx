'use client';

import { useState, useMemo } from 'react';

interface V2HVehicle {
  slug: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  batteryKwh: number;
  v2hMaxKw: number;
  capability: 'V2H' | 'V2L';
}

const V2H_VEHICLES: V2HVehicle[] = [
  { slug: 'ford-f150-lightning-extended-2024', make: 'Ford', model: 'F-150 Lightning', year: 2024, trim: 'Extended Range', batteryKwh: 131, v2hMaxKw: 9.6, capability: 'V2H' },
  { slug: 'ford-f150-lightning-standard-2024', make: 'Ford', model: 'F-150 Lightning', year: 2024, trim: 'Standard Range', batteryKwh: 98, v2hMaxKw: 9.6, capability: 'V2H' },
  { slug: 'rivian-r1t-standard-2024', make: 'Rivian', model: 'R1T', year: 2024, trim: 'Standard', batteryKwh: 135, v2hMaxKw: 11.5, capability: 'V2H' },
  { slug: 'rivian-r1s-standard-2024', make: 'Rivian', model: 'R1S', year: 2024, trim: 'Standard', batteryKwh: 135, v2hMaxKw: 11.5, capability: 'V2H' },
  { slug: 'hyundai-ioniq-5-long-range-2024', make: 'Hyundai', model: 'IONIQ 5', year: 2024, trim: 'Long Range', batteryKwh: 77.4, v2hMaxKw: 3.6, capability: 'V2L' },
  { slug: 'kia-ev6-long-range-2024', make: 'Kia', model: 'EV6', year: 2024, trim: 'Long Range', batteryKwh: 77.4, v2hMaxKw: 3.6, capability: 'V2L' },
  { slug: 'kia-ev9-2024', make: 'Kia', model: 'EV9', year: 2024, trim: 'Standard Range', batteryKwh: 76.1, v2hMaxKw: 3.6, capability: 'V2L' },
  { slug: 'gmc-hummer-ev-2024', make: 'GMC', model: 'Hummer EV', year: 2024, trim: 'Edition 1', batteryKwh: 213, v2hMaxKw: 11.5, capability: 'V2H' },
  { slug: 'nissan-leaf-2024', make: 'Nissan', model: 'LEAF', year: 2024, trim: 'Plus SV', batteryKwh: 62, v2hMaxKw: 6.0, capability: 'V2H' },
  { slug: 'hyundai-ioniq-6-long-range-2024', make: 'Hyundai', model: 'IONIQ 6', year: 2024, trim: 'Long Range', batteryKwh: 77.4, v2hMaxKw: 3.6, capability: 'V2L' },
];

interface Appliance {
  id: string;
  label: string;
  watts: number;
  category: 'essential' | 'comfort' | 'high-draw';
}

const APPLIANCES: Appliance[] = [
  { id: 'fridge', label: 'Refrigerator', watts: 150, category: 'essential' },
  { id: 'freezer', label: 'Chest Freezer', watts: 100, category: 'essential' },
  { id: 'lights', label: 'LED Lighting (10 bulbs)', watts: 100, category: 'essential' },
  { id: 'wifi', label: 'Router + Internet', watts: 20, category: 'essential' },
  { id: 'phone', label: 'Phone Charging (4x)', watts: 80, category: 'essential' },
  { id: 'sump', label: 'Sump Pump', watts: 800, category: 'essential' },
  { id: 'medical', label: 'CPAP / Medical Device', watts: 120, category: 'essential' },
  { id: 'tv', label: 'TV + Streaming', watts: 200, category: 'comfort' },
  { id: 'laptop', label: 'Laptop / Desktop', watts: 150, category: 'comfort' },
  { id: 'microwave', label: 'Microwave', watts: 1200, category: 'comfort' },
  { id: 'fan', label: 'Box Fan (2x)', watts: 100, category: 'comfort' },
  { id: 'electric_blanket', label: 'Electric Blanket', watts: 200, category: 'comfort' },
  { id: 'window_ac', label: 'Window AC (5,000 BTU)', watts: 500, category: 'high-draw' },
  { id: 'space_heater', label: 'Space Heater', watts: 1500, category: 'high-draw' },
  { id: 'well_pump', label: 'Well Pump', watts: 1000, category: 'high-draw' },
  { id: 'ev_charge_l1', label: 'EV Level 1 Charging', watts: 1440, category: 'high-draw' },
  { id: 'dryer_gas', label: 'Gas Dryer (electric start)', watts: 300, category: 'comfort' },
  { id: 'washer', label: 'Washing Machine', watts: 500, category: 'comfort' },
];

const CATEGORY_LABELS: Record<string, string> = {
  essential: 'Essential',
  comfort: 'Comfort',
  'high-draw': 'High-Draw',
};

export default function V2HContent() {
  const [selectedVehicleSlug, setSelectedVehicleSlug] = useState<string>(V2H_VEHICLES[0].slug);
  const [chargePercent, setChargePercent] = useState(80);
  const [reservePercent, setReservePercent] = useState(20);
  const [selectedAppliances, setSelectedAppliances] = useState<Set<string>>(
    new Set(['fridge', 'lights', 'wifi', 'phone'])
  );

  const vehicle = V2H_VEHICLES.find(v => v.slug === selectedVehicleSlug) ?? V2H_VEHICLES[0];

  const toggleAppliance = (id: string) => {
    setSelectedAppliances(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const results = useMemo(() => {
    const usableKwh = vehicle.batteryKwh * Math.max(0, chargePercent - reservePercent) / 100;
    const totalWatts = APPLIANCES
      .filter(a => selectedAppliances.has(a.id))
      .reduce((sum, a) => sum + a.watts, 0);
    const totalKw = totalWatts / 1000;

    const isOverCapacity = totalKw > vehicle.v2hMaxKw;
    const effectiveKw = Math.min(totalKw, vehicle.v2hMaxKw);
    const hoursRuntime = effectiveKw > 0 ? usableKwh / effectiveKw : 0;

    const applianceRuntimes = APPLIANCES
      .filter(a => selectedAppliances.has(a.id))
      .map(a => ({
        ...a,
        hoursRuntime: a.watts > 0 ? usableKwh / (a.watts / 1000) : Infinity,
      }));

    return { usableKwh, totalWatts, totalKw, isOverCapacity, hoursRuntime, applianceRuntimes };
  }, [vehicle, chargePercent, reservePercent, selectedAppliances]);

  const formatHours = (h: number): string => {
    if (!isFinite(h) || h > 999) return '999+ hrs';
    if (h >= 48) return `${(h / 24).toFixed(1)} days`;
    if (h >= 1) return `${h.toFixed(1)} hrs`;
    return `${Math.round(h * 60)} min`;
  };

  // Timeline segments for 24h visualization
  const timelineSegments = useMemo(() => {
    const { usableKwh, totalKw } = results;
    if (totalKw === 0 || usableKwh === 0) return [];
    const totalHours = usableKwh / Math.min(totalKw, vehicle.v2hMaxKw);
    const segments: { label: string; width: number; color: string }[] = [];
    const h = Math.min(totalHours, 72);
    const maxH = 72;
    if (h > 0) {
      segments.push({ label: `${formatHours(totalHours)} runtime`, width: (h / maxH) * 100, color: 'bg-accent' });
    }
    return segments;
  }, [results, vehicle.v2hMaxKw]);

  return (
    <div>
      {/* Vehicle selector */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-text-primary">
          Select Your V2H/V2L Vehicle
        </label>
        <select
          value={selectedVehicleSlug}
          onChange={(e) => setSelectedVehicleSlug(e.target.value)}
          className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-3 text-text-primary outline-none transition-colors focus:border-accent/60"
        >
          {V2H_VEHICLES.map(v => (
            <option key={v.slug} value={v.slug}>
              {v.year} {v.make} {v.model} {v.trim} — {v.batteryKwh} kWh · {v.v2hMaxKw} kW max · {v.capability}
            </option>
          ))}
        </select>

        {/* Vehicle badge */}
        <div className="mt-3 flex flex-wrap gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${vehicle.capability === 'V2H' ? 'bg-accent/20 text-accent' : 'bg-info/20 text-info'}`}>
            {vehicle.capability === 'V2H' ? '⚡ V2H — Powers whole home' : '🔌 V2L — Powers individual devices'}
          </span>
          <span className="rounded-full bg-bg-tertiary px-3 py-1 text-xs text-text-secondary">
            {vehicle.batteryKwh} kWh total battery
          </span>
          <span className="rounded-full bg-bg-tertiary px-3 py-1 text-xs text-text-secondary">
            {vehicle.v2hMaxKw} kW max output
          </span>
        </div>
      </div>

      {/* Charge sliders */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-bg-secondary p-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">Current Charge</span>
            <span className="font-mono text-sm text-accent">{chargePercent}%</span>
          </div>
          <input
            type="range" min={0} max={100} step={5}
            value={chargePercent}
            onChange={(e) => setChargePercent(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-accent"
          />
          <div className="mt-1 flex justify-between text-xs text-text-tertiary">
            <span>0%</span><span>100%</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg-secondary p-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">Reserve (keep charged to)</span>
            <span className="font-mono text-sm text-text-secondary">{reservePercent}%</span>
          </div>
          <input
            type="range" min={0} max={50} step={5}
            value={reservePercent}
            onChange={(e) => setReservePercent(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-accent"
          />
          <div className="mt-1 flex justify-between text-xs text-text-tertiary">
            <span>0%</span><span>50%</span>
          </div>
        </div>
      </div>

      {/* Usable kWh summary */}
      <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 px-5 py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Usable energy for backup power</span>
          <span className="font-mono text-2xl font-bold text-accent">
            {results.usableKwh.toFixed(1)} kWh
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-bg-tertiary">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${Math.max(0, chargePercent - reservePercent)}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-text-tertiary">
          <span>Reserve: {reservePercent}%</span>
          <span>Current: {chargePercent}%</span>
        </div>
      </div>

      {/* Appliance selector */}
      <div className="mb-6">
        <h2 className="mb-3 font-display text-lg font-bold text-text-primary">
          Which appliances do you need to power?
        </h2>
        {(['essential', 'comfort', 'high-draw'] as const).map(cat => (
          <div key={cat} className="mb-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
              {CATEGORY_LABELS[cat]}
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {APPLIANCES.filter(a => a.category === cat).map(a => {
                const checked = selectedAppliances.has(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggleAppliance(a.id)}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                      checked
                        ? 'border-accent/40 bg-accent/10 text-text-primary'
                        : 'border-border bg-bg-secondary text-text-secondary hover:border-accent/20'
                    }`}
                  >
                    <span>{a.label}</span>
                    <span className={`font-mono text-xs ${checked ? 'text-accent' : 'text-text-tertiary'}`}>
                      {a.watts}W
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {/* Total load */}
        <div className={`rounded-xl border p-5 ${results.isOverCapacity ? 'border-warning/40 bg-warning/5' : 'border-border bg-bg-secondary'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-text-primary">Total Load</div>
              <div className="mt-0.5 text-xs text-text-tertiary">
                {selectedAppliances.size} appliance{selectedAppliances.size !== 1 ? 's' : ''} selected
              </div>
            </div>
            <div className="text-right">
              <div className={`font-mono text-2xl font-bold ${results.isOverCapacity ? 'text-warning' : 'text-text-primary'}`}>
                {results.totalWatts.toLocaleString()}W
              </div>
              <div className="text-xs text-text-tertiary">{results.totalKw.toFixed(2)} kW</div>
            </div>
          </div>

          {results.isOverCapacity && (
            <div className="mt-3 rounded-lg bg-warning/10 p-3 text-xs text-warning">
              ⚠️ Load ({results.totalKw.toFixed(1)} kW) exceeds the vehicle&apos;s {vehicle.v2hMaxKw} kW output limit.
              Remove some high-draw appliances, or cycle them on/off. Runtime calculated at max output.
            </div>
          )}
        </div>

        {/* Runtime estimate */}
        <div className="rounded-xl border border-accent/30 bg-bg-secondary p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display text-lg font-bold text-text-primary">Estimated Runtime</div>
              <div className="mt-0.5 text-xs text-text-tertiary">at current load with usable energy</div>
            </div>
            <div className="font-mono text-3xl font-bold text-accent">
              {selectedAppliances.size === 0
                ? '—'
                : formatHours(results.hoursRuntime)}
            </div>
          </div>

          {/* Timeline bar */}
          {timelineSegments.length > 0 && (
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-text-tertiary">
                <span>Now</span>
                <span>72 hour window</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-bg-tertiary">
                {timelineSegments.map((seg, i) => (
                  <div
                    key={i}
                    className={`h-full ${seg.color} inline-block rounded-full transition-all`}
                    style={{ width: `${seg.width}%` }}
                    title={seg.label}
                  />
                ))}
              </div>
              <div className="mt-1 text-xs text-text-tertiary">{timelineSegments[0]?.label}</div>
            </div>
          )}
        </div>

        {/* Per-appliance runtimes */}
        {results.applianceRuntimes.length > 0 && (
          <div>
            <h3 className="mb-3 font-display text-base font-bold text-text-primary">
              Runtime per Appliance (if used alone)
            </h3>
            <div className="space-y-2">
              {results.applianceRuntimes
                .sort((a, b) => a.hoursRuntime - b.hoursRuntime)
                .map(a => (
                  <div key={a.id} className="flex items-center justify-between rounded-lg border border-border bg-bg-secondary px-4 py-2.5">
                    <div>
                      <span className="text-sm text-text-primary">{a.label}</span>
                      <span className="ml-2 font-mono text-xs text-text-tertiary">{a.watts}W</span>
                    </div>
                    <span className="font-mono text-sm font-semibold text-text-primary">
                      {formatHours(a.hoursRuntime)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Equipment needed */}
        {vehicle.capability === 'V2H' && (
          <div className="rounded-xl border border-border bg-bg-secondary p-5">
            <h3 className="mb-3 font-display text-base font-bold text-text-primary">
              Equipment Required for Home Backup
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-accent">•</span>
                <span><strong className="text-text-primary">Bidirectional charger (EVSE):</strong> Ford Charge Station Pro ($1,310), or compatible DCFC hardware. Must support V2H protocol.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-accent">•</span>
                <span><strong className="text-text-primary">Ford Intelligent Backup Power / Sunrun Gateway:</strong> Transfer switch + home integration gateway. Required for whole-home backup (~$3,800 installed).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-accent">•</span>
                <span><strong className="text-text-primary">Professional installation:</strong> Licensed electrician required. Typical cost: $1,500–$4,000 depending on panel work needed.</span>
              </li>
            </ul>
            <div className="mt-3 text-xs text-text-tertiary">
              Total equipment + installation: ~$6,000–$9,000 before any utility rebates.
            </div>
          </div>
        )}

        {vehicle.capability === 'V2L' && (
          <div className="rounded-xl border border-border bg-bg-secondary p-5">
            <h3 className="mb-3 font-display text-base font-bold text-text-primary">
              V2L (Vehicle-to-Load) Setup
            </h3>
            <p className="text-sm text-text-secondary">
              V2L provides a standard 120V/240V outlet directly from the vehicle — no transfer switch or special installation required.
              Plug devices directly into the vehicle&apos;s onboard outlet. Maximum {vehicle.v2hMaxKw} kW continuous.
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-accent">✓</span>
                <span>No electrician or permit required</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent">✓</span>
                <span>Portable — use anywhere (camping, job sites, emergencies)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-text-tertiary">✗</span>
                <span>Cannot automatically power your home during a grid outage (manual setup required)</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
