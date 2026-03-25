'use client';

import { useState, useMemo } from 'react';

// ─── TOU rate data ─────────────────────────────────────────────────────────────
interface TouRate {
  utility: string;
  state: string;
  planName: string;
  peakRate: number;
  offPeakRate: number;
  superOffPeakRate: number | null;
  peakStart: number; // 24h
  peakEnd: number;
  weekendFlat: boolean; // true = all off-peak on weekends
}

const TOU_RATES: TouRate[] = [
  { utility: 'PG&E (Pacific Gas & Electric)', state: 'CA', planName: 'EV2-A', peakRate: 0.55, offPeakRate: 0.18, superOffPeakRate: 0.12, peakStart: 16, peakEnd: 21, weekendFlat: true },
  { utility: 'SCE (Southern California Edison)', state: 'CA', planName: 'TOU-EV-1', peakRate: 0.50, offPeakRate: 0.17, superOffPeakRate: 0.11, peakStart: 16, peakEnd: 21, weekendFlat: true },
  { utility: 'SDG&E (San Diego Gas & Electric)', state: 'CA', planName: 'EV-TOU2', peakRate: 0.67, offPeakRate: 0.20, superOffPeakRate: 0.12, peakStart: 16, peakEnd: 21, weekendFlat: false },
  { utility: 'LADWP (Los Angeles)', state: 'CA', planName: 'EV TOU', peakRate: 0.30, offPeakRate: 0.14, superOffPeakRate: 0.08, peakStart: 10, peakEnd: 21, weekendFlat: true },
  { utility: 'Eversource (CT/MA/NH)', state: 'CT', planName: 'EV Rate', peakRate: 0.35, offPeakRate: 0.14, superOffPeakRate: null, peakStart: 7, peakEnd: 20, weekendFlat: true },
  { utility: 'National Grid (NY)', state: 'NY', planName: 'EV TOU', peakRate: 0.28, offPeakRate: 0.12, superOffPeakRate: null, peakStart: 7, peakEnd: 23, weekendFlat: true },
  { utility: 'Con Edison (NYC)', state: 'NY', planName: 'EV Rate', peakRate: 0.40, offPeakRate: 0.15, superOffPeakRate: null, peakStart: 8, peakEnd: 22, weekendFlat: true },
  { utility: 'ComEd (Illinois)', state: 'IL', planName: 'Electric Vehicle Charging Rate', peakRate: 0.22, offPeakRate: 0.07, superOffPeakRate: null, peakStart: 7, peakEnd: 22, weekendFlat: true },
  { utility: 'PSE&G (New Jersey)', state: 'NJ', planName: 'EV TOU', peakRate: 0.26, offPeakRate: 0.11, superOffPeakRate: null, peakStart: 7, peakEnd: 22, weekendFlat: true },
  { utility: 'Pepco (DC/MD)', state: 'MD', planName: 'EV Rate', peakRate: 0.27, offPeakRate: 0.10, superOffPeakRate: null, peakStart: 10, peakEnd: 20, weekendFlat: true },
  { utility: 'Duke Energy (NC/SC)', state: 'NC', planName: 'EV Plus', peakRate: 0.24, offPeakRate: 0.09, superOffPeakRate: null, peakStart: 6, peakEnd: 21, weekendFlat: true },
  { utility: 'Georgia Power', state: 'GA', planName: 'Smart Usage EV', peakRate: 0.26, offPeakRate: 0.09, superOffPeakRate: null, peakStart: 14, peakEnd: 21, weekendFlat: true },
  { utility: 'FPL (Florida Power & Light)', state: 'FL', planName: 'OnCall EV', peakRate: 0.18, offPeakRate: 0.07, superOffPeakRate: null, peakStart: 11, peakEnd: 21, weekendFlat: false },
  { utility: 'DTE Energy (Michigan)', state: 'MI', planName: 'EV TOU', peakRate: 0.22, offPeakRate: 0.08, superOffPeakRate: null, peakStart: 11, peakEnd: 19, weekendFlat: true },
  { utility: 'Consumers Energy (Michigan)', state: 'MI', planName: 'EV Charging Rate', peakRate: 0.25, offPeakRate: 0.09, superOffPeakRate: null, peakStart: 11, peakEnd: 19, weekendFlat: true },
  { utility: 'Xcel Energy (CO/MN)', state: 'CO', planName: 'EV Accelerate Home', peakRate: 0.22, offPeakRate: 0.06, superOffPeakRate: null, peakStart: 9, peakEnd: 21, weekendFlat: true },
  { utility: 'APS (Arizona)', state: 'AZ', planName: 'EV TOU', peakRate: 0.38, offPeakRate: 0.10, superOffPeakRate: 0.07, peakStart: 15, peakEnd: 19, weekendFlat: true },
  { utility: 'Salt River Project (AZ)', state: 'AZ', planName: 'EV TOU', peakRate: 0.28, offPeakRate: 0.09, superOffPeakRate: null, peakStart: 15, peakEnd: 20, weekendFlat: true },
  { utility: 'Rocky Mountain Power (UT/WY)', state: 'UT', planName: 'EV TOU', peakRate: 0.17, offPeakRate: 0.06, superOffPeakRate: null, peakStart: 8, peakEnd: 22, weekendFlat: true },
  { utility: 'Pacific Power (OR/WA/CA)', state: 'OR', planName: 'EV TOU', peakRate: 0.18, offPeakRate: 0.08, superOffPeakRate: null, peakStart: 7, peakEnd: 21, weekendFlat: true },
  { utility: 'PSE (Puget Sound Energy)', state: 'WA', planName: 'EV Advantage', peakRate: 0.17, offPeakRate: 0.07, superOffPeakRate: null, peakStart: 6, peakEnd: 21, weekendFlat: true },
  { utility: 'Dominion Energy (VA)', state: 'VA', planName: 'EV TOU', peakRate: 0.27, offPeakRate: 0.10, superOffPeakRate: null, peakStart: 7, peakEnd: 21, weekendFlat: true },
  { utility: 'Ameren (MO/IL)', state: 'MO', planName: 'EV Driver Rate', peakRate: 0.19, offPeakRate: 0.07, superOffPeakRate: null, peakStart: 8, peakEnd: 20, weekendFlat: true },
  { utility: 'Entergy (AR/LA/MS/TX)', state: 'TX', planName: 'EV TOU', peakRate: 0.21, offPeakRate: 0.08, superOffPeakRate: null, peakStart: 11, peakEnd: 20, weekendFlat: true },
  { utility: 'CenterPoint Energy (TX)', state: 'TX', planName: 'EV Charging', peakRate: 0.20, offPeakRate: 0.07, superOffPeakRate: null, peakStart: 12, peakEnd: 20, weekendFlat: true },
];

