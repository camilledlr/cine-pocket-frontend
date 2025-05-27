import React, { useEffect, useState } from 'react';
import { getWatchlist } from '../services/lists';
import "../styles/ListPage.css";
import FilmList from "../components/List/FilmList";
import FilterModal from '../components/List/FilterModal';
import NavBar from '../components/Common/NavBar';

function Watchlist() {
  const [watchlist, setWatchlist] = useState({});
    const [sortBy, setSortBy] = useState("date");
    const [filters, setFilters] = useState({ sortBy: 'date' });
const sortedFilms = (watchlist.films || [])
  .filter((film) => {
    if (filters.onlyHyped && !film.hyped) return false;
    if (filters.director && film.director?.toLowerCase() !== filters.director.toLowerCase()) return false;
    if (filters.origin && film.origin?.toLowerCase() !== filters.origin.toLowerCase()) return false;
    if (filters.platform && !film.platform.some(p => p.label.toLowerCase().includes(filters.platform.toLowerCase()))) return false;
    return true;
  })
  .sort((a, b) => {
    if (filters.sortBy === "hyped") return (b.hyped === true) - (a.hyped === true);
    if (filters.sortBy === "date") return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
const [showFilters, setShowFilters] = useState(false);



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
    <NavBar/>
    <FilterModal
    listType ='watchlist'
  isOpen={showFilters}
  onClose={() => setShowFilters(false)}
  onApply={(selectedFilters) => {
  setFilters(selectedFilters);
  setShowFilters(false);
}}
  selectedSort={sortBy}
/>
        <FilmList showFilters={setShowFilters} title="Watchlist" list={sortedFilms} listType='watchlist'/>

    </div>
  );
}

export default Watchlist;