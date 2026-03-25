import { NextRequest, NextResponse } from 'next/server';

const EPA_BASE = 'https://www.fueleconomy.gov/feg/ws/rest';

// Cache headers — EPA data is stable; cache at CDN for 7 days
const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400',
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'years': {
        // Return list of model years (static — EPA covers 1984–present)
        const currentYear = new Date().getFullYear() + 1;
        const years: number[] = [];
        for (let y = currentYear; y >= 2000; y--) years.push(y);
        return NextResponse.json({ years }, { headers: CACHE_HEADERS });
      }

      case 'makes': {
        const year = searchParams.get('year');
        if (!year) return NextResponse.json({ error: 'year required' }, { status: 400 });
        const res = await fetch(`${EPA_BASE}/vehicle/menu/make?year=${year}`, {
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`EPA API ${res.status}`);
        const data = await res.json();
        // EPA returns { menuItem: [{ text, value }] }
        const makes: string[] = (data.menuItem ?? []).map((m: { text: string }) => m.text);
        return NextResponse.json({ makes }, { headers: CACHE_HEADERS });
      }

      case 'models': {
        const year = searchParams.get('year');
        const make = searchParams.get('make');
        if (!year || !make) return NextResponse.json({ error: 'year and make required' }, { status: 400 });
        const res = await fetch(
          `${EPA_BASE}/vehicle/menu/model?year=${year}&make=${encodeURIComponent(make)}`,
          { headers: { Accept: 'application/json' } },
        );
        if (!res.ok) throw new Error(`EPA API ${res.status}`);
        const data = await res.json();
        const models: string[] = (data.menuItem ?? []).map((m: { text: string }) => m.text);
        return NextResponse.json({ models }, { headers: CACHE_HEADERS });
      }

      case 'options': {
        const year = searchParams.get('year');
        const make = searchParams.get('make');
        const model = searchParams.get('model');
        if (!year || !make || !model)
          return NextResponse.json({ error: 'year, make, model required' }, { status: 400 });
        const res = await fetch(
          `${EPA_BASE}/vehicle/menu/options?year=${year}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`,
          { headers: { Accept: 'application/json' } },
        );
        if (!res.ok) throw new Error(`EPA API ${res.status}`);
        const data = await res.json();
        const options: Array<{ text: string; value: string }> = (data.menuItem ?? []).map(
          (m: { text: string; value: string }) => ({ text: m.text, value: m.value }),
        );
        return NextResponse.json({ options }, { headers: CACHE_HEADERS });
      }

      case 'vehicle': {
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
        const res = await fetch(`${EPA_BASE}/vehicle/${id}`, {
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(`EPA API ${res.status}`);
        const v = await res.json();
        // Return only the fields we need
        const vehicle = {
          id: v.id,
          year: v.year,
          make: v.make,
          model: v.model,
          trany: v.trany,
          fuelType: v.fuelType1,
          city08: v.city08,       // city MPG
          hwy08: v.hwy08,         // hwy MPG
          comb08: v.comb08,       // combined MPG
          co2TailpipeGpm: v.co2TailpipeGpm ?? v.co2,
          ghgScore: v.ghgScore,
          cylinders: v.cylinders,
          displ: v.displ,
        };
        return NextResponse.json({ vehicle }, { headers: CACHE_HEADERS });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (err) {
    console.error('[gas-car-lookup]', err);
    return NextResponse.json({ error: 'Failed to fetch EPA data' }, { status: 502 });
  }
}
