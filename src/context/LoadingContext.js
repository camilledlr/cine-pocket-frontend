import React, { createContext, useContext, useState } from 'react';

// Création du contexte
const LoadingContext = createContext();

// Provider global qui enveloppe ton application
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Hook personnalisé pour accéder facilement au contexte
export const useLoading = () => useContext(LoadingContext);
