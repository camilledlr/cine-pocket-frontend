import React from "react";
import { Reorder, useDragControls } from "framer-motion";
import { MdDragIndicator } from "react-icons/md";
import FilmRating from "../Film/FilmRating";
import "./RankingEditor.css";

// Une ligne du classement. On ne la déplace qu'avec la poignée,
// pour que le reste de la ligne laisse défiler la page au doigt.
const RankingRow = ({ film, rank }) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={film}
      dragListener={false}
      dragControls={dragControls}
      className="ranking-row"
      whileDrag={{ scale: 1.03, boxShadow: "0 8px 20px rgba(31, 54, 84, 0.2)" }}
    >
      <span className={`ranking-rank${rank <= 3 ? ` ranking-rank-${rank}` : ""}`}>{rank}</span>
      <span className="ranking-title">{film.title}</span>
      <FilmRating rating={film.rating || "?"} size="medium" />
      <button
        type="button"
        className="ranking-handle"
        aria-label={`Déplacer ${film.title}`}
        onPointerDown={(e) => dragControls.start(e)}
      >
        <MdDragIndicator />
      </button>
    </Reorder.Item>
  );
};

// Éditeur de top, partagé par la création et la modification :
// - titre modifiable (champ qui ressemble à un titre)
// - films réordonnables au glisser-déposer, avec leur numéro
// Composant « contrôlé » : il n'a pas d'état à lui, la page lui donne les valeurs
// (title, films) et est prévenue des changements (onTitleChange, onReorder).
const RankingEditor = ({ title, onTitleChange, defaultTitle, films, onReorder }) => (
  <>
    <input
      className="ranking-name"
      value={title}
      onChange={(e) => onTitleChange(e.target.value)}
      onFocus={(e) => e.target.select()}
      // Titre vidé : on remet le titre par défaut plutôt qu'un top sans nom
      onBlur={() => !title.trim() && onTitleChange(defaultTitle)}
      onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
      aria-label="Nom du top"
      maxLength={80}
    />
    <p className="ranking-hint">
      {films.length} films · fais glisser <MdDragIndicator aria-hidden="true" /> pour classer
    </p>
    <Reorder.Group axis="y" values={films} onReorder={onReorder} className="ranking-list">
      {films.map((film, index) => (
        <RankingRow key={film._id || film.slug} film={film} rank={index + 1} />
      ))}
    </Reorder.Group>
  </>
);

export default RankingEditor;
