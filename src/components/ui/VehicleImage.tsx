import Image from 'next/image';
import { getVehicleImage, getBrandImage } from '@/lib/api/pixabay';

interface VehicleImageProps {
  make: string;
  model: string;
  year?: number;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Server component that fetches and displays a vehicle image from Pixabay.
 * Falls back to a generic EV silhouette if no image is found.
 */
export async function VehicleImage({
  make,
  model,
  year,
  width = 640,
  height = 400,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, 640px',
}: VehicleImageProps) {
  const image = await getVehicleImage(make, model, year);

  if (!image) {
    return (
      <div
        className={`flex items-center justify-center bg-bg-tertiary text-text-tertiary ${className}`}
        style={{ width: '100%', aspectRatio: `${width}/${height}` }}
      >
        <svg className="h-16 w-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={image.url}
      alt={`${year || ''} ${make} ${model} electric vehicle`.trim()}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      style={{ objectFit: 'cover' }}
    />
  );
}

interface BrandImageProps {
  brand: string;
  width?: number;
  height?: number;
  className?: string;
}

export async function BrandImage({
  brand,
  width = 1200,
  height = 400,
  className = '',
}: BrandImageProps) {
  const image = await getBrandImage(brand);

  if (!image) {
    return (
      <div
        className={`flex items-center justify-center bg-bg-tertiary ${className}`}
        style={{ width: '100%', aspectRatio: `${width}/${height}` }}
      >
        <span className="text-4xl font-display font-bold text-text-tertiary/20">{brand}</span>
      </div>
    );
  }

  return (
    <Image
      src={image.url}
      alt={`${brand} electric vehicles`}
      width={width}
      height={height}
      className={className}
      sizes="100vw"
      style={{ objectFit: 'cover' }}
    />
  );
}
