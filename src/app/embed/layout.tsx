import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Embeddable EV Range Calculator',
  description: 'Embed the EV range calculator on your website.',
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
