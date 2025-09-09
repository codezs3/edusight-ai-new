import { useEffect, useState } from 'react';

/**
 * Hook to ensure a component only renders on the client side
 * This prevents hydration mismatches for components that use browser-only APIs
 */
export function useClientOnly() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

/**
 * Hook to get the current year, only on client side
 * This prevents hydration mismatches when displaying dynamic dates
 */
export function useCurrentYear() {
  const [year, setYear] = useState<number | null>(null);
  const mounted = useClientOnly();

  useEffect(() => {
    if (mounted) {
      setYear(new Date().getFullYear());
    }
  }, [mounted]);

  return year;
}

/**
 * Hook to get the current time, only on client side
 * This prevents hydration mismatches when displaying dynamic timestamps
 */
export function useCurrentTime() {
  const [time, setTime] = useState<string | null>(null);
  const mounted = useClientOnly();

  useEffect(() => {
    if (mounted) {
      const updateTime = () => {
        setTime(new Date().toLocaleString());
      };
      
      updateTime(); // Set initial time
      const interval = setInterval(updateTime, 1000); // Update every second
      
      return () => clearInterval(interval);
    }
  }, [mounted]);

  return time;
}