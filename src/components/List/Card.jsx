import React from "react";
import { Link } from "react-router-dom";
import "./Card.css";

const Card = ({ film }) => {
  
  return (
    <Link to={`/films/${film.slug}`} className="card-link">
    <div className="card-container">
    <div className="card-image-container">
  <img
    src={film.posterPath ? `https://image.tmdb.org/t/p/w342${film.posterPath}` : "/logo.svg"}
    alt={film.title}
    className="card-image"
  />
  {/* <img
    src={film.posterPath ? `https://image.tmdb.org/t/p/w342${film.posterPath}` : "/logo.svg"}
    alt={film.title}
    className="home-logo"
  /> */}
</div>
      <div className="card-infos">
      <div>{film.title}</div>
      {/* <div className="card-description">{film.recommendations && film.recommendations[0]}</div> */}
      </div>
    </div>
    </Link>
  );
};

export default Card;
