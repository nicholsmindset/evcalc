'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { AuthModal } from '@/components/auth/AuthModal';
import { createClient } from '@/lib/supabase/client';

interface DashboardStats {
  garageCount: number;
  reportsCount: number;
  routesCount: number;
}

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({ garageCount: 0, reportsCount: 0, routesCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      const supabase = createClient();
      const sb = supabase as unknown as {
        from: (table: string) => {
          select: (cols: string, opts?: { count: string; head: boolean }) => {
            eq: (col: string, val: string) => Promise<{ count: number | null }>;
          };
        };
      };

      const [garage, reports, routes] = await Promise.all([
        sb.from('user_garage').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        sb.from('range_reports').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        sb.from('saved_routes').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);

      setStats({
        garageCount: garage.count || 0,
        reportsCount: reports.count || 0,
        routesCount: routes.count || 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, [user]);

  if (authLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent/5">
            <svg className="h-10 w-10 text-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </div>
          <h1 className="text-2xl font-display font-bold text-text-primary">Dashboard</h1>
          <p className="mt-2 max-w-md text-text-secondary">
            Sign in to view your garage, saved routes, and range reports.
          </p>
          <button
            onClick={() => setShowAuth(true)}
            className="mt-6 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-dim"
          >
            Sign In to Continue
          </button>
        </div>
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Welcome back, {user.email?.split('@')[0] || 'EV enthusiast'}
          </p>
        </div>
        <button
          onClick={signOut}
          className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
        >
          Sign Out
        </button>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl border border-border bg-bg-secondary" />
          ))}
        </div>
      ) : (
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Link
            href="/garage"
            className="group rounded-xl border border-border bg-bg-secondary p-6 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-text-primary">{stats.garageCount}</p>
                <p className="text-xs text-text-secondary group-hover:text-accent transition-colors">Vehicles in Garage</p>
              </div>
            </div>
          </Link>
          <div className="rounded-xl border border-border bg-bg-secondary p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10">
                <svg className="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-text-primary">{stats.reportsCount}</p>
                <p className="text-xs text-text-secondary">Range Reports</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-bg-secondary p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <svg className="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-text-primary">{stats.routesCount}</p>
                <p className="text-xs text-text-secondary">Saved Routes</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-display font-bold text-text-primary">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/garage"
            className="group rounded-xl border border-border bg-bg-secondary p-5 transition-all hover:border-accent/30"
          >
            <h3 className="font-display font-semibold text-text-primary group-hover:text-accent transition-colors">
              My Garage
            </h3>
            <p className="mt-1 text-sm text-text-secondary">Manage your vehicles and battery health.</p>
          </Link>
          <Link
            href="/calculator"
            className="group rounded-xl border border-border bg-bg-secondary p-5 transition-all hover:border-accent/30"
          >
            <h3 className="font-display font-semibold text-text-primary group-hover:text-accent transition-colors">
              Range Calculator
            </h3>
            <p className="mt-1 text-sm text-text-secondary">Calculate real-world range for your EV.</p>
          </Link>
          <Link
            href="/road-trip-planner"
            className="group rounded-xl border border-border bg-bg-secondary p-5 transition-all hover:border-accent/30"
          >
            <h3 className="font-display font-semibold text-text-primary group-hover:text-accent transition-colors">
              Road Trip Planner
            </h3>
            <p className="mt-1 text-sm text-text-secondary">Plan routes with charging stops.</p>
          </Link>
          <Link
            href="/advisor"
            className="group rounded-xl border border-border bg-bg-secondary p-5 transition-all hover:border-accent/30"
          >
            <h3 className="font-display font-semibold text-text-primary group-hover:text-accent transition-colors">
              AI Advisor
            </h3>
            <p className="mt-1 text-sm text-text-secondary">Get expert EV advice instantly.</p>
          </Link>
          <Link
            href="/range-reports"
            className="group rounded-xl border border-border bg-bg-secondary p-5 transition-all hover:border-accent/30"
          >
            <h3 className="font-display font-semibold text-text-primary group-hover:text-accent transition-colors">
              Range Reports
            </h3>
            <p className="mt-1 text-sm text-text-secondary">Share and browse real-world range data.</p>
          </Link>
          <Link
            href="/blog"
            className="group rounded-xl border border-border bg-bg-secondary p-5 transition-all hover:border-accent/30"
          >
            <h3 className="font-display font-semibold text-text-primary group-hover:text-accent transition-colors">
              Blog
            </h3>
            <p className="mt-1 text-sm text-text-secondary">EV tips, guides, and data-driven articles.</p>
          </Link>
        </div>
      </section>

      {/* Account Info */}
      <section>
        <h2 className="mb-4 text-xl font-display font-bold text-text-primary">Account</h2>
        <div className="rounded-xl border border-border bg-bg-secondary p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <span className="font-display text-lg font-bold text-accent">
                {(user.email?.[0] || 'U').toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-text-primary">{user.email}</p>
              <p className="text-xs text-text-tertiary">
                Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
