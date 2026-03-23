import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-7xl font-bold text-accent">404</p>
      <h1 className="mt-4 text-2xl font-display font-bold text-text-primary">Page not found</h1>
      <p className="mt-2 text-text-secondary">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-xl bg-accent px-6 py-3 font-display font-bold text-bg-primary transition-colors hover:bg-accent-dim"
        >
          Go Home
        </Link>
        <Link
          href="/calculator"
          className="rounded-xl border border-border px-6 py-3 font-display font-bold text-text-primary transition-colors hover:border-accent/30"
        >
          Range Calculator
        </Link>
      </div>
    </div>
  );
}
