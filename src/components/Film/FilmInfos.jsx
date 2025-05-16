import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Common/Button";
import "./FilmInfos.css";

function FilmInfos({ title, filmId, director, actors }) {
  const navigate = useNavigate();

  return (
    <div className="film-infos">
      <h3 className="infos-title">Infos</h3>

        {!director && !(actors?.length > 0) ? (
          <div className="no-info-section">
            <p className="no-info  infos-no-info">Aucune info à afficher</p>
            <Button
              text="Ajouter des infos"
              variant="text"
              size="large"
              action={() =>
                navigate(`/films/infos/${filmId}`, { state: { title: title } })
              }
            />
          </div>
        ):(
          <div className="infos-section">
        {director && (
          <p>
            Par <span className="infos-director">{director}</span>
          </p>
        )}
        {actors?.length > 0 && (
          <p>
            Avec <span className="infos-actors">{actors.join(", ")}</span>
          </p>
        )}
        <Button
          text="Ajouter des infos"
          variant="text"
          size="large"
          action={() =>
            navigate(`/films/infos/${filmId}`, { state: { title: title } })
          }
        />
        </div>)}
    </div>
  );
}
export default FilmInfos;
