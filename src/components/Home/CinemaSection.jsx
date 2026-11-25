import React, { useEffect } from "react";
import Card from "../List/Card";
import { useCachedData } from "../../hooks/useCachedData";
import { getWatchlist } from "../../services/lists";
import "./CinemaSection.css";

const CINE_ID = "cine";

// « Allons au ciné » : les films de la watchlist dispo au cinéma, en rangée de cartes.
// Utilise le même cache que les pages Watchlist / Que regarder.
function CinemaSection() {
  const { data: watchlist, refresh } = useCachedData(
    "cinePocket_watchlist",
    getWatchlist,
    { films: [] }
  );

  // Dispos modifiées ailleurs dans l'app : on recharge
  useEffect(() => {
    window.addEventListener("watchlistUpdated", refresh);
    return () => window.removeEventListener("watchlistUpdated", refresh);
  }, [refresh]);

  const films = (watchlist?.films || []).filter((film) =>
    (film.platform || []).some((p) => p.id === CINE_ID)
  );

  // Rien à l'affiche : on n'affiche pas la section
  if (films.length === 0) return null;

  return (
    <section className="cinema-section">
      <h3>Allons au ciné</h3>
      <div className="cinema-row">
        {films.map((film) => (
          <Card key={film.slug} film={film} compact />
        ))}
      </div>
    </section>
  );
}

export default CinemaSection;
