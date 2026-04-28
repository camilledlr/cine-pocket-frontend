import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";

const Card = ({ film }) => {
  return (
    <Link to={`/films/${film.slug}`} className="card-link">
    <div className="card-container">
      <div className="card-image"><img src="/logo.svg" alt="Ciné Pocket" className="home-logo"/></div>
      <div className="card-infos">
      <div>{film.title}</div>
      {/* <div className="card-description">{film.recommendations && film.recommendations[0]}</div> */}
      </div>
    </div>
    </Link>
  );
};

export default Card;
