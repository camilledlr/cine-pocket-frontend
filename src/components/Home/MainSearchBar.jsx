import React, { useState, useEffect } from "react";
import useSearchLogic from "../../hooks/useSearchLogic";
import Tag from "../Common/Tag";
import "./MainSearchBar.css";


const MainSearchBar = ({ allFilms }) => {

 const {
    query,
    setQuery,
    suggestions,
    handleSubmit,
    handleSuggestionClick,
  } = useSearchLogic(allFilms);

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <textarea
          className="search-input"
          placeholder="Rechercher un film ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
      </form>

      {suggestions.length > 0 && (
        <ul className="suggestion-list">
          {suggestions.map((film) => (
            <li key={film._id} onClick={() => handleSuggestionClick(film)}>
              {film.title} {film.status === "to watch" && <Tag variant="secondary" text="A voir" size="small"/>}
        {film.status === "to_rewatch" && <Tag text="A revoir" variant="secondary" size="small"/>}
        {film.status === "watched"  && <Tag text="Vu" size="small"/>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MainSearchBar;
