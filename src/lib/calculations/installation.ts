// Budget assumptions, not surveyed local prices. User-entered quotes take precedence.
export const INSTALLATION_STATES = [
  { code: 'AL', name: 'Alabama', rate: 75, permit: 75 },
  { code: 'AK', name: 'Alaska', rate: 100, permit: 150 },
  { code: 'AZ', name: 'Arizona', rate: 90, permit: 100 },
  { code: 'AR', name: 'Arkansas', rate: 70, permit: 75 },
  { code: 'CA', name: 'California', rate: 135, permit: 200 },
  { code: 'CO', name: 'Colorado', rate: 100, permit: 150 },
  { code: 'CT', name: 'Connecticut', rate: 110, permit: 175 },
  { code: 'DE', name: 'Delaware', rate: 95, permit: 125 },
  { code: 'FL', name: 'Florida', rate: 85, permit: 100 },
  { code: 'GA', name: 'Georgia', rate: 80, permit: 100 },
  { code: 'HI', name: 'Hawaii', rate: 130, permit: 200 },
  { code: 'ID', name: 'Idaho', rate: 80, permit: 75 },
  { code: 'IL', name: 'Illinois', rate: 105, permit: 150 },
  { code: 'IN', name: 'Indiana', rate: 80, permit: 100 },
  { code: 'IA', name: 'Iowa', rate: 75, permit: 75 },
  { code: 'KS', name: 'Kansas', rate: 75, permit: 75 },
  { code: 'KY', name: 'Kentucky', rate: 75, permit: 75 },
  { code: 'LA', name: 'Louisiana', rate: 75, permit: 75 },
  { code: 'ME', name: 'Maine', rate: 90, permit: 125 },
  { code: 'MD', name: 'Maryland', rate: 105, permit: 150 },
  { code: 'MA', name: 'Massachusetts', rate: 115, permit: 175 },
  { code: 'MI', name: 'Michigan', rate: 90, permit: 125 },
  { code: 'MN', name: 'Minnesota', rate: 95, permit: 125 },
  { code: 'MS', name: 'Mississippi', rate: 70, permit: 75 },
  { code: 'MO', name: 'Missouri', rate: 80, permit: 100 },
  { code: 'MT', name: 'Montana', rate: 80, permit: 75 },
  { code: 'NE', name: 'Nebraska', rate: 80, permit: 75 },
  { code: 'NV', name: 'Nevada', rate: 100, permit: 150 },
  { code: 'NH', name: 'New Hampshire', rate: 95, permit: 125 },
  { code: 'NJ', name: 'New Jersey', rate: 110, permit: 175 },
  { code: 'NM', name: 'New Mexico', rate: 85, permit: 100 },
  { code: 'NY', name: 'New York', rate: 120, permit: 200 },
  { code: 'NC', name: 'North Carolina', rate: 80, permit: 100 },
  { code: 'ND', name: 'North Dakota', rate: 75, permit: 75 },
  { code: 'OH', name: 'Ohio', rate: 85, permit: 100 },
  { code: 'OK', name: 'Oklahoma', rate: 75, permit: 75 },
  { code: 'OR', name: 'Oregon', rate: 100, permit: 150 },
  { code: 'PA', name: 'Pennsylvania', rate: 95, permit: 125 },
  { code: 'RI', name: 'Rhode Island', rate: 105, permit: 150 },
  { code: 'SC', name: 'South Carolina', rate: 75, permit: 100 },
  { code: 'SD', name: 'South Dakota', rate: 75, permit: 75 },
  { code: 'TN', name: 'Tennessee', rate: 75, permit: 100 },
  { code: 'TX', name: 'Texas', rate: 85, permit: 100 },
  { code: 'UT', name: 'Utah', rate: 85, permit: 100 },
  { code: 'VT', name: 'Vermont', rate: 95, permit: 125 },
  { code: 'VA', name: 'Virginia', rate: 95, permit: 125 },
  { code: 'WA', name: 'Washington', rate: 110, permit: 150 },
  { code: 'WV', name: 'West Virginia', rate: 75, permit: 75 },
  { code: 'WI', name: 'Wisconsin', rate: 90, permit: 125 },
  { code: 'WY', name: 'Wyoming', rate: 80, permit: 75 },
  { code: 'DC', name: 'District of Columbia', rate: 130, permit: 200 },
];

