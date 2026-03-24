import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — EV Range Tools',
  description: 'Get in touch with the EV Range Tools team. Report issues, suggest features, or ask questions about our EV tools.',
};

const FAQ_ITEMS = [
  {
    question: 'How accurate is the range calculator?',
    answer: 'Our calculator uses EPA-rated range as a baseline and applies physics-based adjustments for temperature, speed, terrain, HVAC, and battery health. Results are estimates — actual range varies with driving conditions.',
  },
  {
    question: 'Where does your vehicle data come from?',
    answer: 'Vehicle specifications come from the U.S. EPA FuelEconomy.gov database. International vehicles use WLTP data with an approximate EPA conversion.',
  },
  {
    question: 'How often is charging station data updated?',
    answer: 'US station data from NREL is refreshed regularly. International data from OpenChargeMap is community-maintained. Station results are cached for 24 hours.',
  },
  {
    question: 'Can I embed the range calculator on my website?',
    answer: 'Yes! Visit our embed widget page for instructions on adding the range calculator to your site.',
  },
  {
    question: 'I found incorrect data for a vehicle. How do I report it?',
    answer: 'Please send us the vehicle name, the incorrect data point, and the correct value with a source link. We will verify and update.',
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          Contact Us
        </h1>
        <p className="mt-4 text-lg text-text-secondary">
          Have a question, found a bug, or want to suggest a feature? We&apos;d love to hear from you.
        </p>
      </div>

      {/* Contact Options */}
      <div className="mb-12 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-bg-secondary p-6">
          <div className="mb-3 inline-flex rounded-lg bg-accent/10 p-2.5">
            <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <h2 className="font-display font-semibold text-text-primary">Email</h2>
          <p className="mt-2 text-sm text-text-secondary">
            For general inquiries, data corrections, or partnership opportunities.
          </p>
          <a
            href="mailto:hello@evrangetools.com"
            className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
          >
            hello@evrangetools.com
          </a>
        </div>

        <div className="rounded-xl border border-border bg-bg-secondary p-6">
          <div className="mb-3 inline-flex rounded-lg bg-accent/10 p-2.5">
            <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 3.31M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 1.17.417 2.282.857 3.31M12 12.75V3m0 9.75a24.23 24.23 0 00-3.5.254M12 3c.69 0 1.371.028 2.042.082M12 3c-.69 0-1.371.028-2.042.082" />
            </svg>
          </div>
          <h2 className="font-display font-semibold text-text-primary">Bug Reports & Features</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Found a bug or have a feature idea? Let us know what would make the tool better.
          </p>
          <a
            href="mailto:feedback@evrangetools.com"
            className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
          >
            feedback@evrangetools.com
          </a>
        </div>
      </div>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-display font-bold text-text-primary">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => (
            <div key={item.question} className="rounded-xl border border-border bg-bg-secondary p-5">
              <h3 className="font-display font-semibold text-text-primary">{item.question}</h3>
              <p className="mt-2 text-sm text-text-secondary">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Links */}
      <section className="rounded-xl border border-border bg-bg-secondary p-6">
        <h2 className="mb-4 text-lg font-display font-semibold text-text-primary">Helpful Resources</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link href="/about" className="text-sm text-accent hover:underline">About Us</Link>
          <Link href="/privacy" className="text-sm text-accent hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="text-sm text-accent hover:underline">Terms of Use</Link>
          <Link href="/blog" className="text-sm text-accent hover:underline">Blog</Link>
          <Link href="/embed-widget" className="text-sm text-accent hover:underline">Embed Widget</Link>
          <Link href="/calculator" className="text-sm text-accent hover:underline">Range Calculator</Link>
        </div>
      </section>
    </div>
  );
}
