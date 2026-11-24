import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useToast } from "../../context/ToastContext";
import { useLongPress } from "../../hooks/useLongPress";
import { updateFilmTearsLevel } from "../../services/films";
import FilmTearsRain from "./FilmTearsRain";
import "./FilmTears.css";

const MAX_LEVEL = 5;
export const TEARS_LABELS = {
  1: "Juste une poussière dans l'œil",
  2: "Une petite larme",
  3: "Sortez les mouchoirs",
  4: "Comme une madeleine",
  5: "Comme un gros bébé",
};
// On attend que l'utilisateur ait fini de taper avant d'enregistrer
const SAVE_DELAY_MS = 700;

// Le réservoir d'eau (utilisé en petit dans la ligne et en grand au centre de l'écran)
const TearsTank = ({ level, className = "", buttonRef, style, ...props }) => (
  <button
    ref={buttonRef}
    type="button" /* ne pas soumettre le formulaire de review */
    className={`film-tears-button${level !== null ? " is-active" : ""} ${className}`}
    style={{ "--tears-level": level || 0, ...style }}
    {...props}
  >
    {/* L'eau monte de 20 % par niveau et se vide quand on coupe */}
    <span className="film-tears-water" aria-hidden="true">
      <svg className="tears-wave tears-wave-back" viewBox="0 0 200 20" preserveAspectRatio="none">
        <path d="M0 10 Q25 0 50 10 T100 10 T150 10 T200 10 V20 H0 Z" />
      </svg>
      <svg className="tears-wave tears-wave-front" viewBox="0 0 200 20" preserveAspectRatio="none">
        <path d="M0 10 Q25 20 50 10 T100 10 T150 10 T200 10 V20 H0 Z" />
      </svg>
    </span>
    <span className="film-tears-icon">💧</span>
  </button>
);

