import type { Metadata } from 'next';
import { DashboardContent } from './components/DashboardContent';

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'View your EV garage, saved routes, and range reports. Track battery health and get personalized range estimates.',
  alternates: { canonical: '/dashboard' },
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardContent />;
}
