import Link from 'next/link';
import type { Vehicle } from '@/lib/supabase/types';
import { LEASE_PAGE_REVIEWS } from '@/lib/data/lease-page-reviews';
import { LeaseQuoteComparison } from './LeaseQuoteComparison';
import { FAQSection } from '@/components/seo/FAQSection';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { generateBreadcrumbSchema } from '@/lib/utils/seo';

export function ReviewedLeasePage({ vehicle }: { vehicle: Vehicle }) {
  const review = LEASE_PAGE_REVIEWS[vehicle.slug];
  const name = `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}`;
  const faqs = [
    { question: `Is there a verified current lease deal for this ${name}?`, answer: 'No current offer is verified on this page. Use the official leasing link and request a written quote for the exact model year, configuration and location. The calculator compares quotes you enter; it does not advertise a payment.' },
    { question: 'Why compare effective monthly cost?', answer: 'A lower advertised monthly payment can require more money upfront. Dividing the total scheduled cost by the term helps compare those payment structures. Also compare mileage, vehicle equipment, taxes and return conditions.' },
    { question: 'Does the calculator apply an EV tax credit or manufacturer rebate?', answer: 'No. Enter the final payment and upfront cost from your quote after any confirmed discounts. Do not subtract the same credit again. Incentive eligibility and availability must be confirmed with the provider.' },
    { question: 'Is a lease-versus-loan payment comparison enough?', answer: 'No. A loan can leave you with ownership and equity, while this lease comparison assumes a scheduled vehicle return. Compare costs over the same period, remaining loan balance, expected resale value and purchase-option terms separately.' },
  ];
  return <article className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
    <SchemaMarkup schema={generateBreadcrumbSchema([{ name: 'Home', href: '/' }, { name: 'Vehicles', href: '/vehicles' }, { name, href: `/vehicles/${vehicle.slug}` }, { name: 'Lease quote comparison', href: `/vehicles/${vehicle.slug}/lease-deals` }])} />
    <nav aria-label="Breadcrumb" className="mb-6 text-sm"><Link href={`/vehicles/${vehicle.slug}`} className="text-accent hover:underline">{name} range and specifications</Link></nav>
    <header className="mb-8"><h1 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">{name} lease guide and quote calculator</h1><p className="mt-4 text-lg text-text-secondary">Compare written lease quotes, including upfront costs, taxes, mileage and return fees.</p><p className="mt-3 text-sm font-medium text-accent">No verified current offer listed. Reviewed October 5, 2026.</p></header>
    <section className="mb-8 rounded-xl border border-border p-6"><h2 className="mb-3 text-xl font-display font-bold text-text-primary">Before comparing a {vehicle.make} {vehicle.model} lease</h2><p className="mb-4 text-text-secondary">{review.configuration}</p><ul className="list-disc space-y-3 pl-5 text-text-secondary">{review.checks.map(c => <li key={c}>{c}</li>)}</ul><a href={review.sourceUrl} className="mt-5 inline-block text-accent hover:underline">{review.sourceTitle} →</a><p className="mt-2 text-xs text-text-tertiary">The provider&apos;s current page may cover other model years. It does not establish availability for this {vehicle.year} vehicle.</p></section>
    <LeaseQuoteComparison />
    <section className="mb-8"><h2 className="mb-3 text-xl font-display font-bold text-text-primary">Read the full quote</h2><p className="mb-3 text-text-secondary">Request the selling price, capitalized fees, reductions, adjusted capitalized cost, residual value, rent charge or money factor, taxes, payment schedule, mileage allowance and purchase-option terms. Keep refundable security deposits separate from the cost of using the vehicle.</p><p className="mb-3 text-text-secondary">A lease payment alone does not describe ownership cost. A purchase comparison also needs the loan balance and resale value at the same point in time. Insurance, charging and maintenance belong in either budget.</p><p className="text-sm text-text-secondary">Source: <a className="text-accent hover:underline" href="https://www.consumerfinance.gov/ask-cfpb/what-should-i-know-about-leasing-versus-buying-a-car-en-815/">CFPB guide to leasing versus buying</a>.</p></section>
    <FAQSection faqs={faqs} />
    <div className="flex flex-wrap gap-4 border-t border-border pt-6 text-sm"><Link href={`/vehicles/${vehicle.slug}`} className="text-accent hover:underline">Verified range references</Link><Link href="/charging-cost-calculator" className="text-accent hover:underline">Charging cost calculator</Link><Link href="/ev-incentives" className="text-accent hover:underline">Incentive guidance</Link></div>
  </article>;
}
