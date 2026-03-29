import type { Metadata } from 'next';
import { VehicleImagesAdmin } from './components/VehicleImagesAdmin';

export const metadata: Metadata = {
  title: 'Admin — Vehicle Images',
  robots: { index: false, follow: false },
};

export default function VehicleImagesAdminPage() {
  return <VehicleImagesAdmin />;
}
