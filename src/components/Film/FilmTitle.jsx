import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheck, FiX } from "react-icons/fi";
import { useToast } from "../../context/ToastContext";
import { updateFilmTitle } from "../../services/films";
import { useLongPress } from "../../hooks/useLongPress";
import "./FilmTitle.css";

// Durée de l'appui prolongé avant de passer en mode édition
const LONG_PRESS_MS = 600;

// Titre du film, renommable par appui prolongé (un simple tap ne fait rien)
const FilmTitle = ({ film, onFilmUpdated }) => {
  const navigate = useNavigate();
  const toast = useToast();

  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(film.title || "");
  const [saving, setSaving] = useState(false);

  const inputRef = useRef(null);

  const { pressing, handlers: longPressHandlers } = useLongPress({
    delay: LONG_PRESS_MS,
    disabled: !film._id,
    onLongPress: () => {
      setValue(film.title || "");
      setEditing(true);
    },
  });

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const exitEditing = () => {
    setEditing(false);
    setValue(film.title || "");
  };

  const save = async () => {
    const newTitle = value.trim();
    if (!newTitle || newTitle === film.title) {
      exitEditing();
      return;
    }
    setSaving(true);
    try {
      const { film: updatedFilm } = await updateFilmTitle(film._id, newTitle);
      onFilmUpdated(updatedFilm);
      setEditing(false);
      toast({ message: "Film renommé", type: "success" });
      // Les listes ouvertes se rechargent avec le nouveau titre
      window.dispatchEvent(new Event("watchlistUpdated"));
      window.dispatchEvent(new Event("seenlistUpdated"));
      // Le slug a changé : on met l'URL à jour sans ajouter d'entrée dans l'historique
      if (updatedFilm.slug !== film.slug) {
        navigate(`/films/${updatedFilm.slug}`, {
          replace: true,
          state: { title: updatedFilm.title },
        });
      }
    } catch (error) {
      toast({ message: error.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      save();
    } else if (e.key === "Escape") {
      exitEditing();
    }
  };

  if (editing) {
    return (
      <div className="film-title-edit">
        <input
          ref={inputRef}
          className="film-title-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={saving}
          enterKeyHint="done"
          aria-label="Nouveau titre du film"
        />
        <div className="film-title-edit-actions">
          {/* onMouseDown preventDefault : garde le focus dans le champ au clic */}
          <button
            type="button"
            className="film-title-btn film-title-btn-cancel"
            onMouseDown={(e) => e.preventDefault()}
            onClick={exitEditing}
            disabled={saving}
            aria-label="Annuler"
          >
            <FiX />
          </button>
          <button
            type="button"
            className="film-title-btn film-title-btn-save"
            onMouseDown={(e) => e.preventDefault()}
            onClick={save}
            disabled={saving || !value.trim()}
            aria-label="Valider le nouveau titre"
          >
            <FiCheck />
          </button>
        </div>
      </div>
    );
  }

  return (
    <h1
      className={`film-title-text${pressing ? " is-pressing" : ""}`}
      {...longPressHandlers}
    >
      {film.title}
    </h1>
  );
};

export default FilmTitle;
