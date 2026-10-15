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
  const wasOfflineRef = React.useRef<boolean>(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const transitionToOnline = () => {
      if (wasOfflineRef.current) {
        wasOfflineRef.current = false;
        setIsOnline(true);
        setShowRestoredNotice(true);
        clearTimeout(timer);
        timer = setTimeout(() => {
          setShowRestoredNotice(false);
        }, 3500);
      } else {
        setIsOnline(true);
      }
    };

    const transitionToOffline = () => {
      wasOfflineRef.current = true;
      setIsOnline(false);
      setShowRestoredNotice(false);
    };

    const handleCustomChange = (e: Event) => {
      const custom = e as CustomEvent<{ isOnline: boolean }>;
      if (custom.detail) {
        if (custom.detail.isOnline) {
          transitionToOnline();
        } else {
          transitionToOffline();
        }
      }
    };

    window.addEventListener('online', transitionToOnline);
    window.addEventListener('offline', transitionToOffline);
    window.addEventListener(CONNECTION_EVENT, handleCustomChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', transitionToOnline);
      window.removeEventListener('offline', transitionToOffline);
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
