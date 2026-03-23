import Link from 'next/link';
import { FOOTER_LINKS, SITE_NAME } from '@/lib/utils/constants';
import { NewsletterSignup } from './NewsletterSignup';

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Tools */}
          <div>
            <h3 className="text-sm font-display font-semibold uppercase tracking-wider text-text-primary">
              Tools
            </h3>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.tools.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular EVs */}
          <div>
            <h3 className="text-sm font-display font-semibold uppercase tracking-wider text-text-primary">
              Popular EVs
            </h3>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.popularEvs.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-display font-semibold uppercase tracking-wider text-text-primary">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-display font-semibold uppercase tracking-wider text-text-primary">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-10">
          <NewsletterSignup />
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-sm text-text-tertiary">
              &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
            </p>
            <div className="text-xs text-text-tertiary text-right space-y-1">
              <p>Data from EPA, NREL, and OpenChargeMap. Not affiliated with any vehicle manufacturer.</p>
              <p>As an Amazon Associate, we earn from qualifying purchases.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
