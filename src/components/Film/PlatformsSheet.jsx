import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { PLATFORMS, NO_DISPO } from "../../constants/platforms";
import "./PlatformsSheet.css";

// Panneau qui monte du bas de l'écran pour choisir les dispos d'un film.
// Chaque pastille se (dé)sélectionne d'un tap ; « Indisponible » est exclusif.
// Fermeture : bouton « Terminé », tap sur le fond, ou glisser le panneau vers le bas.
const PlatformsSheet = ({ open, title, selected, onToggle, onClose }) => {
  const isSelected = (platform) => selected.some((p) => p.id === platform.id);

  // Pas de scroll de la page derrière le panneau
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const handleDragEnd = (_event, info) => {
    if (info.offset.y > 100 || info.velocity.y > 500) onClose();
  };

  const renderChip = (platform, extraClass = "") => {
    const active = isSelected(platform);
    return (
      <button
        key={platform.id}
        type="button"
        className={`platform-chip${active ? " is-selected" : ""} ${extraClass}`}
        aria-pressed={active}
        onClick={() => onToggle(platform)}
      >
        {active && <FiCheck className="platform-chip-check" aria-hidden="true" />}
        {platform.label}
      </button>
    );
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="platforms-backdrop"
          className="platforms-sheet-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="platforms-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={`Dispo de ${title}`}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 1 }}
            onDragEnd={handleDragEnd}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="platforms-sheet-handle" aria-hidden="true" />

            <div className="platforms-sheet-header">
              <span className="platforms-sheet-title">Dispo sur…</span>
              {title && <span className="platforms-sheet-film">{title}</span>}
            </div>

            <div className="platforms-sheet-chips">
              {PLATFORMS.map((platform) => renderChip(platform))}
            </div>

            <div className="platforms-sheet-separator">ou</div>
            <div className="platforms-sheet-chips">
              {renderChip(NO_DISPO, "platform-chip-none")}
            </div>

            <button type="button" className="platforms-sheet-done" onClick={onClose}>
              Terminé
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default PlatformsSheet;
