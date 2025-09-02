import { useState, useEffect } from 'react';

/**
 * Custom hook to ensure a component only renders content on the client side
 * This prevents hydration mismatches for time-sensitive or client-only content
 */
export function useClientOnly() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}

/**
 * Custom hook for safely displaying current time without hydration issues
 */
export function useCurrentTime(updateInterval: number = 60000) {
  const [currentTime, setCurrentTime] = useState('');
  const hasMounted = useClientOnly();

  useEffect(() => {
    if (!hasMounted) return;

    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };

    updateTime(); // Set immediately
    const interval = setInterval(updateTime, updateInterval);

    return () => clearInterval(interval);
  }, [hasMounted, updateInterval]);

  return hasMounted ? currentTime : '--:--:--';
}

/**
 * Custom hook for safely getting current year without hydration issues
 */
export function useCurrentYear() {
  const hasMounted = useClientOnly();
  return hasMounted ? new Date().getFullYear() : 2024;
}
