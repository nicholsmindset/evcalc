'use client';

interface ToggleOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface ToggleProps<T extends string> {
  label: string;
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  icon?: React.ReactNode;
}

export function Toggle<T extends string>({
  label,
  options,
  value,
  onChange,
  icon,
}: ToggleProps<T>) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-text-secondary">
        {icon}
        {label}
      </label>
      <div className="flex rounded-lg border border-border bg-bg-primary p-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-all ${
              value === option.value
                ? 'bg-accent/15 text-accent shadow-sm'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
