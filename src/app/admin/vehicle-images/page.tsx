'use client';

/**
 * /admin/vehicle-images
 *
 * Auth-gated admin page for generating and managing AI vehicle images.
 * Users must sign in with a Supabase account to access.
 *
 * Features:
 * - Login form (if not authenticated)
 * - Vehicle grid showing current image or placeholder
 * - Per-vehicle Generate / Regenerate buttons
 * - Bulk "Generate All Missing" button with live progress
 * - Image preview modal
 */

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface VehicleRow {
  id: string;
  make: string;
  model: string;
  year: number;
  trim: string | null;
  vehicle_class: string | null;
  slug: string;
  image_url: string | null;
}

type GenStatus = 'idle' | 'generating' | 'done' | 'error';

interface VehicleState extends VehicleRow {
  status: GenStatus;
  errorMsg?: string;
}

// ── Vehicle class placeholder SVG ────────────────────────────────────────────
function VehiclePlaceholder({ vehicleClass }: { vehicleClass: string | null }) {
  const cls = (vehicleClass || '').toLowerCase();
  if (cls.includes('truck') || cls.includes('pickup')) {
    // Truck silhouette
    return (
      <svg viewBox="0 0 80 40" className="h-12 w-20 opacity-25" fill="currentColor">
        <rect x="5" y="15" width="55" height="18" rx="2" />
        <rect x="38" y="8" width="22" height="14" rx="2" />
        <circle cx="18" cy="34" r="5" />
        <circle cx="52" cy="34" r="5" />
      </svg>
    );
  }
  if (cls.includes('suv') || cls.includes('crossover') || cls.includes('van')) {
    // SUV silhouette
    return (
      <svg viewBox="0 0 80 40" className="h-12 w-20 opacity-25" fill="currentColor">
        <rect x="5" y="18" width="70" height="16" rx="2" />
        <path d="M15 18 L20 8 L60 8 L65 18 Z" />
        <circle cx="20" cy="35" r="5" />
        <circle cx="60" cy="35" r="5" />
      </svg>
    );
  }
  // Sedan / default
  return (
    <svg viewBox="0 0 80 40" className="h-12 w-20 opacity-25" fill="currentColor">
      <rect x="8" y="20" width="64" height="14" rx="2" />
      <path d="M20 20 L28 10 L52 10 L62 20 Z" />
      <circle cx="22" cy="35" r="5" />
      <circle cx="58" cy="35" r="5" />
    </svg>
  );
}

