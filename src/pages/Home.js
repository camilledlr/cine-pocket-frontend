import React, { useEffect, useState } from 'react';
import { getAllFilms } from "../services/films";
import Menu from '../components/Menu';
import MainSearchBar from '../components/Home/MainSearchBar';
import NavBar from '../components/Common/NavBar';

function Home() {
  const [allFilms, setAllFilms] = useState([]);

useEffect(() => {
  getAllFilms()
  .then(setAllFilms)
  .catch(err => console.error("Erreur chargement films :", err));
}, []);

  return (
    <div className="home">
      <NavBar/>
      <MainSearchBar allFilms={allFilms}/>
      <Menu />
    </div>
  );
}

export default Home;
