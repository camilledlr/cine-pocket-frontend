import React, { useEffect, useState } from 'react';
import { getAllFilms } from '../../services/films';
import { Link, useLocation } from 'react-router-dom';
import MinSearchBar from './MinSearchBar';
import './NavBar.css';

const NavBar = () => {
  const [allFilms, setAllFilms] = useState([]);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
    const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    getAllFilms()
      .then(setAllFilms)
      .catch(err => console.error("Erreur chargement films :", err));
  }, []);

  return (
    <nav className="navbar">
    {!searchFocused && (
        <div className="navbar-logo">
          <Link to="/">
            <img src="/logo.svg" alt="Ciné Pocket" className="home-logo" />
          </Link>
        </div>
      )}

      {!isHomePage && (
        <MinSearchBar
          allFilms={allFilms}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      )}
    </nav>
  );
};

export default NavBar;
