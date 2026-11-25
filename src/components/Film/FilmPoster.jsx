import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./FilmPoster.css";

const TMDB_IMG = "https://image.tmdb.org/t/p";

// Aperçu de l'affiche sur la page film : vignette (posée sur le bandeau FilmBackdrop) ;
// un tap l'ouvre en grand (transition partagée), un tap la referme.
const FilmPoster = ({ posterPath, title }) => {
  const [open, setOpen] = useState(false);

  // Échap ferme l'aperçu ; pas de scroll de la page derrière
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!posterPath) return null;

  const thumbUrl = `${TMDB_IMG}/w342${posterPath}`;
  const fullUrl = `${TMDB_IMG}/w780${posterPath}`;
  const layoutId = `film-poster-${posterPath}`;

  return (
    <div className="film-poster">
      <button
        type="button"
        className="film-poster-button"
        onClick={() => setOpen(true)}
        aria-label={`Agrandir l'affiche de ${title}`}
      >
        <motion.img
          layoutId={layoutId}
          src={thumbUrl}
          alt={`Affiche de ${title}`}
          className="film-poster-thumb"
          // Masquée pendant l'aperçu : c'est la version agrandie qui « vole » à l'écran
          style={{ visibility: open ? "hidden" : "visible" }}
        />
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="film-poster-lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-label={`Affiche de ${title}`}
            >
              <motion.img
                layoutId={layoutId}
                src={fullUrl}
                alt={`Affiche de ${title}`}
                className="film-poster-full"
                transition={{ type: "spring", damping: 28, stiffness: 260 }}
              />
              <span className="film-poster-hint">Touche pour fermer</span>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default FilmPoster;
