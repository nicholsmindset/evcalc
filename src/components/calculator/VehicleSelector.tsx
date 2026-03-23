'use client';

import { useState, useEffect, useCallback } from 'react';
import { Select } from '@/components/ui/Select';
import { createClient } from '@/lib/supabase/client';
import type { Vehicle } from '@/lib/supabase/types';

interface VehicleSelectorProps {
  onVehicleSelect: (vehicle: Vehicle | null) => void;
  selectedVehicle: Vehicle | null;
}

export function VehicleSelector({ onVehicleSelect, selectedVehicle }: VehicleSelectorProps) {
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [trims, setTrims] = useState<Vehicle[]>([]);

  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedTrimId, setSelectedTrimId] = useState('');
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  // Load makes on mount
  useEffect(() => {
    async function loadMakes() {
      const { data } = await supabase
        .from('vehicles')
        .select('make')
        .eq('is_active', true)
        .order('make');
      if (data) {
        const unique = Array.from(new Set(data.map((d: { make: string }) => d.make)));
        setMakes(unique);
      }
    }
    loadMakes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load models when make changes
  const handleMakeChange = useCallback(async (make: string) => {
    setSelectedMake(make);
    setSelectedModel('');
    setSelectedYear('');
    setSelectedTrimId('');
    setModels([]);
    setYears([]);
    setTrims([]);
    onVehicleSelect(null);

    if (!make) return;
    setLoading(true);

    const { data } = await supabase
      .from('vehicles')
      .select('model')
      .eq('make', make)
      .eq('is_active', true)
      .order('model');

    if (data) {
      const unique = Array.from(new Set(data.map((d: { model: string }) => d.model)));
      setModels(unique);
    }
    setLoading(false);
  }, [supabase, onVehicleSelect]);

  // Load years when model changes
  const handleModelChange = useCallback(async (model: string) => {
    setSelectedModel(model);
    setSelectedYear('');
    setSelectedTrimId('');
    setYears([]);
    setTrims([]);
    onVehicleSelect(null);

    if (!model) return;
    setLoading(true);

    const { data } = await supabase
      .from('vehicles')
      .select('year')
      .eq('make', selectedMake)
      .eq('model', model)
      .eq('is_active', true)
      .order('year', { ascending: false });

    if (data) {
      const unique = Array.from(new Set(data.map((d: { year: number }) => d.year)));
      setYears(unique);
    }
    setLoading(false);
  }, [supabase, selectedMake, onVehicleSelect]);

  // Load trims when year changes
  const handleYearChange = useCallback(async (yearStr: string) => {
    setSelectedYear(yearStr);
    setSelectedTrimId('');
    setTrims([]);
    onVehicleSelect(null);

    if (!yearStr) return;
    setLoading(true);

    const { data } = await supabase
      .from('vehicles')
      .select('*')
      .eq('make', selectedMake)
      .eq('model', selectedModel)
      .eq('year', parseInt(yearStr, 10))
      .eq('is_active', true)
      .order('trim');

    if (data) {
      const vehicles = data as Vehicle[];
      setTrims(vehicles);

      // Auto-select if only one trim
      if (vehicles.length === 1) {
        setSelectedTrimId(vehicles[0].id);
        onVehicleSelect(vehicles[0]);
      }
    }
    setLoading(false);
  }, [supabase, selectedMake, selectedModel, onVehicleSelect]);

  // Handle trim selection
  const handleTrimChange = useCallback((trimId: string) => {
    setSelectedTrimId(trimId);
    const vehicle = trims.find((t) => t.id === trimId) || null;
    onVehicleSelect(vehicle);
  }, [trims, onVehicleSelect]);

  const carIcon = (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  );

  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-6">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-display font-semibold text-text-primary">
        {carIcon}
        Select Your Vehicle
      </h3>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Select
          label="Make"
          value={selectedMake}
          options={makes.map((m) => ({ value: m, label: m }))}
          onChange={handleMakeChange}
          placeholder="Select make..."
        />

        <Select
          label="Model"
          value={selectedModel}
          options={models.map((m) => ({ value: m, label: m }))}
          onChange={handleModelChange}
          placeholder="Select model..."
          disabled={!selectedMake || loading}
        />

        <Select
          label="Year"
          value={selectedYear}
          options={years.map((y) => ({ value: String(y), label: String(y) }))}
          onChange={handleYearChange}
          placeholder="Select year..."
          disabled={!selectedModel || loading}
        />

        <Select
          label="Trim"
          value={selectedTrimId}
          options={trims.map((t) => ({
            value: t.id,
            label: t.trim || 'Base',
          }))}
          onChange={handleTrimChange}
          placeholder={trims.length === 1 ? (trims[0].trim || 'Base') : 'Select trim...'}
          disabled={!selectedYear || trims.length <= 1 || loading}
        />
      </div>

      {selectedVehicle && (
        <div className="mt-4 flex items-center gap-4 rounded-lg bg-accent/5 border border-accent/20 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <span className="font-mono text-lg font-bold text-accent">
              {selectedVehicle.epa_range_mi}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {selectedVehicle.make} {selectedVehicle.model} {selectedVehicle.trim || ''} {selectedVehicle.year}
            </p>
            <p className="text-xs text-text-secondary">
              EPA Range: {selectedVehicle.epa_range_mi} mi &middot; {selectedVehicle.battery_kwh} kWh &middot; {selectedVehicle.drivetrain}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
