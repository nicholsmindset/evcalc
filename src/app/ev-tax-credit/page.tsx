import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { FAQSection } from '@/components/seo/FAQSection';
import { generateBreadcrumbSchema } from '@/lib/utils/seo';

export const metadata: Metadata = {
  title: 'EV Tax Credit 2025 — How to Claim Up to $7,500 Federal Credit',
  description:
    "Complete guide to the 2025 federal EV tax credit. Which cars qualify, income limits, how to claim it, and state rebates that stack on top. Updated for 2025.",
  alternates: { canonical: '/ev-tax-credit' },
  openGraph: {
    title: 'EV Tax Credit 2025 — How to Claim Up to $7,500 Federal Credit',
    description:
      "Which EVs qualify for the $7,500 federal tax credit in 2025, income limits, and how to claim it.",
    url: '/ev-tax-credit',
    type: 'website',
  },
};

const QUALIFYING_VEHICLES = [
  { make: 'Tesla', model: 'Model 3 (RWD)', credit: '$7,500', msrp: '$40,240', notes: 'Standard Range qualifies' },
  { make: 'Tesla', model: 'Model Y (RWD/AWD)', credit: '$7,500', msrp: '$43,990', notes: 'Long Range also qualifies' },
  { make: 'Chevrolet', model: 'Equinox EV', credit: '$7,500', msrp: '$34,995', notes: 'Best value with credit' },
  { make: 'Chevrolet', model: 'Blazer EV', credit: '$7,500', msrp: '$44,995', notes: 'Most trims qualify' },
  { make: 'Ford', model: 'F-150 Lightning', credit: '$7,500', msrp: '$54,995', notes: 'Pro/XLT trims qualify' },
  { make: 'Ford', model: 'Mustang Mach-E', credit: '$3,750', msrp: '$42,995', notes: 'Partial credit' },
  { make: 'Rivian', model: 'R1T Standard', credit: '$3,750', msrp: '$67,500', notes: 'Under MSRP cap for trucks' },
  { make: 'Volkswagen', model: 'ID.4', credit: '$7,500', msrp: '$38,995', notes: 'US-assembled qualifies' },
  { make: 'Honda', model: 'Prologue', credit: '$7,500', msrp: '$47,400', notes: 'GM-built platform' },
  { make: 'Hyundai', model: 'Ioniq 6 (RWD)', credit: '$7,500', msrp: '$38,615', notes: 'Check eligibility' },
];

const TAX_CREDIT_FAQS = [
  { question: 'How does the $7,500 EV tax credit work in 2025?', answer: 'The federal Clean Vehicle Credit provides up to $7,500 off your taxes when purchasing a new qualifying EV. Starting in 2024, you can apply it as a point-of-sale discount at the dealership rather than waiting for your tax return. The credit requires meeting income limits ($150K single/$300K joint), MSRP caps ($55K for cars/$80K for trucks/SUVs), and vehicle sourcing requirements.' },
  { question: 'What income limits apply to the EV tax credit?', answer: 'For 2025, the income limits for the new EV credit are: $150,000 for single filers, $225,000 for head of household, and $300,000 for married filing jointly. These limits apply to your modified adjusted gross income (MAGI). If your income fluctuates, you can use the lower of your current or prior year income.' },
  { question: 'Which EVs qualify for the full $7,500 credit?', answer: 'For 2025, vehicles meeting all criteria (assembly, battery sourcing, MSRP, income limits) that qualify for the full $7,500 include: Tesla Model 3 (standard), Tesla Model Y, Chevrolet Equinox EV, Chevrolet Blazer EV, Ford F-150 Lightning Pro/XLT, Volkswagen ID.4 (US-built), and Honda Prologue. The list changes as battery sourcing requirements tighten.' },
  { question: 'Can I get the EV tax credit as a discount at the dealership?', answer: 'Yes. Since January 2024, dealers can apply the federal EV tax credit as a point-of-sale price reduction. You sign over the credit to the dealer, who reduces your purchase price immediately. You do not need to wait for your tax return. You must meet income requirements and the vehicle must qualify.' },
  { question: 'Is there an EV tax credit for used electric cars?', answer: 'Yes. The Used Clean Vehicle Credit provides up to $4,000 (or 30% of sale price, whichever is less) for used EVs costing under $25,000 from a licensed dealer. Income limits are lower: $75,000 single/$150,000 married. The vehicle must be at least 2 years old and cannot have previously received the used EV credit.' },
];

