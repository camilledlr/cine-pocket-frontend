import React, { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import "./SwipeToDelete.css";

// Distance (en px) à dépasser vers la gauche pour déclencher la suppression
const SWIPE_THRESHOLD = 80;

// Enveloppe une ligne pour la rendre « glissable vers la gauche pour supprimer »
// (même geste que FilmListItem). Au-delà du seuil, appelle onSwipe : c'est au parent
// de demander confirmation puis de supprimer.
const SwipeToDelete = ({ onSwipe, children }) => {
  // Position horizontale de la ligne pendant le swipe
  const x = useMotionValue(0);
  // Fond rouge : sa largeur = la partie découverte par le swipe
  const actionWidth = useTransform(x, (value) => Math.max(0, -value));
  // Poubelle : grossit quand on atteint le seuil (= « si tu relâches, ça supprime »)
  const iconScale = useTransform(x, [-SWIPE_THRESHOLD * 0.8, -SWIPE_THRESHOLD], [1, 1.4]);

  // Heure de fin du dernier glissement : sert à ignorer le clic qui le suit
  const lastDragEnd = useRef(0);

  const handleDragEnd = (_event, info) => {
    lastDragEnd.current = Date.now();
    // Seuil dépassé, ou geste rapide vers la gauche
    if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -800) onSwipe();
  };

  // Clic juste après un glissement : on l'annule (pour un futur lien sur la ligne)
  const handleClickCapture = (e) => {
    if (Date.now() - lastDragEnd.current < 300) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="swipe-row">
      <motion.div className="swipe-action" style={{ width: actionWidth }} aria-hidden>
        <motion.span className="swipe-icon" style={{ scale: iconScale }}>
          <FiTrash2 />
        </motion.span>
      </motion.div>

      <motion.div
        className="swipe-content"
        style={{ x }}
        drag="x"
        dragDirectionLock
        // Repos à 0 ; tirable librement vers la gauche, pas du tout vers la droite
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 1, right: 0 }}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        onClickCapture={handleClickCapture}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default SwipeToDelete;