// ── Login form ────────────────────────────────────────────────────────────────
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      onLogin();
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-display font-bold text-text-primary">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-error">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent px-4 py-2.5 font-semibold text-bg-primary hover:bg-accent-dim disabled:opacity-60 transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, hasImage }: { status: GenStatus; hasImage: boolean }) {
  if (status === 'generating') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warning">
        <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
        Generating…
      </span>
    );
  }
  if (status === 'done') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
        ✓ Generated
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-error/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-error">
        ✗ Failed
      </span>
    );
  }
  if (hasImage) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-info/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-info">
        ✓ Has image
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-bg-tertiary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-tertiary">
      No image
    </span>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function VehicleImagesAdminPage() {
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [vehicles, setVehicles] = useState<VehicleState[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [bulkProgress, setBulkProgress] = useState('');
  const [previewVehicle, setPreviewVehicle] = useState<VehicleState | null>(null);

  const bulkAbortRef = useRef(false);

  // ── Auth state ──────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Load vehicles when authenticated ────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    loadVehicles();
  }, [user]);

  async function loadVehicles() {
    setLoadingVehicles(true);
    const { data, error } = await supabase
      .from('vehicles')
      .select('id, make, model, year, trim, vehicle_class, slug, image_url')
      .eq('is_active', true)
      .order('make')
      .order('model')
      .order('year', { ascending: false });

    if (!error && data) {
      setVehicles(
        data.map((v) => ({ ...(v as VehicleRow), status: 'idle' as GenStatus }))
      );
    }
    setLoadingVehicles(false);
  }

  // ── Single image generation ──────────────────────────────────────────────────
  async function generateOne(vehicleId: string) {
    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, status: 'generating', errorMsg: undefined } : v))
    );

    const { data, error } = await supabase.functions.invoke('generate-vehicle-image', {
      body: { vehicle_id: vehicleId },
    });

    if (error || !data?.image_url) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicleId
            ? { ...v, status: 'error', errorMsg: error?.message ?? 'Unknown error' }
            : v
        )
      );
      return;
    }

    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId ? { ...v, status: 'done', image_url: data.image_url } : v
      )
    );

    // Show preview for newly generated image
    setPreviewVehicle((prev) => {
      const updated = vehicles.find((v) => v.id === vehicleId);
      return updated ? { ...updated, status: 'done', image_url: data.image_url } : prev;
    });
  }

  // ── Bulk generation ──────────────────────────────────────────────────────────
  async function generateAllMissing() {
    const missing = vehicles.filter((v) => !v.image_url);
    if (missing.length === 0) {
      setBulkProgress('All vehicles already have images.');
      return;
    }

    setBulkGenerating(true);
    bulkAbortRef.current = false;
    setBulkProgress(`Starting… 0/${missing.length}`);

    let done = 0;
    let failed = 0;

    for (const vehicle of missing) {
      if (bulkAbortRef.current) {
        setBulkProgress(`Cancelled after ${done} generated, ${failed} failed.`);
        break;
      }

      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicle.id ? { ...v, status: 'generating' } : v))
      );

      const { data, error } = await supabase.functions.invoke('generate-vehicle-image', {
        body: { vehicle_id: vehicle.id },
      });

      if (error || !data?.image_url) {
        failed++;
        setVehicles((prev) =>
          prev.map((v) =>
            v.id === vehicle.id
              ? { ...v, status: 'error', errorMsg: error?.message ?? 'Unknown error' }
              : v
          )
        );
      } else {
        done++;
        setVehicles((prev) =>
          prev.map((v) =>
            v.id === vehicle.id ? { ...v, status: 'done', image_url: data.image_url } : v
          )
        );
      }

      setBulkProgress(
        `Generated ${done}/${missing.length}${failed > 0 ? ` (${failed} failed)` : ''}`
      );

      // 3-second delay to respect Gemini rate limits
      if (!bulkAbortRef.current) {
        await new Promise((r) => setTimeout(r, 3000));
      }
    }

    setBulkProgress(
      bulkAbortRef.current
        ? `Stopped. Generated ${done}, failed ${failed}.`
        : `Done! Generated ${done}/${missing.length}${failed > 0 ? `, ${failed} failed` : ''}.`
    );
    setBulkGenerating(false);
  }

  // ── Logout ───────────────────────────────────────────────────────────────────
  async function handleLogout() {
    await supabase.auth.signOut();
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={() => {}} />;
  }

  const missingCount = vehicles.filter((v) => !v.image_url).length;
  const hasCount = vehicles.filter((v) => !!v.image_url).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">
            Vehicle Image Generator
          </h1>
          <p className="mt-1 text-text-secondary">
            {hasCount} of {vehicles.length} vehicles have AI-generated images
            {missingCount > 0 && ` · ${missingCount} missing`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Bulk generate */}
          {missingCount > 0 && !bulkGenerating && (
            <button
              onClick={generateAllMissing}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg-primary hover:bg-accent-dim transition-colors"
            >
              Generate All Missing ({missingCount})
            </button>
          )}
          {bulkGenerating && (
            <button
              onClick={() => { bulkAbortRef.current = true; }}
              className="rounded-lg border border-error px-4 py-2 text-sm font-semibold text-error hover:bg-error/10 transition-colors"
            >
              Stop
            </button>
          )}
          <button
            onClick={handleLogout}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Bulk progress bar */}
      {(bulkGenerating || bulkProgress) && (
        <div className="mb-6 rounded-xl border border-border bg-bg-secondary p-4">
          <div className="flex items-center gap-3">
            {bulkGenerating && (
              <div className="h-4 w-4 rounded-full border-2 border-accent border-t-transparent animate-spin shrink-0" />
            )}
            <p className="text-sm text-text-primary">{bulkProgress}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loadingVehicles && (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      )}

      {/* Vehicle grid */}
      {!loadingVehicles && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vehicles.map((vehicle) => {
            const name = `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}`;
            const isGenerating = vehicle.status === 'generating';

            return (
              <div
                key={vehicle.id}
                className="overflow-hidden rounded-xl border border-border bg-bg-secondary"
              >
                {/* Image area */}
                <div className="relative aspect-video bg-bg-tertiary">
                  {isGenerating && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-bg-tertiary/90">
                      <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                      <p className="text-xs text-text-tertiary">Generating…</p>
                    </div>
                  )}

                  {vehicle.image_url ? (
                    <button
                      onClick={() => setPreviewVehicle(vehicle)}
                      className="block h-full w-full"
                    >
                      <Image
                        src={vehicle.image_url}
                        alt={name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-opacity hover:opacity-90"
                      />
                    </button>
                  ) : (
                    <div className="flex h-full items-center justify-center text-text-tertiary">
                      <VehiclePlaceholder vehicleClass={vehicle.vehicle_class} />
                    </div>
                  )}
                </div>

                {/* Vehicle info + actions */}
                <div className="p-3">
                  <p className="truncate text-sm font-semibold text-text-primary" title={name}>
                    {name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-text-tertiary capitalize">
                    {vehicle.vehicle_class || 'Unknown class'}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <StatusBadge status={vehicle.status} hasImage={!!vehicle.image_url} />

                    <button
                      onClick={() => generateOne(vehicle.id)}
                      disabled={isGenerating || bulkGenerating}
                      className="rounded-md border border-border px-2.5 py-1 text-[11px] font-medium text-text-secondary hover:border-accent/40 hover:text-accent disabled:opacity-40 transition-colors"
                    >
                      {vehicle.image_url ? 'Regenerate' : 'Generate'}
                    </button>
                  </div>

                  {vehicle.status === 'error' && vehicle.errorMsg && (
                    <p className="mt-1.5 text-[10px] text-error leading-tight" title={vehicle.errorMsg}>
                      {vehicle.errorMsg.slice(0, 60)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview modal */}
      {previewVehicle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewVehicle(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-3xl w-full overflow-hidden rounded-2xl bg-bg-secondary shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {previewVehicle.image_url && (
              <Image
                src={previewVehicle.image_url}
                alt={`${previewVehicle.year} ${previewVehicle.make} ${previewVehicle.model}`}
                width={1200}
                height={675}
                className="w-full object-cover"
              />
            )}
            <div className="p-4">
              <p className="font-display font-bold text-text-primary">
                {previewVehicle.year} {previewVehicle.make} {previewVehicle.model}
                {previewVehicle.trim ? ` ${previewVehicle.trim}` : ''}
              </p>
              <p className="mt-1 text-xs text-text-tertiary break-all">{previewVehicle.image_url}</p>
            </div>
            <button
              onClick={() => setPreviewVehicle(null)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
