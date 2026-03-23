import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — EV Range Calculator',
  description: 'Privacy policy for EV Range Calculator. Learn how we handle your data, cookies, and third-party services.',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mb-8 text-sm text-text-tertiary">Last updated: March 2026</p>

      <div className="space-y-8 text-sm text-text-secondary">
        <section>
          <h2 className="mb-3 text-lg font-display font-semibold text-text-primary">1. Information We Collect</h2>
          <div className="space-y-3">
            <p>
              <strong className="text-text-primary">Account Data:</strong> If you create an account,
              we collect your email address and authentication credentials through Supabase Auth
              (Google OAuth or email/password). This is used solely to provide personalized features
              like My Garage and saved routes.
            </p>
            <p>
              <strong className="text-text-primary">Usage Data:</strong> We use Plausible Analytics,
              a privacy-friendly analytics service that does not use cookies and does not collect
              personal data. Plausible tracks page views and referral sources in aggregate only.
            </p>
            <p>
              <strong className="text-text-primary">Location Data:</strong> The charging station finder
              may request your browser location to find nearby stations. This is entirely optional and
              only used for that specific search. We do not store your location.
            </p>
            <p>
              <strong className="text-text-primary">Calculator Inputs:</strong> Vehicle selections and
              driving condition inputs are processed client-side and are not stored on our servers
              unless you explicitly save them to your garage or dashboard.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-display font-semibold text-text-primary">2. How We Use Your Information</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>To provide and maintain our calculator tools and features</li>
            <li>To save your vehicle garage, routes, and preferences (if you have an account)</li>
            <li>To improve our tools based on aggregate, anonymized usage patterns</li>
            <li>To respond to support inquiries</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-display font-semibold text-text-primary">3. Third-Party Services</h2>
          <div className="space-y-3">
            <p>We use the following third-party services:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong className="text-text-primary">Supabase:</strong> Database and authentication. Your account data is stored securely on Supabase infrastructure.</li>
              <li><strong className="text-text-primary">Plausible Analytics:</strong> Privacy-friendly, cookie-free analytics. No personal data is collected.</li>
              <li><strong className="text-text-primary">Mapbox:</strong> Maps and geocoding for the charging station finder and road trip planner.</li>
              <li><strong className="text-text-primary">Vercel:</strong> Hosting and CDN.</li>
              <li><strong className="text-text-primary">Amazon Associates:</strong> We participate in the Amazon Associates affiliate program. Affiliate links are clearly marked.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-display font-semibold text-text-primary">4. Cookies</h2>
          <p>
            We do not use tracking cookies. Plausible Analytics is cookie-free. If you create
            an account, Supabase Auth uses essential cookies for session management only.
            No third-party advertising cookies are used.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-display font-semibold text-text-primary">5. Data Retention</h2>
          <p>
            Account data is retained as long as your account is active. You can delete your account
            and all associated data at any time from your dashboard. Anonymized analytics data
            is retained indefinitely.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-display font-semibold text-text-primary">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data in a portable format</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-display font-semibold text-text-primary">7. Children&apos;s Privacy</h2>
          <p>
            Our service is not directed to children under 13. We do not knowingly collect
            personal information from children.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-display font-semibold text-text-primary">8. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Changes will be posted on this
            page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-display font-semibold text-text-primary">9. Contact</h2>
          <p>
            If you have questions about this privacy policy, please visit our{' '}
            <a href="/contact" className="text-accent hover:underline">contact page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
