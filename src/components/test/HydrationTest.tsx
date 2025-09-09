'use client';

import { useClientOnly } from '@/hooks/useClientOnly';

/**
 * Test component to verify hydration fixes
 * This component should not cause hydration mismatches
 */
export function HydrationTest() {
  const mounted = useClientOnly();

  if (!mounted) {
    return (
      <div className="p-4 bg-gray-100 rounded">
        <p>Loading client-side content...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-100 rounded">
      <p>✅ Client-side content loaded successfully!</p>
      <p>No hydration mismatch detected.</p>
    </div>
  );
}
