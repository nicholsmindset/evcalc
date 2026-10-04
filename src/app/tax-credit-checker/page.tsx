import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import TaxCreditContent from './TaxCreditContent';
import { RelatedTools } from '@/components/ui/RelatedTools';

export const metadata: Metadata = {
  title: 'Federal EV Tax Credit Deadline & Historical Eligibility Checker',
  description: 'Federal new, used, and commercial EV credits ended for vehicles acquired after September 30, 2025. Check the acquisition-date rule and review historical eligibility.',
  alternates: { canonical: '/tax-credit-checker' },
};

const FAQ_ITEMS = [
  {
    q: 'Is there a federal EV purchase tax credit in 2026?',
    a: 'No. The new, used, and commercial clean vehicle credits are unavailable for vehicles acquired after September 30, 2025.',
  },
  {
    q: 'What if I signed a contract before the deadline but took delivery later?',
    a: 'The IRS says an eligible vehicle acquired by September 30, 2025 may still qualify when placed in service later. A binding written contract and payment by the deadline can establish acquisition. Retain documentation and check the IRS rules for your transaction.',
  },
  {
    q: 'Does leasing make the federal credit available again?',
    a: 'No. The commercial clean vehicle credit used by lessors also ended for vehicles acquired after September 30, 2025. A 2026 lease promotion may still offer a manufacturer or dealer discount.',
  },
];

export default function TaxCreditCheckerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-3 flex gap-2 text-xs text-text-tertiary">
        <Link href="/" className="hover:text-text-secondary">Home</Link>
        <span>/</span>
        <span className="text-text-primary">Federal EV Tax Credit</span>
      </nav>
      <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
        Federal EV Tax Credit: Check the Acquisition Deadline
      </h1>
      <p className="mt-3 max-w-3xl text-text-secondary">
        Federal new, used, and commercial clean vehicle credits are unavailable for vehicles acquired after
        September 30, 2025. If you acquired an eligible vehicle by that date, review the historical rules below.
      </p>
      <p className="mt-3 text-sm text-text-secondary">
        Source: <a href="https://www.irs.gov/clean-vehicle-tax-credits" className="text-accent hover:underline">IRS clean vehicle tax credit guidance</a>.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-bg-secondary p-6 sm:p-8">
        <Suspense fallback={<div className="h-80 animate-pulse rounded-xl bg-bg-tertiary" />}>
          <TaxCreditContent />
        </Suspense>
      </div>

      <section className="mt-12">
        <h2 className="mb-5 font-display text-2xl font-bold text-text-primary">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQ_ITEMS.map(({ q, a }) => (
            <div key={q} className="rounded-xl border border-border bg-bg-secondary p-5">
              <h3 className="font-display font-semibold text-text-primary">{q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <RelatedTools tools={[
        { href: '/ev-incentives', emoji: '🏛️', label: 'State EV Incentives', desc: 'Check current state and utility program terms' },
        { href: '/lease-vs-buy', emoji: '📋', label: 'Lease vs Buy Calculator', desc: 'Compare costs without an expired federal credit' },
        { href: '/can-i-afford-an-ev', emoji: '💰', label: 'Can I Afford an EV?', desc: 'Estimate monthly ownership costs' },
      ]} />
    </div>
  );
}
