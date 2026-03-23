'use client';

import { useState, useRef, useCallback } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

const positionClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowClasses = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-bg-tertiary border-x-transparent border-b-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-bg-tertiary border-x-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-bg-tertiary border-y-transparent border-r-transparent',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-bg-tertiary border-y-transparent border-l-transparent',
};

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const show = useCallback(() => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  }, []);

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {visible && (
        <div
          role="tooltip"
          className={`absolute z-50 whitespace-nowrap rounded-lg bg-bg-tertiary px-3 py-1.5 text-xs text-text-primary shadow-lg ${positionClasses[position]}`}
        >
          {content}
          <span
            className={`absolute border-4 ${arrowClasses[position]}`}
          />
        </div>
      )}
    </div>
  );
}
