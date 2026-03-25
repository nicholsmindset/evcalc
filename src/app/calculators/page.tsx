import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'EV Energy Calculators — Watts, kWh, Amps, Volt Converters',
  description:
    'Free EV energy conversion calculators: watts to kWh, kW to kWh, kWh to watts, amp-hours to kWh, and amps to kWh. Instant results with EV charging examples.',
  alternates: { canonical: '/calculators' },
};

const CALCULATORS = [
  { slug: 'watts-to-kwh', title: 'Watts to kWh', formula: 'kWh = (W × H) ÷ 1,000', desc: 'Convert charging power × time to energy delivered.' },
  { slug: 'kw-to-kwh', title: 'kW to kWh', formula: 'kWh = kW × H', desc: 'Multiply charging rate by hours for total energy.' },
  { slug: 'kwh-to-watts', title: 'kWh to Watts', formula: 'W = (kWh ÷ H) × 1,000', desc: 'Find required charger power from battery size and time.' },
  { slug: 'ah-to-kwh', title: 'Amp-Hours to kWh', formula: 'kWh = (Ah × V) ÷ 1,000', desc: 'Convert battery capacity in amp-hours at any voltage.' },
  { slug: 'amp-to-kwh', title: 'Amps to kWh', formula: 'kWh = (A × V × H) ÷ 1,000', desc: 'Calculate energy from charger amps, voltage, and time.' },
];

export default function CalculatorsIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-4 flex gap-2 text-xs text-text-tertiary">
        <Link href="/" className="hover:text-text-secondary">Home</Link>
        <span>/</span>
        <span className="text-text-primary">Calculators</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          EV Energy Calculators
        </h1>
        <p className="mt-3 text-text-secondary">
          Free electrical unit converters for EV owners and enthusiasts. All calculations are instant, accurate, and include real-world EV examples.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CALCULATORS.map((calc) => (
          <Link
            key={calc.slug}
            href={`/calculators/${calc.slug}`}
            className="group rounded-xl border border-border bg-bg-secondary p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
          >
            <div className="mb-2 font-mono text-sm text-accent">{calc.formula}</div>
            <div className="font-display font-semibold text-text-primary group-hover:text-accent transition-colors">
              {calc.title}
            </div>
            <p className="mt-1 text-sm text-text-secondary">{calc.desc}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10 border-t border-border pt-8">
        <h2 className="mb-3 font-display text-lg font-bold text-text-primary">Related Tools</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/charging-cost-calculator" className="text-sm text-accent hover:underline">Charging Cost Calculator</Link>
          <Link href="/calculator" className="text-sm text-accent hover:underline">EV Range Calculator</Link>
          <Link href="/charger-installation-cost" className="text-sm text-accent hover:underline">Installation Cost Calculator</Link>
          <Link href="/solar-ev-calculator" className="text-sm text-accent hover:underline">Solar + EV Calculator</Link>
        </div>
      </section>
    </div>
  );
}
