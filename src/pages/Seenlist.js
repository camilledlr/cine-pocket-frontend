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

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
    <NavBar/>
    <ListHeader title="Films vus" count={films.length} />
      <FilmList type="seenlist" list={films} />
    </div>
  );
}

export default Seenlist;
