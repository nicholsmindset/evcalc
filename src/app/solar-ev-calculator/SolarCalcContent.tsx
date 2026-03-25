'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

interface EV {
  slug: string;
  label: string;
  epaRange: number;
  efficiencyKwhPer100Mi: number;
}

const EVS: EV[] = [
  { slug: 'model-y-lr', label: 'Tesla Model Y Long Range', epaRange: 330, efficiencyKwhPer100Mi: 26 },
  { slug: 'model-3-lr', label: 'Tesla Model 3 Long Range', epaRange: 358, efficiencyKwhPer100Mi: 24 },
  { slug: 'ioniq-5-lr', label: 'Hyundai IONIQ 5 Long Range', epaRange: 266, efficiencyKwhPer100Mi: 30 },
  { slug: 'ioniq-6-lr', label: 'Hyundai IONIQ 6 Long Range', epaRange: 361, efficiencyKwhPer100Mi: 22 },
  { slug: 'equinox-ev', label: 'Chevrolet Equinox EV', epaRange: 319, efficiencyKwhPer100Mi: 27 },
  { slug: 'ev6-lr', label: 'Kia EV6 Long Range', epaRange: 310, efficiencyKwhPer100Mi: 27 },
  { slug: 'id4-pro', label: 'Volkswagen ID.4 Pro', epaRange: 291, efficiencyKwhPer100Mi: 29 },
  { slug: 'f150-lightning', label: 'Ford F-150 Lightning Extended', epaRange: 320, efficiencyKwhPer100Mi: 44 },
  { slug: 'r1t', label: 'Rivian R1T', epaRange: 270, efficiencyKwhPer100Mi: 52 },
  { slug: 'leaf-plus', label: 'Nissan LEAF Plus', epaRange: 212, efficiencyKwhPer100Mi: 29 },
];

