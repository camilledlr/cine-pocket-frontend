import React from 'react';
import { RiMovie2Fill } from 'react-icons/ri';
import './Loader.css';

// Bobine de film qui tourne.
// - par défaut : plein écran, par-dessus l'app
// - inline : dans la page, à la place d'un contenu pas encore chargé (avec un message optionnel)
const Loader = ({ inline = false, message }) => {
  if (inline) {
    return (
      <div className="loader-inline" role="status" aria-live="polite">
        <RiMovie2Fill className="reel-icon reel-icon-inline" aria-hidden="true" />
        <span className={message ? 'loader-message' : 'visually-hidden'}>
          {message || 'Chargement…'}
        </span>
      </div>
    );
  }

  return (
    <div className="loader-overlay" role="status">
      <RiMovie2Fill className="reel-icon" aria-hidden="true" />
      <span className="visually-hidden">Chargement…</span>
    </div>
  );
};

export default Loader;
