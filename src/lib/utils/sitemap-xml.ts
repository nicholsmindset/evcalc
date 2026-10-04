import type { MetadataRoute } from 'next';

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  })[character] as string);
}

export function sitemapIndexXml(urls: string[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <sitemap><loc>${escapeXml(url)}</loc></sitemap>`)
    .join('\n')}\n</sitemapindex>`;
}

export function urlsetXml(entries: MetadataRoute.Sitemap): string {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
    .map((entry) => {
      const fields = [`<loc>${escapeXml(entry.url)}</loc>`];
      if (entry.lastModified) {
        const date = entry.lastModified instanceof Date
          ? entry.lastModified.toISOString()
          : entry.lastModified;
        fields.push(`<lastmod>${escapeXml(date)}</lastmod>`);
      }
      if (entry.changeFrequency) fields.push(`<changefreq>${entry.changeFrequency}</changefreq>`);
      if (entry.priority !== undefined) fields.push(`<priority>${entry.priority}</priority>`);
      return `  <url>${fields.join('')}</url>`;
    })
    .join('\n')}\n</urlset>`;
}
