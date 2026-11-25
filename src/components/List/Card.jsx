import React from "react";
import { Link } from "react-router-dom";
import { AiFillFire } from "react-icons/ai";
import "./Card.css";

const MAX_PLATFORMS = 3;

// Carte « affiche de cinéma » : l'affiche occupe toute la carte, les infos sont
// posées en bas sur un dégradé (titre, réalisateur · origine, dispos).
// compact : petite carte pour les rangées horizontales (sans les dispos).
const Card = ({ film, compact = false }) => {
  const posterUrl = film.posterPath
    ? `https://image.tmdb.org/t/p/w500${film.posterPath}`
    : null;
  const meta = [film.director, film.origin].filter(Boolean).join(" · ");
  const platforms = (film.platform || []).filter((p) => p.id !== "no_dispo");
  const extraPlatforms = platforms.length - MAX_PLATFORMS;

  return (
    <Link to={`/films/${film.slug}`} className="card-link">
      <article
        className={[
          "card-container",
          !posterUrl && "card-no-poster",
          compact && "card-compact",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {posterUrl ? (
          <img src={posterUrl} alt="" className="card-image" loading="lazy" />
        ) : (
          // Pas d'affiche : fond coloré avec le logo en filigrane
          <img src="/logo.svg" alt="" className="card-placeholder" />
        )}

        {film.hyped && (
          <span className="card-hype" title="Hype">
            <AiFillFire aria-hidden="true" />
          </span>
        )}

        <div className="card-infos">
          <h3 className="card-title">{film.title}</h3>
          {meta && <p className="card-meta">{meta}</p>}
          {!compact && platforms.length > 0 && (
            <div className="card-platforms">
              {platforms.slice(0, MAX_PLATFORMS).map((p) => (
                <span key={p.id} className="card-platform">
                  {p.label}
                </span>
              ))}
              {extraPlatforms > 0 && (
                <span className="card-platform">+{extraPlatforms}</span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default Card;
