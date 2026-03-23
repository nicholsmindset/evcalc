'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
        <svg className="h-8 w-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h1 className="text-2xl font-display font-bold text-text-primary">Something went wrong</h1>
      <p className="mt-2 text-text-secondary">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-xl bg-accent px-8 py-3 font-display font-bold text-bg-primary transition-colors hover:bg-accent-dim"
      >
        Try Again
      </button>
    </div>
  );
}
