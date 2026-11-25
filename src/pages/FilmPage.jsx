import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { useParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { getFilmBySlug } from "../services/films";
import FilmPlateforms from "../components/Film/FilmPlateforms";
import FilmInfos from "../components/Film/FilmInfos";
import FilmRecommendations from "../components/Film/FilmRecommendations";
import FilmTemplate from "../components/Film/FilmTemplate";
import DeleteFilmButton from "../components/Film/DeleteFilmButton";
import BackButton from "../components/Common/BackButton";
import Loader from "../components/Common/Loader";
import "../styles/FilmPage.css";

function FilmPage() {
  const { slug } = useParams();
  const [film, setFilm] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const location = useLocation();
  const title = location.state?.title;

  // Fonction pour récupérer les informations du film par son slug
  // et gérer l'état de chargement
useEffect(() => {
  const fetchFilm = async () => {
    try {
      setNotFound(false);
      const fetchedFilm = await getFilmBySlug(slug);
      setFilm(fetchedFilm);
    } catch (err) {
      console.error(err);
      setNotFound(true);
    }
  };

  fetchFilm();
}, [slug]);



  return (
    <motion.div
  initial={{ opacity: 1, x: 100 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 1, x: 100 }}
  transition={{ duration: 0.3 }}
>

    <div>
    {/* Pas encore chargé : retour + titre (si on le connaît déjà) + loader.
        Pas de boutons d'action tant que le film (et son id) n'est pas arrivé */}
    {!film && (
      <div className="film-loading">
        <div className="film-header">
          <BackButton />
        </div>
        {title && (
          <div className="film-title">
            <h1>{title}</h1>
          </div>
        )}
        {notFound ? (
          <p className="film-loading-error">Impossible de charger ce film.</p>
        ) : (
          <Loader inline message="Chargement du film…" />
        )}
      </div>
    )}
    {film && (
      <div>
      {/* Occupe au moins toute la hauteur de l'écran : le bouton de suppression
          est ainsi toujours juste sous le bas de l'écran, visible en scrollant un peu */}
      <div className="film-page-content">
      <FilmTemplate filmInfos={film} onFilmUpdated={setFilm}/>
      {film.status === "to watch" && (
        <FilmRecommendations filmId={film._id} filmTitle={film.title} recommendations={film.recommendations} />
      )}
      {film.status !== "watched" && (
        <FilmPlateforms filmId={film._id} title={film.title} platforms={film.platform} />
      )}

      <div className="film-info-review-section" >
        {film.shortReview && (
          <p className="film-short-review">{film.shortReview}</p>
        )}
        {film.longReview && (
          <p className="film-long-review">{film.longReview}</p>
        )}
      
      <FilmInfos title={film.title} filmId={film._id} infos={film} />
      </div>
      </div>

      <DeleteFilmButton slug={film.slug} title={film.title} />
      </div>
      )}
    </div>
    </motion.div>
  );
}

export default FilmPage;
