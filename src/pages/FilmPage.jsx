import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const title = location.state?.title;


  useEffect(() => {
    getFilmBySlug(slug)
      .then(setFilm)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p>Chargement...</p>;


  return (
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
      
      <FilmInfos title={title} filmId={film._id} director={film.director} actors={film.actors} />
      </div>
      </div>
      )}
    </div>
  );
}

export default FilmPage;
