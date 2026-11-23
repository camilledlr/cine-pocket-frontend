import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { AiFillFire } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";
import FilmRating from "../Film/FilmRating";
import ConfirmModal from "../Common/ConfirmModal";
import { removeFilmFromList } from "../../services/lists";

// Distance (en px) à dépasser vers la gauche pour déclencher la suppression
const SWIPE_THRESHOLD = 80;

const FilmListItem = ({ film, listType, detailed }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isWatchlist = listType === "watchlist";
  const details = isWatchlist ? film.recommendations?.[0] : film.shortReview;

  // Position horizontale de la ligne pendant le swipe
  const x = useMotionValue(0);
  // Fond rouge : sa largeur = la partie découverte par le swipe.
  // Il n'y a donc jamais de rouge DERRIÈRE la ligne (sinon il transparaît sur ses bords)
  const actionWidth = useTransform(x, (value) => Math.max(0, -value));
  // Poubelle : grossit quand on atteint le seuil (= "si tu relâches, ça supprime")
  const iconScale = useTransform(x, [-SWIPE_THRESHOLD * 0.8, -SWIPE_THRESHOLD], [1, 1.4]);

  // Heure de fin du dernier glissement : sert à ignorer le clic qui le suit
  const lastDragEnd = useRef(0);

  const handleDragEnd = (_event, info) => {
    lastDragEnd.current = Date.now();
    // Seuil dépassé, ou geste rapide vers la gauche → on demande confirmation
    if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -800) {
      setShowConfirm(true);
    }
    // Dans tous les cas la ligne revient seule en place (dragConstraints)
  };

  const handleLinkClick = (e) => {
    // Clic juste après un glissement : on l'ignore pour ne pas ouvrir la fiche
    if (Date.now() - lastDragEnd.current < 300) {
      e.preventDefault();
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await removeFilmFromList(listType, film.slug);
      setShowConfirm(false);
      // La page (Watchlist / Seenlist) écoute cet événement et recharge la liste
      window.dispatchEvent(new Event(`${listType}Updated`));
    } catch (error) {
      console.error(error.message);
      alert("Impossible de supprimer le film, réessaie plus tard.");
      setDeleting(false);
    }
  };

  return (
    <div className="list-row">
      {/* Fond révélé pendant le swipe */}
      <motion.div className="list-swipe-action" style={{ width: actionWidth }} aria-hidden>
        <motion.span className="list-swipe-icon" style={{ scale: iconScale }}>
          <FiTrash2 />
        </motion.span>
      </motion.div>

      {/* Ligne glissable */}
      <motion.div
        className="list-swipe-content"
        style={{ x }}
        drag="x"
        dragDirectionLock
        // Position de repos = 0 ; on peut tirer librement vers la gauche (élasticité 1),
        // pas du tout vers la droite (0), et au relâchement la ligne revient à 0
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 1, right: 0 }}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
      >
        <Link
          to={`/films/${film.slug}`}
          className="link"
          draggable={false}
          onClick={handleLinkClick}
        >
          <div className={`list-item ${detailed ? "list-detailed" : ""}`}>
            <div className="list-item-text">
              <div className="list-film-title limited-text">
                {film.title}{" "}
                {isWatchlist && film.hyped && (
                  <span className="list-hype-icon"><AiFillFire /></span>
                )}
              </div>
              <div className="list-film-details limited-text">{details}</div>
            </div>
            {!isWatchlist && <FilmRating rating={film.rating} size="medium" />}
          </div>
        </Link>
      </motion.div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Retirer le film ?"
        message={`« ${film.title} » sera retiré de ta ${listType}.`}
        confirmText={deleting ? "Suppression…" : "Retirer"}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        loading={deleting}
      />
    </div>
  );
};

export default FilmListItem;
