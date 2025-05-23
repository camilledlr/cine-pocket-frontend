import React, { useEffect, useState } from 'react';
import { getWatchlist } from '../services/lists';
import "../styles/ListPage.css";
import FilmList from "../components/List/FilmList";
import ListHeader from '../components/List/ListHeader';
import NavBar from '../components/Common/NavBar';

function Watchlist() {
  const [watchlist, setWatchlist] = useState(null);
  console.log('count', watchlist, );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


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
      <ListHeader type='watchlist' title="Watchlist" count={watchlist.films.length}/>
        <FilmList list={watchlist.films.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))} listType='watchlist'/>

    </div>
  );
}

export default Watchlist;