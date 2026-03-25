import { NextRequest, NextResponse } from 'next/server';
import {
  getVehicleTaxCredit,
  getLeaseEstimate,
  getAllLeaseEstimates,
} from '@/lib/supabase/queries/lease';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const make = searchParams.get('make');
  const model = searchParams.get('model');
  const yearStr = searchParams.get('year');
  const termStr = searchParams.get('term');

  if (!make || !model || !yearStr) {
    return NextResponse.json({ error: 'make, model, and year are required' }, { status: 400 });
  }

  const year = parseInt(yearStr, 10);
  const term = termStr ? parseInt(termStr, 10) : 36;

  if (isNaN(year) || isNaN(term)) {
    return NextResponse.json({ error: 'year and term must be numbers' }, { status: 400 });
  }

  const [taxCredit, leaseEstimate, allTerms] = await Promise.all([
    getVehicleTaxCredit(make, model, year),
    getLeaseEstimate(make, model, year, term),
    getAllLeaseEstimates(make, model, year),
  ]);

  return NextResponse.json({ taxCredit, leaseEstimate, allTerms });
}
