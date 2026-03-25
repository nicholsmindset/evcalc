/**
 * Lease vs Buy calculation engine.
 *
 * Lease formula (standard US automotive):
 *   net_cap_cost  = MSRP - down_payment - trade_in - cap_cost_reduction (tax credit)
 *   residual      = MSRP × residual_pct
 *   depreciation  = (net_cap_cost - residual) ÷ term_months
 *   finance_charge = (net_cap_cost + residual) × money_factor
 *   monthly_base  = depreciation + finance_charge
 *   monthly_total = monthly_base × (1 + sales_tax_rate)
 *
 * Finance formula:
 *   principal = MSRP × (1 + tax_rate) - down - trade - tax_credit
 *   monthly   = P × r(1+r)^n / ((1+r)^n - 1)   [standard amortization]
 *
 * Cash:
 *   total_paid = MSRP × (1 + tax_rate) - trade - tax_credit
 */

export interface LeaseInputs {
  msrp: number;
  downPayment: number;
  tradeIn: number;
  taxCreditAmount: number;   // 0 if not applying; typically 7500
  applyCredit: boolean;       // whether to apply the credit to this option
  moneyFactor: number;        // e.g. 0.00125
  residualPct: number;        // e.g. 52 (= 52%)
  termMonths: number;
  acquisitionFee: number;
  salesTaxRate: number;       // decimal, e.g. 0.0725
}

export interface LeaseResult {
  monthlyPayment: number;
  totalCost: number;       // down + all payments + acquisition fee
  netCapCost: number;
  residualValue: number;
  financeChargeTotal: number;
  effectiveAPR: number;
  youOwnAtEnd: false;
}

export function calculateLease(inputs: LeaseInputs): LeaseResult {
  const {
    msrp, downPayment, tradeIn, taxCreditAmount, applyCredit,
    moneyFactor, residualPct, termMonths, acquisitionFee, salesTaxRate,
  } = inputs;

  const credit = applyCredit ? taxCreditAmount : 0;
  const netCapCost = Math.max(0, msrp - downPayment - tradeIn - credit);
  const residualValue = msrp * (residualPct / 100);

  const depreciation = (netCapCost - residualValue) / termMonths;
  const financeCharge = (netCapCost + residualValue) * moneyFactor;
  const baseMonthly = depreciation + financeCharge;
  const monthlyPayment = Math.round(baseMonthly * (1 + salesTaxRate) * 100) / 100;

  const totalCost = Math.round(downPayment + monthlyPayment * termMonths + acquisitionFee);
  const financeChargeTotal = Math.round(financeCharge * termMonths * (1 + salesTaxRate));

  // Approximate APR from money factor
  const effectiveAPR = Math.round(moneyFactor * 2400 * 10) / 10;

  return {
    monthlyPayment,
    totalCost,
    netCapCost: Math.round(netCapCost),
    residualValue: Math.round(residualValue),
    financeChargeTotal,
    effectiveAPR,
    youOwnAtEnd: false,
  };
}


export interface FinanceInputs {
  msrp: number;
  downPayment: number;
  tradeIn: number;
  taxCreditAmount: number;
  applyCredit: boolean;
  apr: number;           // annual rate as decimal, e.g. 0.07 for 7%
  termMonths: number;
  salesTaxRate: number;
}

export interface FinanceResult {
  monthlyPayment: number;
  totalCost: number;
  totalInterest: number;
  principal: number;
  vehicleValueAtEnd: number;  // estimated (15% annual EV depreciation)
  youOwnAtEnd: true;
}

export function calculateFinance(inputs: FinanceInputs): FinanceResult {
  const {
    msrp, downPayment, tradeIn, taxCreditAmount, applyCredit,
    apr, termMonths, salesTaxRate,
  } = inputs;

  const credit = applyCredit ? taxCreditAmount : 0;
  const purchasePrice = msrp * (1 + salesTaxRate);
  const principal = Math.max(0, purchasePrice - downPayment - tradeIn - credit);

  const r = apr / 12;
  let monthlyPayment: number;
  if (r === 0) {
    monthlyPayment = principal / termMonths;
  } else {
    const factor = Math.pow(1 + r, termMonths);
    monthlyPayment = (principal * r * factor) / (factor - 1);
  }
  monthlyPayment = Math.round(monthlyPayment * 100) / 100;

  const totalPayments = monthlyPayment * termMonths;
  const totalCost = Math.round(downPayment + totalPayments);
  const totalInterest = Math.round(totalPayments - principal);

  // EV depreciation: ~18% year 1, ~13% thereafter (simplified to 15% flat)
  const vehicleValueAtEnd = Math.round(
    Math.max(msrp * 0.05, msrp * Math.pow(0.85, termMonths / 12))
  );

  return {
    monthlyPayment,
    totalCost,
    totalInterest,
    principal: Math.round(principal),
    vehicleValueAtEnd,
    youOwnAtEnd: true,
  };
}


