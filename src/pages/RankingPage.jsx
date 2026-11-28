import React, { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getRanking, updateRanking } from "../services/lists";
import { useCachedData } from "../hooks/useCachedData";
import { timeAgo } from "../utils/timeAgo";
import BackButton from "../components/Common/BackButton";
import Loader from "../components/Common/Loader";
import FilmRating from "../components/Film/FilmRating";
import RankingEditor from "../components/Ranking/RankingEditor";
import "../styles/RankingPage.css";

const TMDB_POSTER = "https://image.tmdb.org/t/p/w342";

// Une marche du podium : affiche, numéro, titre et note. Cliquable vers la fiche du film.
const PodiumStep = ({ film, rank }) => (
  <Link to={`/films/${film.slug}`} className={`podium-step podium-step-${rank}`}>
    <div className="podium-poster">
      {film.posterPath ? (
        <img src={`${TMDB_POSTER}${film.posterPath}`} alt="" loading="lazy" />
      ) : (
        <span className="podium-poster-fallback">{film.title?.charAt(0)}</span>
      )}
      <span className="podium-rank">{rank}</span>
    </div>
    <span className="podium-title">{film.title}</span>
    {film.rating && <span className="podium-rating">{film.rating}/10</span>}
  </Link>
);

// Affichage du top : podium (3 premiers) puis liste numérotée
const RankingView = ({ films }) => {
  // Ordre d'affichage du podium : 2e à gauche, 1er au centre, 3e à droite
  const podium = [
    films[1] && { film: films[1], rank: 2 },
    films[0] && { film: films[0], rank: 1 },
    films[2] && { film: films[2], rank: 3 },
  ].filter(Boolean);
  const rest = films.slice(3);

  return (
    <>
      {podium.length > 0 && (
        <div className="podium">
          {podium.map(({ film, rank }) => (
            <PodiumStep key={film._id} film={film} rank={rank} />
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <ol className="ranking-view-list" start={4}>
          {rest.map((film, index) => (
            <li key={film._id}>
              <Link to={`/films/${film.slug}`} className="ranking-view-row">
                <span className="ranking-view-rank">{index + 4}</span>
                <span className="ranking-view-title">{film.title}</span>
                <FilmRating rating={film.rating || "?"} size="medium" />
              </Link>
            </li>
          ))}
        </ol>
      )}
    </>
  );
};

const RankingPage = () => {
  const { id } = useParams();

  // useCallback : la fonction garde la même identité tant que l'id ne change pas,
  // sinon useCachedData relancerait le chargement à chaque affichage
  const fetchRanking = useCallback(() => getRanking(id), [id]);
  const {
    data: ranking,
    setData,
    refresh,
    initialLoading,
    error,
  } = useCachedData(`cinePocket_top_${id}`, fetchRanking, null);

  // Mode modification : brouillon du titre et de l'ordre, séparé du top affiché.
  // Tant qu'on n'enregistre pas, le top lui-même ne change pas (« Annuler » = on jette le brouillon).
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftFilms, setDraftFilms] = useState([]);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | error

  // Un film supprimé entre-temps disparaît du populate : on l'ignore
  const films = (ranking?.films || []).filter(Boolean);

  const startEditing = () => {
    setDraftTitle(ranking.title);
    setDraftFilms(films);
    setSaveStatus("idle");
    setEditing(true);
  };

  // Quelque chose a changé par rapport au top enregistré ?
  const isDirty =
    draftTitle.trim() !== ranking?.title ||
    draftFilms.some((film, index) => film._id !== films[index]?._id);

  const handleSave = async () => {
    const title = draftTitle.trim() || ranking.title;
    setSaveStatus("saving");
    try {
      const saved = await updateRanking(id, { title, films: draftFilms.map((film) => film._id) });
      // Le serveur renvoie les films sous forme d'id : on garde nos films complets, dans le nouvel ordre
      setData({ ...ranking, title, films: draftFilms, updatedAt: saved.updatedAt });
      setEditing(false);
      setSaveStatus("idle");
      refresh(); // resynchronise avec le serveur et met à jour le cache local
    } catch (err) {
      console.error(err.message);
      setSaveStatus("error");
    }
  };

  if (initialLoading) {
    return (
      <div className="ranking-view">
        <BackButton />
        <Loader inline message="Chargement du top…" />
      </div>
    );
  }

  if (!ranking) {
    return (
      <div className="ranking-view">
        <BackButton />
        <p className="ranking-view-empty">
          {error?.status === 404 ? "Ce top n'existe plus." : "Impossible de charger ce top."}
        </p>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="ranking-view is-editing">
        <RankingEditor
          title={draftTitle}
          onTitleChange={setDraftTitle}
          defaultTitle={ranking.title}
          films={draftFilms}
          onReorder={setDraftFilms}
        />

        <div className="ranking-save-bar">
          {saveStatus === "error" && (
            <p className="ranking-save-error" role="alert">
              L'enregistrement a échoué, réessaie.
            </p>
          )}
          <div className="ranking-save-actions">
            <button
              type="button"
              className="ranking-cancel-button"
              onClick={() => setEditing(false)}
              disabled={saveStatus === "saving"}
            >
              Annuler
            </button>
            <button
              type="button"
              className="ranking-save-button"
              onClick={handleSave}
              disabled={!isDirty || saveStatus === "saving"}
            >
              {saveStatus === "saving" ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ranking-view">
      <BackButton />
      <header className="ranking-view-header">
        <h1>{ranking.title}</h1>
        <span className="ranking-view-meta">
          {films.length} film{films.length > 1 ? "s" : ""}
          {ranking.updatedAt && ` · modifié ${timeAgo(ranking.updatedAt)}`}
        </span>
        {films.length > 0 && (
          <button type="button" className="ranking-edit-button" onClick={startEditing}>
            ✎ Modifier
          </button>
        )}
      </header>

      <RankingView films={films} />
    </div>
  );
};

export default RankingPage;
