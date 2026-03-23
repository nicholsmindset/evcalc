import Image from 'next/image';

export interface AffiliateProduct {
  name: string;
  category: string;
  affiliateUrl: string;
  imageUrl?: string;
  priceDisplay: string;
  rating: number;
  reviewCount: number;
  description: string;
}

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-3.5 w-3.5 ${star <= Math.round(rating) ? 'text-warning' : 'text-text-tertiary/30'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs text-text-tertiary">({reviewCount.toLocaleString()})</span>
    </div>
  );
}

function ProductCard({ product }: { product: AffiliateProduct }) {
  return (
    <a
      href={product.affiliateUrl}
      target="_blank"
      rel="sponsored noopener"
      className="group flex gap-4 rounded-xl border border-border bg-bg-secondary p-4 transition-all hover:border-accent/30"
    >
      {product.imageUrl && (
        <div className="flex-shrink-0">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={80}
            height={80}
            className="rounded-lg object-cover"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors line-clamp-2">
          {product.name}
        </h4>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        <p className="mt-1 text-xs text-text-tertiary line-clamp-2">{product.description}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-accent">{product.priceDisplay}</span>
          <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
            View on Amazon
          </span>
        </div>
      </div>
    </a>
  );
}

interface ProductRecommendationProps {
  products: AffiliateProduct[];
  title?: string;
  className?: string;
}

export function ProductRecommendation({
  products,
  title = 'Recommended Products',
  className = '',
}: ProductRecommendationProps) {
  if (products.length === 0) return null;

  // Max 3 visible at once per CLAUDE.md ad rules
  const displayed = products.slice(0, 3);

  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-display font-bold text-text-primary">{title}</h3>
        <span className="text-[10px] text-text-tertiary">Sponsored</span>
      </div>
      <div className="space-y-3">
        {displayed.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
      <p className="mt-3 text-[10px] text-text-tertiary">
        As an Amazon Associate, we earn from qualifying purchases.
      </p>
    </div>
  );
}
