import type { Metadata } from 'next';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { FAQSection } from '@/components/seo/FAQSection';
import { generateWebApplicationSchema, generateBreadcrumbSchema } from '@/lib/utils/seo';

export const metadata: Metadata = {
  title: 'EV Charging Station Finder — Find Chargers Near You',
  description:
    'Find EV charging stations near you. Browse 85,000+ US stations and global chargers by network, connector type, and power level. Tesla, ChargePoint, Electrify America, and more.',
  alternates: { canonical: '/charging-stations' },
  openGraph: {
    title: 'EV Charging Station Finder — Find Chargers Near You',
    description:
      'Find EV charging stations near you. Browse 85,000+ US stations and global chargers by network, connector type, and power level.',
    url: '/charging-stations',
    type: 'website',
  },
};

const CHARGING_STATION_FAQS = [
  { question: 'How do I find EV charging stations near me?', answer: 'Use our charging station finder above — it shows 85,000+ US stations and global chargers. Filter by network (Tesla, ChargePoint, Electrify America), connector type (CCS, NACS, CHAdeMO), and power level. The map updates in real-time with station availability.' },
  { question: 'How long does it take to charge at a public charger?', answer: "Level 2 chargers (6-20 kW) add 20-30 miles per hour of charging — good for shopping or dining stops. DC fast chargers (50-350 kW) can add 150-250 miles in 20-40 minutes. Charging speed depends on your EV's max charging rate and the station's power output." },
  { question: 'Are Tesla Superchargers open to other EVs?', answer: 'Yes, Tesla is opening its Supercharger network to non-Tesla EVs via the NACS (North American Charging Standard) connector. Most major automakers (Ford, GM, Rivian, Hyundai, BMW) have adopted NACS, and adapters are available for CCS-equipped vehicles.' },
  { question: 'What is the difference between Level 2 and DC fast charging?', answer: 'Level 2 chargers use AC power at 6-20 kW and are common at workplaces, hotels, and parking garages — ideal for longer stops. DC fast chargers deliver 50-350 kW of direct current for rapid charging, typically found along highways for road trips. DC fast charging is 5-15x faster but costs more per kWh.' },
  { question: 'How much does public EV charging cost?', answer: 'Level 2 public charging: $0.20-0.35/kWh or free at some locations. DC fast charging: $0.30-0.60/kWh depending on the network. Tesla Superchargers: $0.25-0.50/kWh. Some networks charge per-minute fees instead. Membership plans from ChargePoint, Electrify America, and EVgo offer 10-20% discounts.' },
];

export default function ChargingStationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SchemaMarkup
        schema={[
          generateWebApplicationSchema(
            'EV Charging Station Finder',
            'Find EV charging stations near you. Browse 85,000+ US stations and global chargers.',
            '/charging-stations'
          ),
          generateBreadcrumbSchema([
            { name: 'Home', href: '/' },
            { name: 'Charging Stations', href: '/charging-stations' },
          ]),
        ]}
      />
      {children}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <FAQSection faqs={CHARGING_STATION_FAQS} />
      </div>
    </>
  );
}
