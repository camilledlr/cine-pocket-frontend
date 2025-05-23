import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tag from "../Common/Tag";
import "./MainSearchBar.css";

const slugify = (text) =>
  text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

const MainSearchBar = ({ allFilms }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  if (query.trim().length < 2) {
    setSuggestions([]);
    return;
  }

  const debounce = setTimeout(() => {
    const results = allFilms.filter((film) =>
      film.title.toLowerCase().includes(query.toLowerCase())
    );
    console.log("📌 Suggestions trouvées :", results);
    setSuggestions(results.slice(0, 5));
  }, 200);

  return () => clearTimeout(debounce);
}, [query, allFilms]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const debounce = setTimeout(() => {
      const results = allFilms.filter((film) =>
        film.title.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(results.slice(0, 5));
    }, 200);

    return () => clearTimeout(debounce);
  }, [query, allFilms]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const slug = slugify(query);
    navigate(`/films/${slug}`, { state: { title: query.trim() } });
    setQuery("");
    setSuggestions([]);
  };

  const handleSuggestionClick = (film) => {
    navigate(`/films/${film.slug}`, { state: { title: film.title } });
    setQuery("");
    setSuggestions([]);
  };

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
