import { useEffect, useState } from "react";
import usePersistentFilters from "../hooks/usePersistentFilters";
import { motion } from "framer-motion";
import { getSeenlist } from "../services/lists";
import { useCachedData } from "../hooks/useCachedData";
import FilmList from "../components/List/FilmList";
import FilterModal from "../components/List/FilterModal";
import NavBar from "../components/Common/NavBar";
import Loader from "../components/Common/Loader";
import { filterFilms, sortFilms } from "../utils/listFilters";

function Seenlist() {
  const { data: list, refresh, initialLoading } = useCachedData(
    'cinePocket_seenlist',
    getSeenlist,
    []
  );

  const { filters, setFiltersFromForm } = usePersistentFilters({
    sortBy: "date",
  });

  const sortedFilms = sortFilms(filterFilms(list.films, filters), filters.sortBy, "seenlist");

  // useEffect(() => {
  //   const fetchSeenlist = async () => {
  //     setLoading(true);
  //     const MIN_DELAY = 500;
  //     const delay = new Promise((res) => setTimeout(res, MIN_DELAY));

  //     try {
  //       const [data] = await Promise.all([
  //         getSeenlist(), // appel à ton service
  //         delay, // garantit un temps minimal
  //       ]);
  //       setFilms(data.films || []);
  //     } catch (error) {
  //       console.error("Erreur :", error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchSeenlist();
  // }, []);

  useEffect(() => {
    const handleUpdate = () => {
      refresh().catch(() => {});
    };

    window.addEventListener('seenlistUpdated', handleUpdate);
    return () => window.removeEventListener('seenlistUpdated', handleUpdate);
  }, [refresh]);

  const [showFilters, setShowFilters] = useState(false);

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
          listType="seenlist"
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          onApply={(selectedFilters) => {
            setFiltersFromForm(selectedFilters);
            setShowFilters(false);
          }}
          filters={filters}
          films={list.films}
        />
        {initialLoading ? (
          <Loader inline message="Chargement des films vus…" />
        ) : (
          <FilmList
            showFilters={setShowFilters}
            title="Films vus"
            listType="seenlist"
            filters={filters}
            list={sortedFilms}
          />
        )}
      </div>
    </motion.div>
  );
}

export default Seenlist;
