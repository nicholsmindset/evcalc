import type { Metadata } from 'next';
import { GarageContent } from './components/GarageContent';

export const metadata: Metadata = {
  title: 'My Garage — Track Your EVs',
  description:
    'Save your electric vehicles, track battery health over time, and get personalized range estimates based on your actual battery condition.',
  alternates: { canonical: '/garage' },
  robots: { index: false, follow: false },
};

export default function GaragePage() {
  return <GarageContent />;
}