export default function EvTaxCreditPage() {
  return (
    <>
      <SchemaMarkup
        schema={generateBreadcrumbSchema([
          { name: 'Home', href: '/' },
          { name: 'EV Tax Credit 2025', href: '/ev-tax-credit' },
        ])}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
            EV Tax Credit 2025 — Complete Guide to the $7,500 Federal Credit
          </h1>
          <p className="mt-3 max-w-2xl text-text-secondary">
            Everything you need to know about claiming the federal EV tax credit in 2025: which
            vehicles qualify, income limits, how to claim it at the dealer, and state rebates that
            stack on top.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-warning/10 px-4 py-1.5 text-sm text-warning">
            <span>⚠</span>
            <span>Vehicle eligibility changes frequently. Verify with the IRS Clean Vehicle Credit tool before purchasing.</span>
          </div>
        </div>

        {/* Key Requirements */}
        <section className="mb-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Income Limits',
              items: ['Single filer: $150,000', 'Head of household: $225,000', 'Married filing jointly: $300,000', 'Based on MAGI (current or prior year)'],
            },
            {
              title: 'MSRP Caps',
              items: ['Cars & wagons: $55,000 max', 'Trucks, SUVs & vans: $80,000 max', 'Applies to final sale price', 'Add-ons above cap = no credit'],
            },
            {
              title: 'Vehicle Requirements',
              items: ['Final assembly in North America', 'Battery mineral sourcing rules', 'Battery component sourcing rules', 'VIN must be submitted to IRS'],
            },
          ].map((box) => (
            <div key={box.title} className="rounded-xl border border-border bg-bg-secondary p-6">
              <h2 className="mb-3 font-display text-lg font-bold text-text-primary">{box.title}</h2>
              <ul className="space-y-1.5">
                {box.items.map((item) => (
                  <li key={item} className="text-sm text-text-secondary">• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Qualifying Vehicles */}
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-display font-bold text-text-primary">
            Qualifying Vehicles (2025)
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-secondary text-left text-xs text-text-tertiary">
                  <th className="px-4 py-3">Make</th>
                  <th className="px-4 py-3">Model</th>
                  <th className="px-4 py-3 text-accent">Credit</th>
                  <th className="px-4 py-3">Starting MSRP</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {QUALIFYING_VEHICLES.map((v) => (
                  <tr key={`${v.make}-${v.model}`} className="border-b border-border/50">
                    <td className="px-4 py-3 font-medium text-text-primary">{v.make}</td>
                    <td className="px-4 py-3 text-text-secondary">{v.model}</td>
                    <td className="px-4 py-3 font-mono font-bold text-accent">{v.credit}</td>
                    <td className="px-4 py-3 font-mono text-text-secondary">{v.msrp}</td>
                    <td className="px-4 py-3 text-xs text-text-tertiary">{v.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-text-tertiary">
            List is not exhaustive. Eligibility changes as battery sourcing rules tighten. Always verify at fueleconomy.gov before purchasing.
          </p>
        </section>

        {/* How to Claim */}
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-display font-bold text-text-primary">
            How to Claim the Credit in 2025
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: '1', title: 'Check Vehicle Eligibility', desc: 'Verify the specific VIN qualifies at fueleconomy.gov — not all trims of a qualifying model qualify.' },
              { step: '2', title: 'Verify Your Income', desc: 'Calculate your MAGI. You can use the lower of current or prior year income if it fluctuates.' },
              { step: '3', title: 'Claim at the Dealer', desc: 'Tell your dealer you want to transfer the credit. They apply it as a price reduction at closing.' },
              { step: '4', title: 'File IRS Form 8936', desc: 'Dealer registers the transfer with the IRS. You file Form 8936 with your taxes to complete the process.' },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-border bg-bg-secondary p-5">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                  <span className="font-mono text-sm font-bold text-accent">{item.step}</span>
                </div>
                <h3 className="font-display font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-1 text-sm text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Tools */}
        <section className="mb-12 rounded-xl border border-border bg-bg-secondary p-6">
          <h2 className="mb-4 text-lg font-display font-semibold text-text-primary">Calculate Your Total EV Savings</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/ev-vs-gas" className="text-sm text-accent hover:underline">EV vs Gas Savings Calculator</Link>
            <Link href="/tco-calculator" className="text-sm text-accent hover:underline">Total Cost of Ownership</Link>
            <Link href="/vehicles" className="text-sm text-accent hover:underline">Browse Qualifying EV Models</Link>
            <Link href="/calculator" className="text-sm text-accent hover:underline">EV Range Calculator</Link>
            <Link href="/compare" className="text-sm text-accent hover:underline">Compare EVs Side by Side</Link>
            <Link href="/ev-vs-hybrid" className="text-sm text-accent hover:underline">EV vs Hybrid Comparison</Link>
          </div>
        </section>

        <FAQSection faqs={TAX_CREDIT_FAQS} />
      </div>
    </>
  );
}
