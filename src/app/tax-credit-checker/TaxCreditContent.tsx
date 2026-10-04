'use client';

import { useState } from 'react';
import Link from 'next/link';

const DEADLINE = '2025-09-30';

export default function TaxCreditContent() {
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const acquiredAfterDeadline = acquisitionDate > DEADLINE;

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="ev-acquisition-date" className="block font-display text-lg font-semibold text-text-primary">
          When did you acquire the vehicle?
        </label>
        <p className="mt-1 text-sm text-text-secondary">
          Use the date you entered a binding written contract and made a payment, if applicable.
          The date you took delivery can be later.
        </p>
        <input
          id="ev-acquisition-date"
          type="date"
          value={acquisitionDate}
          onChange={(event) => setAcquisitionDate(event.target.value)}
          className="mt-4 rounded-lg border border-border bg-bg-primary px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none"
        />
      </div>

      {acquisitionDate && (
        <div className={`rounded-xl border p-5 ${acquiredAfterDeadline ? 'border-red-500/30 bg-red-500/5' : 'border-accent/30 bg-accent/5'}`}>
          <h2 className="font-display text-xl font-bold text-text-primary">
            {acquiredAfterDeadline
              ? 'No federal clean vehicle purchase credit is available'
              : 'You may qualify under the historical rules'}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            {acquiredAfterDeadline
              ? 'The federal new, used, and commercial clean vehicle credits ended for vehicles acquired after September 30, 2025. A current dealer or manufacturer discount is separate from those federal credits.'
              : 'The deadline test is only the first step. Vehicle eligibility, income, price, seller reporting, and other requirements still apply. Keep the contract and payment records and verify your specific transaction with the IRS.'}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <a href="https://www.irs.gov/clean-vehicle-tax-credits" className="font-medium text-accent hover:underline">
              Read IRS guidance →
            </a>
            <Link href="/ev-incentives" className="font-medium text-accent hover:underline">
              Explore state incentives →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
