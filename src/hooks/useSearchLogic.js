// src/hooks/useSearchLogic.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

export default function useSearchLogic(allFilms) {
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

  return {
    query,
    setQuery,
    suggestions,
    handleSubmit,
    handleSuggestionClick,
  };
}
