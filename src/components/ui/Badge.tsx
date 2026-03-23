type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  icon?: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-bg-tertiary text-text-secondary border-border',
  accent: 'bg-accent/10 text-accent border-accent/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  error: 'bg-error/10 text-error border-error/20',
  info: 'bg-info/10 text-info border-info/20',
};

export function Badge({
  children,
  variant = 'default',
  className = '',
  icon,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
