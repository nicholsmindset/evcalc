import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from './constants';

interface PageMetadata {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function generateMetadata({
  title,
  description,
  path,
  ogImage,
  noIndex = false,
}: PageMetadata): Metadata {
  const url = `${SITE_URL}${path}`;
  const image = ogImage || `${SITE_URL}/images/og/default.png`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: `${SITE_URL}/images/icons/logo.svg`,
  };
}

export function generateWebApplicationSchema(name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; href: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/vehicles?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateHowToSchema(
  name: string,
  description: string,
  steps: Array<{ name: string; text: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((s) => ({
      '@type': 'HowToStep',
      name: s.name,
      text: s.text,
    })),
  };
}

export function generateProductSchema(vehicle: {
  name: string;
  description: string;
  slug: string;
  msrp?: number | null;
  imageUrl?: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: vehicle.name,
    description: vehicle.description,
    url: `${SITE_URL}/vehicles/${vehicle.slug}`,
    ...(vehicle.imageUrl && { image: vehicle.imageUrl }),
    ...(vehicle.msrp && {
      offers: {
        '@type': 'Offer',
        price: vehicle.msrp,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    }),
  };
}

export function generateVehicleSchema(vehicle: {
  name: string;
  make: string;
  model: string;
  year: number;
  slug: string;
  epaRangeMi: number;
  msrp?: number | null;
  imageUrl?: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    name: vehicle.name,
    manufacturer: vehicle.make,
    model: vehicle.model,
    vehicleModelDate: vehicle.year.toString(),
    fuelType: 'Electricity',
    url: `${SITE_URL}/vehicles/${vehicle.slug}`,
    ...(vehicle.imageUrl && { image: vehicle.imageUrl }),
    ...(vehicle.msrp && {
      offers: {
        '@type': 'Offer',
        price: vehicle.msrp,
        priceCurrency: 'USD',
      },
    }),
  };
}
