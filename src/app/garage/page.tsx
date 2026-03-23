'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { AuthModal } from '@/components/auth/AuthModal';
import { VehicleSelector } from '@/components/calculator/VehicleSelector';
import { createClient } from '@/lib/supabase/client';
import type { Vehicle } from '@/lib/supabase/types';

interface GarageVehicle {
  id: string;
  vehicle_id: string;
  nickname: string | null;
  purchase_date: string | null;
  current_battery_health: number | null;
  odometer_mi: number | null;
  created_at: string;
  vehicle?: Vehicle;
}

export default function GaragePage() {
  const { user, loading: authLoading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [garageVehicles, setGarageVehicles] = useState<GarageVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [nickname, setNickname] = useState('');
  const [batteryHealth, setBatteryHealth] = useState(100);
  const [odometer, setOdometer] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchGarage = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const supabase = createClient();

    const { data: garageEntries, error } = await (supabase as unknown as { from: (table: string) => { select: (cols: string) => { eq: (col: string, val: string) => { order: (col: string, opts: { ascending: boolean }) => Promise<{ data: GarageVehicle[] | null; error: unknown }> } } } }).from('user_garage')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching garage:', error);
      setLoading(false);
      return;
    }

    if (garageEntries && garageEntries.length > 0) {
      // Fetch vehicle details for each garage entry
      const vehicleIds = garageEntries.map((g) => g.vehicle_id);
      const { data: vehicles } = await (supabase as unknown as { from: (table: string) => { select: (cols: string) => { in: (col: string, vals: string[]) => Promise<{ data: Vehicle[] | null }> } } }).from('vehicles')
        .select('*')
        .in('id', vehicleIds);

      const vehicleMap = new Map((vehicles || []).map((v: Vehicle) => [v.id, v]));
      const enriched = garageEntries.map((g) => ({
        ...g,
        vehicle: vehicleMap.get(g.vehicle_id),
      }));
      setGarageVehicles(enriched);
    } else {
      setGarageVehicles([]);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) fetchGarage();
    else setLoading(false);
  }, [user, fetchGarage]);

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedVehicle) return;

    setSaving(true);
    const supabase = createClient();

    const { error } = await (supabase as unknown as { from: (table: string) => { insert: (data: Record<string, unknown>) => Promise<{ error: unknown }> } }).from('user_garage')
      .insert({
        user_id: user.id,
        vehicle_id: selectedVehicle.id,
        nickname: nickname || null,
        current_battery_health: batteryHealth,
        odometer_mi: odometer ? parseInt(odometer) : null,
      });

    if (error) {
      console.error('Error adding vehicle:', error);
    } else {
      setShowAddForm(false);
      setSelectedVehicle(null);
      setNickname('');
      setBatteryHealth(100);
      setOdometer('');
      await fetchGarage();
    }

    setSaving(false);
  };

  const handleRemoveVehicle = async (garageId: string) => {
    if (!confirm('Remove this vehicle from your garage?')) return;

    const supabase = createClient();
    await (supabase as unknown as { from: (table: string) => { delete: () => { eq: (col: string, val: string) => Promise<{ error: unknown }> } } }).from('user_garage')
      .delete()
      .eq('id', garageId);

    await fetchGarage();
  };

  if (authLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent/5">
            <svg className="h-10 w-10 text-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
          <h1 className="text-2xl font-display font-bold text-text-primary">My Garage</h1>
          <p className="mt-2 max-w-md text-text-secondary">
            Sign in to save your EVs, track battery health, and get personalized range estimates.
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="mt-6 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-dim"
          >
            Sign In to Continue
          </button>
        </div>
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
            My Garage
          </h1>
          <p className="mt-2 text-text-secondary">
            Track your EVs, battery health, and get personalized range estimates.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-dim"
        >
          + Add Vehicle
        </button>
      </div>

      {/* Add Vehicle Form */}
      {showAddForm && (
        <div className="mb-8 rounded-xl border border-accent/20 bg-bg-secondary p-6">
          <h2 className="mb-4 text-lg font-display font-semibold text-text-primary">
            Add a Vehicle
          </h2>
          <form onSubmit={handleAddVehicle} className="space-y-4">
            <VehicleSelector
              onVehicleSelect={setSelectedVehicle}
              selectedVehicle={selectedVehicle}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-text-secondary">Nickname</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g., My Daily Driver"
                  className="mt-1 w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary">
                  Battery Health (%)
                </label>
                <input
                  type="number"
                  value={batteryHealth}
                  onChange={(e) => setBatteryHealth(parseInt(e.target.value) || 100)}
                  min={50}
                  max={100}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary focus:border-accent/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary">
                  Odometer (miles)
                </label>
                <input
                  type="number"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  placeholder="e.g., 25000"
                  className="mt-1 w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/50 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!selectedVehicle || saving}
                className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-dim disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Vehicle'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-lg border border-border px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-bg-tertiary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Garage Vehicles */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
        </div>
      ) : garageVehicles.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {garageVehicles.map((gv) => (
            <div
              key={gv.id}
              className="rounded-xl border border-border bg-bg-secondary p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  {gv.nickname && (
                    <p className="text-xs font-medium text-accent">{gv.nickname}</p>
                  )}
                  <h3 className="font-display font-semibold text-text-primary">
                    {gv.vehicle
                      ? `${gv.vehicle.year} ${gv.vehicle.make} ${gv.vehicle.model}`
                      : 'Unknown Vehicle'}
                  </h3>
                  {gv.vehicle?.trim && (
                    <p className="text-xs text-text-tertiary">{gv.vehicle.trim}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveVehicle(gv.id)}
                  className="text-text-tertiary hover:text-error transition-colors"
                  title="Remove vehicle"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {gv.vehicle && (
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded bg-bg-tertiary px-2 py-1.5 text-center">
                    <p className="text-text-tertiary">EPA Range</p>
                    <p className="font-mono font-semibold text-accent">{gv.vehicle.epa_range_mi} mi</p>
                  </div>
                  <div className="rounded bg-bg-tertiary px-2 py-1.5 text-center">
                    <p className="text-text-tertiary">Battery</p>
                    <p className="font-mono font-semibold text-text-primary">
                      {gv.current_battery_health || 100}%
                    </p>
                  </div>
                  <div className="rounded bg-bg-tertiary px-2 py-1.5 text-center">
                    <p className="text-text-tertiary">Odometer</p>
                    <p className="font-mono font-semibold text-text-primary">
                      {gv.odometer_mi ? `${(gv.odometer_mi / 1000).toFixed(0)}k` : '—'}
                    </p>
                  </div>
                </div>
              )}

              {gv.vehicle && (
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/vehicles/${gv.vehicle.slug}`}
                    className="flex-1 rounded-lg border border-border px-3 py-1.5 text-center text-xs text-text-secondary transition-colors hover:border-accent/30 hover:text-accent"
                  >
                    View Specs
                  </Link>
                  <Link
                    href="/calculator"
                    className="flex-1 rounded-lg border border-border px-3 py-1.5 text-center text-xs text-text-secondary transition-colors hover:border-accent/30 hover:text-accent"
                  >
                    Calculate Range
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold text-text-primary">Your garage is empty</p>
          <p className="mt-2 text-sm text-text-tertiary">
            Add your first EV to track its battery health and get personalized range estimates.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-dim"
          >
            + Add Your First Vehicle
          </button>
        </div>
      )}
    </div>
  );
}
