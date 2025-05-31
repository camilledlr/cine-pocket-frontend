import React, { useEffect, useState } from "react";
import usePersistentFilters from "../hooks/usePersistentFilters";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Récupération de la watchlist depuis l'API
  useEffect(() => {
    getWatchlist()
      .then((data) => {
        setWatchlist(data);

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
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
  );
}

export default Watchlist;
