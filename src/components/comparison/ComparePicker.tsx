'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Vehicle } from '@/lib/supabase/types';

interface PickerSlot {
  query: string;
  results: Vehicle[];
  selected: Vehicle | null;
  open: boolean;
}

const EMPTY_SLOT: PickerSlot = { query: '', results: [], selected: null, open: false };

export function ComparePicker() {
  const router = useRouter();
  const supabase = createClient();
  const [slotA, setSlotA] = useState<PickerSlot>(EMPTY_SLOT);
  const [slotB, setSlotB] = useState<PickerSlot>(EMPTY_SLOT);
  const debounceA = useRef<ReturnType<typeof setTimeout>>();
  const debounceB = useRef<ReturnType<typeof setTimeout>>();

  const search = useCallback(
    async (
      value: string,
      setter: React.Dispatch<React.SetStateAction<PickerSlot>>,
      debounceRef: React.MutableRefObject<ReturnType<typeof setTimeout> | undefined>
    ) => {
      setter((s) => ({ ...s, query: value, selected: null }));
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (value.length < 2) {
        setter((s) => ({ ...s, results: [], open: false }));
        return;
      }

      debounceRef.current = setTimeout(async () => {
        const { data } = await supabase
          .from('vehicles')
          .select('id, make, model, year, trim, slug, epa_range_mi, battery_kwh, drivetrain')
          .or(`make.ilike.%${value}%,model.ilike.%${value}%,trim.ilike.%${value}%`)
          .eq('is_active', true)
          .order('epa_range_mi', { ascending: false })
          .limit(8);
        setter((s) => ({ ...s, results: (data as Vehicle[]) ?? [], open: true }));
      }, 250);
    },
    [supabase]
  );

  const select = (
    vehicle: Vehicle,
    setter: React.Dispatch<React.SetStateAction<PickerSlot>>
  ) => {
    setter({
      query: `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ''}`.trim(),
      results: [],
      selected: vehicle,
      open: false,
    });
  };

  const clear = (setter: React.Dispatch<React.SetStateAction<PickerSlot>>) => {
    setter(EMPTY_SLOT);
  };

  const handleCompare = () => {
    if (!slotA.selected || !slotB.selected) return;
    router.push(`/compare/${slotA.selected.slug}-vs-${slotB.selected.slug}`);
  };

  const canCompare = !!slotA.selected && !!slotB.selected;

  return (
    <div className="mb-12 rounded-2xl border border-accent/20 bg-gradient-to-br from-bg-secondary to-bg-tertiary p-6 shadow-lg shadow-accent/5">
      <h2 className="mb-1 text-xl font-display font-bold text-text-primary">
        Compare Any Two EVs
      </h2>
      <p className="mb-6 text-sm text-text-secondary">
        Search by make, model, or trim — then hit Compare.
      </p>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr_auto]">
        {/* Vehicle A */}
        <VehicleSearchSlot
          label="Vehicle A"
          slot={slotA}
          onSearch={(v) => search(v, setSlotA, debounceA)}
          onSelect={(v) => select(v, setSlotA)}
          onClear={() => clear(setSlotA)}
          accentColor="text-accent"
        />

        {/* VS divider */}
        <div className="hidden items-center justify-center sm:flex">
          <span className="rounded-full border border-border bg-bg-primary px-3 py-1 text-xs font-bold text-text-tertiary">
            VS
          </span>
        </div>

        {/* Vehicle B */}
        <VehicleSearchSlot
          label="Vehicle B"
          slot={slotB}
          onSearch={(v) => search(v, setSlotB, debounceB)}
          onSelect={(v) => select(v, setSlotB)}
          onClear={() => clear(setSlotB)}
          accentColor="text-info"
        />

        {/* Compare button */}
        <div className="flex items-end">
          <button
            onClick={handleCompare}
            disabled={!canCompare}
            className="w-full rounded-xl bg-accent px-6 py-3 text-sm font-bold text-bg-primary transition-all hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            Compare →
          </button>
        </div>
      </div>

      {slotA.selected && slotB.selected && (
        <p className="mt-4 text-xs text-text-tertiary">
          Comparing <span className="text-accent">{slotA.selected.make} {slotA.selected.model}</span> vs{' '}
          <span className="text-info">{slotB.selected.make} {slotB.selected.model}</span>
        </p>
      )}
    </div>
  );
}

interface VehicleSearchSlotProps {
  label: string;
  slot: PickerSlot;
  onSearch: (value: string) => void;
  onSelect: (vehicle: Vehicle) => void;
  onClear: () => void;
  accentColor: string;
}

function VehicleSearchSlot({ label, slot, onSearch, onSelect, onClear, accentColor }: VehicleSearchSlotProps) {
  return (
    <div className="relative">
      <label className="mb-1.5 block text-xs font-semibold text-text-secondary">{label}</label>

      {slot.selected ? (
        <div className={`flex items-center gap-2 rounded-xl border border-border bg-bg-primary px-3 py-2.5`}>
          <div className="min-w-0 flex-1">
            <p className={`truncate text-sm font-semibold ${accentColor}`}>
              {slot.selected.make} {slot.selected.model}
            </p>
            <p className="text-xs text-text-tertiary">
              {slot.selected.year} · {slot.selected.epa_range_mi} mi EPA
            </p>
          </div>
          <button
            onClick={onClear}
            className="shrink-0 text-text-tertiary hover:text-text-primary"
            aria-label="Clear selection"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <input
          type="text"
          value={slot.query}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search make or model..."
          className="w-full rounded-xl border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
        />
      )}

      {slot.open && slot.results.length > 0 && (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-border bg-bg-secondary shadow-xl">
          {slot.results.map((v) => (
            <button
              key={v.id}
              onClick={() => onSelect(v)}
              className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm hover:bg-bg-tertiary first:rounded-t-xl last:rounded-b-xl"
            >
              <div>
                <span className="font-semibold text-text-primary">
                  {v.make} {v.model}
                </span>
                {v.trim && (
                  <span className="ml-1 text-text-tertiary">{v.trim}</span>
                )}
                <span className="ml-1.5 text-xs text-text-tertiary">{v.year}</span>
              </div>
              <span className="ml-3 shrink-0 font-mono text-xs text-accent">
                {v.epa_range_mi} mi
              </span>
            </button>
          ))}
        </div>
      )}

      {slot.open && slot.results.length === 0 && slot.query.length >= 2 && (
        <div className="absolute z-30 mt-1 w-full rounded-xl border border-border bg-bg-secondary px-3 py-2.5 text-sm text-text-tertiary shadow-xl">
          No vehicles found for &quot;{slot.query}&quot;
        </div>
      )}
    </div>
  );
}
