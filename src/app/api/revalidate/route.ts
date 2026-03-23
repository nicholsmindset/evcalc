import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidation-secret');
  const expectedSecret = process.env.REVALIDATION_SECRET;

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json(
      { revalidated: false, message: 'Invalid secret' },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const { path, tag, type = 'page' } = body as {
      path?: string;
      tag?: string;
      type?: 'page' | 'layout';
    };

    if (!path && !tag) {
      return NextResponse.json(
        { revalidated: false, message: 'path or tag is required' },
        { status: 400 },
      );
    }

    if (tag) {
      revalidateTag(tag);
    }

    if (path) {
      revalidatePath(path, type);
    }

    return NextResponse.json({
      revalidated: true,
      path: path || null,
      tag: tag || null,
      timestamp: Date.now(),
    });
  } catch (err) {
    return NextResponse.json(
      { revalidated: false, message: (err as Error).message },
      { status: 500 },
    );
  }
}
