'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { AuthModal } from '@/components/auth/AuthModal';
import { VehicleSelector } from '@/components/calculator/VehicleSelector';
import { createClient } from '@/lib/supabase/client';
import type { Vehicle } from '@/lib/supabase/types';

interface ReportWithVehicle {
  id: string;
  vehicle_id: string;
  user_id: string;
  reported_range_mi: number;
  temperature_f: number | null;
  speed_mph: number | null;
  terrain: string | null;
  hvac_usage: string | null;
  battery_health_pct: number | null;
  notes: string | null;
  verified: boolean;
  created_at: string;
  vehicle?: Vehicle;
}

export default function RangeReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [reports, setReports] = useState<ReportWithVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form state
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [reportedRange, setReportedRange] = useState('');
  const [temperature, setTemperature] = useState('');
  const [speed, setSpeed] = useState('');
  const [terrain, setTerrain] = useState('mixed');
  const [hvac, setHvac] = useState('off');
  const [batteryHealth, setBatteryHealth] = useState('100');
  const [notes, setNotes] = useState('');

  const fetchReports = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const { data: reportData, error } = await (supabase as unknown as {
      from: (table: string) => {
        select: (cols: string) => {
          order: (col: string, opts: { ascending: boolean }) => {
            limit: (n: number) => Promise<{ data: ReportWithVehicle[] | null; error: unknown }>;
          };
        };
      };
    }).from('range_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !reportData) {
      setLoading(false);
      return;
    }

    // Fetch vehicle details
    const vehicleIds = Array.from(new Set(reportData.map((r) => r.vehicle_id)));
    if (vehicleIds.length > 0) {
      const { data: vehicles } = await (supabase as unknown as {
        from: (table: string) => {
          select: (cols: string) => {
            in: (col: string, vals: string[]) => Promise<{ data: Vehicle[] | null }>;
          };
        };
      }).from('vehicles')
        .select('*')
        .in('id', vehicleIds);

      const vehicleMap = new Map((vehicles || []).map((v: Vehicle) => [v.id, v]));
      const enriched = reportData.map((r) => ({
        ...r,
        vehicle: vehicleMap.get(r.vehicle_id),
      }));
      setReports(enriched);
    } else {
      setReports([]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedVehicle || !reportedRange) return;

    setSubmitting(true);
    const supabase = createClient();

    const { error } = await (supabase as unknown as {
      from: (table: string) => {
        insert: (data: Record<string, unknown>) => Promise<{ error: unknown }>;
      };
    }).from('range_reports')
      .insert({
        user_id: user.id,
        vehicle_id: selectedVehicle.id,
        reported_range_mi: parseInt(reportedRange),
        temperature_f: temperature ? parseInt(temperature) : null,
        speed_mph: speed ? parseInt(speed) : null,
        terrain: terrain || null,
        hvac_usage: hvac || null,
        battery_health_pct: batteryHealth ? parseInt(batteryHealth) : null,
        notes: notes || null,
      });

    if (error) {
      console.error('Error submitting report:', error);
    } else {
      setSubmitSuccess(true);
      setShowForm(false);
      resetForm();
      await fetchReports();
      setTimeout(() => setSubmitSuccess(false), 5000);
    }

    setSubmitting(false);
  };

  const resetForm = () => {
    setSelectedVehicle(null);
    setReportedRange('');
    setTemperature('');
    setSpeed('');
    setTerrain('mixed');
    setHvac('off');
    setBatteryHealth('100');
    setNotes('');
  };

  const getRangeColor = (reported: number, epa: number) => {
    const pct = (reported / epa) * 100;
    if (pct >= 90) return 'text-range-full';
    if (pct >= 70) return 'text-range-good';
    if (pct >= 50) return 'text-range-caution';
    return 'text-range-low';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
            Community Range Reports
          </h1>
          <p className="mt-2 text-text-secondary">
            Real-world range data reported by EV owners. Share your experience to help others.
          </p>
        </div>
        {user ? (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-dim"
          >
            + Submit Report
          </button>
        ) : (
          <button
            onClick={() => setShowAuth(true)}
            className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-dim"
          >
            Sign In to Report
          </button>
        )}
      </div>

      {/* Success Banner */}
      {submitSuccess && (
        <div className="mb-6 rounded-xl border border-success/30 bg-success/5 px-6 py-4 text-sm text-success">
          Your range report has been submitted successfully. Thank you for contributing!
        </div>
      )}

      {/* Submit Form */}
      {showForm && user && (
        <div className="mb-8 rounded-xl border border-accent/20 bg-bg-secondary p-6">
          <h2 className="mb-4 text-lg font-display font-semibold text-text-primary">
            Submit a Range Report
          </h2>
          <p className="mb-6 text-sm text-text-secondary">
            Share your real-world range experience. All fields marked with * are required.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vehicle Selection */}
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                Vehicle *
              </label>
              <VehicleSelector
                onVehicleSelect={setSelectedVehicle}
                selectedVehicle={selectedVehicle}
              />
            </div>

            {/* Range + Conditions Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary">
                  Reported Range (miles) *
                </label>
                <input
                  type="number"
                  value={reportedRange}
                  onChange={(e) => setReportedRange(e.target.value)}
                  required
                  min={10}
                  max={600}
                  placeholder="e.g., 245"
                  className="mt-1 w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary">
                  Temperature ({'\u00B0'}F)
                </label>
                <input
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  min={-40}
                  max={130}
                  placeholder="e.g., 72"
                  className="mt-1 w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary">
                  Average Speed (mph)
                </label>
                <input
                  type="number"
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value)}
                  min={10}
                  max={100}
                  placeholder="e.g., 65"
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
                  onChange={(e) => setBatteryHealth(e.target.value)}
                  min={50}
                  max={100}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary focus:border-accent/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Terrain + HVAC */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-text-secondary">
                  Terrain / Driving Type
                </label>
                <select
                  value={terrain}
                  onChange={(e) => setTerrain(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary focus:border-accent/50 focus:outline-none"
                >
                  <option value="city">City</option>
                  <option value="mixed">Mixed</option>
                  <option value="highway">Highway</option>
                  <option value="hilly">Hilly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary">
                  HVAC Usage
                </label>
                <select
                  value={hvac}
                  onChange={(e) => setHvac(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary focus:border-accent/50 focus:outline-none"
                >
                  <option value="off">Off</option>
                  <option value="ac">A/C</option>
                  <option value="heat_pump">Heat Pump</option>
                  <option value="resistive_heat">Resistive Heat</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-text-secondary">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Any additional context about your trip — e.g., heavy rain, strong headwinds, lots of cargo..."
                className="mt-1 w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/50 focus:outline-none resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!selectedVehicle || !reportedRange || submitting}
                className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-dim disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="rounded-lg border border-border px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-bg-tertiary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reports List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl border border-border bg-bg-secondary" />
          ))}
        </div>
      ) : reports.length > 0 ? (
        <div className="space-y-4">
          {/* Stats Summary */}
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-bg-secondary p-5 text-center">
              <p className="font-mono text-2xl font-bold text-accent">{reports.length}</p>
              <p className="text-xs text-text-secondary">Total Reports</p>
            </div>
            <div className="rounded-xl border border-border bg-bg-secondary p-5 text-center">
              <p className="font-mono text-2xl font-bold text-text-primary">
                {new Set(reports.map((r) => r.vehicle_id)).size}
              </p>
              <p className="text-xs text-text-secondary">Vehicles Reported</p>
            </div>
            <div className="rounded-xl border border-border bg-bg-secondary p-5 text-center">
              <p className="font-mono text-2xl font-bold text-text-primary">
                {reports.filter((r) => r.vehicle).length > 0
                  ? Math.round(
                      reports
                        .filter((r) => r.vehicle)
                        .reduce((sum, r) => sum + (r.reported_range_mi / r.vehicle!.epa_range_mi) * 100, 0) /
                        reports.filter((r) => r.vehicle).length
                    )
                  : 0}%
              </p>
              <p className="text-xs text-text-secondary">Avg % of EPA Range</p>
            </div>
          </div>

          {/* Report Cards */}
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-xl border border-border bg-bg-secondary p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-semibold text-text-primary">
                    {report.vehicle
                      ? `${report.vehicle.year} ${report.vehicle.make} ${report.vehicle.model}`
                      : 'Unknown Vehicle'}
                    {report.vehicle?.trim && (
                      <span className="ml-2 text-sm font-normal text-text-tertiary">
                        {report.vehicle.trim}
                      </span>
                    )}
                  </h3>
                  <p className="mt-1 text-xs text-text-tertiary">
                    {new Date(report.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    {report.verified && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                        Verified
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-mono text-2xl font-bold ${report.vehicle ? getRangeColor(report.reported_range_mi, report.vehicle.epa_range_mi) : 'text-text-primary'}`}>
                    {report.reported_range_mi} mi
                  </p>
                  {report.vehicle && (
                    <p className="text-xs text-text-tertiary">
                      {Math.round((report.reported_range_mi / report.vehicle.epa_range_mi) * 100)}% of EPA ({report.vehicle.epa_range_mi} mi)
                    </p>
                  )}
                </div>
              </div>

              {/* Conditions Tags */}
              <div className="mt-3 flex flex-wrap gap-2">
                {report.temperature_f !== null && (
                  <span className="rounded-full bg-bg-tertiary px-2.5 py-1 text-xs text-text-secondary">
                    {report.temperature_f}{'\u00B0'}F
                  </span>
                )}
                {report.speed_mph !== null && (
                  <span className="rounded-full bg-bg-tertiary px-2.5 py-1 text-xs text-text-secondary">
                    {report.speed_mph} mph avg
                  </span>
                )}
                {report.terrain && (
                  <span className="rounded-full bg-bg-tertiary px-2.5 py-1 text-xs text-text-secondary capitalize">
                    {report.terrain}
                  </span>
                )}
                {report.hvac_usage && report.hvac_usage !== 'off' && (
                  <span className="rounded-full bg-bg-tertiary px-2.5 py-1 text-xs text-text-secondary">
                    {report.hvac_usage === 'ac' ? 'A/C' : report.hvac_usage === 'heat_pump' ? 'Heat Pump' : 'Resistive Heat'}
                  </span>
                )}
                {report.battery_health_pct !== null && report.battery_health_pct < 100 && (
                  <span className="rounded-full bg-bg-tertiary px-2.5 py-1 text-xs text-text-secondary">
                    {report.battery_health_pct}% battery health
                  </span>
                )}
              </div>

              {/* Notes */}
              {report.notes && (
                <p className="mt-3 text-sm text-text-secondary italic">
                  &ldquo;{report.notes}&rdquo;
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent/5">
            <svg className="h-10 w-10 text-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-text-primary">No reports yet</p>
          <p className="mt-2 text-sm text-text-tertiary">
            Be the first to share your real-world EV range data with the community.
          </p>
          {user ? (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-dim"
            >
              + Submit First Report
            </button>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="mt-4 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-dim"
            >
              Sign In to Report
            </button>
          )}
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-16 border-t border-border pt-12">
        <h2 className="mb-4 text-xl font-display font-bold text-text-primary">
          About Community Range Reports
        </h2>
        <div className="prose prose-invert max-w-none text-sm text-text-secondary space-y-3">
          <p>
            EPA range ratings are measured under controlled lab conditions. Real-world range varies significantly
            based on temperature, speed, terrain, HVAC usage, and driving habits. Community range reports help
            bridge this gap by collecting actual driving data from EV owners.
          </p>
          <p>
            Every report includes the conditions under which the range was observed, making it easy to find
            relevant data for your specific driving scenario. Whether you&apos;re planning a winter road trip or
            curious about highway range at 75 mph, community data provides the most realistic expectations.
          </p>
          <p>
            Data sources: Community-submitted reports. EPA range data from{' '}
            <span className="text-text-tertiary">fueleconomy.gov</span>.
          </p>
        </div>
      </section>

      {/* Auth Modal */}
      {!authLoading && <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />}
    </div>
  );
}
