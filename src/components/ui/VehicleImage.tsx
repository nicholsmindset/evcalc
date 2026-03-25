import Image from 'next/image';

// ── Vehicle class placeholder SVG ─────────────────────────────────────────────

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  );
}

function SUVIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
      <rect x="2" y="9" width="20" height="9" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9L8 5h8l2 4" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="17" cy="19" r="2" />
    </svg>
  );
}

function SedanIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
      <rect x="2" y="11" width="20" height="7" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 11L9 7h6l3 4" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="17" cy="19" r="2" />
    </svg>
  );
}

function PlaceholderIcon({
  vehicleClass,
  className,
}: {
  vehicleClass?: string | null;
  className?: string;
}) {
  const cls = (vehicleClass || '').toLowerCase();
  if (cls.includes('truck') || cls.includes('pickup')) {
    return <TruckIcon className={className} />;
  }
  if (cls.includes('suv') || cls.includes('crossover') || cls.includes('van')) {
    return <SUVIcon className={className} />;
  }
  return <SedanIcon className={className} />;
}

// ── VehicleImage ──────────────────────────────────────────────────────────────

interface VehicleImageProps {
  /** The stored image URL from the vehicles.image_url DB field */
  imageUrl?: string | null;
  /** Used to pick the right silhouette for the placeholder */
  vehicleClass?: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** CSS class applied to the placeholder wrapper (when no image URL) */
  placeholderClassName?: string;
}

/**
 * Displays an AI-generated vehicle image from Supabase Storage.
 * Falls back to a vehicle-class-appropriate silhouette placeholder
 * when no image URL is available yet.
 *
 * Images are served from Supabase Storage CDN; next/image handles
 * WebP conversion, responsive sizing, and lazy loading automatically.
 */
export function VehicleImage({
  imageUrl,
  vehicleClass,
  alt,
  width = 800,
  height = 450,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px',
  placeholderClassName = '',
}: VehicleImageProps) {
  if (!imageUrl) {
    return (
      <div
        className={`flex items-center justify-center bg-bg-tertiary text-text-tertiary ${placeholderClassName || className}`}
        style={!placeholderClassName ? { width: '100%', aspectRatio: `${width}/${height}` } : undefined}
      >
        <PlaceholderIcon
          vehicleClass={vehicleClass}
          className="h-16 w-16 opacity-30"
        />
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      style={{ objectFit: 'cover' }}
    />
  );
}

// ── VehicleCard image (16:9, lazy-loaded) ─────────────────────────────────────

interface VehicleCardImageProps {
  imageUrl?: string | null;
  vehicleClass?: string | null;
  alt: string;
  priority?: boolean;
}

/**
 * Compact 16:9 vehicle image for grid cards (homepage, categories, compare).
 * Uses lazy loading by default; set priority for above-the-fold cards.
 */
export function VehicleCardImage({
  imageUrl,
  vehicleClass,
  alt,
  priority = false,
}: VehicleCardImageProps) {
  if (!imageUrl) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg bg-bg-tertiary text-text-tertiary">
        <PlaceholderIcon vehicleClass={vehicleClass} className="h-10 w-10 opacity-25" />
      </div>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg">
      <Image
        src={imageUrl}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}
