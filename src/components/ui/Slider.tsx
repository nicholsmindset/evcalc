'use client';

import { useCallback, useRef } from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  icon?: React.ReactNode;
  accentColor?: string;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  formatValue,
  icon,
  accentColor,
}: SliderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const pct = ((value - min) / (max - min)) * 100;
  const displayValue = formatValue ? formatValue(value) : `${value}${unit}`;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Number(e.target.value));
    },
    [onChange],
  );

  const trackStyle = accentColor
    ? { background: `linear-gradient(to right, ${accentColor} ${pct}%, var(--border) ${pct}%)` }
    : { background: `linear-gradient(to right, var(--accent) ${pct}%, var(--border) ${pct}%)` };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-text-secondary">
          {icon}
          {label}
        </label>
        <span className="font-mono text-sm font-semibold text-text-primary">
          {displayValue}
        </span>
      </div>
      <input
        ref={inputRef}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="slider-input w-full"
        style={trackStyle}
      />
    </div>
  );
}
