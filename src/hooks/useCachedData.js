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
  // Rien en cache au départ : la page n'a encore aucune donnée à montrer
  const [hasData, setHasData] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem(storageKey) !== null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const freshData = await fetcher();
      setData(freshData);
      setHasData(true);
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

  // initialLoading : premier chargement sans cache → afficher un loader plutôt qu'une liste vide
  const initialLoading = loading && !hasData;

  return { data, setData, loading, initialLoading, error, refresh };
};
