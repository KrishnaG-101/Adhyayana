/**
 * Global Real-Time Internet Connection & Offline Status Banner.
 *
 * Automatically monitors browser connectivity (navigator.onLine) and API failure
 * events to instantly alert the learner when internet connectivity is interrupted.
 */

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export const CONNECTION_EVENT = 'adhyayana:connection:change';

export function setGlobalConnectionState(isOnline: boolean) {
  window.dispatchEvent(
    new CustomEvent(CONNECTION_EVENT, { detail: { isOnline } })
  );
}

export const ConnectionStatusBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showRestoredNotice, setShowRestoredNotice] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestoredNotice(true);
      const timer = setTimeout(() => {
        setShowRestoredNotice(false);
      }, 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestoredNotice(false);
    };

    const handleCustomChange = (e: Event) => {
      const custom = e as CustomEvent<{ isOnline: boolean }>;
      if (custom.detail) {
        if (custom.detail.isOnline) {
          handleOnline();
        } else {
          handleOffline();
        }
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener(CONNECTION_EVENT, handleCustomChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener(CONNECTION_EVENT, handleCustomChange);
    };
  }, []);

  // Display offline warning when connection is lost
  if (!isOnline) {
    return (
      <div
        data-testid="connection-lost-banner"
        role="alert"
        aria-live="assertive"
        className="sticky top-0 z-50 w-full px-4 py-2.5 bg-rose-600 text-white text-xs sm:text-sm font-medium shadow-md flex items-center justify-center gap-2.5 animate-in slide-in-from-top duration-200"
      >
        <WifiOff className="w-4 h-4 shrink-0 animate-pulse text-rose-200" />
        <span>
          <strong>Connection Lost:</strong> Adhyayana requires an active internet connection to evaluate word stems and synchronize your progress.
        </span>
      </div>
    );
  }

  // Brief positive toast when connection is restored
  if (showRestoredNotice) {
    return (
      <div
        data-testid="connection-restored-banner"
        role="status"
        aria-live="polite"
        className="sticky top-0 z-50 w-full px-4 py-2 bg-emerald-600 text-white text-xs sm:text-sm font-medium shadow-md flex items-center justify-center gap-2 animate-in slide-in-from-top duration-200"
      >
        <Wifi className="w-4 h-4 shrink-0 text-emerald-200" />
        <span>Connection restored. Progress synchronized with cloud.</span>
      </div>
    );
  }

  return null;
};
