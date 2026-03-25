'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { VehicleSelector } from '@/components/calculator/VehicleSelector';
import { CumulativeCostChart } from '@/components/charts/CumulativeCostChart';
import {
  calculateLease,
  calculateFinance,
  calculateCash,
  calculateBreakEven,
  type LeaseResult,
  type FinanceResult,
  type CashResult,
  type BreakEvenResult,
} from '@/lib/calculations/lease';
import {
  LOAN_APR,
  STATE_SALES_TAX,
  US_STATES,
  type CreditTier,
  CREDIT_TIER_LABELS,
} from '@/lib/utils/lease-constants';
import type { Vehicle } from '@/lib/supabase/types';
import type { TaxCreditRow, LeaseEstimateRow } from '@/lib/supabase/queries/lease';

const LEASE_TERMS = [24, 36, 48];
const FINANCE_TERMS = [48, 60, 72, 84];

type ActiveTab = 'lease' | 'finance' | 'cash';

interface LeaseData {
  taxCredit: TaxCreditRow | null;
  leaseEstimate: LeaseEstimateRow | null;
  allTerms: LeaseEstimateRow[];
}

function formatCurrency(n: number) {
  return '$' + Math.round(n).toLocaleString();
}

function ResultCard({
  label,
  monthly,
  total,
  youOwnAtEnd,
  vehicleValue,
  highlight,
  badge,
}: {
  label: string;
  monthly?: number;
  total: number;
  youOwnAtEnd: boolean;
  vehicleValue?: number;
  highlight?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`relative flex flex-col gap-3 rounded-xl border p-5 transition-all ${
        highlight
          ? 'border-accent/50 bg-accent/5 ring-1 ring-accent/20'
          : 'border-border bg-bg-secondary'
      }`}
    >
      {badge && (
        <span className="absolute -top-2.5 left-4 rounded-full bg-accent px-3 py-0.5 text-xs font-bold text-bg-primary">
          {badge}
        </span>
      )}
      <h3 className="font-display font-semibold text-text-primary">{label}</h3>
      {monthly !== undefined && (
        <div>
          <div className="font-mono text-3xl font-bold text-accent">{formatCurrency(monthly)}<span className="text-base font-normal text-text-secondary">/mo</span></div>
        </div>
      )}
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-text-tertiary">Total Cost</span>
          <span className="font-mono font-semibold text-text-primary">{formatCurrency(total)}</span>
        </div>
        {vehicleValue !== undefined && (
          <div className="flex justify-between">
            <span className="text-text-tertiary">Est. Vehicle Value</span>
            <span className="font-mono text-success">{formatCurrency(vehicleValue)}</span>
          </div>
        )}
        {vehicleValue !== undefined && (
          <div className="flex justify-between border-t border-border pt-1.5">
            <span className="text-text-tertiary">Net Cost</span>
            <span className="font-mono font-semibold text-text-primary">{formatCurrency(total - vehicleValue)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-text-tertiary">Own at end?</span>
          <span className={youOwnAtEnd ? 'font-semibold text-success' : 'text-text-tertiary'}>
            {youOwnAtEnd ? 'Yes' : 'No'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LeaseVsBuyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Vehicle state ---
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [leaseData, setLeaseData] = useState<LeaseData | null>(null);
  const [loadingLeaseData, setLoadingLeaseData] = useState(false);

  // --- Input state ---
  const [activeTab, setActiveTab] = useState<ActiveTab>('lease');
  const [msrp, setMsrp] = useState(50000);
  const [downPayment, setDownPayment] = useState(2000);
  const [tradeIn, setTradeIn] = useState(0);
  const [leaseTerm, setLeaseTerm] = useState(36);
  const [financeTerm, setFinanceTerm] = useState(60);
  const [creditTier, setCreditTier] = useState<CreditTier>('good');
  const [state, setState] = useState('California');
  const [applyTaxCredit, setApplyTaxCredit] = useState(true);

  // --- Results ---
  const [leaseResult, setLeaseResult] = useState<LeaseResult | null>(null);
  const [financeResult, setFinanceResult] = useState<FinanceResult | null>(null);
  const [cashResult, setCashResult] = useState<CashResult | null>(null);
  const [breakEven, setBreakEven] = useState<BreakEvenResult | null>(null);

  // Load from URL params on mount
  useEffect(() => {
    const p = searchParams;
    if (p.get('msrp')) setMsrp(Number(p.get('msrp')));
    if (p.get('down')) setDownPayment(Number(p.get('down')));
    if (p.get('trade')) setTradeIn(Number(p.get('trade')));
    if (p.get('lt')) setLeaseTerm(Number(p.get('lt')));
    if (p.get('ft')) setFinanceTerm(Number(p.get('ft')));
    if (p.get('ct')) setCreditTier(p.get('ct') as CreditTier);
    if (p.get('state')) setState(p.get('state')!);
    if (p.get('tab')) setActiveTab(p.get('tab') as ActiveTab);
    if (p.get('credit') === '0') setApplyTaxCredit(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // When vehicle changes, fetch lease data
  useEffect(() => {
    if (!vehicle) {
      setLeaseData(null);
      return;
    }
    if (vehicle.msrp_usd) setMsrp(vehicle.msrp_usd);

    setLoadingLeaseData(true);
    const params = new URLSearchParams({
      make: vehicle.make,
      model: vehicle.model,
      year: String(vehicle.year),
      term: String(leaseTerm),
    });
    fetch(`/api/lease-data?${params}`)
      .then((r) => r.json())
      .then((d: LeaseData) => setLeaseData(d))
      .catch(() => setLeaseData(null))
      .finally(() => setLoadingLeaseData(false));
  }, [vehicle]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch lease estimate when term changes
  useEffect(() => {
    if (!vehicle) return;
    const params = new URLSearchParams({
      make: vehicle.make,
      model: vehicle.model,
      year: String(vehicle.year),
      term: String(leaseTerm),
    });
    fetch(`/api/lease-data?${params}`)
      .then((r) => r.json())
      .then((d: LeaseData) => setLeaseData(d))
      .catch(() => null);
  }, [leaseTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate whenever inputs change
  const recalculate = useCallback(() => {
    const salesTaxRate = STATE_SALES_TAX[state] ?? 0.0725;
    const creditAmount = leaseData?.taxCredit?.credit_amount ?? 0;

    // Lease
    const leaseEst = leaseData?.leaseEstimate;
    const lResult = calculateLease({
      msrp,
      downPayment,
      tradeIn,
      taxCreditAmount: creditAmount,
      applyCredit: applyTaxCredit,
      moneyFactor: leaseEst?.money_factor ?? 0.00125,
      residualPct: leaseEst?.residual_value_pct ?? 52,
      termMonths: leaseTerm,
      acquisitionFee: leaseEst?.acquisition_fee ?? 695,
      salesTaxRate,
    });

    // Finance
    const fResult = calculateFinance({
      msrp,
      downPayment,
      tradeIn,
      taxCreditAmount: creditAmount,
      applyCredit: applyTaxCredit,
      apr: LOAN_APR[creditTier],
      termMonths: financeTerm,
      salesTaxRate,
    });

    // Cash
    const cResult = calculateCash({
      msrp,
      tradeIn,
      taxCreditAmount: creditAmount,
      applyCredit: applyTaxCredit,
      salesTaxRate,
    });

    const beResult = calculateBreakEven(
      lResult, fResult, cResult, leaseTerm, financeTerm, msrp, downPayment
    );

    setLeaseResult(lResult);
    setFinanceResult(fResult);
    setCashResult(cResult);
    setBreakEven(beResult);
  }, [msrp, downPayment, tradeIn, leaseTerm, financeTerm, creditTier, state, applyTaxCredit, leaseData]);

  useEffect(() => {
    recalculate();
  }, [recalculate]);

  // Update shareable URL
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams({
      msrp: String(msrp),
      down: String(downPayment),
      trade: String(tradeIn),
      lt: String(leaseTerm),
      ft: String(financeTerm),
      ct: creditTier,
      state,
      tab: activeTab,
      credit: applyTaxCredit ? '1' : '0',
    });
    router.replace(`/lease-vs-buy?${params}`, { scroll: false });
  }, [msrp, downPayment, tradeIn, leaseTerm, financeTerm, creditTier, state, activeTab, applyTaxCredit, router]);

  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  const taxCreditAmount = leaseData?.taxCredit?.credit_amount ?? 0;
  const leaseEst = leaseData?.leaseEstimate;

  // Determine best option
  const options = leaseResult && financeResult && cashResult
    ? [
        { key: 'lease', net: leaseResult.totalCost, label: 'Lease' },
        { key: 'finance', net: financeResult.totalCost - financeResult.vehicleValueAtEnd, label: 'Finance' },
        { key: 'cash', net: cashResult.totalCost - cashResult.vehicleValueAtEnd, label: 'Cash' },
      ]
    : [];
  const bestNet = options.length ? Math.min(...options.map((o) => o.net)) : Infinity;

  return (
    <div className="space-y-10">
      {/* Vehicle Selector */}
      <section className="rounded-xl border border-border bg-bg-secondary p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-text-primary">
          Select a Vehicle
        </h2>
        <VehicleSelector onVehicleSelect={setVehicle} selectedVehicle={vehicle} />

        {/* Tax Credit Banner */}
        {taxCreditAmount > 0 && (
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-accent/30 bg-accent/5 p-4">
            <span className="mt-0.5 text-accent">⚡</span>
            <div className="flex-1 text-sm">
              <span className="font-semibold text-accent">
                ${taxCreditAmount.toLocaleString()} Federal Tax Credit Available
              </span>
              <p className="mt-1 text-text-secondary">
                When leasing, dealers apply the full ${taxCreditAmount.toLocaleString()} as a capital cost
                reduction — <strong className="text-text-primary">no income limit applies to you</strong>.
                When purchasing, eligibility is income-limited ($150k single / $300k joint for §30D).
              </p>
              <label className="mt-2 flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={applyTaxCredit}
                  onChange={(e) => setApplyTaxCredit(e.target.checked)}
                  className="accent-accent"
                />
                <span className="text-text-secondary">Apply credit to calculation</span>
              </label>
            </div>
          </div>
        )}

        {loadingLeaseData && (
          <p className="mt-3 text-sm text-text-tertiary">Loading lease data…</p>
        )}
        {leaseEst && (
          <p className="mt-2 text-xs text-text-tertiary">
            Using {leaseTerm}-mo lease estimate: MF {leaseEst.money_factor.toFixed(5)} · {leaseEst.residual_value_pct}% residual · ${leaseEst.acquisition_fee} acq. fee
            {leaseEst.source ? ` · Source: ${leaseEst.source}` : ''}
          </p>
        )}
        {!leaseEst && vehicle && !loadingLeaseData && (
          <p className="mt-2 text-xs text-text-tertiary">
            No lease estimate found for this vehicle/term — using typical market defaults (MF 0.00125, 52% residual).
          </p>
        )}
      </section>

      {/* Inputs */}
      <section className="rounded-xl border border-border bg-bg-secondary p-6">
        <h2 className="mb-5 font-display text-lg font-semibold text-text-primary">
          Financial Details
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* MSRP */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Vehicle MSRP
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">$</span>
              <input
                type="number"
                value={msrp}
                onChange={(e) => setMsrp(Number(e.target.value))}
                min={10000}
                max={200000}
                step={500}
                className="w-full rounded-lg border border-border bg-bg-tertiary py-2.5 pl-7 pr-3 text-sm text-text-primary focus:border-accent/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Down Payment */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Down Payment / Cap Cost Reduction
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">$</span>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                min={0}
                max={50000}
                step={500}
                className="w-full rounded-lg border border-border bg-bg-tertiary py-2.5 pl-7 pr-3 text-sm text-text-primary focus:border-accent/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Trade-in */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Trade-In Value
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">$</span>
              <input
                type="number"
                value={tradeIn}
                onChange={(e) => setTradeIn(Number(e.target.value))}
                min={0}
                max={80000}
                step={500}
                className="w-full rounded-lg border border-border bg-bg-tertiary py-2.5 pl-7 pr-3 text-sm text-text-primary focus:border-accent/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Lease Term */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Lease Term
            </label>
            <div className="flex gap-2">
              {LEASE_TERMS.map((t) => (
                <button
                  key={t}
                  onClick={() => setLeaseTerm(t)}
                  className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-all ${
                    leaseTerm === t
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-text-secondary hover:border-accent/30'
                  }`}
                >
                  {t} mo
                </button>
              ))}
            </div>
          </div>

          {/* Finance Term */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Finance Term
            </label>
            <div className="flex gap-2">
              {FINANCE_TERMS.map((t) => (
                <button
                  key={t}
                  onClick={() => setFinanceTerm(t)}
                  className={`flex-1 rounded-lg border py-2 text-xs font-medium transition-all ${
                    financeTerm === t
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-text-secondary hover:border-accent/30'
                  }`}
                >
                  {t}mo
                </button>
              ))}
            </div>
          </div>

          {/* Credit Tier */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              Credit Score (for APR)
            </label>
            <select
              value={creditTier}
              onChange={(e) => setCreditTier(e.target.value as CreditTier)}
              className="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2.5 text-sm text-text-primary focus:border-accent/50 focus:outline-none"
            >
              {(Object.keys(CREDIT_TIER_LABELS) as CreditTier[]).map((tier) => (
                <option key={tier} value={tier}>
                  {CREDIT_TIER_LABELS[tier]} — {(LOAN_APR[tier] * 100).toFixed(1)}% APR
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="mb-1.5 block text-sm font-medium text-text-secondary">
              State (Sales Tax)
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2.5 text-sm text-text-primary focus:border-accent/50 focus:outline-none"
            >
              {US_STATES.map((s) => (
                <option key={s} value={s}>
                  {s} ({(STATE_SALES_TAX[s] * 100).toFixed(2)}%)
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Results — always visible */}
      {leaseResult && financeResult && cashResult && (
        <>
          {/* Tabs */}
          <div className="flex gap-2 border-b border-border">
            {(['lease', 'finance', 'cash'] as ActiveTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-medium capitalize transition-all ${
                  activeTab === tab
                    ? 'border-b-2 border-accent text-accent'
                    : 'text-text-tertiary hover:text-text-secondary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 3-Card Comparison */}
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultCard
              label="Lease"
              monthly={leaseResult.monthlyPayment}
              total={leaseResult.totalCost}
              youOwnAtEnd={false}
              highlight={options.find((o) => o.key === 'lease')?.net === bestNet}
              badge={options.find((o) => o.key === 'lease')?.net === bestNet ? 'Lowest Net Cost' : undefined}
            />
            <ResultCard
              label={`Finance (${financeTerm} mo)`}
              monthly={financeResult.monthlyPayment}
              total={financeResult.totalCost}
              youOwnAtEnd={true}
              vehicleValue={financeResult.vehicleValueAtEnd}
              highlight={options.find((o) => o.key === 'finance')?.net === bestNet}
              badge={options.find((o) => o.key === 'finance')?.net === bestNet ? 'Lowest Net Cost' : undefined}
            />
            <ResultCard
              label="Cash"
              total={cashResult.totalCost}
              youOwnAtEnd={true}
              vehicleValue={cashResult.vehicleValueAtEnd}
              highlight={options.find((o) => o.key === 'cash')?.net === bestNet}
              badge={options.find((o) => o.key === 'cash')?.net === bestNet ? 'Lowest Net Cost' : undefined}
            />
          </div>

          {/* Detail Panel for active tab */}
          <section className="rounded-xl border border-border bg-bg-secondary p-6">
            {activeTab === 'lease' && (
              <div>
                <h3 className="mb-4 font-display text-lg font-semibold text-text-primary">Lease Details</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                  {[
                    ['Net Cap Cost', formatCurrency(leaseResult.netCapCost)],
                    ['Residual Value', formatCurrency(leaseResult.residualValue)],
                    ['Finance Charges (total)', formatCurrency(leaseResult.financeChargeTotal)],
                    ['Effective APR', `${leaseResult.effectiveAPR}%`],
                    ['Monthly Payment', formatCurrency(leaseResult.monthlyPayment)],
                    ['Total Cost (all-in)', formatCurrency(leaseResult.totalCost)],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between rounded-lg bg-bg-tertiary px-4 py-3">
                      <span className="text-text-tertiary">{label}</span>
                      <span className="font-mono font-semibold text-text-primary">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'finance' && (
              <div>
                <h3 className="mb-4 font-display text-lg font-semibold text-text-primary">Finance Details</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                  {[
                    ['Loan Principal', formatCurrency(financeResult.principal)],
                    ['APR', `${(LOAN_APR[creditTier] * 100).toFixed(1)}%`],
                    ['Total Interest', formatCurrency(financeResult.totalInterest)],
                    ['Monthly Payment', formatCurrency(financeResult.monthlyPayment)],
                    ['Total Cost', formatCurrency(financeResult.totalCost)],
                    [`Est. Value at ${financeTerm} mo`, formatCurrency(financeResult.vehicleValueAtEnd)],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between rounded-lg bg-bg-tertiary px-4 py-3">
                      <span className="text-text-tertiary">{label}</span>
                      <span className="font-mono font-semibold text-text-primary">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'cash' && (
              <div>
                <h3 className="mb-4 font-display text-lg font-semibold text-text-primary">Cash Purchase Details</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                  {[
                    ['Purchase Price (w/ tax)', formatCurrency(cashResult.totalCost + cashResult.vehicleValueAtEnd - cashResult.vehicleValueAtEnd)],
                    ['Total Out of Pocket', formatCurrency(cashResult.totalCost)],
                    ['Effective Monthly Cost', `${formatCurrency(cashResult.effectiveMonthlyCost)}/mo`],
                    ['Est. Value at 5 yrs', formatCurrency(cashResult.vehicleValueAtEnd)],
                    ['Net Cost (5 yr)', formatCurrency(cashResult.totalCost - cashResult.vehicleValueAtEnd)],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between rounded-lg bg-bg-tertiary px-4 py-3">
                      <span className="text-text-tertiary">{label}</span>
                      <span className="font-mono font-semibold text-text-primary">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Break-Even Chart */}
          {breakEven && (
            <section className="rounded-xl border border-border bg-bg-secondary p-6">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold text-text-primary">
                    Break-Even Analysis
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    Net cumulative cost over 84 months (payments minus vehicle residual value)
                  </p>
                </div>
                {breakEven.breakEvenMonth ? (
                  <div className="rounded-lg border border-warning/30 bg-warning/5 px-4 py-2 text-sm">
                    <span className="font-semibold text-warning">Break-even:</span>{' '}
                    <span className="text-text-primary">Month {breakEven.breakEvenMonth}</span>
                    <span className="ml-1 text-text-tertiary">
                      ({Math.floor(breakEven.breakEvenMonth / 12)} yrs {breakEven.breakEvenMonth % 12} mo)
                    </span>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border px-4 py-2 text-sm text-text-tertiary">
                    Finance never clearly cheaper over 7 years
                  </div>
                )}
              </div>
              <CumulativeCostChart
                leaseCosts={breakEven.cumulativeLeaseCosts}
                financeCosts={breakEven.cumulativeFinanceCosts}
                cashCosts={breakEven.cumulativeCashCosts}
                breakEvenMonth={breakEven.breakEvenMonth}
              />
              <p className="mt-3 text-xs text-text-tertiary">
                * Vehicle value modeled at 15% annual depreciation. Lease renewal assumes 50% of original down payment.
                Cash total spread over purchase month (month 1). Actual results vary.
              </p>
            </section>
          )}

          {/* Share Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
              className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-all hover:border-accent/30 hover:text-text-primary"
            >
              Copy Shareable Link
            </button>
            {vehicle && (
              <Link
                href={`/vehicles/${vehicle.slug}/lease-deals`}
                className="rounded-lg border border-accent/40 bg-accent/5 px-4 py-2 text-sm font-medium text-accent transition-all hover:bg-accent/10"
              >
                View {vehicle.make} {vehicle.model} Lease Deals →
              </Link>
            )}
          </div>
        </>
      )}

      {/* Empty state */}
      {!vehicle && (
        <div className="rounded-xl border border-border bg-bg-secondary p-10 text-center">
          <p className="text-text-tertiary">Select a vehicle above to see lease vs. buy calculations.</p>
          <p className="mt-2 text-sm text-text-tertiary">
            Or adjust the MSRP manually and results will update automatically.
          </p>
        </div>
      )}
    </div>
  );
}
