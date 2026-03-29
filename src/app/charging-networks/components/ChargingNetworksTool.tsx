'use client';

import { useState, useMemo } from 'react';

// ─── Cost-to-charge calculator data ──────────────────────────────────────────
interface EVSpec { name: string; batteryKwh: number; }
const EVS_FOR_CALC: EVSpec[] = [
  { name: 'Tesla Model 3 RWD (57.5 kWh)', batteryKwh: 57.5 },
  { name: 'Tesla Model 3 LR (82 kWh)', batteryKwh: 82 },
  { name: 'Tesla Model Y RWD (60 kWh)', batteryKwh: 60 },
  { name: 'Tesla Model Y LR (82 kWh)', batteryKwh: 82 },
  { name: 'Chevrolet Equinox EV (85 kWh)', batteryKwh: 85 },
  { name: 'Hyundai IONIQ 6 (77.4 kWh)', batteryKwh: 77.4 },
  { name: 'Hyundai IONIQ 5 (77.4 kWh)', batteryKwh: 77.4 },
  { name: 'Kia EV6 (77.4 kWh)', batteryKwh: 77.4 },
  { name: 'VW ID.4 Pro (82 kWh)', batteryKwh: 82 },
  { name: 'Ford F-150 Lightning (98 kWh)', batteryKwh: 98 },
  { name: 'Rivian R1T (135 kWh)', batteryKwh: 135 },
  { name: 'Nissan LEAF 40 kWh', batteryKwh: 40 },
  { name: 'Chevy Bolt EV (65 kWh)', batteryKwh: 65 },
];

// ─── Network DCFC pricing (subset needed for calculator) ─────────────────────
interface NetworkCalcRow {
  name: string;
  slug: string;
  pricingDcfc: number;
  membershipName: string | null;
  maxSpeedKw: number;
}

const NETWORKS_CALC: NetworkCalcRow[] = [
  { name: 'Tesla Supercharger', slug: 'tesla-supercharger', pricingDcfc: 0.28, membershipName: null, maxSpeedKw: 250 },
  { name: 'Electrify America', slug: 'electrify-america', pricingDcfc: 0.43, membershipName: 'Pass+', maxSpeedKw: 350 },
  { name: 'ChargePoint', slug: 'chargepoint', pricingDcfc: 0.35, membershipName: 'ChargePoint+', maxSpeedKw: 62 },
  { name: 'EVgo', slug: 'evgo', pricingDcfc: 0.36, membershipName: 'EVgo Plus', maxSpeedKw: 350 },
  { name: 'Blink', slug: 'blink', pricingDcfc: 0.48, membershipName: 'Blink Plus', maxSpeedKw: 80 },
  { name: 'FLO', slug: 'flo', pricingDcfc: 0.39, membershipName: 'FLO+', maxSpeedKw: 62 },
  { name: 'Rivian Adventure Network', slug: 'rivian-adventure', pricingDcfc: 0.32, membershipName: 'Rivian Membership', maxSpeedKw: 200 },
  { name: 'Shell Recharge', slug: 'shell-recharge', pricingDcfc: 0.40, membershipName: 'Shell Recharge', maxSpeedKw: 62 },
];

export default function ChargingNetworksTool() {
  const [selEV, setSelEV] = useState(EVS_FOR_CALC[0]);
  const [chargeFromPct, setChargeFromPct] = useState(20);
  const [chargeToP, setChargeToP] = useState(80);

  const kwhNeeded = useMemo(() => {
    const pct = Math.max(0, chargeToP - chargeFromPct);
    return selEV.batteryKwh * pct / 100;
  }, [selEV, chargeFromPct, chargeToP]);

  const sortedNetworks = useMemo(
    () => [...NETWORKS_CALC].sort((a, b) => a.pricingDcfc - b.pricingDcfc),
    [],
  );

  return (
    <div className="mb-10 rounded-lg border border-border bg-bg-secondary p-5">
      <h2 className="mb-4 font-display text-base font-bold text-text-primary">
        Cost to Charge 10% &rarr; 80% by Network
      </h2>
      <div className="mb-4 flex flex-wrap items-end gap-4">
        <div>
          <label className="mb-1 block text-xs text-text-secondary">Select EV</label>
          <select
            value={selEV.name}
            onChange={e => { const f = EVS_FOR_CALC.find(ev => ev.name === e.target.value); if (f) setSelEV(f); }}
            className="rounded border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {EVS_FOR_CALC.map(ev => <option key={ev.name} value={ev.name}>{ev.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-secondary">Charge from %</label>
          <input type="number" min={0} max={90} value={chargeFromPct}
            onChange={e => setChargeFromPct(Number(e.target.value))}
            className="w-20 rounded border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-secondary">Charge to %</label>
          <input type="number" min={10} max={100} value={chargeToP}
            onChange={e => setChargeToP(Number(e.target.value))}
            className="w-20 rounded border border-border bg-bg-tertiary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent" />
        </div>
        <div className="text-sm text-text-secondary">
          = <span className="font-mono font-bold text-text-primary">{kwhNeeded.toFixed(1)} kWh</span>
        </div>
      </div>
      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-tertiary text-xs text-text-secondary">
              <th className="px-3 py-2 text-left">Network</th>
              <th className="px-3 py-2 text-right">Non-member</th>
              <th className="px-3 py-2 text-right">Member</th>
              <th className="px-3 py-2 text-right">Max Speed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedNetworks.map(n => {
              const cost = n.pricingDcfc * kwhNeeded;
              const memberCost = n.membershipName ? cost * 0.84 : null;
              return (
                <tr key={n.slug}>
                  <td className="px-3 py-2 font-medium text-text-primary">{n.name}</td>
                  <td className="px-3 py-2 text-right font-mono">${cost.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right font-mono text-green-400">
                    {memberCost !== null ? `$${memberCost.toFixed(2)}` : '\u2014'}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-text-secondary">{n.maxSpeedKw} kW</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-text-tertiary">Member pricing shown as ~16% average discount; actual varies by network and plan.</p>
    </div>
  );
}
