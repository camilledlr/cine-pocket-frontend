import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CURTAIN_MS = 1800; // ouverture du rideau
const COUNT_MS = 800; // durée de chaque chiffre du compte à rebours
const COUNT_FROM = 3;

// 2e étape : la salle s'assombrit, le rideau s'ouvre, puis le compte à rebours
// des vieilles pellicules (3, 2, 1) avant le début du film.
const Curtain = ({ onDone }) => {
  const [count, setCount] = useState(null); // null = rideau en cours d'ouverture

  useEffect(() => {
    // Enchaînement minuté : rideau, puis 3, 2, 1, puis on lance le film.
    // On garde chaque minuteur pour les annuler si on quitte la salle avant la fin.
    const timers = [setTimeout(() => setCount(COUNT_FROM), CURTAIN_MS)];
    for (let i = 1; i < COUNT_FROM; i += 1) {
      timers.push(setTimeout(() => setCount(COUNT_FROM - i), CURTAIN_MS + i * COUNT_MS));
    }
    timers.push(setTimeout(onDone, CURTAIN_MS + COUNT_FROM * COUNT_MS));
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className="seance-curtain-stage">
      {/* Compte à rebours façon amorce de pellicule : cercle, croix, aiguille qui tourne */}
      <AnimatePresence>
        {count !== null && (
          <motion.div
            className="seance-leader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className="seance-leader-cross" />
            <motion.span
              key={count}
              className="seance-leader-hand"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: COUNT_MS / 1000, ease: "linear" }}
            />
            <span className="seance-leader-number">{count}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Les deux pans du rideau s'écartent vers les côtés */}
      <motion.div
        className="seance-curtain-half is-left"
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{ duration: CURTAIN_MS / 1000, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
      />
      <motion.div
        className="seance-curtain-half is-right"
        initial={{ x: 0 }}
        animate={{ x: "100%" }}
        transition={{ duration: CURTAIN_MS / 1000, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
      />
    </div>
  );
};

export default Curtain;