// ─── EV dataset ────────────────────────────────────────────────────────────────
interface EVOption {
  name: string;
  batteryKwh: number;
  onboardChargerKw: number; // max AC charge rate
  milesPerKwh: number;
}

const EVS: EVOption[] = [
  { name: 'Tesla Model 3 RWD', batteryKwh: 57.5, onboardChargerKw: 11.5, milesPerKwh: 4.0 },
  { name: 'Tesla Model 3 Long Range', batteryKwh: 82, onboardChargerKw: 11.5, milesPerKwh: 4.2 },
  { name: 'Tesla Model Y RWD', batteryKwh: 60, onboardChargerKw: 11.5, milesPerKwh: 3.6 },
  { name: 'Tesla Model Y Long Range', batteryKwh: 82, onboardChargerKw: 11.5, milesPerKwh: 3.7 },
  { name: 'Chevrolet Equinox EV', batteryKwh: 85, onboardChargerKw: 11.5, milesPerKwh: 3.4 },
  { name: 'Ford Mustang Mach-E', batteryKwh: 91, onboardChargerKw: 10.5, milesPerKwh: 3.1 },
  { name: 'Hyundai IONIQ 6 SE', batteryKwh: 77.4, onboardChargerKw: 11.5, milesPerKwh: 4.0 },
  { name: 'Hyundai IONIQ 5', batteryKwh: 77.4, onboardChargerKw: 11.5, milesPerKwh: 3.2 },
  { name: 'Kia EV6', batteryKwh: 77.4, onboardChargerKw: 11.5, milesPerKwh: 3.7 },
  { name: 'Volkswagen ID.4 Pro', batteryKwh: 82, onboardChargerKw: 11.5, milesPerKwh: 3.1 },
  { name: 'BMW i4 eDrive35', batteryKwh: 83.9, onboardChargerKw: 11.5, milesPerKwh: 3.3 },
  { name: 'Rivian R1S', batteryKwh: 135, onboardChargerKw: 11.5, milesPerKwh: 2.2 },
  { name: 'Nissan LEAF 40 kWh', batteryKwh: 40, onboardChargerKw: 6.6, milesPerKwh: 3.5 },
  { name: 'Chevy Bolt EV', batteryKwh: 65, onboardChargerKw: 11.5, milesPerKwh: 3.9 },
];

