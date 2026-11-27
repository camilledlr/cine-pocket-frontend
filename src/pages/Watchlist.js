import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import usePersistentFilters from "../hooks/usePersistentFilters";
import { getWatchlist } from "../services/lists";
import { useCachedData } from "../hooks/useCachedData";
import "../styles/ListPage.css";
import FilmList from "../components/List/FilmList";
import FilterModal from "../components/List/FilterModal";
import NavBar from "../components/Common/NavBar";
import Loader from "../components/Common/Loader";
import { filterFilms, sortFilms } from "../utils/listFilters";

function Watchlist() {
  const { data: watchlist, refresh, error, initialLoading } = useCachedData(
    'cinePocket_watchlist',
    getWatchlist,
    { films: [] }
  );
  const { filters, setFiltersFromForm} =
    usePersistentFilters({ sortBy: "date" });

  const sortedFilms = sortFilms(filterFilms(watchlist.films, filters), filters.sortBy, "watchlist");

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      refresh().catch(() => {});
    };

    window.addEventListener('watchlistUpdated', handleUpdate);
    return () => window.removeEventListener('watchlistUpdated', handleUpdate);
  }, [refresh]);

  if (error) return <p>Erreur : {error.message || String(error)}</p>;

  return (
       <motion.div
      initial={{ opacity: 1, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 1, y: -20 }}
      transition={{ duration: 0.3 }}
    >
    <div>
      <NavBar />
      <FilterModal
        listType="watchlist"
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={(selectedFilters) => {
          setFiltersFromForm(selectedFilters);
          setShowFilters(false);
        }}
        filters={filters}
        films={watchlist.films}
      />
      {initialLoading ? (
        <Loader inline message="Chargement de la watchlist…" />
      ) : (
        <FilmList
          showFilters={setShowFilters}
          title="Watchlist"
          list={sortedFilms}
          listType="watchlist"
          filters={filters}
        />
      )}
    </div>
    </motion.div>
  );
}

export default Watchlist;
