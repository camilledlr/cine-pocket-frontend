import React from "react";
import { motion } from "framer-motion";

const SECONDS_PER_SECTION = 2.5;

// Générique de fin : le texte remonte lentement, de bas en haut de l'écran.
// Un tap l'accélère jusqu'à la fin (comme on zappe un générique).
const Credits = ({ sections, onEnd }) => {
  const duration = 4 + sections.length * SECONDS_PER_SECTION;

  return (
    <div
      className="seance-credits"
      onClick={onEnd}
      role="button"
      tabIndex={0}
      aria-label="Passer le générique"
    >
      <motion.div
        className="seance-credits-roll"
        // De sous l'écran (100vh) à au-dessus (-100%) : le texte traverse tout l'écran
        initial={{ y: "100vh" }}
        animate={{ y: "-100%" }}
        transition={{ duration, ease: "linear" }}
        onAnimationComplete={onEnd}
      >
        {sections.map((section) => (
          <div key={section.role} className="seance-credits-section">
            <span className="seance-credits-role">{section.role}</span>
            {section.names.map((name) => (
              <span key={name} className="seance-credits-name">
                {name}
              </span>
            ))}
          </div>
        ))}
        <span className="seance-credits-end">Fin</span>
      </motion.div>
    </div>
  );
};

export default Credits;
