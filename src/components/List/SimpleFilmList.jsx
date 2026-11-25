import React from "react";
import { Link } from "react-router-dom";
import FilmRating from "../Film/FilmRating";
import "./SimpleFilmList.css";

// Liste compacte de films (sans swipe, header, filtres ni scroll-to-top).
// Chaque ligne : titre + sous-titre à gauche, note à droite (« ? » si pas de note),
// lien vers la fiche.
//
// - films : tableau de films ({ slug, title, rating, ... })
// - getSubtitle : (film) => texte du sous-titre (par défaut la critique courte)
// - emptyMessage : texte affiché si la liste est vide
const SimpleFilmList = ({
  films = [],
  getSubtitle = (film) => film.shortReview,
  emptyMessage = "Aucun film pour l'instant.",
}) => {
  if (films.length === 0) {
    return <p className="simple-list-empty">{emptyMessage}</p>;
  }

  return (
    <ul className="simple-list">
      {films.map((film) => {
        const subtitle = getSubtitle(film);
        return (
          <li key={film.slug} className="simple-list-row">
            <Link to={`/films/${film.slug}`} className="simple-list-link">
              <div className="simple-list-text">
                <span className="simple-list-title">{film.title}</span>
                {subtitle && <span className="simple-list-subtitle">{subtitle}</span>}
              </div>
              {/* Pas encore de note : on garde l'encadré, avec un « ? » */}
              <FilmRating rating={film.rating || "?"} size="medium" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SimpleFilmList;
