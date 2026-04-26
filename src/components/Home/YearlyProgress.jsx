import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWatchedCount } from '../../services/films';
import './YearlyProgress.css';

const YearlyProgress = () => {
  const [watchedCount, setWatchedCount] = useState(() => {
    return parseInt(localStorage.getItem('watched2026')) || 0;
  });
  const goal = 52;
  const year = 2026;
  const goalCount = Math.round((new Date() - new Date(year, 0, 1)) / (1000 * 60 * 60 * 24 * 7));

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
  const goalPercentage = Math.min((goalCount / goal) * 100, 100);

  return (
    <div className="yearly-progress">
      <h3>Objectif 52 Films {'\uD83C\uDFAF'}</h3>
      <p>{watchedCount} vus en {goalCount} semaines</p>
      <div className="progress-bar">
        <div
          className="goal-fill"
          style={{ width: `${goalPercentage}%` }}
        ></div>
        <div
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <Link to={`/seenlist?sortBy=date&watchYear=${new Date().getFullYear()}`}>Voir les films</Link>

    </div>
  );
};

export default YearlyProgress;