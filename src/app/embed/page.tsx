import type { Metadata } from 'next';
import { EmbedCalculatorWidget } from './components/EmbedCalculator';

export const metadata: Metadata = {
  title: 'EV Range Calculator Embed Widget',
  description:
    'Embeddable EV range calculator widget for your website.',
  alternates: { canonical: '/embed' },
};

export default function EmbedPage() {
  return <EmbedCalculatorWidget />;
}
