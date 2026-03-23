'use client';

import { useState, useCallback } from 'react';
import type { ConditionValues } from './ConditionSliders';

interface ShareButtonProps {
  vehicleSlug: string | null;
  conditions: ConditionValues;
  adjustedRange: number;
}

export function ShareButton({ vehicleSlug, conditions, adjustedRange }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const generateShareUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (vehicleSlug) params.set('v', vehicleSlug);
    params.set('t', String(conditions.temperatureF));
    params.set('s', String(conditions.speedMph));
    params.set('tr', conditions.terrain);
    params.set('h', conditions.hvacMode);
    params.set('c', String(conditions.cargoLbs));
    params.set('b', String(conditions.batteryHealthPct));

    const base = typeof window !== 'undefined' ? window.location.origin : '';
    return `${base}/calculator?${params.toString()}`;
  }, [vehicleSlug, conditions]);

  const handleShare = useCallback(async () => {
    const url = generateShareUrl();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `EV Range: ${adjustedRange} miles`,
          text: `My estimated EV range is ${adjustedRange} miles under these conditions.`,
          url,
        });
        return;
      } catch {
        // User cancelled share or not supported, fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  }, [generateShareUrl, adjustedRange]);

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-accent/30 hover:text-accent"
    >
      {copied ? (
        <>
          <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          Link copied!
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
          Share Results
        </>
      )}
    </button>
  );
}
