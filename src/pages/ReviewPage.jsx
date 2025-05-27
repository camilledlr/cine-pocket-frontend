import { useEffect, useState } from "react";
import Modale from "../components/Common/Modale";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { updateFilmReview, getFilmById } from "../services/films";
import Input from "../components/Common/Input";
import FilmRating from "../components/Film/FilmRating";
import Form from "../components/Common/Form";

const ReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { filmId } = useParams();
  const title = location.state?.title;
  const [film, setFilm] = useState(null);
  const [prevShortReview, setPrevShortReview] = useState(null);
  const [prevLongReview, setPrevLongReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFilmById(filmId)
      .then((fetchedFilm) => {
      setFilm(fetchedFilm);
      setRating(fetchedFilm.rating || 0);
      setPrevLongReview(fetchedFilm.longReview || null);
      setPrevShortReview(fetchedFilm.shortReview || null);
    })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [filmId]);

  const handleSubmitReview = async (data) => {
    try {
      const result = await updateFilmReview(filmId, {
        shortReview: data.shortReview,
        longReview: data.longReview,
        rating: data.rating,
      });
      if (result && result.message) {
        setTimeout(() => navigate(-1), 500); // ← retour en arrière après 500ms
      }
      return {
        success: true,
        message: result.message || "Dispo modifiée avec succès !",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Échec de la modif de la review.",
      };
    }
  };
  if (loading) return <p>Chargement...</p>;
  return (
    <div>
      <Modale modaleTitle={title}>
        <Form onSubmit={handleSubmitReview}>
          <FilmRating
            rating={rating}
            editable={true}
            size="xlarge"
            onChange={(val) => setRating(val)}
          />
          <Input value={prevShortReview} inputId="shortReview" placeholder="En Bref" onChange={(val) => setPrevShortReview(val)}/>
          <Input textarea value={prevLongReview} inputId="longReview" placeholder="En long et en large" onChange={(val) => setPrevLongReview(val)} />
        </Form>
      </Modale>
    </div>
  );
};

export default ReviewPage;
