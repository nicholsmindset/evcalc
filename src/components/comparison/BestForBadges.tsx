import type { Vehicle } from '@/lib/supabase/types';
import { Badge } from '@/components/ui/Badge';

interface BestForBadgesProps {
  vehicle: Vehicle;
  allVehicles?: Vehicle[];
}

interface BadgeInfo {
  label: string;
  variant: 'accent' | 'success' | 'info' | 'warning';
}

function computeBadges(vehicle: Vehicle, allVehicles?: Vehicle[]): BadgeInfo[] {
  const badges: BadgeInfo[] = [];

  if (vehicle.epa_range_mi >= 350) {
    badges.push({ label: 'Best Range', variant: 'accent' });
  } else if (vehicle.epa_range_mi >= 300) {
    badges.push({ label: 'Great Range', variant: 'success' });
  }

  if (vehicle.efficiency_kwh_per_100mi <= 26) {
    badges.push({ label: 'Most Efficient', variant: 'accent' });
  }

  if (vehicle.msrp_usd && vehicle.msrp_usd <= 35000) {
    badges.push({ label: 'Budget Pick', variant: 'success' });
  } else if (vehicle.msrp_usd && vehicle.msrp_usd <= 45000) {
    badges.push({ label: 'Great Value', variant: 'info' });
  }

  if (vehicle.dc_fast_max_kw && vehicle.dc_fast_max_kw >= 250) {
    badges.push({ label: 'Fast Charging', variant: 'accent' });
  }

  if (vehicle.msrp_usd && vehicle.epa_range_mi) {
    const costPerMile = vehicle.msrp_usd / vehicle.epa_range_mi;
    if (costPerMile <= 120) {
      badges.push({ label: 'Best $/Mile', variant: 'success' });
    }
  }

  const cls = (vehicle.vehicle_class || '').toLowerCase();
  if (cls.includes('suv') || cls.includes('utility')) {
    badges.push({ label: 'SUV', variant: 'info' });
  } else if (cls.includes('truck') || cls.includes('pickup')) {
    badges.push({ label: 'Truck', variant: 'info' });
  } else if (cls.includes('sedan') || cls.includes('car')) {
    badges.push({ label: 'Sedan', variant: 'info' });
  }

  // If we have all vehicles, check for category winners
  if (allVehicles && allVehicles.length > 1) {
    const sameClass = allVehicles.filter(
      (v) => v.vehicle_class === vehicle.vehicle_class && v.id !== vehicle.id,
    );
    if (sameClass.length > 0) {
      const bestRange = sameClass.every((v) => vehicle.epa_range_mi >= v.epa_range_mi);
      if (bestRange) badges.push({ label: 'Class Leader', variant: 'accent' });
    }
  }

  return badges;
}

export function BestForBadges({ vehicle, allVehicles }: BestForBadgesProps) {
  const badges = computeBadges(vehicle, allVehicles);

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((b) => (
        <Badge key={b.label} variant={b.variant}>
          {b.label}
        </Badge>
      ))}
    </div>
  );
}