// ─── Helper: rate for a given hour ────────────────────────────────────────────
function rateForHour(hour: number, rate: TouRate, isWeekend: boolean): 'peak' | 'off_peak' | 'super_off_peak' {
  if (isWeekend && rate.weekendFlat) return 'off_peak';
  const inPeak = rate.peakStart < rate.peakEnd
    ? hour >= rate.peakStart && hour < rate.peakEnd
    : hour >= rate.peakStart || hour < rate.peakEnd;
  if (inPeak) return 'peak';
  // Super off-peak: midnight–6am for utilities that have it
  if (rate.superOffPeakRate !== null && (hour < 6 || hour >= 22)) return 'super_off_peak';
  return 'off_peak';
}

function rateValue(tier: 'peak' | 'off_peak' | 'super_off_peak', rate: TouRate): number {
  if (tier === 'peak') return rate.peakRate;
  if (tier === 'super_off_peak' && rate.superOffPeakRate !== null) return rate.superOffPeakRate;
  return rate.offPeakRate;
}

type HourTier = { hour: number; tier: 'peak' | 'off_peak' | 'super_off_peak'; rate: number };

function buildDayTimeline(touRate: TouRate, isWeekend: boolean): HourTier[] {
  return Array.from({ length: 24 }, (_, h) => {
    const tier = rateForHour(h, touRate, isWeekend);
    return { hour: h, tier, rate: rateValue(tier, touRate) };
  });
}

function fmtHour(h: number): string {
  if (h === 0) return '12am';
  if (h < 12) return `${h}am`;
  if (h === 12) return '12pm';
  return `${h - 12}pm`;
}

