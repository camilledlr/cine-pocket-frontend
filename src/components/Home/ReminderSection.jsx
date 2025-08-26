import React, { useEffect, useState } from "react";
import { getToReview } from "../../services/films";
import Card from "../List/Card";
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

  if (loading) return <p>Chargement des films à reviewer...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <section className="reminder-section">
      <h3>N'oublie pas !</h3>
      {films.length === 0 ? (
        <p>Aucun film à reviewer pour l’instant 👍</p>
      ) : (
        <div className="reminder-list">
          {films.map((film) => (
            <Card film={film}/>
          ))}
        </div>
      )}
    </section>
  );
}

export default ReminderSection;