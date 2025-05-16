import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainSearchBar.css";
import { RiSearchLine } from "react-icons/ri";

const slugify = (text) =>
  text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // enlève accents
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // remplace espaces par tirets
    .replace(/[^a-z0-9-]/g, "") // enlève tout sauf lettres/chiffres/tirets
    .replace(/-+/g, "-"); // évite les tirets multiples

const MainSearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const slug = slugify(query);
    navigate(`/films/${slug}`, { state: { title: query.trim() } });
    setQuery("");
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="search-form">
        {/* <input className='search-input' type="search" id="site-search" name="q"  placeholder='Rechercher un film ...'/> */}
        <textarea
          className="search-input"
          placeholder="Rechercher un film ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e); // déclenche la recherche
            }
          }}
        />
      </form>
    </div>
  );
};

export default MainSearchBar;
