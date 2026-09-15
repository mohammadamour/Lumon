import { useState, useCallback } from 'react';

/**
 * useQueryParams — syncs React state with URL query parameters.
 *
 * Updates use `window.history.replaceState` so the URL changes
 * without triggering a full Inertia page navigation.
 * Changing any filter (non-page) param automatically resets page to 1.
 */
function readParams() {
  return Object.fromEntries(new URL(window.location).searchParams);
}

export default function useQueryParams() {
  const [params, setParams] = useState(readParams);

  const setParam = useCallback((key, value) => {
    const url = new URL(window.location);
    if (value === null || value === undefined || value === '') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, String(value));
    }
    // Reset to page 1 when changing any filter
    if (key !== 'page') {
      url.searchParams.delete('page');
    }
    window.history.replaceState({}, '', url);
    setParams(Object.fromEntries(url.searchParams));
  }, []);

  const removeParam = useCallback((key) => {
    const url = new URL(window.location);
    url.searchParams.delete(key);
    window.history.replaceState({}, '', url);
    setParams(Object.fromEntries(url.searchParams));
  }, []);

  const clearAll = useCallback(() => {
    const url = new URL(window.location);
    url.search = '';
    window.history.replaceState({}, '', url);
    setParams({});
  }, []);

  return { params, setParam, removeParam, clearAll };
}
