import React from "react";
import "./Card.css";

const Card = ({ film }) => {
  return (
    <div className="card-container">
      <div className="card-image"><img src="/logo.svg" alt="Ciné Pocket" className="home-logo"/></div>
      <div className="card-infos">
      <div>{film.title}</div>
      <div className="card-description">{film.recommendations && film.recommendations[0]}</div>
      </div>
    </div>
  );
};

export default Card;
