import { useCallback, useEffect, useState } from 'react';

const parseStoredValue = (storageKey, fallback) => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const storedValue = localStorage.getItem(storageKey);
  if (!storedValue) {
    return fallback;
  }

  try {
    return JSON.parse(storedValue);
  } catch (error) {
    console.error(`Impossible de parser le cache ${storageKey} :`, error);
    return fallback;
  }
};

const writeStoredValue = (storageKey, value) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify(value));
  } catch (error) {
    console.error(`Impossible d'écrire le cache ${storageKey} :`, error);
  }
};

export const useCachedData = (storageKey, fetcher, initialValue) => {
  const [data, setData] = useState(() => parseStoredValue(storageKey, initialValue));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const freshData = await fetcher();
      setData(freshData);
      writeStoredValue(storageKey, freshData);
      setError(null);
      return freshData;
    } catch (fetchError) {
      console.error(`Erreur lors de la récupération de ${storageKey} :`, fetchError.message);
      setError(fetchError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetcher, storageKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, setData, loading, error, refresh };
};
