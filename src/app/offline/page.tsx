import Link from 'next/link';

export const metadata = {
  title: 'Offline — EV Range Tools',
};

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-warning/10">
        <svg className="h-8 w-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" />
        </svg>
      </div>
      <h1 className="text-2xl font-display font-bold text-text-primary">You&apos;re offline</h1>
      <p className="mt-2 text-text-secondary">
        It looks like you&apos;ve lost your internet connection. Some features require
        an active connection to load real-time data.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-accent px-8 py-3 font-display font-bold text-bg-primary transition-colors hover:bg-accent-dim"
      >
        Try Again
      </Link>
    </div>
  );
}
