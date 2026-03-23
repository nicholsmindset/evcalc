import { Suspense } from 'react';
import { CalculatorContent } from './CalculatorContent';

export default function CalculatorPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
            EV Range Calculator
          </h1>
          <p className="mt-2 text-text-secondary">
            Calculate real-world range adjusted for temperature, speed, terrain, and driving conditions.
          </p>
        </div>
        <div className="h-16 animate-pulse rounded-xl bg-bg-secondary" />
      </div>
    }>
      <CalculatorContent />
    </Suspense>
  );
}
