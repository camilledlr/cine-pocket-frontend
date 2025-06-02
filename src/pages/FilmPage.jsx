import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { useLoading } from "../context/LoadingContext";
import { useParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { getFilmBySlug } from "../services/films";
import FilmPlateforms from "../components/Film/FilmPlateforms";
import FilmInfos from "../components/Film/FilmInfos";
import FilmRecommendations from "../components/Film/FilmRecommendations";
import FilmTemplate from "../components/Film/FilmTemplate";
import SkeletonText from "../components/Common/SkeletonText";
import "../styles/FilmPage.css";

function FilmPage() {
  const { slug } = useParams();
  const [film, setFilm] = useState(null);
   const { setLoading } = useLoading();
  const location = useLocation();
  const title = location.state?.title;

  // Fonction pour récupérer les informations du film par son slug
  // et gérer l'état de chargement
useEffect(() => {
  const fetchFilm = async () => {
    try {
      const fetchedFilm = await getFilmBySlug(slug);
      setFilm(fetchedFilm);
    } catch (err) {
      console.error(err);
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
    {!film && <FilmTemplate filmInfos={{title : title, slug}} onFilmUpdated={setFilm}/> }
    {film && (
      <div>
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
      
      <FilmInfos title={title} filmId={film._id}  infos={film} />
      </div>
      </div>
      )}
    </div>
    </motion.div>
  );
}

export default FilmPage;
