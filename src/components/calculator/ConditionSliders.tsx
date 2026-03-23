'use client';

import { Slider } from '@/components/ui/Slider';
import { Toggle } from '@/components/ui/Toggle';
import type { TerrainType, HvacMode } from '@/lib/calculations/coefficients';

interface ConditionValues {
  temperatureF: number;
  speedMph: number;
  terrain: TerrainType;
  hvacMode: HvacMode;
  cargoLbs: number;
  batteryHealthPct: number;
}

interface ConditionSlidersProps {
  values: ConditionValues;
  onChange: (values: ConditionValues) => void;
}

function TempIcon({ temp }: { temp: number }) {
  if (temp <= 20) return <span className="text-blue-400">🥶</span>;
  if (temp <= 40) return <span className="text-blue-300">❄️</span>;
  if (temp <= 60) return <span className="text-sky-300">🌤️</span>;
  if (temp <= 80) return <span className="text-green-400">☀️</span>;
  if (temp <= 100) return <span className="text-orange-400">🌡️</span>;
  return <span className="text-red-400">🔥</span>;
}

function getTempColor(temp: number): string {
  if (temp <= 20) return '#60a5fa';
  if (temp <= 40) return '#7dd3fc';
  if (temp <= 60) return '#38bdf8';
  if (temp <= 80) return 'var(--accent)';
  if (temp <= 100) return '#fb923c';
  return '#ef4444';
}

export function ConditionSliders({ values, onChange }: ConditionSlidersProps) {
  const update = (partial: Partial<ConditionValues>) => {
    onChange({ ...values, ...partial });
  };

  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-6">
      <h3 className="mb-6 flex items-center gap-2 text-lg font-display font-semibold text-text-primary">
        <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
        Driving Conditions
      </h3>

      <div className="space-y-6">
        <Slider
          label="Temperature"
          value={values.temperatureF}
          min={-20}
          max={120}
          step={1}
          onChange={(v) => update({ temperatureF: v })}
          formatValue={(v) => `${v}°F`}
          icon={<TempIcon temp={values.temperatureF} />}
          accentColor={getTempColor(values.temperatureF)}
        />

        <Slider
          label="Average Speed"
          value={values.speedMph}
          min={25}
          max={85}
          step={1}
          unit=" mph"
          onChange={(v) => update({ speedMph: v })}
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          }
        />

        <Toggle
          label="Terrain"
          value={values.terrain}
          onChange={(v) => update({ terrain: v })}
          options={[
            { value: 'city' as TerrainType, label: 'City' },
            { value: 'mixed' as TerrainType, label: 'Mixed' },
            { value: 'highway' as TerrainType, label: 'Highway' },
            { value: 'hilly' as TerrainType, label: 'Hilly' },
          ]}
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
          }
        />

        <Toggle
          label="Climate Control"
          value={values.hvacMode}
          onChange={(v) => update({ hvacMode: v })}
          options={[
            { value: 'off' as HvacMode, label: 'Off' },
            { value: 'ac' as HvacMode, label: 'AC' },
            { value: 'heat_pump' as HvacMode, label: 'Heat Pump' },
            { value: 'resistive_heat' as HvacMode, label: 'Heater' },
          ]}
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 6.75 6.75 0 0012 15.75a6.75 6.75 0 005.362-10.536z" />
            </svg>
          }
        />

        <Slider
          label="Extra Cargo"
          value={values.cargoLbs}
          min={0}
          max={500}
          step={25}
          unit=" lbs"
          onChange={(v) => update({ cargoLbs: v })}
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          }
        />

        <Slider
          label="Battery Health"
          value={values.batteryHealthPct}
          min={70}
          max={100}
          step={1}
          unit="%"
          onChange={(v) => update({ batteryHealthPct: v })}
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z" />
            </svg>
          }
        />
      </div>
    </div>
  );
}

export type { ConditionValues };
