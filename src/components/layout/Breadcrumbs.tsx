import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-sm ${className}`}
    >
      <ol
        className="flex flex-wrap items-center gap-1"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <li
          className="flex items-center"
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <Link
            href="/"
            className="transition-colors hover:text-[var(--accent)]"
            style={{ color: 'var(--text-secondary)' }}
            itemProp="item"
          >
            <span itemProp="name">Home</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>

        {items.map((item, index) => (
          <li
            key={item.label}
            className="flex items-center"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <span
              className="mx-1.5 select-none"
              style={{ color: 'var(--text-tertiary)' }}
              aria-hidden="true"
            >
              /
            </span>

            {item.href && index < items.length - 1 ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-[var(--accent)]"
                style={{ color: 'var(--text-secondary)' }}
                itemProp="item"
              >
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span
                style={{ color: 'var(--text-primary)' }}
                itemProp="name"
                aria-current="page"
              >
                {item.label}
              </span>
            )}

            <meta itemProp="position" content={String(index + 2)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
