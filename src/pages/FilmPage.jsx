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
        // setLoading(true);
        const MIN_DELAY = 0;
        const delay = new Promise((res) => setTimeout(res, MIN_DELAY));
  
        try {
          const [fetchedFilm] = await Promise.all([getFilmBySlug(slug), delay]);
          setFilm(fetchedFilm);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchFilm();
    }, [slug]);



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
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
