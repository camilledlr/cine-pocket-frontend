import React from 'react';
import { Link } from 'react-router-dom';
import MinSearchBar from './MinSearchBar';
import './NavBar.css';

const NavBar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/"><img src="/logo.svg" alt="Ciné Pocket" className="home-logo" /></Link>
            </div>
            <MinSearchBar  />
        </nav>
    );
};

export default NavBar;