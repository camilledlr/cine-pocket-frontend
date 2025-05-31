import { useEffect, useState } from "react";
import usePersistentFilters from "../hooks/usePersistentFilters";
import { getSeenlist } from "../services/lists";
import FilmList from "../components/List/FilmList";
import FilterModal from "../components/List/FilterModal";
import NavBar from "../components/Common/NavBar";

function Seenlist() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { filters, setFiltersFromForm} = usePersistentFilters({ sortBy: "date" });
  

  const sortedFilms = [...(films || [])]
    .filter((film) => {
      if (filters.onlyLiked && !film.liked) return false;
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
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === "rating") return b.rating - a.rating;
      if (filters.sortBy === "date") {
        const dateA = a.watchedDates?.[a.watchedDates.length - 1] || 0;
        const dateB = b.watchedDates?.[b.watchedDates.length - 1] || 0;
        return new Date(dateB) - new Date(dateA);
      } // plus récent en haut;
      return 0;
    });

  useEffect(() => {
    getSeenlist()
      .then((data) => {
        setFilms(data.films || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur :", error.message);
        setLoading(false);
      });
  }, []);

  const [showFilters, setShowFilters] = useState(false);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <NavBar />
      <FilterModal
        listType="seenlist"
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
        title="Films vus"
        type="seenlist"
        list={sortedFilms}
      />
    </div>
  );
}

export default Seenlist;
