import React, { useEffect, useState } from "react";
import { getFiltersData } from "../services/films";
import { getWatchlist } from "../services/lists";
import Select from "react-select";
import usePersistentFilters from "../hooks/usePersistentFilters";
import { useCachedData } from "../hooks/useCachedData";
import Card from "../components/List/Card";
import Button from "../components/Common/Button";
import "../styles/WhatToWatch.css";

const WhatToWatch = () => {
  const { data: watchlist, refresh } = useCachedData(
    'cinePocket_watchlist',
    getWatchlist,
    { films: [] }
  );
  const { buildFilterOptions } = usePersistentFilters();
  const [showResults, setShowResults] = useState(false);
  const [chosenFilm, setChosenFilm] = useState(null);
  const [onlyHyped, setOnlyHyped] = useState(false);
  const [platformsFilter, setPlatformsFilter] = useState([]);
  const [tagsFilter, setTagsFilter] = useState([]);
  const [options, setOptions] = useState({
    platforms: [],
    tags: [],
  });

  const sortedFilms = (watchlist.films || []).filter((film) => {
    if (onlyHyped && !film.hyped) return false;
    if (
      platformsFilter?.length &&
      !film.platform?.some((p) =>
        platformsFilter.some(
          (filterPlat) =>
            p.label?.toLowerCase() === filterPlat.label.toLowerCase()
        )
      )
    )
      return false;
    if (
      tagsFilter?.length &&
      !film.tags?.some((t) =>
        tagsFilter.some(
          (filterTag) => t?.toLowerCase() === filterTag.label.toLowerCase()
        )
      )
    )
      return false;
    return true;
  });

  const chooseRandomFilm = (list) => {
    if (!list || list.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * list.length);
    setChosenFilm(list[randomIndex]);
    return list[randomIndex];
  };

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const filtersData = await getFiltersData();
        setOptions({
          platforms: buildFilterOptions(filtersData.platforms),
          tags: buildFilterOptions(filtersData.tags),
        });
      } catch (error) {
        console.error("Erreur chargement filtres :", error.message);
      }
    };

    fetchFilters();
  }, [buildFilterOptions]);

  useEffect(() => {
    const handleUpdate = () => {
      refresh().catch(() => {});
    };

    window.addEventListener('watchlistUpdated', handleUpdate);
    return () => window.removeEventListener('watchlistUpdated', handleUpdate);
  }, [refresh]);

  return (
    <div className="what-to-watch-page">
      <h3 className="page-title">On regarde quoi ?</h3>
      {!showResults && (
        <div className="filters-container">
          <div className="input-container">
            <h4>Parmi </h4>
            <label className="custom-checkbox-container">
              <input
              className="custom-checkbox"
                type="checkbox"
                checked={onlyHyped}
                onChange={(e) => setOnlyHyped(e.target.checked)}
              />
              Les films hypés ?
            </label>
          </div>
          <div className="input-container">
            <h4>Dispo sur </h4>
            <Select
              options={options.platforms}
              value={platformsFilter}
              onChange={setPlatformsFilter}
              placeholder="Netflix, Prime Vidéo, Disney+..."
              isClearable
              isMulti={true}
            />
          </div>
          <div className="input-container">
            <h4>Du genre </h4>
            <Select
              options={options.tags}
              value={tagsFilter}
              onChange={setTagsFilter}
              placeholder="Comédie, Drama..."
              isClearable
              isMulti={true}
            />
          </div>
          <div className="filters-actions">
            <Button
              text="Lancer la recherche"
              size="large"
              action={() => {
                setShowResults(true);
                chooseRandomFilm(sortedFilms);
              }}
            />
          </div>
        </div>
      )}
      {showResults && (
        <div className="results-container">
          {chosenFilm ? (
            <Card film={chosenFilm} />
          ) : (
            <div>Aucun film trouvé avec ces critères.</div>
          )}
          <div className="results-actions">
            <Button
              text="Relancer la recherche"
              size="large"
              action={() => {
                chooseRandomFilm(sortedFilms);
              }}
            />
            <Button
              text="Changer les critères"
              variant="text"
              size="large"
              action={() => {
                setShowResults(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatToWatch;