function computeOptimalSchedule(
  timeline: HourTier[],
  ev: EVOption,
  departureHour: number,
  rangeNeeded: number,
  chargerKw: number,
) {
  // kWh needed
  const kwhNeeded = rangeNeeded / ev.milesPerKwh;
  const effectiveKw = Math.min(chargerKw, ev.onboardChargerKw);
  const hoursNeeded = kwhNeeded / effectiveKw;

  // Find cheapest contiguous block ending at or before departureHour
  // We scan backwards from departure and greedily pick cheapest hours
  // First: rank hours by rate (ascending), select cheapest enough hours to cover kwhNeeded
  const availableHours: HourTier[] = [];
  for (let i = 0; i < 24; i++) {
    const h = (departureHour - 1 - i + 24) % 24;
    availableHours.push(timeline[h]);
  }

  // Sort available hours by rate ascending
  const sorted = [...availableHours].sort((a, b) => a.rate - b.rate);
  const cheapestHours = new Set<number>();
  let accumulatedKwh = 0;
  for (const slot of sorted) {
    if (accumulatedKwh >= kwhNeeded) break;
    cheapestHours.add(slot.hour);
    accumulatedKwh += effectiveKw;
  }

  // Find the earliest hour in cheapestHours to recommend as start
  const sortedChosen = Array.from(cheapestHours).sort((a, b) => a - b);
  // Find contiguous blocks going backwards from departure
  // Simplest recommendation: start charging at the first cheapest hour
  const recommendedStart = sortedChosen.length > 0 ? sortedChosen[0] : (departureHour - Math.ceil(hoursNeeded) + 24) % 24;

  // Cost if charging during cheapest hours
  const cheapCost = Array.from(cheapestHours).reduce((sum, h) => sum + timeline[h].rate * effectiveKw, 0);

  // Cost if charging randomly (peak hours)
  const peakHours = timeline.filter(h => h.tier === 'peak');
  const avgPeakRate = peakHours.length ? peakHours.reduce((s, h) => s + h.rate, 0) / peakHours.length : timeline[0].rate;
  const worstCost = kwhNeeded * avgPeakRate;

  return {
    kwhNeeded,
    effectiveKw,
    hoursNeeded,
    recommendedStart,
    cheapCost,
    worstCost,
    monthlySavings: (worstCost - cheapCost) * 30,
    annualSavings:  (worstCost - cheapCost) * 365,
    cheapestHours,
  };
}

const CHARGER_OPTIONS = [
  { label: 'Level 1 (1.4 kW)', kw: 1.4 },
  { label: 'Level 2 — 16A (3.8 kW)', kw: 3.8 },
  { label: 'Level 2 — 24A (5.8 kW)', kw: 5.8 },
  { label: 'Level 2 — 32A (7.7 kW)', kw: 7.7 },
  { label: 'Level 2 — 40A (9.6 kW)', kw: 9.6 },
  { label: 'Level 2 — 48A (11.5 kW)', kw: 11.5 },
];

// Per-brand charging schedule instructions
const BRAND_INSTRUCTIONS: Record<string, string> = {
  Tesla: 'In the Tesla app → Schedule → set Departure Time. The car will precondition battery and finish charging just before you leave.',
  Hyundai: 'In the Hyundai Bluelink app → Charge Settings → Scheduled Charging. Set off-peak start/end times.',
  Kia: 'In the Kia Connect app → Charge → Scheduled Charging. Enter your off-peak window.',
  Ford: 'In the FordPass app → Charging → Preferred Charge Times. Set your off-peak window.',
  Chevrolet: 'In the myChevrolet app → Charging → Charge Schedule. Set departure time or charge window.',
  Volkswagen: 'In the myVW app → Charging → Charge Planning. Set preferred charging times.',
  BMW: 'In the My BMW app → Charging → Charge Now / Timer. Set up to 2 charge timers.',
  Rivian: 'In the Rivian app → Charging → Scheduled Charging. Set departure time.',
  Nissan: 'In the NissanConnect app → Charge Timer → set start time.',
};

function getBrandInstructions(evName: string): string {
  for (const [brand, instructions] of Object.entries(BRAND_INSTRUCTIONS)) {
    if (evName.toLowerCase().includes(brand.toLowerCase())) return instructions;
  }
  return 'Check your EV\'s companion app under Charging Settings or Scheduled Charging to set off-peak charge times.';
}

