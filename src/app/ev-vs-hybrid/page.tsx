import type { Metadata } from 'next';
import Link from 'next/link';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { FAQSection } from '@/components/seo/FAQSection';
import { generateBreadcrumbSchema } from '@/lib/utils/seo';

export const metadata: Metadata = {
  title: 'EV vs Hybrid — Which Is Right for You in 2025?',
  description:
    'Compare electric vehicles vs hybrid cars on range, cost, charging, and environmental impact. Find out whether an EV or hybrid fits your lifestyle.',
  alternates: { canonical: '/ev-vs-hybrid' },
  openGraph: {
    title: 'EV vs Hybrid — Which Is Right for You in 2025?',
    description:
      'Compare electric vehicles vs hybrid cars on range, cost, charging, and environmental impact.',
    url: '/ev-vs-hybrid',
    type: 'website',
  },
};

const COMPARISON = [
  {
    category: 'Fuel Cost',
    ev: '$500-800/year (home charging)',
    hybrid: '$1,200-1,800/year (gas + minimal electric)',
    phev: '$600-1,000/year (mixed)',
    winner: 'ev',
  },
  {
    category: 'Range',
    ev: '200-400 miles per charge',
    hybrid: '500-600 miles per tank',
    phev: '25-50 miles electric + 400+ miles gas',
    winner: 'hybrid',
  },
  {
    category: 'Maintenance',
    ev: '$600-900/year (no oil changes)',
    hybrid: '$1,000-1,400/year',
    phev: '$800-1,200/year',
    winner: 'ev',
  },
  {
    category: 'Upfront Cost',
    ev: '$35,000-55,000 (avg)',
    hybrid: '$28,000-42,000 (avg)',
    phev: '$35,000-50,000 (avg)',
    winner: 'hybrid',
  },
  {
    category: 'Tax Credit',
    ev: 'Up to $7,500 federal',
    hybrid: '$0 (standard hybrids)',
    phev: 'Up to $7,500 federal',
    winner: 'ev',
  },
  {
    category: 'Home Charging',
    ev: 'Required (Level 2 recommended)',
    hybrid: 'Not needed',
    phev: 'Optional but recommended',
    winner: 'hybrid',
  },
  {
    category: 'Emissions',
    ev: 'Zero tailpipe emissions',
    hybrid: '30-40% lower than gas',
    phev: 'Zero when on electric',
    winner: 'ev',
  },
  {
    category: 'Long Road Trips',
    ev: 'Requires planning (charging stops)',
    hybrid: 'No range anxiety',
    phev: 'Gas engine eliminates anxiety',
    winner: 'hybrid',
  },
];

const EV_VS_HYBRID_FAQS = [
  { question: 'Should I buy an EV or a hybrid?', answer: "Buy an EV if you drive mostly local routes (under 200 miles/day), have home charging access, and want the lowest operating costs. Choose a hybrid if you frequently take long road trips, live in an apartment without charging, or want the reliability of a gas engine as backup. PHEVs (plug-in hybrids) offer a middle ground — electric for daily driving, gas for trips." },
  { question: 'Are EVs cheaper than hybrids to own?', answer: 'EVs cost less to fuel and maintain but typically have higher upfront costs. Over 5 years, the average EV saves $4,000-8,000 in fuel and maintenance vs a comparable hybrid. With the $7,500 federal tax credit, EVs often match hybrid total ownership costs within 2-3 years.' },
  { question: 'What is the difference between a hybrid and a plug-in hybrid?', answer: "A standard hybrid (HEV) charges its small battery entirely through regenerative braking and the gas engine — no plugging in. A plug-in hybrid (PHEV) has a larger battery you charge at home, giving 25-50 miles of pure electric range before switching to gas. PHEVs are ideal if you want EV benefits for daily commuting but gas backup for trips." },
  { question: 'Do hybrids need to be charged?', answer: "Standard hybrids (Toyota Prius, Honda Accord Hybrid) never need to be plugged in — they charge themselves while driving. Plug-in hybrids (Toyota RAV4 Prime, Hyundai Tucson PHEV) can be charged at home for best efficiency but will run on gas alone if you don't charge them." },
  { question: 'Which is better for the environment — EV or hybrid?', answer: 'EVs produce zero tailpipe emissions and 50-70% less lifetime carbon than gas cars when accounting for electricity generation. Hybrids produce 30-40% less carbon than gas cars. PHEVs fall in between depending on how often they run on electric. EVs have the greatest environmental benefit, especially as the electric grid becomes cleaner.' },
];

