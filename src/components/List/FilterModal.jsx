import React, { useState } from "react";
import Button from "../Common/Button";
import { TfiClose } from "react-icons/tfi";
import "./FilterModal.css";

const FilterModal = ({ listType, isOpen, onClose, onApply, selectedSort }) => {
  const [sortBy, setSortBy] = useState(selectedSort || "");
  const [onlyHyped, setOnlyHyped] = useState(false);
  const [onlyLiked, setOnlyLiked] = useState(false);
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
          <><div className="sort-section">
              <h4>Trier par</h4>
              <div className="sort-options">
                <div className="radio-input">
                  <input
                    type="radio"
                    id="sort-rating"
                    name="sort"
                    value="rating"
                    checked={sortBy === "rating"}
                    onChange={() => setSortBy("rating")}
                  />
                  <label htmlFor="sort-date">Note</label>
                </div>
                <div className="radio-input">
                  <input
                    type="radio"
                    id="sort-date"
                    name="sort"
                    value="date"
                    checked={sortBy === "date"}
                    onChange={() => setSortBy("date")}
                  />
                  <label htmlFor="sort-date">Date de visionnage</label>
                </div>
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
                <label>
                  Réalisateur :
                  <input
                    type="text"
                    value={directorFilter}
                    onChange={(e) => setDirectorFilter(e.target.value)}
                    placeholder="Nom du réalisateur"
                  />
                </label>
              </div>
              <div className="filter-option">
                <label>
                  Pays d'origine :
                  <input
                    type="text"
                    value={originFilter}
                    onChange={(e) => setOriginFilter(e.target.value)}
                    placeholder="Ex : FR, USA"
                  />
                </label>
              </div>
            </div>
          </>
        )}
        {listType === "watchlist" && (
          <>
            <div className="sort-section">
              <h4>Trier par</h4>
              <div className="sort-options">
                <div className="radio-input">
                  <input
                    type="radio"
                    id="sort-date"
                    name="sort"
                    value="date"
                    checked={sortBy === "date"}
                    onChange={() => setSortBy("date")}
                  />
                  <label htmlFor="sort-date">Date d'ajout</label>
                </div>
                <div className="radio-input">
                  <input
                    type="radio"
                    id="sort-hype"
                    name="sort"
                    value="hyped"
                    checked={sortBy === "hyped"}
                    onChange={() => setSortBy("hyped")}
                  />
                  <label htmlFor="sort-date">Hype</label>
                </div>
              </div>
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
                <label>
                  Réalisateur :
                  <input
                    type="text"
                    value={directorFilter}
                    onChange={(e) => setDirectorFilter(e.target.value)}
                    placeholder="Nom du réalisateur"
                  />
                </label>
              </div>
              <div className="filter-option">
                <label>
                  Pays d'origine :
                  <input
                    type="text"
                    value={originFilter}
                    onChange={(e) => setOriginFilter(e.target.value)}
                    placeholder="Ex : FR, USA"
                  />
                </label>
              </div>
            <div className="filter-option">
              <label>
                Plateforme :
                <input
                  type="text"
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  placeholder="Nom plateforme"
                />
              </label>
              </div>
            </div>
          </>
        )}
      </div>
      <Button
        text="Appliquer les filtres"
        size="medium"
        action={() =>
          onApply({
            sortBy,
            onlyHyped,
            director: directorFilter,
            origin: originFilter,
            platform: platformFilter,
          })
        }
      />
    </div>
  );
};

export default FilterModal;
