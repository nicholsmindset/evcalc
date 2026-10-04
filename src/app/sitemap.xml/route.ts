import { SITE_URL } from '@/lib/utils/constants';
import { SITEMAP_IDS } from '@/lib/sitemap';
import { sitemapIndexXml } from '@/lib/utils/sitemap-xml';

export function GET() {
  const urls = SITEMAP_IDS.map((id) => `${SITE_URL}/sitemap/${id}.xml`);
  return new Response(sitemapIndexXml(urls), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
