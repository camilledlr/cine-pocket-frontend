import { useEffect, useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export default API_BASE_URL;

// ---- Suivi des requêtes en cours ----
// Le back peut mettre du temps à démarrer (mise en veille). On compte les requêtes
// en cours pour pouvoir prévenir l'utilisateur quand elles traînent.

const SLOW_REQUEST_MS = 3000;

let pending = 0;
let slowTimer = null;
let isSlow = false;
const listeners = new Set();

const setSlow = (value) => {
  if (isSlow === value) return;
  isSlow = value;
  listeners.forEach((listener) => listener(isSlow));
};

const requestStarted = () => {
  pending += 1;
  if (pending === 1) {
    slowTimer = setTimeout(() => setSlow(true), SLOW_REQUEST_MS);
  }
};

const requestEnded = () => {
  pending = Math.max(0, pending - 1);
  if (pending === 0) {
    clearTimeout(slowTimer);
    setSlow(false);
  }
};

// Remplace fetch pour tous les appels au back : même signature, même résultat
export const apiFetch = async (...args) => {
  requestStarted();
  try {
    return await fetch(...args);
  } finally {
    requestEnded();
  }
};

// true tant qu'au moins une requête dure depuis plus de 3 s (serveur qui se réveille)
export const useSlowRequests = () => {
  const [slow, setSlowState] = useState(isSlow);
  useEffect(() => {
    listeners.add(setSlowState);
    setSlowState(isSlow);
    return () => listeners.delete(setSlowState);
  }, []);
  return slow;
};