// A'larmes : un tap sur le petit bouton déclenche l'alarme et ouvre un grand réservoir
// au centre de l'écran. Là, chaque tap monte d'un niveau (1 → 5), un appui prolongé coupe.
// Enregistré directement via sa propre route, indépendamment du formulaire de review.
const FilmTears = ({ filmId, initialLevel = null }) => {
  const toast = useToast();
  const [level, setLevel] = useState(initialLevel);
  const [maxed, setMaxed] = useState(false); // petite secousse quand on tape au-delà de 5
  const [bursts, setBursts] = useState([]); // averses de larmes en cours sur l'écran
  const [open, setOpen] = useState(false); // vue plein écran avec le grand réservoir
  const [closing, setClosing] = useState(false);
  const [zoomFrom, setZoomFrom] = useState(null); // position du petit bouton, pour l'effet de zoom

  const smallRef = useRef(null);
  const bigRef = useRef(null);

  const savedLevelRef = useRef(initialLevel); // dernière valeur confirmée par le serveur
  const pendingRef = useRef(undefined); // valeur en attente d'envoi
  const saveTimerRef = useRef(null);

  const persist = async (value) => {
    pendingRef.current = undefined;
    if (value === savedLevelRef.current) return;
    try {
      await updateFilmTearsLevel(filmId, value);
      savedLevelRef.current = value;
    } catch (error) {
      toast({ message: error.message, type: "error" });
      setLevel(savedLevelRef.current);
    }
  };

  const scheduleSave = (value) => {
    pendingRef.current = value;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => persist(value), SAVE_DELAY_MS);
  };

  // Si on quitte la page avant la fin du délai, on enregistre quand même
  useEffect(
    () => () => {
      clearTimeout(saveTimerRef.current);
      if (pendingRef.current !== undefined) persist(pendingRef.current);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const increase = () => {
    if (level === MAX_LEVEL) {
      setMaxed(true);
      setTimeout(() => setMaxed(false), 400);
      return;
    }
    const next = (level || 0) + 1;
    setLevel(next);
    scheduleSave(next);
    launchRain(next);
  };

  const launchRain = (lvl) => {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    const id = Date.now() + Math.random();
    setBursts((prev) => [...prev, { id, level: lvl }]);
    // On laisse le temps à l'averse (et à l'inondation au niveau max) de se terminer
    setTimeout(
      () => setBursts((prev) => prev.filter((b) => b.id !== id)),
      lvl === MAX_LEVEL ? 3600 : 2600
    );
  };

  const cut = () => {
    if (level === null) return;
    setLevel(null);
    clearTimeout(saveTimerRef.current);
    persist(null);
    toast({ message: "Alarme coupée", type: "success" });
  };

  const openOverlay = () => {
    // Le grand réservoir part de la position du petit bouton pour venir au centre
    const rect = smallRef.current?.getBoundingClientRect();
    if (rect) {
      setZoomFrom({
        x: rect.left + rect.width / 2 - window.innerWidth / 2,
        y: rect.top + rect.height / 2 - window.innerHeight / 2,
        width: rect.width,
      });
    }
    setClosing(false);
    setOpen(true);
  };

  const closeOverlay = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 250);
  };

  // Seul le grand réservoir (vue plein écran) modifie le niveau
  const big = useLongPress({ onTap: increase, onLongPress: cut });

  // Vue plein écran : focus sur le grand réservoir, pas de scroll derrière.
  // On ne la ferme qu'avec le bouton « Terminé ».
  useEffect(() => {
    if (!open) return;
    bigRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const active = level !== null;
  const bigSize = Math.min(window.innerWidth * 0.6, 256); // px, = taille CSS du grand réservoir

  return (
    <div className="film-tears">
      <TearsTank
        level={level}
        buttonRef={smallRef}
        // Petit bouton : ouvre seulement la vue plein écran, sans toucher au niveau
        onClick={openOverlay}
        onContextMenu={(e) => e.preventDefault()}
        aria-label={
          active
            ? `A'larmes niveau ${level} sur ${MAX_LEVEL} : ${TEARS_LABELS[level]}. Toucher pour modifier.`
            : "A'larmes : toucher si le film t'a fait pleurer"
        }
      />

      <span className="film-tears-name">A'larmes</span>
      {active && (
        <>
          <span className="film-tears-label">
            <strong>Niv. {level}</strong> · {TEARS_LABELS[level]}
          </span>
        </>
      )}

      {open &&
        createPortal(
          <div
            className={`tears-overlay${closing ? " is-closing" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label="A'larmes"
          >
            <span className="tears-overlay-name">A'larmes</span>

            {/* Le réservoir grandit depuis la position du petit bouton jusqu'au centre */}
            <div
              className="tears-overlay-tank"
              style={
                zoomFrom
                  ? {
                      "--zoom-x": `${zoomFrom.x}px`,
                      "--zoom-y": `${zoomFrom.y}px`,
                      "--zoom-scale": zoomFrom.width / bigSize,
                    }
                  : undefined
              }
            >
              <TearsTank
                level={level}
                buttonRef={bigRef}
                className={[
                  "film-tears-button-big",
                  big.pressing && "is-pressing",
                  maxed && "is-maxed",
                ]
                  .filter(Boolean)
                  .join(" ")}
                {...big.handlers}
                onClick={(e) => e.detail === 0 && increase()}
                onKeyDown={(e) => {
                  if (e.key === "Delete" || e.key === "Backspace") cut();
                }}
                aria-label={
                  active
                    ? `Niveau ${level} sur ${MAX_LEVEL} : ${TEARS_LABELS[level]}. Toucher pour augmenter, appui long pour couper.`
                    : "Toucher pour déclencher l'alarme"
                }
              />
            </div>

            <div className="tears-overlay-info" aria-live="polite">
              {active && (
                <>
                  <strong className="tears-overlay-level">Niv. {level}</strong>
                  <span className="tears-overlay-label">{TEARS_LABELS[level]}</span>
                </>
              )}
            </div>
            <span className="tears-overlay-hint">
              Tape pour monter · Appui long pour couper
            </span>
            <button type="button" className="tears-overlay-done" onClick={closeOverlay}>
              Terminé
            </button>
          </div>,
          document.body
        )}

      {bursts.map((b) => (
        <FilmTearsRain key={b.id} level={b.level} />
      ))}
    </div>
  );
};

export default FilmTears;
