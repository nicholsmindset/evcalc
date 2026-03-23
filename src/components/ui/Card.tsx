interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({
  children,
  className = '',
  padding = 'md',
  hover = false,
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-bg-secondary ${paddingClasses[padding]} ${hover ? 'transition-all hover:border-accent/30' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  as?: 'h2' | 'h3' | 'h4';
  className?: string;
}

export function CardTitle({ children, as: Tag = 'h3', className = '' }: CardTitleProps) {
  return (
    <Tag className={`font-display font-bold text-text-primary ${className}`}>
      {children}
    </Tag>
  );
}
