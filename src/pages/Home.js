import React, { useEffect, useState } from 'react';
import { getAllFilms } from "../services/films";
import { motion } from "framer-motion";
import Menu from '../components/Menu';
import MainSearchBar from '../components/Home/MainSearchBar';
import NavBar from '../components/Common/NavBar';
import Button from '../components/Common/Button';

function Home() {
  const [allFilms, setAllFilms] = useState([]);

useEffect(() => {
  getAllFilms()
  .then(setAllFilms)
  .catch(err => console.error("Erreur chargement films :", err));
}, []);

  return (
    <motion.div
      initial={{ opacity: 1, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 1, y: 20 }}
      transition={{ duration: 0.3 }}
    >
    <div className="home">
      <NavBar/>
      <MainSearchBar allFilms={allFilms}/>
      <Menu />
      <Button
      size='large'
        action={() => window.location.href = "/what-to-watch"}
        text="On regarde quoi ?" />
    </div>
    </motion.div>
  );
}

export default Home;
