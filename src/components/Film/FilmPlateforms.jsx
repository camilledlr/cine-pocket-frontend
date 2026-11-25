import React, { useEffect, useRef, useState } from "react";
import { FiPlus, FiSlash } from "react-icons/fi";
import { FaPen } from "react-icons/fa";
import PlatformsSheet from "./PlatformsSheet";
import { useToast } from "../../context/ToastContext";
import { updateFilmPlatforms } from "../../services/films";
import { NO_DISPO } from "../../constants/platforms";
import "./FilmPlateforms.css";

// On attend la fin d'une série de taps avant d'enregistrer
const SAVE_DELAY_MS = 600;

const samePlatforms = (a, b) =>
  a.length === b.length && a.every((p) => b.some((q) => q.id === p.id));

function FilmPlateforms({ title, filmId, platforms = [] }) {
  const toast = useToast();
  const [selected, setSelected] = useState(platforms);
  const [sheetOpen, setSheetOpen] = useState(false);

  const savedRef = useRef(platforms); // dernière valeur confirmée par le serveur
  const pendingRef = useRef(null); // valeur en attente d'envoi
  const saveTimerRef = useRef(null);

  // Le film est rechargé (autre film, retour sur la page…) : on repart des données reçues
  useEffect(() => {
    setSelected(platforms);
    savedRef.current = platforms;
  }, [platforms]);

  const persist = async (value) => {
    pendingRef.current = null;
    clearTimeout(saveTimerRef.current);
    if (samePlatforms(value, savedRef.current)) return;
    try {
      await updateFilmPlatforms(filmId, value);
      savedRef.current = value;
      // Les listes ouvertes (filtres par plateforme) se rechargent
      window.dispatchEvent(new Event("watchlistUpdated"));
    } catch (error) {
      toast({ message: error.message, type: "error" });
      setSelected(savedRef.current);
    }
  };

  const flush = () => {
    if (pendingRef.current) persist(pendingRef.current);
  };

  // Si on quitte la page avant la fin du délai, on enregistre quand même
  useEffect(
    () => () => {
      clearTimeout(saveTimerRef.current);
      if (pendingRef.current) persist(pendingRef.current);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleToggle = (platform) => {
    const isSelected = selected.some((p) => p.id === platform.id);
    let next;
    if (isSelected) {
      next = selected.filter((p) => p.id !== platform.id);
    } else if (platform.id === NO_DISPO.id) {
      // « Indisponible » remplace toutes les plateformes
      next = [NO_DISPO];
    } else {
      // Choisir une plateforme retire « Indisponible »
      next = [...selected.filter((p) => p.id !== NO_DISPO.id), platform];
    }
    setSelected(next);
    pendingRef.current = next;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => persist(next), SAVE_DELAY_MS);
  };

  const handleClose = () => {
    setSheetOpen(false);
    flush();
  };

  const isUnavailable = selected.some((p) => p.id === NO_DISPO.id);
  const platformsToShow = selected.filter((p) => p.id !== NO_DISPO.id);
  const isEmpty = selected.length === 0;

  return (
    <section className="film-dispo" aria-labelledby="film-dispo-title">
      <h3 id="film-dispo-title" className="film-section-title">Dispo sur</h3>

      {/* Tout le bloc ouvre le panneau d'édition */}
      <button
        type="button"
        className={`film-dispo-body${isEmpty ? " is-empty" : ""}`}
        onClick={() => setSheetOpen(true)}
      >
        {isEmpty && (
          <span className="film-dispo-add">
            <FiPlus aria-hidden="true" /> Ajouter une dispo
          </span>
        )}

        {!isEmpty && (
          <span className="film-dispo-chips">
            {isUnavailable && (
              <span className="film-dispo-none">
                <FiSlash aria-hidden="true" /> Indisponible pour l'instant
              </span>
            )}
            {platformsToShow.map((platform) => (
              <span key={platform.id} className="film-dispo-chip">
                {platform.label}
              </span>
            ))}
            {/* Indice discret : petit crayon au bout de la ligne, texte réservé aux lecteurs d'écran */}
            <span className="film-dispo-edit">
              <FaPen aria-hidden="true" />
              <span className="visually-hidden">Modifier</span>
            </span>
          </span>
        )}
      </button>

      <PlatformsSheet
        open={sheetOpen}
        title={title}
        selected={selected}
        onToggle={handleToggle}
        onClose={handleClose}
      />
    </section>
  );
}

export default FilmPlateforms;
