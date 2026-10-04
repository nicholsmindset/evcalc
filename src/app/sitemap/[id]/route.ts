import { notFound } from 'next/navigation';
import { getSitemap, SITEMAP_IDS } from '@/lib/sitemap';
import { urlsetXml } from '@/lib/utils/sitemap-xml';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const match = /^([a-z-]+)\.xml$/.exec(params.id);
  const id = match?.[1];
  if (!id || !SITEMAP_IDS.some((validId) => validId === id)) notFound();

  return new Response(urlsetXml(await getSitemap(id)), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
