import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import usePersistentFilters from "../hooks/usePersistentFilters";
import { useCachedData } from "../hooks/useCachedData";
import { getSeenlist, getWatchlist, createRanking, updateRanking } from "../services/lists";
import { filterFilms } from "../utils/listFilters";
import BackButton from "../components/Common/BackButton";
import Loader from "../components/Common/Loader";
import RankingEditor from "../components/Ranking/RankingEditor";
import "../styles/RankingCreatePage.css";

// Même cache que les pages Films vus / Watchlist : pas de rechargement si la liste est déjà connue
const SOURCES = {
  seenlist: { cacheKey: "cinePocket_seenlist", fetcher: getSeenlist },
  watchlist: { cacheKey: "cinePocket_watchlist", fetcher: getWatchlist },
};

const DEFAULT_TITLE = "Nouveau top";

// Mélange de Fisher-Yates : ordre de départ aléatoire, pour ne pas influencer le classement
const shuffle = (items) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const RankingCreatePage = () => {
  const [searchParams] = useSearchParams();
  const sourceKey = SOURCES[searchParams.get("from")] ? searchParams.get("from") : "seenlist";
  const { cacheKey, fetcher } = SOURCES[sourceKey];
  const { data, initialLoading } = useCachedData(cacheKey, fetcher, { films: [] });
  const { filters } = usePersistentFilters();

  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [ranking, setRanking] = useState([]);
  const initialized = useRef(false);

  // Enregistrement : id du classement une fois créé, et dernier état enregistré
  // (pour savoir s'il y a des changements à enregistrer)
  const [savedId, setSavedId] = useState(null);
  const [savedSnapshot, setSavedSnapshot] = useState(null);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | error

  const payload = useMemo(
    () => ({ title: title.trim() || DEFAULT_TITLE, films: ranking.map((film) => film._id) }),
    [title, ranking]
  );
  const snapshot = JSON.stringify(payload);
  const isDirty = snapshot !== savedSnapshot;

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const saved = savedId
        ? await updateRanking(savedId, payload)
        : await createRanking(payload);
      setSavedId(saved._id);
      setSavedSnapshot(snapshot);
      setSaveStatus("idle");
    } catch (error) {
      console.error(error);
      setSaveStatus("error");
    }
  };

  const saveLabel =
    saveStatus === "saving"
      ? "Enregistrement…"
      : !isDirty
        ? "✓ Top enregistré"
        : savedId
          ? "Enregistrer les modifications"
          : "Enregistrer le top";

  // Les films filtrés, mélangés une seule fois : une mise à jour de la liste en arrière-plan
  // ne doit pas défaire le classement en cours
  useEffect(() => {
    if (initialLoading || initialized.current) return;
    initialized.current = true;
    setRanking(shuffle(filterFilms(data?.films, filters)));
  }, [initialLoading, data, filters]);

  return (
    <div className="ranking-page">
      <BackButton />

      {initialLoading ? (
        <Loader inline message="Chargement des films…" />
      ) : ranking.length < 2 ? (
        <p className="ranking-empty">Il faut au moins deux films pour faire un top.</p>
      ) : (
        <>
          <RankingEditor
            title={title}
            onTitleChange={setTitle}
            defaultTitle={DEFAULT_TITLE}
            films={ranking}
            onReorder={setRanking}
          />

          {/* Barre collée en bas : le bouton reste accessible quelle que soit la longueur du classement */}
          <div className="ranking-save-bar">
            {saveStatus === "error" && (
              <p className="ranking-save-error" role="alert">
                L'enregistrement a échoué, réessaie.
              </p>
            )}
            <button
              type="button"
              className={`ranking-save-button${!isDirty ? " is-saved" : ""}`}
              onClick={handleSave}
              disabled={!isDirty || saveStatus === "saving"}
            >
              {saveLabel}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RankingCreatePage;
