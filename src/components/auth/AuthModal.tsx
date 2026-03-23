'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (mode === 'signin') {
      const { error: err } = await signInWithEmail(email, password);
      if (err) {
        setError(err.message);
      } else {
        onClose();
      }
    } else {
      const { error: err } = await signUpWithEmail(email, password);
      if (err) {
        setError(err.message);
      } else {
        setSuccess('Check your email for a confirmation link.');
      }
    }

    setLoading(false);
  };

  const handleGoogle = async () => {
    setError(null);
    const { error: err } = await signInWithGoogle();
    if (err) setError(err.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-bg-primary p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-text-tertiary hover:text-text-primary transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-display font-bold text-text-primary">
          {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          {mode === 'signin'
            ? 'Sign in to access your garage and saved routes.'
            : 'Create an account to save vehicles and track range.'}
        </p>

        {/* Google Sign In */}
        <button
          onClick={handleGoogle}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-tertiary"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 border-t border-border" />
          <span className="text-xs text-text-tertiary">or</span>
          <div className="flex-1 border-t border-border" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 w-full rounded-lg border border-border bg-bg-tertiary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
              placeholder="Min 6 characters"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-error/30 bg-error/5 px-4 py-2.5 text-sm text-error">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-success/30 bg-success/5 px-4 py-2.5 text-sm text-success">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-dim disabled:opacity-50"
          >
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-tertiary">
          {mode === 'signin' ? (
            <>
              Don&apos;t have an account?{' '}
              <button onClick={() => { setMode('signup'); setError(null); setSuccess(null); }} className="text-accent hover:underline">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => { setMode('signin'); setError(null); setSuccess(null); }} className="text-accent hover:underline">
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
