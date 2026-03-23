'use client';

interface StationProperties {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  network: string | null;
  connectors: string[] | null;
  level2Count: number;
  dcFastCount: number;
  pricing: string | null;
  accessHours: string | null;
  phone: string | null;
  distance?: number;
}

interface StationPopupProps {
  station: StationProperties;
  onClose: () => void;
}

function ConnectorBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    NACS: 'NACS',
    TESLA: 'Tesla',
    CCS: 'CCS',
    CHADEMO: 'CHAdeMO',
    J1772: 'J1772',
  };
  return (
    <span className="rounded-full bg-bg-tertiary px-2 py-0.5 text-[10px] font-medium text-text-secondary">
      {labels[type] ?? type}
    </span>
  );
}

export function StationPopup({ station, onClose }: StationPopupProps) {
  const totalPorts = station.level2Count + station.dcFastCount;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${station.address}, ${station.city}, ${station.state}`
  )}`;

  return (
    <div className="w-72 rounded-lg border border-border bg-bg-secondary p-4 shadow-xl">
      {/* Header */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold text-text-primary">
            {station.name}
          </h4>
          {station.network && (
            <p className="text-xs text-accent">{station.network}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 rounded p-0.5 text-text-tertiary transition-colors hover:text-text-primary"
          aria-label="Close"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Address */}
      <p className="text-xs text-text-secondary">
        {station.address}
        <br />
        {station.city}, {station.state}
      </p>

      {/* Stats row */}
      <div className="mt-3 flex items-center gap-3">
        {station.dcFastCount > 0 && (
          <div className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            <span className="text-xs font-medium text-text-primary">
              {station.dcFastCount} DC Fast
            </span>
          </div>
        )}
        {station.level2Count > 0 && (
          <div className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z" />
            </svg>
            <span className="text-xs text-text-secondary">
              {station.level2Count} L2
            </span>
          </div>
        )}
        {totalPorts === 0 && (
          <span className="text-xs text-text-tertiary">Port info unavailable</span>
        )}
      </div>

      {/* Connectors */}
      {station.connectors && station.connectors.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {station.connectors.map((c) => (
            <ConnectorBadge key={c} type={c} />
          ))}
        </div>
      )}

      {/* Pricing */}
      {station.pricing && (
        <p className="mt-2 text-[11px] text-text-tertiary">
          {station.pricing.length > 80
            ? station.pricing.slice(0, 80) + '...'
            : station.pricing}
        </p>
      )}

      {/* Access hours */}
      {station.accessHours && (
        <p className="mt-1 text-[11px] text-text-tertiary">
          {station.accessHours}
        </p>
      )}

      {/* Distance */}
      {station.distance !== undefined && (
        <p className="mt-2 text-xs font-medium text-text-secondary">
          {station.distance.toFixed(1)} mi away
        </p>
      )}

      {/* Actions */}
      <div className="mt-3 flex gap-2">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-accent/10 px-3 py-2 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>
          Directions
        </a>
        {station.phone && (
          <a
            href={`tel:${station.phone}`}
            className="flex items-center justify-center rounded-lg border border-border px-3 py-2 text-xs text-text-secondary transition-colors hover:text-text-primary"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

export type { StationProperties };