// Illustrative wire and conduit material allowance; labor is calculated separately.
const WIRE_COST_PER_FOOT = 2.5;
const BREAKER_COST = 75;

type ExistingElectrical = 'has_240v_outlet' | 'has_200a_panel' | 'needs_panel_upgrade' | 'unsure';
type GarageType = 'attached' | 'detached' | 'carport' | 'street';
type ChargerAmperage = 24 | 32 | 40 | 48 | 60;

export interface InstallationInputs {
  stateCode: string;
  laborRate?: number;
  permitCost?: number;
  existingElectrical: ExistingElectrical;
  garageType: GarageType;
  panelDistance: number;
  chargerAmperage: ChargerAmperage;
}

interface CostBreakdown {
  labor: { low: number; high: number };
  wire: { low: number; high: number };
  breaker: { low: number; high: number };
  permit: { low: number; high: number };
  panelUpgrade?: { low: number; high: number };
  total: { low: number; high: number };
}

export function calcInstallationCosts(inputs: InstallationInputs): CostBreakdown {
  const state = INSTALLATION_STATES.find((s) => s.code === inputs.stateCode) ?? INSTALLATION_STATES[4]; // CA default
  const rate = inputs.laborRate ?? state.rate;
  const permit = inputs.permitCost ?? state.permit;

  const distanceFt = inputs.panelDistance;
  const wireCost = Math.round(distanceFt * WIRE_COST_PER_FOOT);

  // Detached garage adds 20–50ft wire run estimate
  const extraWire = inputs.garageType === 'detached' ? Math.round(30 * WIRE_COST_PER_FOOT) : 0;

  let laborHoursLow: number;
  let laborHoursHigh: number;
  let needsBreaker = true;
  let panelUpgrade: { low: number; high: number } | undefined;

  switch (inputs.existingElectrical) {
    case 'has_240v_outlet':
      // Plug-in install: just mount charger, no new circuit
      laborHoursLow = inputs.chargerAmperage > 40 ? 2 : 1;
      laborHoursHigh = inputs.chargerAmperage > 40 ? 4 : 2;
      needsBreaker = inputs.chargerAmperage > 40;
      break;
    case 'has_200a_panel':
      // New circuit needed, panel has capacity
      laborHoursLow = 2;
      laborHoursHigh = 4;
      break;
    case 'needs_panel_upgrade':
      // New circuit + panel upgrade
      laborHoursLow = 2;
      laborHoursHigh = 4;
      panelUpgrade = { low: 1500, high: 3000 };
      break;
    case 'unsure':
    default:
      // Mid estimate: assume new circuit
      laborHoursLow = 2;
      laborHoursHigh = 5;
      break;
  }

  const laborLow = Math.round(laborHoursLow * rate);
  const laborHigh = Math.round(laborHoursHigh * rate);
  const breakerLow = needsBreaker ? BREAKER_COST : 0;
  const breakerHigh = needsBreaker ? Math.round(BREAKER_COST * 1.3) : 0;
  const wireLow = needsBreaker ? wireCost + extraWire : 0;
  const wireHigh = needsBreaker ? Math.round((wireCost + extraWire) * 1.2) : 0;
  const permitLow = needsBreaker ? permit : 0;
  const permitHigh = needsBreaker ? Math.round(permit * 1.3) : 0;

  const panelLow = panelUpgrade?.low ?? 0;
  const panelHigh = panelUpgrade?.high ?? 0;

  return {
    labor: { low: laborLow, high: laborHigh },
    wire: { low: wireLow, high: wireHigh },
    breaker: { low: breakerLow, high: breakerHigh },
    permit: { low: permitLow, high: permitHigh },
    panelUpgrade: panelUpgrade,
    total: {
      low: laborLow + wireLow + breakerLow + permitLow + panelLow,
      high: laborHigh + wireHigh + breakerHigh + permitHigh + panelHigh,
    },
  };
}

