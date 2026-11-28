import React, { useState } from "react";
import { motion } from "framer-motion";

// Distance (px) à faire glisser le talon vers la droite pour le déchirer
const TEAR_THRESHOLD = 90;

// 1re étape : le billet d'entrée. On déchire le talon (glisser vers la droite, ou un tap)
// pour entrer dans la salle.
const Ticket = ({ year, viewer, onEnter }) => {
  const [torn, setTorn] = useState(false);

  const tear = () => {
    if (torn) return;
    setTorn(true);
    // On laisse le temps au talon de s'envoler avant de passer à la suite
    setTimeout(onEnter, 700);
  };

  return (
    <div className="seance-ticket-stage">
      <div className="seance-ticket">
        <div className="seance-ticket-main">
          <span className="seance-ticket-brand">Ciné Pocket</span>
          <span className="seance-ticket-kicker">Séance unique</span>
          <span className="seance-ticket-title">L'année {year}</span>
          <div className="seance-ticket-details">
            <span>Salle 1</span>
            <span>1ᵉʳ janvier</span>
            <span>Admise : {viewer}</span>
          </div>
        </div>

        {/* Talon : c'est lui qu'on arrache */}
        <motion.button
          type="button"
          className="seance-ticket-stub"
          aria-label="Déchirer le billet et entrer dans la salle"
          drag={torn ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={{ left: 0, right: 0.8 }}
          onDragEnd={(_e, info) => info.offset.x > TEAR_THRESHOLD && tear()}
          onClick={tear}
          animate={torn ? { x: 320, y: 80, rotate: 35, opacity: 0 } : { x: 0 }}
          transition={{ duration: 0.6, ease: "easeIn" }}
        >
          <span className="seance-ticket-stub-text">ENTRÉE</span>
          <span className="seance-ticket-stub-number">Nº {year}</span>
        </motion.button>
      </div>

      <motion.p
        className="seance-hint"
        animate={{ opacity: torn ? 0 : [0.4, 1, 0.4] }}
        transition={torn ? { duration: 0.2 } : { duration: 2, repeat: Infinity }}
      >
        Déchire le billet pour entrer →
      </motion.p>
    </div>
  );
};

export default Ticket;
