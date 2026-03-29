import type { Metadata } from 'next';
import { RangeReportsTool } from './components/RangeReportsTool';

export const metadata: Metadata = {
  title: 'Community EV Range Reports — Real-World Range Data from Owners',
  description:
    'Browse and submit real-world EV range reports from the community. See actual range data under different conditions — temperature, speed, terrain, and HVAC usage.',
  alternates: { canonical: '/range-reports' },
  openGraph: {
    title: 'Community EV Range Reports — Real-World Range Data from Owners',
    description:
      'Browse and submit real-world EV range reports from the community. See actual range data under different conditions — temperature, speed, terrain, and HVAC usage.',
    url: '/range-reports',
    type: 'website',
  },
};

export default function RangeReportsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <RangeReportsTool />

      {/* Static SEO Content */}
      <section className="mt-16 border-t border-border pt-12">
        <h2 className="mb-4 text-xl font-display font-bold text-text-primary">
          About Community Range Reports
        </h2>
        <div className="prose prose-invert max-w-none text-sm text-text-secondary space-y-3">
          <p>
            EPA range ratings are measured under controlled lab conditions. Real-world range varies significantly
            based on temperature, speed, terrain, HVAC usage, and driving habits. Community range reports help
            bridge this gap by collecting actual driving data from EV owners.
          </p>
          <p>
            Every report includes the conditions under which the range was observed, making it easy to find
            relevant data for your specific driving scenario. Whether you&apos;re planning a winter road trip or
            curious about highway range at 75 mph, community data provides the most realistic expectations.
          </p>
          <p>
            Data sources: Community-submitted reports. EPA range data from{' '}
            <span className="text-text-tertiary">fueleconomy.gov</span>.
          </p>
        </div>
      </section>
    </div>
  );
}
