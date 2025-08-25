'use client';

import { useState, useEffect, useCallback } from 'react';

// Basic in-memory cache
let cachedSubscription = null;
let lastFetchTime = 0;

export function useSubscription() {
  const [subscription, setSubscription] = useState(cachedSubscription);
  const [isLoading, setIsLoading] = useState(!cachedSubscription);
  const [error, setError] = useState(null);

  const fetchSubscription = useCallback(async (force = false) => {
    const now = Date.now();
    // Use cache if data is less than 5 minutes old, unless forced
    if (!force && cachedSubscription && (now - lastFetchTime < 300000)) {
      setSubscription(cachedSubscription);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/subscription/status');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch subscription status');
      }
      const data = await response.json();
      cachedSubscription = data.subscription;
      lastFetchTime = now;
      setSubscription(data.subscription);
      setError(null);
    } catch (e) {
      setError(e.message);
      console.error('useSubscription Error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const checkUsage = (type, amount = 1) => {
    // If subscription is loading or errored, block usage.
    if (!subscription) {
      return { hasReachedLimit: true, limit: 0, used: 0 };
    }

    // Pro users have unlimited access
    if (subscription.planId !== 'free') {
      return { hasReachedLimit: false };
    }

    const limit = subscription?.limits?.[type] || 0;
    const used = subscription?.usage?.[type] || 0;

    // -1 signifies unlimited
    if (limit === -1) {
      return { hasReachedLimit: false };
    }

    if (used + amount > limit) {
      return { hasReachedLimit: true, limit, used };
    }

    return { hasReachedLimit: false, limit, used };
  };

  // Function to invalidate cache and refetch
  const refreshSubscription = () => fetchSubscription(true);

  return { subscription, isLoading, error, checkUsage, refreshSubscription };
}

// Function to clear the cache on sign-out
export function clearSubscriptionCache() {
    cachedSubscription = null;
    lastFetchTime = 0;
}
