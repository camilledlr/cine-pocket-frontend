import { useEffect, useState } from "react";
import usePersistentFilters from "../hooks/usePersistentFilters";
import { useLoading } from "../context/LoadingContext";
import { getSeenlist } from "../services/lists";
import FilmList from "../components/List/FilmList";
import FilterModal from "../components/List/FilterModal";
import NavBar from "../components/Common/NavBar";

function Seenlist() {
  const [films, setFilms] = useState([]);

  const { filters, setFiltersFromForm } = usePersistentFilters({
    sortBy: "date",
  });
  const { setLoading } = useLoading();

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
    const fetchSeenlist = async () => {
      setLoading(true);
      const MIN_DELAY = 500;
      const delay = new Promise((res) => setTimeout(res, MIN_DELAY));

      try {
        const [data] = await Promise.all([
          getSeenlist(), // appel à ton service
          delay, // garantit un temps minimal
        ]);
        setFilms(data.films || []);
      } catch (error) {
        console.error("Erreur :", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeenlist();
  }, []);

  const [showFilters, setShowFilters] = useState(false);

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
