/**
 * Total Cost of Ownership (TCO) calculation engine.
 *
 * Compares the full ownership cost of an EV vs gas car over N years,
 * including purchase price, fuel, maintenance, insurance, and depreciation.
 */

export interface TcoInput {
  // Vehicle prices
  evPurchasePrice: number;
  gasPurchasePrice: number;

  // Tax incentives
  evTaxCredit?: number;         // default $7,500

  // Fuel
  evEfficiencyKwhPer100Mi: number;
  electricityRatePerKwh: number;
  gasMpg: number;
  gasPricePerGallon: number;

  // Driving
  annualMiles?: number;         // default 12,000
  years?: number;               // default 5

  // Insurance
  evInsuranceAnnual?: number;   // default $2,300
  gasInsuranceAnnual?: number;  // default $1,900

  // Maintenance
  evMaintenanceAnnual?: number; // default $400
  gasMaintenanceAnnual?: number; // default $900

  // Depreciation (% of purchase price per year)
  evDepreciationPctPerYear?: number;  // default 15% year 1, decreasing
  gasDepreciationPctPerYear?: number; // default 12% year 1, decreasing
}

export interface TcoYearBreakdown {
  year: number;
  evFuel: number;
  gasFuel: number;
  evMaintenance: number;
  gasMaintenance: number;
  evInsurance: number;
  gasInsurance: number;
  evResidualValue: number;
  gasResidualValue: number;
  evCumulativeCost: number;
  gasCumulativeCost: number;
}

export interface TcoResult {
  evNetPurchase: number;
  gasNetPurchase: number;
  yearlyBreakdown: TcoYearBreakdown[];
  evTotalCost: number;
  gasTotalCost: number;
  totalSavings: number;
  evCostPerMile: number;
  gasCostPerMile: number;
  categories: {
    label: string;
    ev: number;
    gas: number;
  }[];
}

const DEPRECIATION_CURVE_EV = [0.22, 0.15, 0.12, 0.10, 0.08, 0.07, 0.06, 0.05];
const DEPRECIATION_CURVE_GAS = [0.18, 0.14, 0.11, 0.09, 0.07, 0.06, 0.05, 0.05];

export function calculateTCO(input: TcoInput): TcoResult {
  const {
    evPurchasePrice,
    gasPurchasePrice,
    evTaxCredit = 7500,
    evEfficiencyKwhPer100Mi,
    electricityRatePerKwh,
    gasMpg,
    gasPricePerGallon,
    annualMiles = 12000,
    years = 5,
    evInsuranceAnnual = 2300,
    gasInsuranceAnnual = 1900,
    evMaintenanceAnnual = 400,
    gasMaintenanceAnnual = 900,
  } = input;

  const evNetPurchase = evPurchasePrice - evTaxCredit;
  const gasNetPurchase = gasPurchasePrice;

  // Annual fuel costs
  const kwhPerMile = evEfficiencyKwhPer100Mi / 100;
  const annualEvFuel = round(kwhPerMile / 0.9 * electricityRatePerKwh * annualMiles);
  const annualGasFuel = round((annualMiles / gasMpg) * gasPricePerGallon);

  // Build yearly breakdown
  const yearlyBreakdown: TcoYearBreakdown[] = [];
  let evCumulative = 0;
  let gasCumulative = 0;
  let evValue = evPurchasePrice;
  let gasValue = gasPurchasePrice;

  for (let y = 0; y < years; y++) {
    const evDepRate = DEPRECIATION_CURVE_EV[Math.min(y, DEPRECIATION_CURVE_EV.length - 1)];
    const gasDepRate = DEPRECIATION_CURVE_GAS[Math.min(y, DEPRECIATION_CURVE_GAS.length - 1)];

    evValue *= (1 - evDepRate);
    gasValue *= (1 - gasDepRate);

    const yearCosts = {
      evFuel: annualEvFuel,
      gasFuel: annualGasFuel,
      evMaintenance: evMaintenanceAnnual,
      gasMaintenance: gasMaintenanceAnnual,
      evInsurance: evInsuranceAnnual,
      gasInsurance: gasInsuranceAnnual,
    };

    evCumulative += yearCosts.evFuel + yearCosts.evMaintenance + yearCosts.evInsurance;
    gasCumulative += yearCosts.gasFuel + yearCosts.gasMaintenance + yearCosts.gasInsurance;

    yearlyBreakdown.push({
      year: y + 1,
      ...yearCosts,
      evResidualValue: round(evValue),
      gasResidualValue: round(gasValue),
      evCumulativeCost: round(evNetPurchase + evCumulative - evValue + evPurchasePrice),
      gasCumulativeCost: round(gasNetPurchase + gasCumulative - gasValue + gasPurchasePrice),
    });
  }

  // Total cost = net purchase + running costs - residual value
  const evTotalCost = round(evNetPurchase + evCumulative + (evPurchasePrice - evValue));
  const gasTotalCost = round(gasNetPurchase + gasCumulative + (gasPurchasePrice - gasValue));
  const totalSavings = round(gasTotalCost - evTotalCost);
  const totalMiles = annualMiles * years;

  const categories = [
    { label: 'Net Purchase', ev: evNetPurchase, gas: gasNetPurchase },
    { label: 'Fuel', ev: round(annualEvFuel * years), gas: round(annualGasFuel * years) },
    { label: 'Maintenance', ev: round(evMaintenanceAnnual * years), gas: round(gasMaintenanceAnnual * years) },
    { label: 'Insurance', ev: round(evInsuranceAnnual * years), gas: round(gasInsuranceAnnual * years) },
    { label: 'Depreciation', ev: round(evPurchasePrice - evValue), gas: round(gasPurchasePrice - gasValue) },
  ];

  return {
    evNetPurchase,
    gasNetPurchase,
    yearlyBreakdown,
    evTotalCost,
    gasTotalCost,
    totalSavings,
    evCostPerMile: round(evTotalCost / totalMiles),
    gasCostPerMile: round(gasTotalCost / totalMiles),
    categories,
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
