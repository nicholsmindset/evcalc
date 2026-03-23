import type { StationProperties } from '@/components/maps/StationPopup';

interface StationCardProps {
  station: StationProperties;
  onClick?: (station: StationProperties) => void;
}

export function StationCard({ station, onClick }: StationCardProps) {
  const totalPorts = station.level2Count + station.dcFastCount;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${station.address}, ${station.city}, ${station.state}`,
  )}`;

  return (
    <div
      className="group rounded-xl border border-border bg-bg-secondary p-4 transition-all hover:border-accent/30 cursor-pointer"
      onClick={() => onClick?.(station)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(station); }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">
            {station.name}
          </h4>
          {station.network && (
            <p className="text-xs text-accent">{station.network}</p>
          )}
        </div>
        {station.distance !== undefined && (
          <span className="shrink-0 rounded-full bg-bg-tertiary px-2 py-0.5 text-xs font-mono text-text-secondary">
            {station.distance.toFixed(1)} mi
          </span>
        )}
      </div>

      <p className="mt-1 text-xs text-text-tertiary">
        {station.address}, {station.city}, {station.state}
      </p>

      <div className="mt-3 flex items-center gap-3">
        {station.dcFastCount > 0 && (
          <div className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            <span className="text-xs font-medium text-text-primary">{station.dcFastCount} DC Fast</span>
          </div>
        )}
        {station.level2Count > 0 && (
          <span className="text-xs text-text-secondary">{station.level2Count} L2</span>
        )}
        {totalPorts === 0 && (
          <span className="text-xs text-text-tertiary">Port info unavailable</span>
        )}
      </div>

      {station.connectors && station.connectors.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {station.connectors.map((c) => (
            <span key={c} className="rounded-full bg-bg-tertiary px-2 py-0.5 text-[10px] font-medium text-text-secondary">
              {c}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/20 transition-colors"
        >
          Directions
        </a>
        {station.pricing && (
          <span className="flex items-center text-[11px] text-text-tertiary">
            {station.pricing.length > 40 ? station.pricing.slice(0, 40) + '...' : station.pricing}
          </span>
        )}
      </div>
    </div>
  );
}
