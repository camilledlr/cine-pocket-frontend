import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { getWatchlist } from "../services/lists";
import Select from "react-select";
import { useCachedData } from "../hooks/useCachedData";
import { useFilterOptions } from "../hooks/useFilterOptions";
import { useWhatToWatchFilters } from "../hooks/useWhatToWatchFilters";
import Card from "../components/List/Card";
import Button from "../components/Common/Button";
import "../styles/WhatToWatch.css";

const STACK_SIZE = 10;
const TOTAL_SHUFFLES = 10;
const EXIT_DURATION = 280;

const FiltersView = ({ options, filterState, filterHandlers, onSubmit }) => (
  <div className="filters-container">
    <div className="input-container">
      <h4>Parmi</h4>
      <label className="custom-checkbox-container">
        <input
          className="custom-checkbox"
          type="checkbox"
          checked={filterState.onlyHyped}
          onChange={(e) => filterHandlers.setOnlyHyped(e.target.checked)}
        />
        Les films hypés ?
      </label>
    </div>
    <div className="input-container">
      <h4>Dispo sur</h4>
      <Select
        options={options.platforms}
        value={filterState.platformsFilter}
        onChange={filterHandlers.setPlatformsFilter}
        placeholder="Netflix, Prime Vidéo, Disney+..."
        isClearable
        isMulti
      />
    </div>
    <div className="input-container">
      <h4>Du genre</h4>
      <Select
        options={options.tags}
        value={filterState.tagsFilter}
        onChange={filterHandlers.setTagsFilter}
        placeholder="Comédie, Drama..."
        isClearable
        isMulti
      />
    </div>
    <div className="filters-actions">
      <Button text="Lancer la recherche" size="large" action={onSubmit} />
    </div>
  </div>
);

const PickingView = ({ films, chosenFilm, onDone }) => {
  const [cards, setCards] = useState(() =>
    Array.from({ length: STACK_SIZE }, (_, i) => ({
      id: i,
      film: films[Math.floor(Math.random() * films.length)],
    }))
  );
  const [revealed, setRevealed] = useState(false);
  const idRef = useRef(STACK_SIZE);

  useEffect(() => {
    let shuffle = 0;
    const timeouts = [];

    const doShuffle = () => {
      if (shuffle >= TOTAL_SHUFFLES) {
        setCards([{ id: idRef.current++, film: chosenFilm }]);
        setRevealed(true);
        timeouts.push(setTimeout(onDone, 1100));
        return;
      }

      setCards((prev) =>
        prev.map((c, i) => (i === 0 ? { ...c, leaving: true } : c))
      );

      timeouts.push(
        setTimeout(() => {
          setCards((prev) => [
            ...prev.filter((c) => !c.leaving),
            {
              id: idRef.current++,
              film: films[Math.floor(Math.random() * films.length)],
            },
          ]);
        }, EXIT_DURATION)
      );

      shuffle++;
      const delay = 360 + Math.pow(shuffle / TOTAL_SHUFFLES, 2) * 700;
      timeouts.push(setTimeout(doShuffle, delay));
    };

    doShuffle();
    return () => timeouts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleCards = cards.filter((c) => !c.leaving);

  return (
    <div className={`picking-stack ${revealed ? "picking-stack--revealed" : ""}`}>
      {cards.map((card) => {
        const pos = card.leaving ? 0 : visibleCards.indexOf(card);
        return (
          <div
            key={card.id}
            className={`stack-card ${card.leaving ? "stack-card--leaving" : ""}`}
            style={{ "--pos": pos }}
          >
            <Card film={card.film} />
          </div>
        );
      })}
    </div>
  );
};

const ResultView = ({ film, onRetry, onReset }) => (
  <div className="results-container">
    {film ? <Card film={film} /> : <div>Aucun film trouvé avec ces critères.</div>}
    <div className="results-actions">
      <Button text="Relancer la recherche" size="large" action={onRetry} />
      <Button text="Changer les critères" variant="text" size="large" action={onReset} />
    </div>
  </div>
);

const WhatToWatch = () => {
  const navigate = useNavigate();
  const { data: watchlist, refresh } = useCachedData("cinePocket_watchlist", getWatchlist, { films: [] });
  const { options } = useFilterOptions();
  const { filteredFilms, filterState, filterHandlers } = useWhatToWatchFilters(watchlist.films);
  const [view, setView] = useState("filters");
  const [chosenFilm, setChosenFilm] = useState(null);

  const pickRandom = useCallback(() => {
    if (!filteredFilms.length) {
      setChosenFilm(null);
      setView("results");
      return;
    }
    const idx = Math.floor(Math.random() * filteredFilms.length);
    setChosenFilm(filteredFilms[idx]);
    setView("picking");
  }, [filteredFilms]);

  useEffect(() => {
    const handleUpdate = () => refresh().catch(() => {});
    window.addEventListener("watchlistUpdated", handleUpdate);
    return () => window.removeEventListener("watchlistUpdated", handleUpdate);
  }, [refresh]);

  return (
    <div className="what-to-watch-page">
      <button
        type="button"
        className="close-button"
        aria-label="Fermer"
        onClick={() => navigate(-1)}
      >
        <IoClose />
      </button>
      <h3 className="page-title">On regarde quoi ?</h3>
      {view === "filters" && (
        <FiltersView
          options={options}
          filterState={filterState}
          filterHandlers={filterHandlers}
          onSubmit={pickRandom}
        />
      )}
      {view === "picking" && (
        <PickingView
          films={filteredFilms}
          chosenFilm={chosenFilm}
          onDone={() => setView("results")}
        />
      )}
      {view === "results" && (
        <ResultView
          film={chosenFilm}
          onRetry={pickRandom}
          onReset={() => setView("filters")}
        />
      )}
    </div>
  );
};

export default WhatToWatch;
