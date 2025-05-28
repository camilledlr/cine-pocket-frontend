import React, { useEffect, useState } from "react";
import Select from "react-select";
import { getFiltersData } from "../../services/films";
import Button from "../Common/Button";
import { TfiClose } from "react-icons/tfi";
import "./FilterModal.css";

const FilterModal = ({ listType, isOpen, onClose, onApply, selectedSort }) => {
  const [sortBy, setSortBy] = useState(selectedSort || "");
  const [onlyHyped, setOnlyHyped] = useState(false);
  const [onlyLiked, setOnlyLiked] = useState(false);
  const [directorFilter, setDirectorFilter] = useState(null);
  const [originFilter, setOriginFilter] = useState(null);
  const [platformFilter, setPlatformFilter] = useState(null);

  const [options, setOptions] = useState({
    directors: [],
    origins: [],
    platforms: [],
  });

  useEffect(() => {
    getFiltersData()
      .then(({ directors, origins, platforms }) => {
        setOptions({
          directors: directors.map((d) => ({ value: d, label: d })),
          origins: origins.map((o) => ({ value: o, label: o })),
          platforms: platforms.map((p) => ({ value: p, label: p })),
        });
      })
      .catch((err) => console.error("Erreur filtre :", err));
  }, []);

  const resetFilters = () => {
    setSortBy("date");
    setOnlyHyped(false);
    setOnlyLiked(false);
    setDirectorFilter(null);
    setOriginFilter(null);
    setPlatformFilter(null);
  };

  if (!isOpen) return null;

  return (
    <div className="filter-modal">
      <TfiClose className="modale-close" onClick={onClose} />
      <div className="filter-group">
        {listType === "seenlist" && (
          <>
            <div className="sort-section">
              <h4>Trier par</h4>
              <div className="sort-options">
                <label>
                  <input
                    type="radio"
                    name="sort"
                    value="rating"
                    checked={sortBy === "rating"}
                    onChange={() => setSortBy("rating")}
                  />
                  Note
                </label>
                <label>
                  <input
                    type="radio"
                    name="sort"
                    value="date"
                    checked={sortBy === "date"}
                    onChange={() => setSortBy("date")}
                  />
                  Date de visionnage
                </label>
              </div>
            </div>
            <div className="filters-section">
              <label>
                <input
                  type="checkbox"
                  checked={onlyLiked}
                  onChange={() => setOnlyLiked(!onlyLiked)}
                />
                Uniquement les films likés
              </label>
              <div className="filter-option">
                <label>Réalisateur :</label>
                <Select
                  options={options.directors}
                  value={directorFilter}
                  onChange={setDirectorFilter}
                  placeholder="Choisir un réalisateur"
                  isClearable
                  // isMulti={true}
                />
              </div>
              <div className="filter-option">
                <label>Pays d'origine :</label>
                <Select
                  options={options.origins}
                  value={originFilter}
                  onChange={setOriginFilter}
                  placeholder="Choisir un pays"
                  isClearable
                />
              </div>
            </div>
          </>
        )}
        {listType === "watchlist" && (
          <>
            <div className="sort-section">
              <h4>Trier par</h4>
              <label>
                <input
                  type="radio"
                  name="sort"
                  value="date"
                  checked={sortBy === "date"}
                  onChange={() => setSortBy("date")}
                />
                Date d'ajout
              </label>
              <label>
                <input
                  type="radio"
                  name="sort"
                  value="hyped"
                  checked={sortBy === "hyped"}
                  onChange={() => setSortBy("hyped")}
                />
                Hype
              </label>
            </div>
            <div className="filters-section">
              <label>
                <input
                  type="checkbox"
                  checked={onlyHyped}
                  onChange={() => setOnlyHyped(!onlyHyped)}
                />
                Uniquement les films hypés
              </label>
              <div className="filter-option">
                <label>Réalisateur :</label>
                <Select
                  options={options.directors}
                  value={directorFilter}
                  onChange={setDirectorFilter}
                  placeholder="Choisir un réalisateur"
                  isClearable
                />
              </div>
              <div className="filter-option">
                <label>Pays d'origine :</label>
                <Select
                  options={options.origins}
                  value={originFilter}
                  onChange={setOriginFilter}
                  placeholder="Choisir un pays"
                  isClearable
                />
              </div>
              <div className="filter-option">
                <label>Plateforme :</label>
                <Select
                  options={options.platforms}
                  value={platformFilter}
                  onChange={setPlatformFilter}
                  placeholder="Choisir une plateforme"
                  isClearable
                />
              </div>
            </div>
          </>
        )}
      </div>
      <div className="filters-actions">
        <Button
          text="Réinitialiser les filtres"
          size="large"
          variant="text"
          action={resetFilters}
        />
        <Button
          text="Appliquer les filtres"
          size="large"
          action={() =>
            onApply({
              sortBy,
              onlyHyped,
              onlyLiked,
              director: directorFilter?.value || "",
              origin: originFilter?.value || "",
              platform: platformFilter?.value || "",
            })
          }
        />
      </div>
    </div>
  );
};

export default FilterModal;