export interface CashInputs {
  msrp: number;
  tradeIn: number;
  taxCreditAmount: number;
  applyCredit: boolean;
  salesTaxRate: number;
}

export interface CashResult {
  totalCost: number;
  effectiveMonthlyCost: number;  // spread over 60 months
  vehicleValueAtEnd: number;     // after 5 years
  youOwnAtEnd: true;
}

export function calculateCash(inputs: CashInputs): CashResult {
  const { msrp, tradeIn, taxCreditAmount, applyCredit, salesTaxRate } = inputs;

  const credit = applyCredit ? taxCreditAmount : 0;
  const totalCost = Math.round(msrp * (1 + salesTaxRate) - tradeIn - credit);
  const effectiveMonthlyCost = Math.round(totalCost / 60);
  const vehicleValueAtEnd = Math.round(Math.max(msrp * 0.05, msrp * Math.pow(0.85, 5)));

  return {
    totalCost,
    effectiveMonthlyCost,
    vehicleValueAtEnd,
    youOwnAtEnd: true,
  };
}


export interface BreakEvenResult {
  breakEvenMonth: number | null;   // null if buying never breaks even over 84 months
  cumulativeLeaseCosts: number[];  // 84 data points (net cost at each month)
  cumulativeFinanceCosts: number[];
  cumulativeCashCosts: number[];
}

/**
 * Calculate cumulative NET cost (money paid minus vehicle residual value) for
 * all three options over 84 months. This lets the user see when buying
 * becomes cheaper than leasing.
 */
export function calculateBreakEven(
  leaseResult: LeaseResult,
  financeResult: FinanceResult,
  cashResult: CashResult,
  leaseTerm: number,
  financeTerm: number,
  msrp: number,
  downPayment: number,
): BreakEvenResult {
  const MONTHS = 84;
  const ANNUAL_DEPRECIATION = 0.15; // 15% / year for EVs
  const MIN_RESIDUAL_PCT = 0.05;

  let leaseTotal = downPayment;          // upfront at signing
  let financeTotal = downPayment;
  let breakEvenMonth: number | null = null;

  const cumulativeLeaseCosts: number[] = [];
  const cumulativeFinanceCosts: number[] = [];
  const cumulativeCashCosts: number[] = [];

  for (let m = 1; m <= MONTHS; m++) {
    // Lease: monthly payment; at renewal add a smaller down (50% of original)
    leaseTotal += leaseResult.monthlyPayment;
    if (m % leaseTerm === 0 && m < MONTHS) {
      leaseTotal += downPayment * 0.5; // simplified renewal cost
    }

    // Finance: monthly payment until term, then $0
    if (m <= financeTerm) {
      financeTotal += financeResult.monthlyPayment;
    }

    // Current vehicle market value (depreciation curve)
    const vehicleValue = Math.round(
      Math.max(msrp * MIN_RESIDUAL_PCT, msrp * Math.pow(1 - ANNUAL_DEPRECIATION, m / 12))
    );

    // Net costs: subtract vehicle's current value for purchase options
    // (you own an asset worth X; your effective net spend is reduced by X)
    const netLease   = Math.round(leaseTotal);
    const netFinance = Math.round(financeTotal - vehicleValue);
    const netCash    = Math.round(cashResult.totalCost - vehicleValue);

    cumulativeLeaseCosts.push(netLease);
    cumulativeFinanceCosts.push(netFinance);
    cumulativeCashCosts.push(netCash);

    // Break-even: first month where financing is net cheaper than leasing
    if (breakEvenMonth === null && netFinance < netLease) {
      breakEvenMonth = m;
    }
  }

  return { breakEvenMonth, cumulativeLeaseCosts, cumulativeFinanceCosts, cumulativeCashCosts };
}
