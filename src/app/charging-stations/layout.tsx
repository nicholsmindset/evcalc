import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EV Charging Station Finder — Find Chargers Near You',
  description: 'Find EV charging stations near you. Browse 85,000+ US stations and global chargers by network, connector type, and power level. Tesla, ChargePoint, Electrify America, and more.',
};

export default function ChargingStationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
