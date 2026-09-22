import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

interface DemoModeBannerProps {
  /** Whether the page is currently using mock/demo data */
  isDemo: boolean;
  /** Optional custom message */
  message?: string;
}

/**
 * Small, non-dominant banner shown when API is unavailable and mock data is being used.
 * Dismissible by the user. Only renders when isDemo is true.
 */
export default function DemoModeBanner({ isDemo, message }: DemoModeBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!isDemo || dismissed) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2 animate-[fade-in_0.3s_ease-out]">
      <Info className="w-4 h-4 text-amber-500 flex-shrink-0" />
      <span className="text-xs text-amber-700 font-medium">
        {message || '📋 Demo Mode — Live database unavailable, showing local data'}
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="ml-auto p-1 text-amber-400 hover:text-amber-600 transition-colors cursor-pointer"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
