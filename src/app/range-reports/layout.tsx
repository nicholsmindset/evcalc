import type { Metadata } from 'next';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { generateBreadcrumbSchema } from '@/lib/utils/seo';

export const metadata: Metadata = {
  title: 'Community EV Range Reports — Real-World Range Data',
  description:
    'Browse and submit real-world EV range reports from owners. See how temperature, speed, and conditions affect range.',
  alternates: { canonical: '/range-reports' },
  openGraph: {
    title: 'Community EV Range Reports — Real-World Range Data',
    description:
      'Browse and submit real-world EV range reports from owners. See how temperature, speed, and conditions affect range.',
    url: '/range-reports',
    type: 'website',
  },
};

export default function RangeReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SchemaMarkup
        schema={generateBreadcrumbSchema([
          { name: 'Home', href: '/' },
          { name: 'Range Reports', href: '/range-reports' },
        ])}
      />
      {children}
    </>
  );
}
