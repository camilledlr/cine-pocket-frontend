import React, { useState } from "react";
import Button from "../Common/Button";
import { TfiClose } from "react-icons/tfi";
import "./FilterModal.css";

const FilterModal = ({ listType, isOpen, onClose, onApply, selectedSort }) => {
  const [sortBy, setSortBy] = useState(selectedSort || "");
  const [onlyHyped, setOnlyHyped] = useState(false);
  const [directorFilter, setDirectorFilter] = useState("");
  const [originFilter, setOriginFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");

  if (!isOpen) return null;

  return (
    <div className="filter-modal">
      <TfiClose className="modale-close" onClick={onClose} />
      <h2>Filtres & Tri</h2>
      <div className="filter-group">
        {listType === "seenlist" && (
          <>
            <label>
              <input
                type="radio"
                name="sort"
                value="rating"
                checked={sortBy === "rating"}
                onChange={() => setSortBy("rating")}
              />
              par Note
            </label>
            <label>
              <input
                type="radio"
                name="sort"
                value="date"
                checked={sortBy === "date"}
                onChange={() => setSortBy("date")}
              />
              par Date de visionnage
            </label>
          </>
        )}
        {listType === "watchlist" && (
          <>
            <label>
              <input
                type="radio"
                name="sort"
                value="date"
                checked={sortBy === "date"}
                onChange={() => setSortBy("date")}
              />
              par Date d'ajout
            </label>
            <label>
              <input
                type="radio"
                name="sort"
                value="hyped"
                checked={sortBy === "hyped"}
                onChange={() => setSortBy("hyped")}
              />
              par Hypé
            </label>
            <h3>Filtres</h3>
            <label>
              <input
                type="checkbox"
                checked={onlyHyped}
                onChange={() => setOnlyHyped(!onlyHyped)}
              />
              Uniquement les films hypés
            </label>

            <label>
              Réalisateur :
              <input
                type="text"
                value={directorFilter}
                onChange={(e) => setDirectorFilter(e.target.value)}
                placeholder="Nom du réalisateur"
              />
            </label>

            <label>
              Pays d'origine :
              <input
                type="text"
                value={originFilter}
                onChange={(e) => setOriginFilter(e.target.value)}
                placeholder="Ex : FR, USA"
              />
            </label>

            <label>
              Plateforme :
              <input
                type="text"
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                placeholder="Nom plateforme"
              />
            </label>
          </>
        )}
      </div>
      <Button
        text="Appliquer les filtres"
        size="medium"
        action={() => onApply({
      sortBy,
      onlyHyped,
      director: directorFilter,
      origin: originFilter,
      platform: platformFilter
    })}
      />
    </div>
  );
};

export default FilterModal;