const STATE_RATES: Record<string, number> = {
  CA: 0.27, NY: 0.22, TX: 0.13, FL: 0.13, WA: 0.11, OR: 0.12,
  CO: 0.13, AZ: 0.13, NV: 0.12, MA: 0.24, IL: 0.14, OH: 0.13,
  GA: 0.13, NC: 0.12, VA: 0.13, MI: 0.17, NJ: 0.19, PA: 0.15,
  MN: 0.14, WI: 0.16, CT: 0.23, HI: 0.38, AK: 0.23,
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface SolarResult {
  annual_kwh: number;
  monthly_kwh: number[];
  capacity_factor: number | null;
  solrad_annual: number | null;
}

interface ChartEntry {
  month: string;
  solar: number;
  consumption: number;
  surplus: number;
}

export default function SolarCalcContent() {
  const [evSlug, setEvSlug] = useState('model-y-lr');
  const [dailyMiles, setDailyMiles] = useState(35);
  const [systemKw, setSystemKw] = useState(8);
  const [state, setState] = useState('CA');
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SolarResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedEV = EVS.find(e => e.slug === evSlug) ?? EVS[0];
  const electricityRate = STATE_RATES[state] ?? 0.16;

  // Monthly EV consumption (constant)
  const monthlyEvKwh = (dailyMiles / 100) * selectedEV.efficiencyKwhPer100Mi * 30;
  const annualEvKwh = monthlyEvKwh * 12;

  // Auto-detect location
  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLon(pos.coords.longitude);
        setLocation(`${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`);
        setGeoLoading(false);
      },
      () => setGeoLoading(false)
    );
  }, []);

  const calculate = useCallback(async () => {
    if (lat === null || lon === null) {
      setError('Please detect your location or enter coordinates first.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/solar-estimate?lat=${lat}&lon=${lon}&system_kw=${systemKw}`
      );
      const data = await res.json() as SolarResult & { error?: string };
      if (data.error) {
        setError(data.error);
        setResult(null);
      } else {
        setResult(data);
      }
    } catch {
      setError('Failed to fetch solar data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [lat, lon, systemKw]);

  // Chart data
  const chartData: ChartEntry[] = result
    ? MONTH_LABELS.map((month, i) => {
        const solar = result.monthly_kwh[i] ?? 0;
        const consumption = monthlyEvKwh;
        return {
          month,
          solar: Math.round(solar),
          consumption: Math.round(consumption),
          surplus: Math.max(0, Math.round(solar - consumption)),
        };
      })
    : [];

  const annualSolar = result?.annual_kwh ?? 0;
  const netAnnualCost = Math.max(0, annualEvKwh - annualSolar) * electricityRate;
  const annualSavings = Math.min(annualEvKwh, annualSolar) * electricityRate;
  const coveragePct = annualEvKwh > 0 ? Math.min(100, (annualSolar / annualEvKwh) * 100) : 0;

  // Solar system cost estimates
  const systemCostBefore = systemKw * 3200; // national avg ~$3.20/W installed
  const federalItc = systemCostBefore * 0.30;
  const systemCostAfter = systemCostBefore - federalItc;
  const paybackYears = annualSavings > 0 ? systemCostAfter / annualSavings : null;

  const formatCurrency = (n: number) =>
    '$' + Math.round(n).toLocaleString();

  return (
    <div>
      {/* Inputs */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {/* EV selector */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">Your EV</label>
          <select
            value={evSlug}
            onChange={(e) => setEvSlug(e.target.value)}
            className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-3 text-text-primary outline-none focus:border-accent/60"
          >
            {EVS.map(ev => (
              <option key={ev.slug} value={ev.slug}>{ev.label}</option>
            ))}
          </select>
          <div className="mt-1 text-xs text-text-tertiary">
            {selectedEV.efficiencyKwhPer100Mi} kWh/100 mi · {selectedEV.epaRange} mi EPA range
          </div>
        </div>

        {/* State */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-primary">State (electricity rate)</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-3 text-text-primary outline-none focus:border-accent/60"
          >
            {Object.entries(STATE_RATES).sort(([a], [b]) => a.localeCompare(b)).map(([code, rate]) => (
              <option key={code} value={code}>{code} — ${rate.toFixed(2)}/kWh</option>
            ))}
            <option value="OTHER">Other — $0.16/kWh (national avg)</option>
          </select>
        </div>

        {/* Daily miles */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-text-primary">Daily Miles Driven</label>
            <span className="font-mono text-sm text-accent">{dailyMiles} mi/day</span>
          </div>
          <input
            type="range" min={5} max={150} step={5}
            value={dailyMiles}
            onChange={(e) => setDailyMiles(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-accent"
          />
          <div className="mt-1 text-xs text-text-tertiary">
            ≈ {Math.round(monthlyEvKwh)} kWh/month for EV charging
          </div>
        </div>

        {/* System size */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium text-text-primary">Solar System Size</label>
            <span className="font-mono text-sm text-accent">{systemKw} kW</span>
          </div>
          <input
            type="range" min={2} max={20} step={0.5}
            value={systemKw}
            onChange={(e) => setSystemKw(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-accent"
          />
          <div className="mt-1 flex flex-wrap gap-1.5">
            {[4, 6, 8, 10, 12].map(kw => (
              <button
                key={kw}
                onClick={() => setSystemKw(kw)}
                className={`rounded-full px-2 py-0.5 text-xs transition-colors ${
                  systemKw === kw
                    ? 'bg-accent/20 text-accent border border-accent/30'
                    : 'border border-border bg-bg-tertiary text-text-secondary hover:border-accent/20'
                }`}
              >
                {kw} kW
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="mb-6 rounded-xl border border-border bg-bg-secondary p-4">
        <div className="mb-2 text-sm font-medium text-text-primary">Your Location</div>
        <div className="flex gap-2">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Lat, Lon (e.g. 37.77, -122.41)"
            className="flex-1 rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder-text-tertiary outline-none focus:border-accent/60"
          />
          <button
            onClick={detectLocation}
            disabled={geoLoading}
            className="rounded-lg border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-secondary transition-colors hover:border-accent/30 hover:text-accent disabled:opacity-50"
          >
            {geoLoading ? '...' : '📍 Detect'}
          </button>
        </div>
        {lat !== null && (
          <div className="mt-1.5 text-xs text-text-tertiary">
            Using coordinates: {lat.toFixed(3)}, {lon?.toFixed(3)}
          </div>
        )}
      </div>

      {/* Calculate button */}
      <button
        onClick={calculate}
        disabled={loading || lat === null}
        className="mb-8 w-full rounded-xl bg-accent py-3.5 font-display text-base font-bold text-bg-primary transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {loading ? 'Calculating Solar...' : 'Calculate Solar + EV Savings'}
      </button>

      {error && (
        <div className="mb-6 rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-bg-secondary p-4 text-center">
              <div className="font-mono text-2xl font-bold text-accent">
                {Math.round(annualSolar).toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-text-secondary">kWh/year produced</div>
            </div>
            <div className="rounded-xl border border-border bg-bg-secondary p-4 text-center">
              <div className="font-mono text-2xl font-bold text-text-primary">
                {Math.round(annualEvKwh).toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-text-secondary">kWh/year for EV</div>
            </div>
            <div className="rounded-xl border border-border bg-bg-secondary p-4 text-center">
              <div className="font-mono text-2xl font-bold text-accent">
                {coveragePct.toFixed(0)}%
              </div>
              <div className="mt-1 text-xs text-text-secondary">EV charging covered</div>
            </div>
            <div className="rounded-xl border border-border bg-bg-secondary p-4 text-center">
              <div className="font-mono text-2xl font-bold text-accent">
                {formatCurrency(annualSavings)}
              </div>
              <div className="mt-1 text-xs text-text-secondary">EV savings/year</div>
            </div>
          </div>

          {/* Monthly chart */}
          <div className="rounded-xl border border-border bg-bg-secondary p-5">
            <h2 className="mb-4 font-display text-base font-bold text-text-primary">
              Monthly Solar Production vs EV Consumption
            </h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: 12 }}
                    labelStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Bar dataKey="solar" name="Solar (kWh)" radius={[3, 3, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.solar >= entry.consumption ? 'var(--accent)' : 'var(--accent-dim)'}
                      />
                    ))}
                  </Bar>
                  <ReferenceLine
                    y={Math.round(monthlyEvKwh)}
                    stroke="var(--text-tertiary)"
                    strokeDasharray="4 3"
                    label={{ value: 'EV need', fill: 'var(--text-tertiary)', fontSize: 10 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="rounded-xl border border-border bg-bg-secondary p-5">
            <h2 className="mb-4 font-display text-base font-bold text-text-primary">
              System Cost &amp; Payback
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">System cost ({systemKw} kW at $3.20/W)</span>
                <span className="font-semibold text-text-primary">{formatCurrency(systemCostBefore)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Federal ITC (30%)</span>
                <span className="font-semibold text-accent">–{formatCurrency(federalItc)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-sm font-bold">
                <span className="text-text-primary">Net system cost</span>
                <span className="text-text-primary">{formatCurrency(systemCostAfter)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Annual EV charging savings</span>
                <span className="font-semibold text-accent">{formatCurrency(annualSavings)}/yr</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Payback period (EV savings only)</span>
                <span className="font-semibold text-text-primary">
                  {paybackYears !== null ? `${paybackYears.toFixed(1)} years` : '—'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">25-year savings (EV only)</span>
                <span className="font-semibold text-accent">{formatCurrency(annualSavings * 25)}</span>
              </div>
            </div>
          </div>

          {/* CO2 impact */}
          <div className="rounded-xl border border-border bg-bg-secondary p-5">
            <h2 className="mb-3 font-display text-base font-bold text-text-primary">
              Environmental Impact
            </h2>
            <div className="grid gap-3 sm:grid-cols-3 text-center text-sm">
              <div>
                <div className="font-mono text-xl font-bold text-accent">
                  {(Math.min(annualSolar, annualEvKwh) * 0.386 / 1000).toFixed(1)}
                </div>
                <div className="text-text-tertiary">tons CO₂ offset/yr</div>
              </div>
              <div>
                <div className="font-mono text-xl font-bold text-accent">
                  {Math.round(Math.min(annualSolar, annualEvKwh) * 0.386 / 1000 * 0.39 * 10) / 10}
                </div>
                <div className="text-text-tertiary">trees equivalent</div>
              </div>
              <div>
                <div className="font-mono text-xl font-bold text-accent">
                  {Math.round((Math.min(annualSolar, annualEvKwh) * 0.386 / 1000) / 0.406 * 10) / 10}
                </div>
                <div className="text-text-tertiary">roundtrips LAX→NYC offset</div>
              </div>
            </div>
          </div>

          {/* EnergySage CTA */}
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl">☀️</span>
              <div>
                <div className="font-semibold text-text-primary">Ready to go solar?</div>
                <p className="mt-1 text-sm text-text-secondary">
                  Get free quotes from pre-vetted local installers. Most homeowners save 20-30%
                  compared to the first quote they receive.
                </p>
                <a
                  href="https://www.energysage.com/"
                  target="_blank"
                  rel="sponsored noopener"
                  className="mt-3 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg-primary transition-opacity hover:opacity-90"
                >
                  Get Free Solar Quotes →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Static explainer (shown before results) */}
      {!result && (
        <div className="rounded-xl border border-border bg-bg-secondary p-5">
          <h2 className="mb-3 font-display text-base font-bold text-text-primary">How It Works</h2>
          <ol className="space-y-2 text-sm text-text-secondary">
            <li className="flex gap-2"><span className="text-accent font-bold">1.</span> We use NREL&apos;s PVWatts API to calculate hourly solar production at your exact coordinates, accounting for local sunlight, weather, and tilt.</li>
            <li className="flex gap-2"><span className="text-accent font-bold">2.</span> Your EV&apos;s monthly energy consumption is calculated from daily miles × EPA efficiency.</li>
            <li className="flex gap-2"><span className="text-accent font-bold">3.</span> We compare production vs consumption month-by-month to show when solar fully covers your charging and when it doesn&apos;t.</li>
            <li className="flex gap-2"><span className="text-accent font-bold">4.</span> System cost uses the 2024 national average of $3.20/W installed, minus the 30% federal Investment Tax Credit (ITC).</li>
          </ol>
        </div>
      )}
    </div>
  );
}
