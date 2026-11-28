import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { TfiClose } from "react-icons/tfi";
import Ticket from "./Ticket";
import Curtain from "./Curtain";
import Credits from "./Credits";
import { SCENE_COMPONENTS, CartonScene } from "./scenes";
import "./Seance.css";

// Pause dans le noir avant la scène post-générique (il faut avoir attendu la fin !)
const POST_CREDITS_DELAY_MS = 1500;

// Le « projecteur » : enchaîne les étapes de la séance.
//   billet → rideau → film (scènes) → générique → noir → scène post-générique
// Il ne connaît pas le contenu : il reçoit un objet recap { year, scenes, credits, … }.
const SeancePlayer = ({ recap, onExit }) => {
  const [phase, setPhase] = useState("ticket"); // ticket | curtain | film | credits | dark | post
  const [index, setIndex] = useState(0);

  // On ignore les scènes d'un type inconnu plutôt que de planter la séance
  const scenes = recap.scenes.filter((scene) => SCENE_COMPONENTS[scene.type]);

  // useCallback : Curtain relance son minutage si cette fonction change d'identité
  const startFilm = useCallback(() => setPhase("film"), []);
  const endCredits = useCallback(() => setPhase("dark"), []);

  // Noir après le générique, puis la scène post-générique (si le recap en a une)
  useEffect(() => {
    if (phase !== "dark") return undefined;
    if (!recap.postCredits) {
      setPhase("post");
      return undefined;
    }
    const timer = setTimeout(() => setPhase("post"), POST_CREDITS_DELAY_MS);
    return () => clearTimeout(timer);
  }, [phase, recap.postCredits]);

  // Tap pendant le film : tiers gauche = scène précédente, le reste = scène suivante
  const handleFilmTap = (e) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const goBack = e.clientX - left < width / 3;
    if (goBack) {
      setIndex((i) => Math.max(0, i - 1));
    } else if (index < scenes.length - 1) {
      setIndex((i) => i + 1);
    } else {
      setPhase("credits");
    }
  };

  const restart = () => {
    setIndex(0);
    setPhase("ticket");
  };

  const Scene = scenes[index] && SCENE_COMPONENTS[scenes[index].type];

  // Portail vers <body> : la salle couvre tout l'écran, au-dessus de l'app
  return createPortal(
    <div className="seance" role="dialog" aria-modal="true" aria-label={`La Séance ${recap.year}`}>
      <div className="seance-grain" aria-hidden="true" />
      <div className="seance-vignette" aria-hidden="true" />

      <button type="button" className="seance-close" onClick={onExit} aria-label="Quitter la salle">
        <TfiClose />
      </button>

      {phase === "ticket" && (
        <Ticket year={recap.year} viewer={recap.viewer} onEnter={() => setPhase("curtain")} />
      )}

      {phase === "curtain" && <Curtain onDone={startFilm} />}

      {phase === "film" && Scene && (
        <div className="seance-film" onClick={handleFilmTap}>
          {/* Amorce de pellicule : une perforation par scène, allumée jusqu'à la scène en cours */}
          <div className="seance-reel" aria-label={`Scène ${index + 1} sur ${scenes.length}`}>
            {scenes.map((scene, i) => (
              <span key={i} className={`seance-reel-frame${i <= index ? " is-lit" : ""}`} />
            ))}
          </div>

          {/* Fondu au noir entre deux scènes : l'ancienne disparaît avant que la nouvelle arrive */}
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              className="seance-scene"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Scene scene={scenes[index]} />
            </motion.div>
          </AnimatePresence>

          {index === 0 && (
            <p className="seance-hint seance-hint-bottom">Touche l'écran pour continuer</p>
          )}
        </div>
      )}

      {phase === "credits" && <Credits sections={recap.credits || []} onEnd={endCredits} />}

      {phase === "post" && (
        <motion.div
          className="seance-post"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {recap.postCredits && <CartonScene scene={recap.postCredits} />}
          <div className="seance-post-actions">
            <button type="button" className="seance-button" onClick={onExit}>
              Quitter la salle
            </button>
            <button type="button" className="seance-button is-ghost" onClick={restart}>
              Revoir la séance
            </button>
          </div>
        </motion.div>
      )}
    </div>,
    document.body,
  );
};

export default SeancePlayer;
