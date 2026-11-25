import React from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { FaPen } from "react-icons/fa";
import "./FilmInfos.css";

// Section « Infos » de la page film : réalisateur, acteurs, origine.
function FilmInfos({ title, filmId, infos }) {
  const navigate = useNavigate();
  const director = infos?.director || null;
  const origin = infos?.origin || null;
  const actors = infos?.actors || [];
  const tags = infos?.tags || [];
  const isEmpty = !director && actors.length === 0 && !origin && tags.length === 0;

  const openEdit = () => navigate(`/films/infos/${filmId}`, { state: { title } });

  return (
    <section className="film-infos" aria-labelledby="film-infos-title">
      <h3 id="film-infos-title" className="film-section-title">Infos</h3>

      {isEmpty ? (
        <button type="button" className="film-infos-add" onClick={openEdit}>
          <FiPlus aria-hidden="true" /> Ajouter des infos
        </button>
      ) : (
        <>
          <div className="infos-section">
            {director && (
              <p>
                par <span className="infos-director">{director}</span>
              </p>
            )}
            {actors.length > 0 && (
              <p>
                avec <span className="infos-actors">{actors.join(", ")}</span>
              </p>
            )}
            {origin && (
              <p>
                de <span className="infos-actors">{origin}</span>
              </p>
            )}
          </div>

          {tags.length > 0 && (
            <ul className="film-infos-tags" aria-label="Tags">
              {tags.map((tag) => (
                <li key={tag} className="film-infos-tag">
                  {tag}
                </li>
              ))}
            </ul>
          )}

          <button type="button" className="film-infos-edit" onClick={openEdit}>
            <FaPen aria-hidden="true" /> Modifier
          </button>
        </>
      )}
    </section>
  );
}

export default FilmInfos;
