import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use — EV Range Calculator',
  description: 'Terms of use for EV Range Calculator. Understand our data accuracy disclaimers, affiliate disclosures, and usage policies.',
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
        Terms of Use
      </h1>
      <p className="mb-8 text-sm text-text-tertiary">Last updated: March 2026</p>

      <div className="space-y-8 text-sm text-text-secondary">
        <section>
          <h2 className="mb-3 text-lg font-display font-semibold text-text-primary">1. Acceptance of Terms</h2>
          <p>
            By accessing and using EV Range Calculator (&ldquo;the Service&rdquo;), you accept and
            agree to be bound by these Terms of Use. If you do not agree to these terms, please
            do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-display font-semibold text-text-primary">2. Description of Service</h2>
          <p>
            EV Range Calculator provides electric vehicle range estimation tools, charging station
            information, cost calculators, vehicle comparisons, and related resources. The Service
            is provided free of charge for personal, non-commercial use.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-display font-semibold text-text-primary">3. Data Accuracy Disclaimer</h2>
          <div className="space-y-3">
            <p>
              Range estimates provided by our calculator are based on EPA data and physics-based
              modeling. These are <strong className="text-text-primary">estimates only</strong> and
              should not be relied upon as exact predictions.
            </p>
            <p>
              Actual range varies based on individual driving habits, vehicle condition, weather
              conditions, road conditions, tire pressure, accessory usage, and many other factors.
              Always use your vehicle&apos;s onboard range estimator and plan charging stops with
              adequate safety margin.
            </p>
            <p>
              Charging station data is sourced from NREL and OpenChargeMap and may not reflect
              real-time availability, pricing, or operational status. Always verify station
              availability before relying on it for trip planning.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-display font-semibold text-text-primary">4. Data Sources & Attribution</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Vehicle data: U.S. Environmental Protection Agency (EPA) via FuelEconomy.gov</li>
            <li>Charging stations (US): National Renewable Energy Laboratory (NREL)</li>
            <li>Charging stations (International): OpenChargeMap</li>
            <li>Electricity rates: U.S. Energy Information Administration (EIA)</li>
          </ul>
          <p className="mt-3">
            We are not affiliated with any vehicle manufacturer, charging network, or government agency.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-display font-semibold text-text-primary">5. Affiliate Disclosure</h2>
          <p>
            EV Range Calculator participates in the Amazon Services LLC Associates Program, an
            affiliate advertising program designed to provide a means for sites to earn advertising
            fees by advertising and linking to Amazon.com. Product recommendations are clearly
            labeled as sponsored content. As an Amazon Associate, we earn from qualifying purchases.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-display font-semibold text-text-primary">6. User Accounts</h2>
          <div className="space-y-3">
            <p>
              Certain features (My Garage, saved routes, community range reports) require
              creating an account. You are responsible for maintaining the security of your
              account credentials.
            </p>
            <p>
              Community-submitted range reports must reflect genuine driving experiences.
              Submitting false or misleading data may result in account suspension.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-display font-semibold text-text-primary">7. Limitation of Liability</h2>
          <p>
            The Service is provided &ldquo;as is&rdquo; without warranties of any kind. We are
            not liable for any damages arising from the use of our range estimates, charging
            station data, or any other information provided by the Service. Do not make vehicle
            purchase decisions, trip plans, or safety-critical decisions based solely on our
            estimates.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-display font-semibold text-text-primary">8. Intellectual Property</h2>
          <p>
            The Service&apos;s design, code, and original content are protected by copyright.
            Vehicle data from EPA and other government sources is public domain. You may not
            scrape, reproduce, or redistribute our tools or content without permission.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-display font-semibold text-text-primary">9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the
            Service after changes constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-display font-semibold text-text-primary">10. Contact</h2>
          <p>
            For questions about these terms, please visit our{' '}
            <a href="/contact" className="text-accent hover:underline">contact page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
