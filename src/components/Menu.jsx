import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';

function Menu() {
  return (
    <nav className="menu">
      <ul className="menu-list">
        <li><Link to="/watchlist" className="menu-item">Watchlist
        <svg className="menu-arrow" xmlns="http://www.w3.org/2000/svg"  fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 1 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
  </svg>
            </Link></li>
        <li><Link to="/seenlist" className="menu-item">Films Vus
        <svg className="menu-arrow" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 1 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
  </svg>
        </Link></li>
      </ul>
    </nav>
  );
}

export default Menu;
