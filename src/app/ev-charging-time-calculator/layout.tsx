import type { Metadata } from 'next';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { generateWebApplicationSchema, generateBreadcrumbSchema } from '@/lib/utils/seo';

export const metadata: Metadata = {
  title: 'EV Charging Time Calculator — How Long to Charge Any Electric Car?',
  description:
    'Calculate exactly how long it takes to charge your EV. Enter battery size, current charge level, and charger type for an accurate time estimate.',
  alternates: { canonical: '/ev-charging-time-calculator' },
  openGraph: {
    title: 'EV Charging Time Calculator — How Long to Charge Any Electric Car?',
    description:
      'Calculate exactly how long it takes to charge your EV based on battery size, current charge level, and charger type.',
    url: '/ev-charging-time-calculator',
    type: 'website',
  },
};

export default function EvChargingTimeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SchemaMarkup
        schema={[
          generateWebApplicationSchema(
            'EV Charging Time Calculator',
            'Calculate how long it takes to charge any electric vehicle based on battery size and charger type.',
            '/ev-charging-time-calculator'
          ),
          generateBreadcrumbSchema([
            { name: 'Home', href: '/' },
            { name: 'Charging Time Calculator', href: '/ev-charging-time-calculator' },
          ]),
        ]}
      />
      {children}
    </>
  );
}
