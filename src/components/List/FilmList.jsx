import React from "react";
import FilmRating from "../Film/FilmRating";
import { Link } from "react-router-dom";
import { AiFillFire } from "react-icons/ai";

const FilmList = ({ list, listType, detailed='false'}) => {
  console.log("list lenght", list);
  return (
    <div className="film-list">
      {list && list.length > 0 ? (
        list.map((film) => (
          <div>
            <Link to={`/films/${film.slug}`} className="link">
              <div className={`list-item ${detailed ? 'list-detailed' : ''}`}>
              <div className="list-item-text">
                <div className="list-film-title limited-text">
                  {film.title}{" "}
                  {listType === "watchlist" && film.hyped && 
                  <span className="list-hype-icon"><AiFillFire /></span>}
                </div>
                <div className="list-film-details limited-text">{listType === "watchlist" ? film.recommendations[0] : film.shortReview}</div>
              </div>
              {listType !== "watchlist" && <FilmRating rating={film.rating} size='medium'/>}
              </div>
            </Link>
          </div>
        ))
      ) : (
        <p className="no-info empty-list">La watchlist est vide.</p>
      )}
    </div>
  );
};

export default FilmList;
