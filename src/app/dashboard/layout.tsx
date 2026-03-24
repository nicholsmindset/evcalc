import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Dashboard — EV Range Tools',
  description: 'Your personal EV dashboard with saved calculations, garage, and range reports.',
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
