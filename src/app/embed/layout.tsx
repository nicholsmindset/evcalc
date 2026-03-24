import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Embeddable EV Range Tools Widget',
  description: 'Embed the EV range calculator widget on your website.',
  robots: { index: false, follow: false },
};

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Minimal layout — no header/footer for iframe embedding
  return <>{children}</>;
}
