import React from "react";
import "./FilmBackdrop.css";

// Bandeau d'ambiance : l'affiche très floue, derrière tout le haut de la page film
// (header, affiche, titre), qui se fond dans la couleur de fond vers le bas.
const FilmBackdrop = ({ posterPath }) => {
  if (!posterPath) return null;
  return (
    <div className="film-backdrop" aria-hidden="true">
      <img
        src={`https://image.tmdb.org/t/p/w342${posterPath}`}
        alt=""
        className="film-backdrop-image"
      />
    </div>
  );
};

export default FilmBackdrop;
