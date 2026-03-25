import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/vehicle-search?q=tesla&type=new
 * Searches tax_credits table for vehicles matching the query.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get('q')?.trim() ?? '';
  const type = searchParams.get('type') === 'used' ? 'used' : 'new';

  if (q.length < 2) return NextResponse.json([]);

  const supabase = await createClient();

  // Search by make or model
  const { data, error } = await supabase
    .from('tax_credits')
    .select('*')
    .eq('credit_type', type)
    .or(`make.ilike.%${q}%,model.ilike.%${q}%`)
    .order('credit_amount', { ascending: false })
    .limit(10);

  if (error) {
    console.error('[vehicle-search] error:', error.message);
    return NextResponse.json([]);
  }

  return NextResponse.json(data ?? []);
}
