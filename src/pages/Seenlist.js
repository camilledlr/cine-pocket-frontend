import { useEffect, useState } from 'react';
import { getSeenlist } from '../services/lists';
import FilmList from "../components/List/FilmList";
import ListHeader from "../components/List/ListHeader";
import NavBar from '../components/Common/NavBar';


function Seenlist() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSeenlist()
      .then((data) => {
        setFilms(data.films || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur :', error.message);
        setLoading(false);
      });
  }, []);

  const sortedFilms = [...films].sort((a, b) => {
  const dateA = a.watchedDates?.[a.watchedDates.length - 1] || 0;
  const dateB = b.watchedDates?.[b.watchedDates.length - 1] || 0;
  return new Date(dateB) - new Date(dateA); // plus récent en haut
});

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
    <NavBar/>
    <ListHeader title="Films vus" count={films.length} />
      <FilmList type="seenlist" list={sortedFilms} />
    </div>
  );
}

export default Seenlist;
