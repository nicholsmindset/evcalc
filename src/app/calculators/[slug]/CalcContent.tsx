'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CALCULATOR_CONFIGS } from './configs';

export interface InputField {
  id: string;
  label: string;
  unit: string;
  placeholder: string;
  min?: number;
  max?: number;
  presets?: { label: string; value: number }[];
}

export interface CalculatorConfig {
  slug: string;
  title: string;
  tagline: string;
  formula: string;
  formulaLatex: string; // human-readable formula display
  inputs: InputField[];
  outputUnit: string;
  outputLabel: string;
  compute: (inputs: Record<string, number>) => number | null;
  howItWorks: string;
  evExamples: { label: string; description: string; result: string }[];
  relatedSlugs: string[];
}

const SLUG_LABELS: Record<string, string> = {
  'watts-to-kwh': 'Watts to kWh',
  'kw-to-kwh': 'kW to kWh',
  'kwh-to-watts': 'kWh to Watts',
  'ah-to-kwh': 'Ah to kWh',
  'amp-to-kwh': 'Amps to kWh',
};

interface CalcContentProps {
  slug: string;
}

export default function CalcContent({ slug }: CalcContentProps) {
  const config = CALCULATOR_CONFIGS[slug] as CalculatorConfig | undefined;
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<number | null>(null);

  const compute = useCallback(() => {
    if (!config) return;
    const numericInputs: Record<string, number> = {};
    for (const field of config.inputs) {
      const raw = values[field.id];
      const n = parseFloat(raw ?? '');
      if (!isNaN(n) && n > 0) {
        numericInputs[field.id] = n;
      } else {
        setResult(null);
        return;
      }
    }
    setResult(config.compute(numericInputs));
  }, [values, config]);

  useEffect(() => {
    compute();
  }, [compute]);

  if (!config) return null;

  const handleChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handlePreset = (id: string, value: number) => {
    setValues((prev) => ({ ...prev, [id]: String(value) }));
  };

  const formatResult = (n: number): string => {
    if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 1 });
    if (n >= 100) return n.toFixed(2);
    if (n >= 1) return n.toFixed(3);
    return n.toFixed(4);
  };

  return (
    <div>
      {/* Formula display */}
      <div className="mb-8 rounded-xl border border-accent/20 bg-accent/5 px-5 py-4 text-center">
        <div className="font-mono text-lg font-semibold text-accent">{config.formulaLatex}</div>
        <div className="mt-1 text-xs text-text-tertiary">Formula</div>
      </div>

      {/* Inputs + Result side by side on desktop */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-5">
          {config.inputs.map((field) => (
            <div key={field.id}>
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  inputMode="decimal"
                  value={values[field.id] ?? ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  min={field.min ?? 0}
                  className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-3 pr-16 font-mono text-text-primary placeholder-text-tertiary outline-none transition-colors focus:border-accent/60 focus:ring-1 focus:ring-accent/20"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-text-tertiary">
                  {field.unit}
                </span>
              </div>
              {/* Presets */}
              {field.presets && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {field.presets.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => handlePreset(field.id, p.value)}
                      className="rounded-full border border-border bg-bg-tertiary px-2.5 py-0.5 text-xs text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Result */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-bg-secondary p-8 text-center">
          {result !== null ? (
            <>
              <div className="font-display text-5xl font-bold text-accent">
                {formatResult(result)}
              </div>
              <div className="mt-2 text-lg font-medium text-text-secondary">
                {config.outputUnit}
              </div>
              <div className="mt-1 text-sm text-text-tertiary">{config.outputLabel}</div>
            </>
          ) : (
            <>
              <div className="font-display text-5xl font-bold text-text-tertiary">—</div>
              <div className="mt-2 text-sm text-text-tertiary">Enter values above</div>
            </>
          )}
        </div>
      </div>

      {/* How it works */}
      <section className="mt-10 border-t border-border pt-8">
        <h2 className="mb-3 font-display text-xl font-bold text-text-primary">How This Formula Works</h2>
        <p className="text-sm text-text-secondary">{config.howItWorks}</p>
      </section>

      {/* EV Examples */}
      <section className="mt-8">
        <h2 className="mb-4 font-display text-xl font-bold text-text-primary">Common EV Examples</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {config.evExamples.map((ex) => (
            <div key={ex.label} className="rounded-xl border border-border bg-bg-secondary p-4">
              <div className="font-semibold text-text-primary">{ex.label}</div>
              <div className="mt-0.5 text-xs text-text-secondary">{ex.description}</div>
              <div className="mt-2 font-mono text-sm font-bold text-accent">{ex.result}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Related calculators */}
      <section className="mt-10 border-t border-border pt-8">
        <h2 className="mb-3 font-display text-lg font-bold text-text-primary">Related Calculators</h2>
        <div className="flex flex-wrap gap-3">
          {config.relatedSlugs.map((slug) => (
            <Link
              key={slug}
              href={`/calculators/${slug}`}
              className="rounded-lg border border-border bg-bg-secondary px-3 py-2 text-sm text-text-secondary transition-colors hover:border-accent/30 hover:text-accent"
            >
              {SLUG_LABELS[slug] ?? slug}
            </Link>
          ))}
          <Link
            href="/charging-cost-calculator"
            className="rounded-lg border border-border bg-bg-secondary px-3 py-2 text-sm text-text-secondary transition-colors hover:border-accent/30 hover:text-accent"
          >
            Charging Cost Calculator
          </Link>
          <Link
            href="/calculator"
            className="rounded-lg border border-border bg-bg-secondary px-3 py-2 text-sm text-text-secondary transition-colors hover:border-accent/30 hover:text-accent"
          >
            EV Range Calculator
          </Link>
        </div>
      </section>
    </div>
  );
}
