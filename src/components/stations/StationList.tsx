'use client';

import { StationCard } from './StationCard';
import type { StationProperties } from '@/components/maps/StationPopup';

interface StationListProps {
  stations: StationProperties[];
  loading?: boolean;
  onStationClick?: (station: StationProperties) => void;
  emptyMessage?: string;
}

export function StationList({
  stations,
  loading = false,
  onStationClick,
  emptyMessage = 'No stations found. Try adjusting your filters or search area.',
}: StationListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border border-border bg-bg-secondary p-4">
            <div className="h-4 w-3/4 rounded bg-bg-tertiary" />
            <div className="mt-2 h-3 w-1/2 rounded bg-bg-tertiary" />
            <div className="mt-3 h-3 w-full rounded bg-bg-tertiary" />
          </div>
        ))}
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-bg-secondary p-8 text-center">
        <svg className="mx-auto h-10 w-10 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        <p className="mt-3 text-sm text-text-secondary">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-text-tertiary">{stations.length} station{stations.length !== 1 ? 's' : ''} found</p>
      {stations.map((station) => (
        <StationCard
          key={station.id}
          station={station}
          onClick={onStationClick}
        />
      ))}
    </div>
  );
}
