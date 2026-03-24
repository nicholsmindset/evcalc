import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My EV Garage — Track Your Electric Vehicles',
  description: 'Track your electric vehicles, battery health, and range performance over time.',
  robots: { index: false, follow: false },
};

export default function GarageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