export default function EvVsHybridPage() {
  return (
    <>
      <SchemaMarkup
        schema={generateBreadcrumbSchema([
          { name: 'Home', href: '/' },
          { name: 'EV vs Hybrid', href: '/ev-vs-hybrid' },
        ])}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
            EV vs Hybrid — Which Should You Buy in 2025?
          </h1>
          <p className="mt-3 max-w-2xl text-text-secondary">
            A data-driven comparison of electric vehicles, standard hybrids, and plug-in hybrids
            across cost, range, charging, and emissions.
          </p>
        </div>

        {/* Comparison Table */}
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-display font-bold text-text-primary">
            Side-by-Side Comparison
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-secondary text-left text-xs text-text-tertiary">
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium text-accent">Full EV (BEV)</th>
                  <th className="px-4 py-3 font-medium">Hybrid (HEV)</th>
                  <th className="px-4 py-3 font-medium">Plug-In Hybrid (PHEV)</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.category} className="border-b border-border/50">
                    <td className="px-4 py-3 font-medium text-text-primary">{row.category}</td>
                    <td className={`px-4 py-3 ${row.winner === 'ev' ? 'font-semibold text-accent' : 'text-text-secondary'}`}>
                      {row.winner === 'ev' && <span className="mr-1 text-accent">★</span>}
                      {row.ev}
                    </td>
                    <td className={`px-4 py-3 ${row.winner === 'hybrid' ? 'font-semibold text-warning' : 'text-text-secondary'}`}>
                      {row.winner === 'hybrid' && <span className="mr-1 text-warning">★</span>}
                      {row.hybrid}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{row.phev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-text-tertiary">★ Winner in this category</p>
        </section>

        {/* Who Should Buy Each */}
        <section className="mb-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-accent/30 bg-bg-secondary p-6">
            <h2 className="mb-3 font-display text-lg font-bold text-accent">Buy an EV if...</h2>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>✓ You drive less than 200 miles/day</li>
              <li>✓ You have home or workplace charging</li>
              <li>✓ You want the lowest fuel costs</li>
              <li>✓ You qualify for the $7,500 tax credit</li>
              <li>✓ Your region has good charging infrastructure</li>
              <li>✓ You care about zero emissions</li>
            </ul>
          </div>
          <div className="rounded-xl border border-warning/30 bg-bg-secondary p-6">
            <h2 className="mb-3 font-display text-lg font-bold text-warning">Buy a Hybrid if...</h2>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>✓ You frequently take long road trips</li>
              <li>✓ You live in an apartment without charging</li>
              <li>✓ You want a lower upfront cost</li>
              <li>✓ Charging infrastructure is limited nearby</li>
              <li>✓ You want better gas mileage without hassle</li>
              <li>✓ You drive a lot in rural areas</li>
            </ul>
          </div>
          <div className="rounded-xl border border-info/30 bg-bg-secondary p-6">
            <h2 className="mb-3 font-display text-lg font-bold text-info">Buy a PHEV if...</h2>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>✓ Your daily commute is under 40 miles</li>
              <li>✓ You occasionally take long road trips</li>
              <li>✓ You have home charging available</li>
              <li>✓ You want EV savings with gas backup</li>
              <li>✓ You qualify for up to $7,500 tax credit</li>
              <li>✓ You want range flexibility</li>
            </ul>
          </div>
        </section>

        {/* Related Tools */}
        <section className="mb-12 rounded-xl border border-border bg-bg-secondary p-6">
          <h2 className="mb-4 text-lg font-display font-semibold text-text-primary">Calculate Your Savings</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/ev-vs-gas" className="text-sm text-accent hover:underline">EV vs Gas Savings Calculator</Link>
            <Link href="/tco-calculator" className="text-sm text-accent hover:underline">Total Cost of Ownership</Link>
            <Link href="/charging-cost-calculator" className="text-sm text-accent hover:underline">Charging Cost Calculator</Link>
            <Link href="/calculator" className="text-sm text-accent hover:underline">EV Range Calculator</Link>
            <Link href="/vehicles" className="text-sm text-accent hover:underline">Browse All EVs</Link>
            <Link href="/compare" className="text-sm text-accent hover:underline">Compare EVs Side by Side</Link>
          </div>
        </section>

        <FAQSection faqs={EV_VS_HYBRID_FAQS} />
      </div>
    </>
  );
}
