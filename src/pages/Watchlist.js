import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import usePersistentFilters from "../hooks/usePersistentFilters";
import { useLoading } from '../context/LoadingContext';
import { getWatchlist } from "../services/lists";
import "../styles/ListPage.css";
import FilmList from "../components/List/FilmList";
import FilterModal from "../components/List/FilterModal";
import NavBar from "../components/Common/NavBar";

function Watchlist() {
  const [watchlist, setWatchlist] = useState({});
  const { filters, setFiltersFromForm} =
    usePersistentFilters({ sortBy: "date" });

  // Fonction pour trier et filtrer les films de la watchlist
  const sortedFilms = (watchlist.films || [])
    .filter((film) => {
      if (filters.onlyHyped && !film.hyped) return false;
      if (
        filters.director?.length &&
        !filters.director.some(
          (dir) => film.director?.toLowerCase() === dir.toLowerCase()
        )
      )
        return false;
      if (
        filters.origin?.length &&
        !filters.origin.some(
          (orig) => film.origin?.toLowerCase() === orig.toLowerCase()
        )
      )
        return false;
      if (
        filters.platform?.length &&
        !film.platform?.some((p) =>
          filters.platform.some(
            (filterPlat) => p.label?.toLowerCase() === filterPlat.toLowerCase()
          )
        )
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === "hyped")
        return (b.hyped === true) - (a.hyped === true);
      if (filters.sortBy === "date")
        return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  const [showFilters, setShowFilters] = useState(false);
  const { setLoading } = useLoading();
  const [error, setError] = useState("");

  // Récupération de la watchlist depuis l'API
  useEffect(() => {
  const fetchWatchlist = async () => {
    try {
      const data = await getWatchlist();
      setWatchlist(data || []);
    } catch (error) {
      console.error("Erreur :", error.message);
    }
  };

  fetchWatchlist();
}, []);

  if (error) return <p>Erreur : {error}</p>;

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
        selectedSort={filters.sortBy}
      />
      <FilmList
        showFilters={setShowFilters}
        title="Watchlist"
        list={sortedFilms}
        listType="watchlist"
      />
    </div>
    </motion.div>
  );
}

export default Watchlist;
