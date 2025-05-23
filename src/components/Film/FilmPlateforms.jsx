import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Common/Button";
import Tag from "../Common/Tag";
import "./FilmPlateforms.css";


function FilmPlateforms({title, filmId, platforms = [] }) {
  const list = platforms;
  const navigate = useNavigate();
  
  return (
    <div className="list-section">
      {/* <h3 className="">Dispo sur</h3> */}
      <div className="list-plateforms">
        {list.map((platform) => (
          <Tag text={platform.label} variant="" size="large" />
        ))}
      
      <Button text="+ dispo" color="primary" size="small" action={ ()=>navigate(`/films/platforms/${filmId}`, { state: { title: title } })}/>
      </div>

    </div>
  );
}

export default FilmPlateforms;
