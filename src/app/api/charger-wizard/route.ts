import { NextRequest, NextResponse } from 'next/server';
import { getChargerRecommendations, getInstallationCost } from '@/lib/supabase/queries/chargers';

export const dynamic = 'force-dynamic';

/**
 * GET /api/charger-wizard?state=CA&hardwired=1&wifiRequired=0&maxBudget=500&chargerLevel=2
 * Returns charger recommendations + installation cost for state
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const stateCode = searchParams.get('state') ?? 'CA';
  const chargerLevel = searchParams.get('chargerLevel') === '1' ? 1 : 2;
  const hardwiredOrPlug = searchParams.get('hardwired') === '1' ? 'hardwired' : 'plug';
  const wifiRequired = searchParams.get('wifiRequired') === '1';
  const maxBudgetDollars = searchParams.get('maxBudget') ? parseInt(searchParams.get('maxBudget')!) : undefined;

  const [chargers, installCost] = await Promise.all([
    getChargerRecommendations({
      chargerLevel: chargerLevel as 1 | 2,
      hardwiredOrPlug: hardwiredOrPlug as 'hardwired' | 'plug',
      wifiRequired,
      maxBudgetCents: maxBudgetDollars ? maxBudgetDollars * 100 : undefined,
    }),
    getInstallationCost(stateCode),
  ]);

  return NextResponse.json({ chargers, installCost });
}
