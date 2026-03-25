'use client';

import { useState, useMemo, useEffect } from 'react';
import { VehicleSelector } from '@/components/calculator/VehicleSelector';
import { Slider } from '@/components/ui/Slider';
import { CostComparisonBar } from '@/components/charts/CostComparisonBar';
import { SavingsTimeline } from '@/components/charts/SavingsTimeline';
import { calculateEvVsGas, COMMON_GAS_CARS } from '@/lib/calculations/ev-vs-gas';
import { createClient } from '@/lib/supabase/client';
import type { Vehicle } from '@/lib/supabase/types';
import { RelatedTools } from '@/components/ui/RelatedTools';

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

export default function EvVsGasPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedState, setSelectedState] = useState('');
  const [electricityRate, setElectricityRate] = useState(0.16);
  const [gasPrice, setGasPrice] = useState(3.50);
  const [annualMiles, setAnnualMiles] = useState(12000);
  const [selectedGasCar, setSelectedGasCar] = useState('Average US Car');
  const [customMpg, setCustomMpg] = useState(27);
  const [useCustomMpg, setUseCustomMpg] = useState(false);
  const [years, setYears] = useState(5);

  // Fetch rates when state changes
  useEffect(() => {
    if (!selectedState) return;

    const fetchRates = async () => {
      try {
        const supabase = createClient();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sb = supabase as any;

        const { data: elecData } = await sb
          .from('electricity_rates')
          .select('rate_per_kwh')
          .eq('country_code', 'US')
          .eq('state_or_region', selectedState)
          .single();

        if (elecData) setElectricityRate(elecData.rate_per_kwh);

        const { data: gasData } = await sb
          .from('gas_prices')
          .select('price_per_gallon')
          .eq('country_code', 'US')
          .eq('state_or_region', selectedState)
          .single();

        if (gasData?.price_per_gallon) setGasPrice(gasData.price_per_gallon);
      } catch {
        // Keep current rates
      }
    };

    fetchRates();
  }, [selectedState]);

  const gasMpg = useMemo(() => {
    if (useCustomMpg) return customMpg;
    const car = COMMON_GAS_CARS.find((c) => c.name === selectedGasCar);
    return car?.mpg ?? 27;
  }, [useCustomMpg, customMpg, selectedGasCar]);

  const result = useMemo(() => {
    if (!selectedVehicle) return null;

    return calculateEvVsGas({
      evEfficiencyKwhPer100Mi: selectedVehicle.efficiency_kwh_per_100mi,
      evMsrpUsd: selectedVehicle.msrp_usd,
      electricityRatePerKwh: electricityRate,
      gasMpg,
      gasPricePerGallon: gasPrice,
      annualMiles,
      years,
    });
  }, [selectedVehicle, electricityRate, gasMpg, gasPrice, annualMiles, years]);

  const costBarData = useMemo(() => {
    if (!result) return [];
    return [
      { name: 'EV Fuel', cost: result.annualEvFuelCost, color: 'var(--accent)' },
      { name: 'Gas Fuel', cost: result.annualGasFuelCost, color: 'var(--range-low)' },
      { name: 'EV Maint.', cost: result.annualEvMaintenance, color: 'var(--info)' },
      { name: 'Gas Maint.', cost: result.annualGasMaintenance, color: 'var(--warning)' },
    ];
  }, [result]);

  const timelineData = useMemo(() => {
    if (!result) return [];
    return result.yearlyBreakdown.map((y) => ({
      year: y.year,
      evTotalCumulative: y.evTotalCumulative,
      gasTotalCumulative: y.gasTotalCumulative,
      cumulativeSavings: y.cumulativeSavings,
    }));
  }, [result]);

  const breakEvenYear = useMemo(() => {
    if (!result?.breakEvenMonths) return null;
    return Math.ceil(result.breakEvenMonths / 12);
  }, [result]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          EV vs Gas Savings — Is an Electric Car Cheaper Than Gas?
        </h1>
        <p className="mt-2 text-text-secondary">
          Compare the total running costs of an electric vehicle vs a gas car over time.
        </p>
      </div>

      {/* Vehicle Selector */}
      <VehicleSelector
        onVehicleSelect={setSelectedVehicle}
        selectedVehicle={selectedVehicle}
      />

      {/* Inputs + Results */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          {/* Gas Car Selection */}
          <div className="rounded-xl border border-border bg-bg-secondary p-6">
            <h3 className="mb-4 text-lg font-display font-semibold text-text-primary">
              Compare Against
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-text-secondary">
                  Gas vehicle
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={useCustomMpg ? '__custom__' : selectedGasCar}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setUseCustomMpg(true);
                      } else {
                        setUseCustomMpg(false);
                        setSelectedGasCar(e.target.value);
                      }
                    }}
                    className="flex-1 rounded-lg border border-border bg-bg-tertiary px-3 py-2.5 text-sm text-text-primary focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
                  >
                    {COMMON_GAS_CARS.map((car) => (
                      <option key={car.name} value={car.name}>
                        {car.name} ({car.mpg} MPG)
                      </option>
                    ))}
                    <option value="__custom__">Custom MPG...</option>
                  </select>
                </div>
              </div>

              {useCustomMpg && (
                <Slider
                  label="Gas Vehicle MPG"
                  value={customMpg}
                  onChange={setCustomMpg}
                  min={10}
                  max={60}
                  step={1}
                  formatValue={(v) => `${v} MPG`}
                />
              )}
            </div>
          </div>

          {/* Location + Rates */}
          <div className="rounded-xl border border-border bg-bg-secondary p-6">
            <h3 className="mb-4 text-lg font-display font-semibold text-text-primary">
              Your Rates & Driving
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
                label="Gas Price"
                value={gasPrice}
                onChange={setGasPrice}
                min={2.00}
                max={7.00}
                step={0.10}
                formatValue={(v) => `$${v.toFixed(2)}/gal`}
              />

              <Slider
                label="Annual Miles"
                value={annualMiles}
                onChange={setAnnualMiles}
                min={3000}
                max={30000}
                step={1000}
                formatValue={(v) => `${v.toLocaleString()} mi`}
              />

              <Slider
                label="Projection Years"
                value={years}
                onChange={setYears}
                min={1}
                max={10}
                step={1}
                formatValue={(v) => `${v} ${v === 1 ? 'year' : 'years'}`}
              />
            </div>
          </div>

          {/* Charts */}
          {result && (
            <>
              <div className="rounded-xl border border-border bg-bg-secondary p-6">
                <h3 className="mb-4 text-lg font-display font-semibold text-text-primary">
                  Annual Cost Breakdown
                </h3>
                <CostComparisonBar data={costBarData} />
              </div>

              <div className="rounded-xl border border-border bg-bg-secondary p-6">
                <h3 className="mb-4 text-lg font-display font-semibold text-text-primary">
                  Cumulative Cost Over {years} Years
                </h3>
                <SavingsTimeline data={timelineData} breakEvenYear={breakEvenYear} />
              </div>
            </>
          )}
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {result && selectedVehicle ? (
            <>
              {/* Savings highlight */}
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-accent">
                  Total {years}-Year Savings
                </p>
                <p className="mt-1 font-mono text-4xl font-bold text-accent">
                  ${result.totalSavings.toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  by driving electric instead of gas
                </p>
              </div>

              {/* Annual breakdown */}
              <div className="rounded-xl border border-border bg-bg-secondary p-6">
                <h3 className="mb-4 text-lg font-display font-semibold text-text-primary">
                  Annual Savings
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-bg-tertiary p-3">
                    <span className="text-sm text-text-secondary">Fuel Savings</span>
                    <span className="font-mono text-sm font-bold text-accent">
                      ${result.annualFuelSavings.toLocaleString()}/yr
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-bg-tertiary p-3">
                    <span className="text-sm text-text-secondary">Maintenance Savings</span>
                    <span className="font-mono text-sm font-bold text-accent">
                      ${result.annualMaintenanceSavings.toLocaleString()}/yr
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-accent/20 bg-accent/5 p-3">
                    <span className="text-sm font-semibold text-text-primary">Total Annual Savings</span>
                    <span className="font-mono text-sm font-bold text-accent">
                      ${result.annualTotalSavings.toLocaleString()}/yr
                    </span>
                  </div>
                </div>
              </div>

              {/* Cost per mile */}
              <div className="rounded-xl border border-border bg-bg-secondary p-6">
                <h3 className="mb-4 text-lg font-display font-semibold text-text-primary">
                  Cost Per Mile
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-bg-tertiary p-3 text-center">
                    <p className="text-xs text-text-tertiary">EV</p>
                    <p className="font-mono text-lg font-bold text-accent">
                      ${result.evCostPerMile.toFixed(3)}
                    </p>
                    <p className="text-xs text-text-tertiary">per mile</p>
                  </div>
                  <div className="rounded-lg bg-bg-tertiary p-3 text-center">
                    <p className="text-xs text-text-tertiary">Gas</p>
                    <p className="font-mono text-lg font-bold text-range-low">
                      ${result.gasCostPerMile.toFixed(3)}
                    </p>
                    <p className="text-xs text-text-tertiary">per mile</p>
                  </div>
                </div>
              </div>

              {/* Break-even */}
              {result.breakEvenMonths && result.breakEvenMiles && (
                <div className="rounded-xl border border-warning/30 bg-warning/5 p-6">
                  <h3 className="mb-2 text-lg font-display font-semibold text-text-primary">
                    Break-Even Point
                  </h3>
                  <p className="text-sm text-text-secondary">
                    The EV&apos;s higher purchase price is offset by fuel and maintenance
                    savings in approximately:
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-bg-tertiary p-3 text-center">
                      <p className="font-mono text-lg font-bold text-warning">
                        {Math.floor(result.breakEvenMonths / 12)}y {result.breakEvenMonths % 12}m
                      </p>
                      <p className="text-xs text-text-tertiary">time</p>
                    </div>
                    <div className="rounded-lg bg-bg-tertiary p-3 text-center">
                      <p className="font-mono text-lg font-bold text-warning">
                        {result.breakEvenMiles.toLocaleString()}
                      </p>
                      <p className="text-xs text-text-tertiary">miles</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Projection totals */}
              <div className="rounded-xl border border-border bg-bg-secondary p-6">
                <h3 className="mb-4 text-lg font-display font-semibold text-text-primary">
                  {years}-Year Totals
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">EV Running Cost</span>
                    <span className="font-mono font-semibold text-text-primary">
                      ${result.totalEvCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Gas Running Cost</span>
                    <span className="font-mono font-semibold text-text-primary">
                      ${result.totalGasCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="my-2 border-t border-border" />
                  <div className="flex justify-between">
                    <span className="font-semibold text-text-primary">You Save</span>
                    <span className="font-mono font-bold text-accent">
                      ${result.totalSavings.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-bg-secondary/50 p-12 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent/5">
                <svg className="h-10 w-10 text-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-display font-semibold text-text-primary">
                Select a Vehicle
              </h3>
              <p className="mt-2 max-w-xs text-sm text-text-tertiary">
                Choose an EV above to compare its running costs against a gas vehicle.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SEO Content */}
      <section className="mt-16 border-t border-border pt-12">
        <h2 className="text-2xl font-display font-bold text-text-primary">
          How Much Can You Save With an Electric Vehicle?
        </h2>
        <div className="mt-4 max-w-3xl space-y-4 text-text-secondary">
          <p>
            Electric vehicles are significantly cheaper to fuel and maintain than gas cars.
            The average American drives 12,000 miles per year and spends roughly $1,800-$2,400
            on gasoline. An equivalent EV would cost $500-$700 in electricity — saving
            $1,100-$1,700 annually on fuel alone.
          </p>
          <p>
            Maintenance savings add another $480 per year on average. EVs have no oil changes,
            fewer brake replacements (thanks to regenerative braking), no transmission fluid,
            and fewer moving parts overall. The typical EV costs about $0.06 per mile to
            maintain vs $0.10 per mile for a gas car.
          </p>
          <p>
            Over 5 years, the total savings from fuel and maintenance typically range from
            $7,500 to $11,000 depending on your electricity rate, gas prices, and driving
            habits. In many cases, these savings offset the higher purchase price of an EV
            within 3-5 years.
          </p>
        </div>
      </section>
      <RelatedTools tools={[
        { href: '/tco-calculator', emoji: '📈', label: 'Total Cost of Ownership', desc: 'Full lifetime cost breakdown including depreciation and maintenance' },
        { href: '/lease-vs-buy', emoji: '📋', label: 'Lease vs Buy Calculator', desc: 'Compare payments and break-even timelines with the $7,500 credit' },
        { href: '/ev-depreciation-calculator', emoji: '📉', label: 'Depreciation Calculator', desc: 'Project your EV\'s resale value at 3, 5, and 7 years' },
      ]} />
    </div>
  );
}
