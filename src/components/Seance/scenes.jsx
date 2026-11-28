import React, { useEffect, useState } from "react";
import { animate, motion } from "framer-motion";

// Les « mises en scène » disponibles. Chacune reçoit les données d'une scène
// (scene) et sait seulement les AFFICHER : le choix de ce qu'on montre se fait ailleurs.

const TMDB_POSTER = "https://image.tmdb.org/t/p/w342";

// Entrée progressive des éléments d'une scène : chaque enfant apparaît après le précédent
const stagger = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.35, delayChildren: 0.2 } },
};
const rise = {
  hidden: { opacity: 0, y: 18 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Carton façon cinéma muet : texte encadré d'un filet orné
const CartonScene = ({ scene }) => (
  <motion.div className="scene-carton" variants={stagger} initial="hidden" animate="shown">
    <div className="scene-carton-frame">
      {scene.lines.map((line) => (
        <motion.p key={line} variants={rise}>
          {line}
        </motion.p>
      ))}
    </div>
  </motion.div>
);

// Un grand chiffre qui défile jusqu'à sa valeur
const CountUp = ({ value }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    // animate() de framer-motion fait varier un nombre de 0 à value en 1,6 s
    const controls = animate(0, value, {
      duration: 1.6,
      delay: 0.5,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value]);
  return <span className="scene-number-value">{display}</span>;
};

const NumberScene = ({ scene }) => (
  <motion.div className="scene-number" variants={stagger} initial="hidden" animate="shown">
    {scene.before && <motion.p variants={rise}>{scene.before}</motion.p>}
    <motion.div variants={rise}>
      <CountUp value={scene.value} />
    </motion.div>
    {scene.after && <motion.p variants={rise}>{scene.after}</motion.p>}
    {scene.caption && (
      <motion.p className="scene-caption" variants={rise}>
        {scene.caption}
      </motion.p>
    )}
  </motion.div>
);

const Poster = ({ film }) =>
  film.posterPath ? (
    <img src={`${TMDB_POSTER}${film.posterPath}`} alt={film.title} />
  ) : (
    <span className="scene-poster-fallback">{film.title}</span>
  );

// Mur d'affiches qui arrivent une à une, légèrement de travers
const PostersScene = ({ scene }) => (
  <div className="scene-posters">
    {scene.title && (
      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        {scene.title}
      </motion.h2>
    )}
    <motion.div
      className="scene-posters-grid"
      variants={{
        hidden: {},
        shown: { transition: { staggerChildren: 0.18, delayChildren: 0.5 } },
      }}
      initial="hidden"
      animate="shown"
    >
      {scene.films.map((film, index) => (
        <motion.div
          key={film.title}
          className="scene-poster"
          variants={{
            hidden: { opacity: 0, scale: 0.6, rotate: 0 },
            // Inclinaison alternée : -4°, 3°, -2°… pour un effet « posé à la main »
            shown: { opacity: 1, scale: 1, rotate: index % 2 ? 3 : -4 },
          }}
        >
          <Poster film={film} />
        </motion.div>
      ))}
    </motion.div>
    {scene.caption && (
      <motion.p
        className="scene-caption"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 + scene.films.length * 0.18 }}
      >
        {scene.caption}
      </motion.p>
    )}
  </div>
);

// Devine avant de voir : on choisit une réponse, puis la vraie s'affiche
const GuessScene = ({ scene }) => {
  const [picked, setPicked] = useState(null);
  const revealed = picked !== null;

  return (
    <motion.div className="scene-guess" variants={stagger} initial="hidden" animate="shown">
      <motion.p className="scene-guess-question" variants={rise}>
        {scene.question}
      </motion.p>
      <motion.div className="scene-guess-choices" variants={rise}>
        {scene.choices.map((choice, index) => {
          const state = !revealed
            ? ""
            : index === scene.answer
              ? " is-answer"
              : index === picked
                ? " is-wrong"
                : " is-dimmed";
          return (
            <button
              key={choice}
              type="button"
              className={`scene-guess-choice${state}`}
              disabled={revealed}
              // stopPropagation : ce tap ne doit pas aussi faire avancer à la scène suivante
              onClick={(e) => {
                e.stopPropagation();
                setPicked(index);
              }}
            >
              {choice}
            </button>
          );
        })}
      </motion.div>
      {revealed && (
        <motion.p
          className="scene-guess-reveal"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {picked === scene.answer ? "Bien vu ! " : "Raté… "}
          {scene.reveal}
        </motion.p>
      )}
    </motion.div>
  );
};

// Type de scène → composant qui l'affiche
export const SCENE_COMPONENTS = {
  carton: CartonScene,
  number: NumberScene,
  posters: PostersScene,
  guess: GuessScene,
};

export { CartonScene };
