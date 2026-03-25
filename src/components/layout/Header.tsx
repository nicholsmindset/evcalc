'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { NAV_GROUPS } from '@/lib/utils/constants';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [isDark]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass shadow-lg shadow-black/20'
          : 'bg-bg-primary border-b border-transparent'
      }`}
    >
      <nav
        ref={navRef}
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-bold text-text-primary hover:text-accent transition-colors"
        >
          <svg className="h-8 w-8 text-accent" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 4l-4 12h8L12 28l8-12h-8L16 4z" />
          </svg>
          <span>EV Range<span className="text-accent">Tools</span></span>
        </Link>

        {/* Desktop Navigation — grouped dropdowns */}
        <div className="hidden lg:flex lg:items-center lg:gap-0.5">
          {/* Vehicles direct link */}
          <Link
            href="/vehicles"
            className="rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors"
          >
            Vehicles
          </Link>

          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="relative">
              <button
                onMouseEnter={() => setOpenGroup(group.label)}
                onMouseLeave={() => setOpenGroup(null)}
                onClick={() => setOpenGroup(openGroup === group.label ? null : group.label)}
                className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  openGroup === group.label
                    ? 'bg-bg-tertiary text-text-primary'
                    : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                }`}
              >
                {group.label}
                <svg
                  className={`h-3.5 w-3.5 transition-transform ${openGroup === group.label ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown panel */}
              {openGroup === group.label && (
                <div
                  onMouseEnter={() => setOpenGroup(group.label)}
                  onMouseLeave={() => setOpenGroup(null)}
                  className="absolute left-0 top-full mt-1 w-72 rounded-xl border border-border bg-bg-secondary shadow-xl shadow-black/30 animate-fade-in"
                >
                  <div className="p-2">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpenGroup(null)}
                        className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-bg-tertiary"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-text-primary">{item.label}</span>
                            {'badge' in item && item.badge && (
                              <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-text-tertiary">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="rounded-lg p-2 text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-border bg-bg-secondary lg:hidden animate-fade-in">
          <div className="px-4 py-3">
            <Link
              href="/vehicles"
              onClick={() => setIsMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-base font-medium text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors"
            >
              Vehicles
            </Link>

            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="mt-1">
                <button
                  onClick={() => setOpenMobileGroup(openMobileGroup === group.label ? null : group.label)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors"
                >
                  {group.label}
                  <svg
                    className={`h-4 w-4 transition-transform ${openMobileGroup === group.label ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openMobileGroup === group.label && (
                  <div className="ml-3 mt-1 space-y-0.5 border-l border-border pl-3">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => { setIsMenuOpen(false); setOpenMobileGroup(null); }}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors"
                      >
                        {item.label}
                        {'badge' in item && item.badge && (
                          <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
