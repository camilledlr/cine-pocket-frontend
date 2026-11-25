import React, { useEffect, useState } from "react";
import { getToReview } from "../../services/films";
import SimpleFilmList from "../List/SimpleFilmList";
import Loader from "../Common/Loader";
import { lastWatchedDate, timeAgo } from "../../utils/timeAgo";
import "./ReminderSection.css";


function ReminderSection() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFilms = async () => {
      try {
        setLoading(true);
        const data = await getToReview(); // 👈 appel direct
        setFilms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFilms();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <section className="reminder-section">
      <h3>N'oublie pas !</h3>
      {loading ? (
        <Loader inline />
      ) : (
      <SimpleFilmList
        films={films}
        emptyMessage="Aucun film à reviewer pour l’instant 👍"
        // Sous-titre : depuis quand le film a été vu ("Vu il y a 3 jours", "Vu hier"…)
        getSubtitle={(film) => {
          const last = lastWatchedDate(film);
          return last ? `Vu ${timeAgo(last)}` : null;
        }}
      />
      )}
      {/* {films.length === 0 ? (
        <p>Aucun film à reviewer pour l’instant 👍</p>
      ) : (
        <div className="reminder-list">
          {films.map((film) => (
            <Card film={film}/>
          ))}
        </div>
      )} */}
    </section>
  );
}

export default ReminderSection;