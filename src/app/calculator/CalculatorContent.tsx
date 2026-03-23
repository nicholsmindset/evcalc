'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { VehicleSelector } from '@/components/calculator/VehicleSelector';
import { ConditionSliders, type ConditionValues } from '@/components/calculator/ConditionSliders';
import { RangeGauge } from '@/components/calculator/RangeGauge';
import { RangeResultCard } from '@/components/calculator/RangeResultCard';
import { RangeBySpeedChart } from '@/components/calculator/RangeBySpeedChart';
import { ShareButton } from '@/components/calculator/ShareButton';
import { RangeMap } from '@/components/maps/RangeMap';
import { calculateRange, calculateRangeBySpeed } from '@/lib/calculations/range';
import { DEFAULT_CALCULATION_VALUES } from '@/lib/utils/constants';
import type { Vehicle } from '@/lib/supabase/types';

export function CalculatorContent() {
  const searchParams = useSearchParams();

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const [conditions, setConditions] = useState<ConditionValues>({
    temperatureF: DEFAULT_CALCULATION_VALUES.temperatureF,
    speedMph: DEFAULT_CALCULATION_VALUES.speedMph,
    terrain: DEFAULT_CALCULATION_VALUES.terrain,
    hvacMode: DEFAULT_CALCULATION_VALUES.hvacMode,
    cargoLbs: DEFAULT_CALCULATION_VALUES.cargoLbs,
    batteryHealthPct: DEFAULT_CALCULATION_VALUES.batteryHealthPct,
  });

  // Parse URL params for shared links
  useEffect(() => {
    const t = searchParams.get('t');
    const s = searchParams.get('s');
    const tr = searchParams.get('tr');
    const h = searchParams.get('h');
    const c = searchParams.get('c');
    const b = searchParams.get('b');

    if (t || s || tr || h || c || b) {
      setConditions((prev) => ({
        ...prev,
        ...(t ? { temperatureF: Number(t) } : {}),
        ...(s ? { speedMph: Number(s) } : {}),
        ...(tr && ['city', 'mixed', 'highway', 'hilly'].includes(tr) ? { terrain: tr as ConditionValues['terrain'] } : {}),
        ...(h && ['off', 'ac', 'heat_pump', 'resistive_heat'].includes(h) ? { hvacMode: h as ConditionValues['hvacMode'] } : {}),
        ...(c ? { cargoLbs: Number(c) } : {}),
        ...(b ? { batteryHealthPct: Number(b) } : {}),
      }));
    }
  }, [searchParams]);

  // Calculate range whenever vehicle or conditions change
  const result = useMemo(() => {
    if (!selectedVehicle) return null;

    return calculateRange({
      epaRangeMi: selectedVehicle.epa_range_mi,
      temperatureF: conditions.temperatureF,
      speedMph: conditions.speedMph,
      terrain: conditions.terrain,
      hvacMode: conditions.hvacMode,
      cargoLbs: conditions.cargoLbs,
      batteryHealthPct: conditions.batteryHealthPct,
    });
  }, [selectedVehicle, conditions]);

  // Calculate range-by-speed chart data
  const speedChartData = useMemo(() => {
    if (!selectedVehicle) return [];

    return calculateRangeBySpeed({
      epaRangeMi: selectedVehicle.epa_range_mi,
      temperatureF: conditions.temperatureF,
      terrain: conditions.terrain,
      hvacMode: conditions.hvacMode,
      cargoLbs: conditions.cargoLbs,
      batteryHealthPct: conditions.batteryHealthPct,
    });
  }, [selectedVehicle, conditions]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          EV Range Calculator
        </h1>
        <p className="mt-2 text-text-secondary">
          Calculate real-world range adjusted for temperature, speed, terrain, and driving conditions.
        </p>
      </div>

      {/* Vehicle Selector */}
      <VehicleSelector
        onVehicleSelect={setSelectedVehicle}
        selectedVehicle={selectedVehicle}
      />

      {/* Main Content Grid */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Left Column: Sliders */}
        <div className="space-y-8">
          <ConditionSliders values={conditions} onChange={setConditions} />

          {/* Range by Speed Chart */}
          {result && speedChartData.length > 0 && (
            <RangeBySpeedChart
              data={speedChartData}
              currentSpeed={conditions.speedMph}
              epaRange={selectedVehicle!.epa_range_mi}
            />
          )}

          {/* Range Map */}
          {result && (
            <RangeMap
              adjustedRangeMi={result.adjustedRangeMi}
              speedMph={conditions.speedMph}
            />
          )}
        </div>

        {/* Right Column: Results */}
        <div className="space-y-6">
          {result && selectedVehicle ? (
            <>
              {/* Range Gauge */}
              <div className="rounded-xl border border-border bg-bg-secondary p-6">
                <RangeGauge
                  adjustedRange={result.adjustedRangeMi}
                  epaRange={selectedVehicle.epa_range_mi}
                  pctOfEpa={result.pctOfEpa}
                />

                <div className="mt-6 flex justify-center">
                  <ShareButton
                    vehicleSlug={selectedVehicle.slug}
                    conditions={conditions}
                    adjustedRange={result.adjustedRangeMi}
                  />
                </div>
              </div>

              {/* Factor Breakdown */}
              <RangeResultCard
                factorBreakdown={result.factorBreakdown}
                adjustedRangeMi={result.adjustedRangeMi}
                adjustedRangeKm={result.adjustedRangeKm}
                epaRange={selectedVehicle.epa_range_mi}
              />
            </>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-bg-secondary/50 p-12 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent/5">
                <svg className="h-10 w-10 text-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008H15.75v-.008zm0 2.25h.008v.008H15.75V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
                </svg>
              </div>
              <h3 className="text-lg font-display font-semibold text-text-primary">
                Select a Vehicle
              </h3>
              <p className="mt-2 max-w-xs text-sm text-text-tertiary">
                Choose your EV above to see real-world range estimates based on your driving conditions.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SEO Content */}
      <section className="mt-16 border-t border-border pt-12">
        <h2 className="text-2xl font-display font-bold text-text-primary">
          How Does Temperature Affect EV Range?
        </h2>
        <div className="mt-4 max-w-3xl space-y-4 text-text-secondary">
          <p>
            Temperature is the single biggest factor affecting electric vehicle range.
            In extreme cold (below 20°F), EVs can lose 25-40% of their rated range due
            to increased battery resistance and cabin heating demands. Heat pumps reduce
            this impact significantly compared to resistive heaters.
          </p>
          <p>
            At highway speeds above 55 mph, aerodynamic drag increases exponentially
            (proportional to the square of velocity). Driving at 75 mph instead of 55 mph
            can reduce range by 15-20%. City driving actually improves range through
            regenerative braking.
          </p>
          <p>
            Our calculator uses physics-based modeling calibrated against real-world data
            from the EPA, including non-linear temperature curves, quadratic aerodynamic
            drag, and terrain-specific energy recovery factors.
          </p>
        </div>
      </section>
    </div>
  );
}
