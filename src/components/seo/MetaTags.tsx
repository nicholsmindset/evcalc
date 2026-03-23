import { SITE_NAME, SITE_URL } from '@/lib/utils/constants';

interface MetaTagsProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

/**
 * Renders Open Graph and Twitter Card meta tags as <meta> elements.
 * Use this in pages that need meta tags beyond what Next.js Metadata provides,
 * or in client components where the Metadata API isn't available.
 *
 * For most pages, prefer the generateMetadata() function from lib/utils/seo.ts
 * which uses Next.js built-in Metadata API.
 */
export function MetaTags({
  title,
  description,
  path,
  ogImage,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
}: MetaTagsProps) {
  const url = `${SITE_URL}${path}`;
  const image = ogImage || `${SITE_URL}/images/og/default.png`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return (
    <>
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="en_US" />

      {/* Article-specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical */}
      <link rel="canonical" href={url} />
    </>
  );
}
