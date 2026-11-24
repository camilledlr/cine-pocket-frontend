import React from "react";
import { TEARS_LABELS } from "./FilmTears";
import "./FilmTears.css";

const MAX_LEVEL = 5;

// Affichage (lecture seule) du niveau A'larmes dans le header de la page film,
// au même gabarit que la note.
const FilmTearsBadge = ({ level }) => {
  if (!level) return null;
  const label = `A'larmes niveau ${level} sur ${MAX_LEVEL} : ${TEARS_LABELS[level]}`;

  return (
    <span
      className="film-tears-badge"
      style={{ "--tears-level": level }}
      title={label}
      aria-label={label}
      role="img"
    >
      <span className="film-tears-badge-content" aria-hidden="true">
        <span className="film-tears-badge-level">{level}</span>
        <span className="film-tears-badge-icon">💧</span>
      </span>
    </span>
  );
};

export default FilmTearsBadge;
