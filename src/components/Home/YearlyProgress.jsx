import React, { useEffect, useState } from 'react';
import { getWatchedCount } from '../../services/films';
import './YearlyProgress.css';

const YearlyProgress = () => {
  const [watchedCount, setWatchedCount] = useState(() => {
    return parseInt(localStorage.getItem('watched2026')) || 0;
  });
  const goal = 52;
  const year = 2026;

  // Synchroniser avec le backend au chargement si possible
  useEffect(() => {
    const syncWithBackend = async () => {
      try {
        const data = await getWatchedCount(year);
        setWatchedCount(data.count);
        localStorage.setItem('watched2026', data.count);
      } catch (error) {
        console.error('Erreur synchronisation backend :', error);
        // Garder la valeur locale
      }
    };
    syncWithBackend();
  }, [year]);

  // Écouter les events de marquage de films comme vus
  useEffect(() => {
    const handleFilmMarkedAsSeen = (event) => {
      if (event.detail.year === year) {
        setWatchedCount(prev => {
          const newCount = prev + 1;
          localStorage.setItem('watched2026', newCount);
          return newCount;
        });
      }
    };

    window.addEventListener('filmMarkedAsSeen', handleFilmMarkedAsSeen);
    return () => window.removeEventListener('filmMarkedAsSeen', handleFilmMarkedAsSeen);
  }, [year]);

  const progressPercentage = Math.min((watchedCount / goal) * 100, 100);

  return (
    <div className="yearly-progress">
      <h3>Films vus en 2026</h3>
      <p>{watchedCount} / {goal} films</p>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default YearlyProgress;