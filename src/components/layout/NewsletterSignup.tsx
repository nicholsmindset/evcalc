'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/supabase/types';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');

    try {
      const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error } = await (supabase as unknown as {
        from: (table: string) => {
          insert: (data: { email: string; source: string }) => Promise<{ error: { code?: string; message: string } | null }>;
        };
      }).from('newsletter_subscribers').insert({
        email: email.trim().toLowerCase(),
        source: 'footer',
      });

      if (error) {
        if (error.code === '23505') {
          setStatus('success');
          setMessage("You're already subscribed!");
        } else {
          throw error;
        }
      } else {
        setStatus('success');
        setMessage('Welcome! Check your inbox for a confirmation.');
        setEmail('');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="rounded-xl border border-border bg-bg-tertiary p-6">
      <h3 className="font-display font-semibold text-text-primary">
        Stay updated on EV range data
      </h3>
      <p className="mt-1 text-sm text-text-secondary">
        Get monthly insights on EV range, charging infrastructure, and new vehicle data.
      </p>

      {status === 'success' ? (
        <p className="mt-4 text-sm font-medium text-success">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="flex-1 rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/50 focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-bg-primary transition-colors hover:bg-accent-dim disabled:opacity-50"
          >
            {status === 'loading' ? '...' : 'Subscribe'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="mt-2 text-xs text-error">{message}</p>
      )}

      <p className="mt-3 text-xs text-text-tertiary">
        No spam. Unsubscribe anytime.
      </p>
    </div>
  );
}
