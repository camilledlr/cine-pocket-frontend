import React, { useEffect, useState } from 'react';
import { getAllFilms } from "../services/films";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import Menu from '../components/Menu';
import ReminderSection from '../components/Home/ReminderSection';
import CinemaSection from '../components/Home/CinemaSection';
import YearlyProgress from '../components/Home/YearlyProgress';
import MainSearchBar from '../components/Home/MainSearchBar';
import NavBar from '../components/Common/NavBar';
import Button from '../components/Common/Button';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();
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
      {/* Action principale de l'accueil : juste sous la recherche, centrée */}
      <YearlyProgress />
      <div className="home-cta">
        <Button
          size='large'
          action={() => navigate("/what-to-watch")}
          text="On regarde quoi ?" />
      </div>
      <Menu />
       <CinemaSection />
        <ReminderSection />
        
    </div>
    </motion.div>
  );
}

export default Home;
