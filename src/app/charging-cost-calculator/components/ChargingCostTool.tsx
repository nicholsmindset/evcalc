'use client';

import { useState, useMemo, useEffect } from 'react';
import { VehicleSelector } from '@/components/calculator/VehicleSelector';
import { Slider } from '@/components/ui/Slider';
import { CostComparisonBar } from '@/components/charts/CostComparisonBar';
import { calculateChargingCosts } from '@/lib/calculations/charging-cost';
import { createClient } from '@/lib/supabase/client';
import type { Vehicle } from '@/lib/supabase/types';

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming',
];

export function ChargingCostTool() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedState, setSelectedState] = useState('');
  const [electricityRate, setElectricityRate] = useState(0.16); // national avg
  const [monthlyMiles, setMonthlyMiles] = useState(1000);

  // Fetch rate when state changes
  useEffect(() => {
    if (!selectedState) return;

    const fetchRate = async () => {
      try {
        const supabase = createClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any)
          .from('electricity_rates')
          .select('rate_per_kwh')
          .eq('country_code', 'US')
          .eq('state_or_region', selectedState)
          .single();

        if (data) setElectricityRate(data.rate_per_kwh);
      } catch {
        // Keep current rate
      }
    };

    fetchRate();
  }, [selectedState]);

  const result = useMemo(() => {
    if (!selectedVehicle) return null;

    return calculateChargingCosts({
      batteryKwh: selectedVehicle.battery_kwh,
      efficiencyKwhPer100Mi: selectedVehicle.efficiency_kwh_per_100mi,
      homeRatePerKwh: electricityRate,
      monthlyMiles,
    });
  }, [selectedVehicle, electricityRate, monthlyMiles]);

  const barData = useMemo(() => {
    if (!result) return [];
    return result.methods.map((m) => ({
      name: m.shortName,
      cost: m.annualCost,
      color: m.shortName.includes('Home')
        ? 'var(--accent)'
        : m.shortName.includes('DC')
          ? 'var(--range-low)'
          : 'var(--info)',
    }));
  }, [result]);

  return (
    <>
      {/* Vehicle Selector */}
      <VehicleSelector
        onVehicleSelect={setSelectedVehicle}
        selectedVehicle={selectedVehicle}
      />

      {/* Inputs */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          {/* State + Rate */}
          <div className="rounded-xl border border-border bg-bg-secondary p-6">
            <h3 className="mb-4 text-lg font-display font-semibold text-text-primary">
              Your Electricity Rate
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-text-secondary">
                  Select your state
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2.5 text-sm text-text-primary focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
                >
                  <option value="">Select state...</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <Slider
                label="Electricity Rate"
                value={electricityRate}
                onChange={setElectricityRate}
                min={0.05}
                max={0.50}
                step={0.01}
                formatValue={(v) => `$${v.toFixed(2)}/kWh`}
              />

              <Slider
                label="Monthly Miles"
                value={monthlyMiles}
                onChange={setMonthlyMiles}
                min={200}
                max={3000}
                step={50}
                formatValue={(v) => `${v.toLocaleString()} mi`}
              />
            </div>
          </div>

          {/* Cost Chart */}
          {result && (
            <div className="rounded-xl border border-border bg-bg-secondary p-6">
              <h3 className="mb-4 text-lg font-display font-semibold text-text-primary">
                Annual Charging Cost Comparison
              </h3>
              <CostComparisonBar data={barData} />
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result && selectedVehicle ? (
            <>
              {/* Summary cards */}
              <div className="rounded-xl border border-border bg-bg-secondary p-6">
                <h3 className="mb-4 text-lg font-display font-semibold text-text-primary">
                  Cost Summary
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-bg-tertiary p-3 text-center">
                    <p className="text-xs text-text-tertiary">Monthly Energy</p>
                    <p className="font-mono text-lg font-bold text-accent">{result.monthlyKwh}</p>
                    <p className="text-xs text-text-tertiary">kWh</p>
                  </div>
                  <div className="rounded-lg bg-bg-tertiary p-3 text-center">
                    <p className="text-xs text-text-tertiary">Annual Miles</p>
                    <p className="font-mono text-lg font-bold text-text-primary">{result.annualMiles.toLocaleString()}</p>
                    <p className="text-xs text-text-tertiary">mi/year</p>
                  </div>
                </div>
              </div>

              {/* Method breakdown */}
              <div className="rounded-xl border border-border bg-bg-secondary p-6">
                <h3 className="mb-4 text-lg font-display font-semibold text-text-primary">
                  Charging Methods
                </h3>
                <div className="space-y-4">
                  {result.methods.map((method) => (
                    <div key={method.name} className="rounded-lg bg-bg-tertiary p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-text-primary">{method.name}</h4>
                        <span className="text-xs text-text-tertiary">{method.powerKw} kW</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-text-tertiary">Full charge:</span>
                          <span className="ml-1 font-mono font-semibold text-text-primary">
                            ${method.costPerFullCharge.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-text-tertiary">Per mile:</span>
                          <span className="ml-1 font-mono font-semibold text-text-primary">
                            ${method.costPerMile.toFixed(3)}
                          </span>
                        </div>
                        <div>
                          <span className="text-text-tertiary">Monthly:</span>
                          <span className="ml-1 font-mono font-semibold text-accent">
                            ${method.monthlyCost.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-text-tertiary">Annual:</span>
                          <span className="ml-1 font-mono font-semibold text-accent">
                            ${method.annualCost.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-[11px] text-text-tertiary">
                        Charge time (10-100%): {method.chargeTimeHrs < 1
                          ? `${Math.round(method.chargeTimeHrs * 60)} min`
                          : `${method.chargeTimeHrs.toFixed(1)} hrs`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-bg-secondary/50 p-12 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent/5">
                <svg className="h-10 w-10 text-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-lg font-display font-semibold text-text-primary">
                Select a Vehicle
              </h3>
              <p className="mt-2 max-w-xs text-sm text-text-tertiary">
                Choose your EV above to see charging cost estimates for different methods.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