export default function ChargingScheduleContent() {
  const [selUtility, setSelUtility] = useState<TouRate>(TOU_RATES[0]);
  const [selEV, setSelEV] = useState<EVOption>(EVS[0]);
  const [departureHour, setDepartureHour] = useState(7); // 7am
  const [rangeNeeded, setRangeNeeded] = useState(40);    // miles
  const [chargerKw, setChargerKw] = useState(7.7);
  const [isWeekend, setIsWeekend] = useState(false);

  const timeline = useMemo(
    () => buildDayTimeline(selUtility, isWeekend),
    [selUtility, isWeekend],
  );

  const schedule = useMemo(
    () => computeOptimalSchedule(timeline, selEV, departureHour, rangeNeeded, chargerKw),
    [timeline, selEV, departureHour, rangeNeeded, chargerKw],
  );

  const tierColor = (tier: 'peak' | 'off_peak' | 'super_off_peak') => {
    if (tier === 'peak') return '#ff5252';
    if (tier === 'super_off_peak') return '#00e676';
    return '#ffc107';
  };

  const tierLabel = (tier: 'peak' | 'off_peak' | 'super_off_peak') => {
    if (tier === 'peak') return 'Peak';
    if (tier === 'super_off_peak') return 'Super Off-Peak';
    return 'Off-Peak';
  };

  return (
    <div className="space-y-8">
      {/* ─── Inputs ──────────────────────────────────────────────────────────── */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Utility */}
        <div className="space-y-3 rounded-lg border border-border bg-bg-secondary p-5">
          <h2 className="font-display text-base font-bold text-text-primary">Your Utility</h2>
          <select
            value={selUtility.utility}
            onChange={e => {
              const found = TOU_RATES.find(r => r.utility === e.target.value);
              if (found) setSelUtility(found);
            }}
            className="w-full rounded border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {TOU_RATES.map(r => (
              <option key={r.utility} value={r.utility}>{r.utility} ({r.state})</option>
            ))}
          </select>
          <div className="rounded bg-bg-tertiary px-3 py-2 text-xs text-text-secondary">
            <div className="font-semibold text-text-primary">{selUtility.planName}</div>
            <div className="mt-1 flex flex-wrap gap-x-4">
              <span style={{ color: '#ff5252' }}>Peak: ${selUtility.peakRate.toFixed(2)}/kWh</span>
              <span style={{ color: '#ffc107' }}>Off-Peak: ${selUtility.offPeakRate.toFixed(2)}/kWh</span>
              {selUtility.superOffPeakRate !== null && (
                <span style={{ color: '#00e676' }}>Super Off-Peak: ${selUtility.superOffPeakRate.toFixed(2)}/kWh</span>
              )}
            </div>
            <div className="mt-1">
              Peak hours: {fmtHour(selUtility.peakStart)} – {fmtHour(selUtility.peakEnd)}
              {selUtility.weekendFlat && ' · Weekends all off-peak'}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={isWeekend}
              onChange={e => setIsWeekend(e.target.checked)}
              className="rounded"
            />
            Show weekend rates
          </label>
        </div>

        {/* EV + schedule */}
        <div className="space-y-3 rounded-lg border border-border bg-bg-secondary p-5">
          <h2 className="font-display text-base font-bold text-text-primary">Your Vehicle &amp; Schedule</h2>

          <select
            value={selEV.name}
            onChange={e => {
              const found = EVS.find(ev => ev.name === e.target.value);
              if (found) setSelEV(found);
            }}
            className="w-full rounded border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {EVS.map(ev => (
              <option key={ev.name} value={ev.name}>{ev.name}</option>
            ))}
          </select>

          <div>
            <label className="mb-1 block text-xs text-text-secondary">Departure time</label>
            <select
              value={departureHour}
              onChange={e => setDepartureHour(Number(e.target.value))}
              className="w-full rounded border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {Array.from({ length: 24 }, (_, h) => (
                <option key={h} value={h}>{fmtHour(h)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-text-secondary">
              Range needed tonight ({rangeNeeded} mi)
            </label>
            <input
              type="range"
              min={10}
              max={Math.round(selEV.batteryKwh * selEV.milesPerKwh * 0.9)}
              step={5}
              value={rangeNeeded}
              onChange={e => setRangeNeeded(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="flex justify-between text-xs text-text-tertiary">
              <span>10 mi</span>
              <span>{Math.round(selEV.batteryKwh * selEV.milesPerKwh * 0.9)} mi</span>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-text-secondary">Home charger</label>
            <select
              value={chargerKw}
              onChange={e => setChargerKw(Number(e.target.value))}
              className="w-full rounded border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {CHARGER_OPTIONS.map(c => (
                <option key={c.kw} value={c.kw}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ─── Recommendation ──────────────────────────────────────────────────── */}
      <div className="rounded-lg border border-accent/40 bg-accent/5 p-5 text-center">
        <div className="font-display text-xl font-bold text-accent">
          Start charging at {fmtHour(schedule.recommendedStart)}
        </div>
        <div className="mt-1 text-sm text-text-secondary">
          You need{' '}
          <span className="font-semibold text-text-primary">
            {schedule.kwhNeeded.toFixed(1)} kWh
          </span>{' '}
          ({rangeNeeded} miles at {selEV.milesPerKwh.toFixed(1)} mi/kWh) ·{' '}
          <span className="font-semibold text-text-primary">
            {schedule.hoursNeeded.toFixed(1)} hours
          </span>{' '}
          at {Math.min(chargerKw, selEV.onboardChargerKw).toFixed(1)} kW ·{' '}
          finishing by {fmtHour(departureHour)}
        </div>
        <div className="mt-3 flex flex-wrap justify-center gap-4 text-sm">
          <div>
            <span className="text-text-tertiary">Tonight&apos;s cost: </span>
            <span className="font-semibold text-text-primary">${schedule.cheapCost.toFixed(2)}</span>
            <span className="ml-1 text-text-tertiary">vs ${schedule.worstCost.toFixed(2)} at peak</span>
          </div>
          <div>
            <span className="text-text-tertiary">Monthly savings: </span>
            <span className="font-semibold text-green-400">${schedule.monthlySavings.toFixed(0)}</span>
          </div>
          <div>
            <span className="text-text-tertiary">Annual savings: </span>
            <span className="font-semibold text-green-400">${schedule.annualSavings.toFixed(0)}</span>
          </div>
        </div>
      </div>

      {/* ─── 24-hour timeline ────────────────────────────────────────────────── */}
      <div>
        <h2 className="mb-3 font-display text-base font-bold text-text-primary">
          24-Hour Rate Timeline {isWeekend ? '(Weekend)' : '(Weekday)'}
        </h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <div className="flex min-w-max">
            {timeline.map(slot => {
              const isChargingHour = schedule.cheapestHours.has(slot.hour);
              const isDeparture = slot.hour === departureHour;
              return (
                <div
                  key={slot.hour}
                  className="relative flex flex-col items-center border-r border-border last:border-r-0"
                  style={{ width: 44 }}
                >
                  {/* Color bar */}
                  <div
                    className="w-full"
                    style={{
                      height: 48,
                      background: isChargingHour
                        ? '#00e676'
                        : tierColor(slot.tier),
                      opacity: isChargingHour ? 0.9 : 0.2,
                    }}
                  />
                  {/* Charging indicator */}
                  {isChargingHour && (
                    <div
                      className="absolute top-1 text-xs font-bold"
                      style={{ color: '#0a0a0f' }}
                    >
                      ⚡
                    </div>
                  )}
                  {isDeparture && (
                    <div className="absolute top-1 right-0.5 text-xs" title="Departure">
                      🚗
                    </div>
                  )}
                  {/* Hour label */}
                  <div className="mt-1 text-center text-xs text-text-tertiary">
                    {slot.hour % 3 === 0 ? fmtHour(slot.hour) : ''}
                  </div>
                  {/* Rate */}
                  <div className="mt-0.5 text-center text-xs font-mono" style={{ color: tierColor(slot.tier) }}>
                    {slot.hour % 3 === 0 ? `${(slot.rate * 100).toFixed(0)}¢` : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Legend */}
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-text-secondary">
          {((['peak', 'off_peak'] as const) as Array<'peak' | 'off_peak' | 'super_off_peak'>)
            .concat(selUtility.superOffPeakRate !== null ? ['super_off_peak'] : [])
            .map(tier => (
              <span key={tier} className="flex items-center gap-1">
                <span
                  className="inline-block h-3 w-3 rounded-sm"
                  style={{ background: tierColor(tier), opacity: 0.6 }}
                />
                {tierLabel(tier)}
              </span>
            ))}
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-sm bg-accent" />
            ⚡ Optimal charging window
          </span>
          <span>🚗 = departure</span>
        </div>
      </div>

      {/* ─── Rate comparison table ───────────────────────────────────────────── */}
      <div>
        <h2 className="mb-3 font-display text-base font-bold text-text-primary">Rate Comparison</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-tertiary text-xs text-text-secondary">
                <th className="px-4 py-3 text-left">Charging Strategy</th>
                <th className="px-4 py-3 text-right">Cost Tonight</th>
                <th className="px-4 py-3 text-right">Monthly (est.)</th>
                <th className="px-4 py-3 text-right">Annual (est.)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-text-primary">
              <tr>
                <td className="px-4 py-3">
                  <span style={{ color: '#00e676' }} className="font-semibold">Optimal (off-peak)</span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-green-400">
                  ${schedule.cheapCost.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-green-400">
                  ${(schedule.cheapCost * 30).toFixed(0)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-green-400">
                  ${(schedule.cheapCost * 365).toFixed(0)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3">
                  <span style={{ color: '#ff5252' }} className="font-semibold">Worst case (peak)</span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-red-400">
                  ${schedule.worstCost.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-red-400">
                  ${(schedule.worstCost * 30).toFixed(0)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-red-400">
                  ${(schedule.worstCost * 365).toFixed(0)}
                </td>
              </tr>
              <tr className="bg-bg-tertiary font-semibold">
                <td className="px-4 py-3 text-text-secondary">Savings</td>
                <td className="px-4 py-3 text-right font-mono text-text-primary">
                  ${(schedule.worstCost - schedule.cheapCost).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-text-primary">
                  ${schedule.monthlySavings.toFixed(0)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-text-primary">
                  ${schedule.annualSavings.toFixed(0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-text-tertiary">
          Monthly/annual estimates assume same charge session every day. Actual savings vary by driving habits.
        </p>
      </div>

      {/* ─── How to set it up ────────────────────────────────────────────────── */}
      <div className="rounded-lg border border-border bg-bg-secondary p-5">
        <h2 className="mb-3 font-display text-base font-bold text-text-primary">
          How to Set Up Scheduled Charging on Your {selEV.name}
        </h2>
        <p className="text-sm text-text-secondary">{getBrandInstructions(selEV.name)}</p>
        <div className="mt-4 rounded bg-bg-tertiary p-3 text-xs text-text-secondary">
          <strong className="text-text-primary">Pro tip:</strong> Set your departure time in the app, not
          just the charge start time. Most EVs will automatically calculate when to start charging so the
          battery is full (and warm in winter) right when you leave — saving money and extending battery life.
        </div>
      </div>

      {/* ─── TOU tips ────────────────────────────────────────────────────────── */}
      <div>
        <h2 className="mb-3 font-display text-base font-bold text-text-primary">
          Making the Most of TOU Rates
        </h2>
        <ul className="space-y-2 text-sm text-text-secondary">
          {[
            'Sign up for your utility\'s EV-specific TOU rate plan — many offer super off-peak rates (midnight–6am) as low as 6–12¢/kWh.',
            'Use your EV\'s companion app departure timer rather than a plug-in timer, so battery preconditioning also happens off-peak.',
            'If your utility has weekend flat rates, shift any "top-off" charging to Saturday or Sunday mornings.',
            'If you have solar panels, time your EV charging to coincide with peak solar production (10am–3pm) to maximize self-consumption.',
            'Avoid charging at 100% regularly — set your charge limit to 80% for daily driving to preserve long-term battery health.',
          ].map((tip, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-0.5 text-accent">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
