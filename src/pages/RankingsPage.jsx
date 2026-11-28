import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getRankings, deleteRanking } from "../services/lists";
import { useCachedData } from "../hooks/useCachedData";
import { timeAgo } from "../utils/timeAgo";
import NavBar from "../components/Common/NavBar";
import Loader from "../components/Common/Loader";
import ConfirmModal from "../components/Common/ConfirmModal";
import SwipeToDelete from "../components/Common/SwipeToDelete";
import "../styles/RankingsPage.css";

const MEDALS = ["🥇", "🥈", "🥉"];

// Les 3 premières affiches en éventail (ou l'initiale du titre s'il n'y a pas d'affiche)
const PodiumPreview = ({ films }) => (
  <div className="rankings-preview" aria-hidden="true">
    {films.slice(0, 3).map((film, index) => (
      <div key={film._id} className={`rankings-preview-poster rankings-preview-${index + 1}`}>
        {film.posterPath ? (
          <img src={`https://image.tmdb.org/t/p/w154${film.posterPath}`} alt="" loading="lazy" />
        ) : (
          <span>{film.title?.charAt(0)}</span>
        )}
      </div>
    ))}
  </div>
);

const RankingItem = ({ ranking, onDeleteRequest }) => {
  // Un film supprimé entre-temps disparaît du populate : on l'ignore
  const films = (ranking.films || []).filter(Boolean);
  const podium = films.slice(0, 3);

  return (
    <li className="rankings-item">
      {/* Glisser vers la gauche → demande de suppression (confirmée par la page) */}
      <SwipeToDelete onSwipe={() => onDeleteRequest(ranking)}>
        <Link to={`/tops/${ranking._id}`} className="rankings-item-content" draggable={false}>
          <PodiumPreview films={films} />
          <div className="rankings-text">
            <span className="rankings-title">{ranking.title}</span>
            <span className="rankings-meta">
              {films.length} film{films.length > 1 ? "s" : ""}
              {ranking.updatedAt && ` · modifié ${timeAgo(ranking.updatedAt)}`}
            </span>
            {podium.length > 0 && (
              <span className="rankings-podium">
                {podium.map((film, index) => `${MEDALS[index]} ${film.title}`).join("  ")}
              </span>
            )}
          </div>
        </Link>
      </SwipeToDelete>
    </li>
  );
};

const RankingsPage = () => {
  // Rechargé à chaque ouverture de la page (le cache sert juste à afficher tout de suite)
  const {
    data: rankings,
    setData,
    refresh,
    initialLoading,
    error,
  } = useCachedData("cinePocket_rankings", getRankings, []);

  // Top en attente de confirmation de suppression (null = pas de fenêtre ouverte)
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteRanking(toDelete._id);
      // On le retire tout de suite de l'écran, puis on resynchronise avec le serveur (et le cache)
      setData((prev) => (Array.isArray(prev) ? prev.filter((r) => r._id !== toDelete._id) : prev));
      setToDelete(null);
      refresh();
    } catch (err) {
      console.error(err.message);
      alert("Impossible de supprimer le top, réessaie plus tard.");
    } finally {
      setDeleting(false);
    }
  };

  const list = Array.isArray(rankings) ? rankings : [];

  return (
    <motion.div
      initial={{ opacity: 1, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 1, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <NavBar />
      <header className="rankings-header">
        <h1>Mes Tops</h1>
        {!initialLoading && <div className="list-count">({list.length})</div>}
      </header>

      {initialLoading ? (
        <Loader inline message="Chargement de tes tops…" />
      ) : error && list.length === 0 ? (
        <p className="rankings-empty">Impossible de charger tes tops.</p>
      ) : list.length === 0 ? (
        <div className="rankings-empty">
          <p>Aucun top pour l'instant.</p>
          <p>
            Filtre tes <Link to="/seenlist">films vus</Link> ou ta{" "}
            <Link to="/watchlist">watchlist</Link>, puis appuie sur « 🏆 Créer un top ».
          </p>
        </div>
      ) : (
        <ul className="rankings-list">
          {list.map((ranking) => (
            <RankingItem key={ranking._id} ranking={ranking} onDeleteRequest={setToDelete} />
          ))}
        </ul>
      )}

      <ConfirmModal
        isOpen={!!toDelete}
        title="Supprimer le top ?"
        message={`« ${toDelete?.title} » sera supprimé. Les films, eux, restent dans tes listes.`}
        confirmText={deleting ? "Suppression…" : "Supprimer"}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </motion.div>
  );
};

export default RankingsPage;
