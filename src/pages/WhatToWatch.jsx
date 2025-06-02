import React, { useEffect, useState } from "react";
import { getFiltersData } from "../services/films";
import { getWatchlist } from "../services/lists";
import Select from "react-select";
import usePersistentFilters from "../hooks/usePersistentFilters";
import Card from "../components/List/Card";
import Button from "../components/Common/Button";
import "../styles/WhatToWatch.css"; 

const WhatToWatch = () => {
  const chooseRandomFilm = (list) => {
    if (!list || list.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  };

  const { buildFilterOptions } = usePersistentFilters();
  const [showResults, setShowResults] = useState(false);
  const [onlyHyped, setOnlyHyped] = useState(false);
  const [platformsFilter, setPlatformsFilter] = useState([]);
  const [tagsFilter, setTagsFilter] = useState([]);
  const [options, setOptions] = useState({
    platforms: [],
    tags: [],
  });
  const [watchlist, setWatchlist] = useState({});

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
  console.log("sorted Films", sortedFilms);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [watchlistData, filtersData] = await Promise.all([
          getWatchlist(),
          getFiltersData(),
        ]);

        setWatchlist(watchlistData || []);
        setOptions({
          platforms: buildFilterOptions(filtersData.platforms),
          tags: buildFilterOptions(filtersData.tags),
        });
      } catch (error) {
        console.error("Erreur chargement données :", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="what-to-watch-page">
      <h3 className="page-title">On regarde quoi ?</h3>
      {!showResults && (
        <div>
          <label>
            <input
              type="checkbox"
              checked={onlyHyped}
              onChange={(e) => setOnlyHyped(e.target.checked)}
            />
            Les films hypés
          </label>

          <Select
            options={options.platforms}
            value={platformsFilter}
            onChange={setPlatformsFilter}
            placeholder="Netflix, Prime Vidéo, Disney+..."
            isClearable
            isMulti={true}
          />
          <Select
            options={options.tags}
            value={tagsFilter}
            onChange={setTagsFilter}
            placeholder="Comédie, Drama..."
            isClearable
            isMulti={true}
          />
          <Button
            text="Lancer la recherche"
            size="large"
            action={() => {
              setShowResults(true);
              chooseRandomFilm(sortedFilms);
            }}
          />
        </div>
      )}
      {showResults && (
        <div className="results-container">
        <Card film={chooseRandomFilm(sortedFilms)}/>
        </div>
      )}
    </div>
  );
};

export default WhatToWatch;
