'use client';

import { useState, useMemo } from 'react';
import { VehicleSelector } from '@/components/calculator/VehicleSelector';
import { Slider } from '@/components/ui/Slider';
import { RoadTripMap } from '@/components/maps/RoadTripMap';
import { calculateRange } from '@/lib/calculations/range';
import type { Vehicle } from '@/lib/supabase/types';

export default function RoadTripPlannerPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [temperatureF, setTemperatureF] = useState(70);
  const [speedMph, setSpeedMph] = useState(65);
  const [batteryHealthPct, setBatteryHealthPct] = useState(100);

  const rangeResult = useMemo(() => {
    if (!selectedVehicle) return null;
    return calculateRange({
      epaRangeMi: selectedVehicle.epa_range_mi,
      temperatureF,
      speedMph,
      terrain: 'highway',
      hvacMode: temperatureF < 50 ? 'heat_pump' : temperatureF > 85 ? 'ac' : 'off',
      cargoLbs: 0,
      batteryHealthPct,
    });
  }, [selectedVehicle, temperatureF, speedMph, batteryHealthPct]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          EV Road Trip Planner — Plan Routes with Charging Stops
        </h1>
        <p className="mt-2 text-text-secondary">
          Plan your route, find charging stops, and estimate travel time with your EV.
        </p>
      </div>

      {/* Vehicle Selector */}
      <VehicleSelector
        onVehicleSelect={setSelectedVehicle}
        selectedVehicle={selectedVehicle}
      />

      {/* Conditions + Map */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Sidebar - Conditions — below map on mobile, left on desktop */}
        <div className="order-2 space-y-6 lg:order-1">
          <div className="rounded-xl border border-border bg-bg-secondary p-5">
            <h3 className="mb-4 text-sm font-display font-semibold text-text-primary">
              Trip Conditions
            </h3>
            <div className="space-y-4">
              <Slider
                label="Temperature"
                value={temperatureF}
                onChange={setTemperatureF}
                min={-10}
                max={110}
                step={5}
                formatValue={(v) => `${v}°F`}
              />
              <Slider
                label="Highway Speed"
                value={speedMph}
                onChange={setSpeedMph}
                min={45}
                max={85}
                step={5}
                formatValue={(v) => `${v} mph`}
              />
              <Slider
                label="Battery Health"
                value={batteryHealthPct}
                onChange={setBatteryHealthPct}
                min={50}
                max={100}
                step={1}
                formatValue={(v) => `${v}%`}
              />
            </div>
          </div>

          {/* Vehicle Range Info */}
          {rangeResult && selectedVehicle && (
            <div className="rounded-xl border border-border bg-bg-secondary p-5">
              <h3 className="mb-3 text-sm font-display font-semibold text-text-primary">
                Estimated Range
              </h3>
              <div className="space-y-3">
                <div className="rounded-lg bg-bg-tertiary p-3 text-center">
                  <p className="text-xs text-text-tertiary">Adjusted Range</p>
                  <p className="font-mono text-2xl font-bold text-accent">
                    {rangeResult.adjustedRangeMi}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    miles ({rangeResult.pctOfEpa}% of EPA)
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-bg-tertiary p-2 text-center">
                    <p className="text-[10px] text-text-tertiary">EPA Range</p>
                    <p className="font-mono text-sm font-bold text-text-primary">
                      {selectedVehicle.epa_range_mi} mi
                    </p>
                  </div>
                  <div className="rounded-lg bg-bg-tertiary p-2 text-center">
                    <p className="text-[10px] text-text-tertiary">Battery</p>
                    <p className="font-mono text-sm font-bold text-text-primary">
                      {selectedVehicle.battery_kwh} kWh
                    </p>
                  </div>
                </div>
                {selectedVehicle.dc_fast_max_kw && (
                  <div className="rounded-lg bg-bg-tertiary p-2 text-center">
                    <p className="text-[10px] text-text-tertiary">DC Fast Charging</p>
                    <p className="font-mono text-sm font-bold text-text-primary">
                      {selectedVehicle.dc_fast_max_kw} kW max
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main content - Map — first on mobile */}
        <div className="order-1 lg:order-2">
          {selectedVehicle && rangeResult ? (
            <RoadTripMap
              adjustedRangeMi={rangeResult.adjustedRangeMi}
              batteryKwh={selectedVehicle.battery_kwh}
              efficiencyKwhPer100Mi={selectedVehicle.efficiency_kwh_per_100mi}
              dcFastMaxKw={selectedVehicle.dc_fast_max_kw ?? 150}
            />
          ) : (
            <div className="flex h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-bg-secondary/50 text-center sm:h-[500px]">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent/5">
                <svg className="h-10 w-10 text-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-display font-semibold text-text-primary">
                Select a Vehicle
              </h3>
              <p className="mt-2 max-w-xs text-sm text-text-tertiary">
                Choose your EV above to plan a road trip with charging stop recommendations.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SEO Content */}
      <section className="mt-16 border-t border-border pt-12">
        <h2 className="text-2xl font-display font-bold text-text-primary">
          Plan Your EV Road Trip with Confidence
        </h2>
        <div className="mt-4 max-w-3xl space-y-4 text-text-secondary">
          <p>
            Range anxiety is the #1 concern for EV road trippers, but with proper planning
            it&apos;s easily managed. Our road trip planner calculates your actual range based on
            highway speed, temperature, and battery health — then finds DC fast charging
            stations along your route.
          </p>
          <p>
            The US now has over 85,000 public EV charging stations with 273,000+ ports.
            Major networks like Tesla Supercharger (now open to all EVs via NACS),
            Electrify America, ChargePoint, and EVgo provide coast-to-coast coverage.
            Most DC fast chargers can add 200+ miles of range in 20-30 minutes.
          </p>
          <p>
            Tips for efficient EV road trips: charge to 80% (faster than 100%), plan stops
            every 150-200 miles, keep speeds under 70 mph when possible, and pre-condition
            your battery before arriving at a charger in cold weather.
          </p>
        </div>
      </section>
    </div>
  );
}
