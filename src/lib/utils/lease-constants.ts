/**
 * Static constants for the Lease vs Buy calculator.
 * Loan APR by credit tier — Federal Reserve / Bankrate averages (2025).
 * State sales tax rates for vehicle purchases (state-level only; excludes local add-ons).
 */

export type CreditTier = 'excellent' | 'good' | 'fair' | 'poor';

export const CREDIT_TIER_LABELS: Record<CreditTier, string> = {
  excellent: 'Excellent (720+)',
  good: 'Good (680–719)',
  fair: 'Fair (620–679)',
  poor: 'Poor (<620)',
};

/** Average new-car auto loan APR by FICO tier (annual %, as decimal). Source: Bankrate 2025. */
export const LOAN_APR: Record<CreditTier, number> = {
  excellent: 0.055, // 5.5%
  good:      0.070, // 7.0%
  fair:      0.095, // 9.5%
  poor:      0.130, // 13.0%
};

/**
 * State-level vehicle sales tax rates (approximate).
 * Some states use flat vehicle excise tax instead of percentage (noted).
 * Source: NCSL / state DMV schedules.
 */
export const STATE_SALES_TAX: Record<string, number> = {
  'Alabama':             0.0200, // AL charges 2% state, plus local
  'Alaska':              0.0000, // no state sales tax
  'Arizona':             0.0560,
  'Arkansas':            0.0650,
  'California':          0.0725, // state rate; county/city add more
  'Colorado':            0.0290,
  'Connecticut':         0.0635,
  'Delaware':            0.0000, // no sales tax
  'District of Columbia':0.0600,
  'Florida':             0.0600,
  'Georgia':             0.0700, // Title Ad Valorem Tax ~7%
  'Hawaii':              0.0400,
  'Idaho':               0.0600,
  'Illinois':            0.0625,
  'Indiana':             0.0700,
  'Iowa':                0.0500,
  'Kansas':              0.0650,
  'Kentucky':            0.0600,
  'Louisiana':           0.0445,
  'Maine':               0.0550,
  'Maryland':            0.0600,
  'Massachusetts':       0.0625,
  'Michigan':            0.0600,
  'Minnesota':           0.0688,
  'Mississippi':         0.0500,
  'Missouri':            0.0423,
  'Montana':             0.0000, // no sales tax
  'Nebraska':            0.0550,
  'Nevada':              0.0685,
  'New Hampshire':       0.0000, // no sales tax
  'New Jersey':          0.0663,
  'New Mexico':          0.0513,
  'New York':            0.0400, // state; NYC adds ~4.5% more
  'North Carolina':      0.0300, // 3% Highway Use Tax
  'North Dakota':        0.0500,
  'Ohio':                0.0575,
  'Oklahoma':            0.0325,
  'Oregon':              0.0000, // no sales tax
  'Pennsylvania':        0.0600,
  'Rhode Island':        0.0700,
  'South Carolina':      0.0500,
  'South Dakota':        0.0400,
  'Tennessee':           0.0700,
  'Texas':               0.0625,
  'Utah':                0.0485,
  'Vermont':             0.0600,
  'Virginia':            0.0415,
  'Washington':          0.0650,
  'West Virginia':       0.0600,
  'Wisconsin':           0.0500,
  'Wyoming':             0.0400,
};

export const US_STATES = Object.keys(STATE_SALES_TAX).sort();
