import React from "react";
import { useNavigate } from "react-router-dom";
import "./FilmRecommendations.css";
import Button from "../Common/Button";

function FilmRecommendations({filmId, filmTitle, recommendations = [] }) {
  const navigate = useNavigate();

  return (
    <div className="film-recommendations">
      {recommendations.length === 0 ? 
        (<Button text="Ajouter une reco" variant="text" size="large" action={ ()=>navigate(`/films/add-reco/${filmId}`, { state: { title: filmTitle } })}/>) :
      <ul className="recommendations-list">
        {recommendations.map((rec, index) => (
          <li key={index} className="recommendation-item">
            <div className="recommendation-number">#{index + 1} Reco</div>
            <div>{rec}</div>
          </li>
        ))}
      </ul>}
    </div>
  );
}

export default FilmRecommendations;
