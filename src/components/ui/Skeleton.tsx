interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      className={`animate-pulse bg-bg-tertiary ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-5 space-y-3">
      <Skeleton variant="text" className="h-5 w-3/4" />
      <Skeleton variant="text" className="h-4 w-1/2" />
      <div className="space-y-2 pt-2">
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      <Skeleton variant="rectangular" className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="rectangular" className="h-12 w-full" />
      ))}
    </div>
  );
}
