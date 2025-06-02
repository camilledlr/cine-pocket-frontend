import React from 'react';
import useSearchLogic from "../../hooks/useSearchLogic";
import Tag from "../Common/Tag";
import { IoIosSearch } from "react-icons/io";
import './MinSearchBar.css';

const MinSearchBar = ({allFilms,  onFocus, onBlur}) => {
const {
    query,
    setQuery,
    suggestions,
    handleSubmit,
    handleSuggestionClick,
  } = useSearchLogic(allFilms);

return (
    <div className="mini-search-container">
      <form onSubmit={handleSubmit} className="mini-search-form">
        <input
          className="mini-search-input"
          placeholder="Rechercher un film ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        //   onFocus={onFocus}
        //   onBlur={onBlur}
        />
      </form>

      {suggestions.length > 0 && (
        <ul className="mini-suggestion-list">
          {suggestions.map((film) => (
            <li key={film._id} onClick={() => handleSuggestionClick(film)}>
              {film.title}
              {film.status === "to watch" && <Tag variant="secondary" text="A voir" size="medium" />}
              {film.status === "to_rewatch" && <Tag text="A revoir" variant="secondary" size="medium" />}
              {film.status === "watched" && <Tag text="Vu" size="medium" />}
            </li>
          ))}
        </ul>
      )}
    </div>
)
}

export default MinSearchBar