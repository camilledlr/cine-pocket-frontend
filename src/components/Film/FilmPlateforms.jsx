import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Common/Button";
import Tag from "../Common/Tag";
import "./FilmPlateforms.css";


function FilmPlateforms({title, filmId, platforms = [] }) {
  const list = platforms;
  const navigate = useNavigate();
  
  return (
    <div>
      <h3 className="">Dispo sur</h3>
      <div className="list-plateforms">
        {list.map((platform) => (
          <Tag text={platform.label} variant="secondary" size="large" />
        ))}
      </div>
      <Button text="Ajouter une dispo" variant="text" size="large" action={ ()=>navigate(`/films/platforms/${filmId}`, { state: { title: title } })}/>

    </div>
  );
}

export default FilmPlateforms;
