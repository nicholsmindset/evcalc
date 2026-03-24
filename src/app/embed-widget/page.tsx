import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Embed EV Range Tools Widget — Free for Any Website',
  description: 'Add the EV Range Tools calculator to your website for free. Get the embed code for blogs, forums, and EV enthusiast sites.',
};

const EMBED_CODE = `<iframe
  src="https://www.evrangetools.com/embed"
  width="100%"
  height="520"
  style="border: none; border-radius: 12px; max-width: 440px;"
  title="EV Range Calculator"
  loading="lazy"
></iframe>`;

export default function EmbedWidgetPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          Embed the EV Range Calculator
        </h1>
        <p className="mt-2 max-w-2xl text-text-secondary">
          Add our range calculator to your website, blog, or forum for free. Help your visitors
          calculate real-world EV range with physics-based adjustments for temperature, speed, and terrain.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Preview */}
        <div>
          <h2 className="mb-4 text-lg font-display font-bold text-text-primary">Preview</h2>
          <div className="rounded-xl border border-border bg-bg-secondary p-4">
            <iframe
              src="/embed"
              width="100%"
              height="520"
              style={{ border: 'none', borderRadius: '12px', maxWidth: '440px' }}
              title="EV Range Calculator Widget Preview"
            />
          </div>
        </div>

        {/* Embed Code */}
        <div>
          <h2 className="mb-4 text-lg font-display font-bold text-text-primary">Embed Code</h2>
          <p className="mb-3 text-sm text-text-secondary">
            Copy and paste this code into your website&apos;s HTML:
          </p>
          <div className="rounded-xl border border-border bg-bg-tertiary p-4">
            <pre className="overflow-x-auto text-sm text-text-primary">
              <code>{EMBED_CODE}</code>
            </pre>
          </div>

          <h3 className="mt-8 mb-3 text-lg font-display font-bold text-text-primary">Customization</h3>
          <div className="space-y-4 text-sm text-text-secondary">
            <div className="rounded-xl border border-border bg-bg-secondary p-4">
              <h4 className="font-semibold text-text-primary">Width</h4>
              <p className="mt-1">The widget is responsive. Set <code className="rounded bg-bg-tertiary px-1.5 py-0.5 font-mono text-accent">max-width</code> to control the maximum size.</p>
            </div>
            <div className="rounded-xl border border-border bg-bg-secondary p-4">
              <h4 className="font-semibold text-text-primary">Height</h4>
              <p className="mt-1">Recommended height: <code className="rounded bg-bg-tertiary px-1.5 py-0.5 font-mono text-accent">520px</code>. Adjust if content is clipped.</p>
            </div>
            <div className="rounded-xl border border-border bg-bg-secondary p-4">
              <h4 className="font-semibold text-text-primary">Dark Theme</h4>
              <p className="mt-1">The widget uses a dark theme by default, matching most modern designs. It works well on both light and dark backgrounds.</p>
            </div>
          </div>

          <h3 className="mt-8 mb-3 text-lg font-display font-bold text-text-primary">Terms</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-text-secondary">
            <li>Free for personal and commercial use</li>
            <li>Attribution link must remain visible</li>
            <li>Do not modify the iframe content</li>
            <li>Data sourced from EPA, updated regularly</li>
          </ul>
        </div>
      </div>

      {/* Related */}
      <section className="mt-16 border-t border-border pt-12">
        <h2 className="mb-4 text-xl font-display font-bold text-text-primary">Related Tools</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/calculator" className="text-sm text-accent hover:underline">Full Range Calculator</Link>
          <Link href="/charging-cost-calculator" className="text-sm text-accent hover:underline">Charging Cost Calculator</Link>
          <Link href="/ev-vs-gas" className="text-sm text-accent hover:underline">EV vs Gas Savings</Link>
          <Link href="/compare" className="text-sm text-accent hover:underline">Compare EVs</Link>
        </div>
      </section>
    </div>
  );
}
