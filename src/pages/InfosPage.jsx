import { useEffect, useState } from "react";
import { useLoading } from "../context/LoadingContext";
import Modale from "../components/Common/Modale";
import { updateFilmCrew, getFilmById } from "../services/films";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Input from "../components/Common/Input";
import Form from "../components/Common/Form";

const InfosPage = () => {
  const location = useLocation();
  const title = location.state?.title;
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { filmId } = useParams();
  const [film, setFilm] = useState(null);
  const [director, setDirector] = useState(null);
  const [actors, setActors] = useState(null);

  useEffect(() => {
    const fetchFilm = async () => {
      setLoading(true);
      const MIN_DELAY = 500;
      const delay = new Promise((res) => setTimeout(res, MIN_DELAY));

      try {
        const [fetchedFilm] = await Promise.all([getFilmById(filmId), delay]);

        setFilm(fetchedFilm);
        setDirector(fetchedFilm.director || null);
        setActors((fetchedFilm.actors || []).join(", "));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilm();
  }, [filmId]);

  function parseCommaSeparated(text) {
    if (!text) return [];
    return text
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  const handleUpdate = async (data) => {
    try {
      const result = await updateFilmCrew(filmId, {
        director: data.director,
        actors: parseCommaSeparated(data.actors),
      });
      if (result && result.message) {
        setTimeout(() => navigate(-1), 500); // ← retour en arrière après 500ms
      }
      return {
        success: true,
        message: result.message || "✅ Recommandation ajoutée avec succès !",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "❌ Échec de l’ajout de la recommandation.",
      };
    }
  };

  return (
    <div>
      <Modale modaleTitle={title}>
        <Form onSubmit={handleUpdate}>
          <Input
            value={director}
            label="réalisé par"
            inputId="director"
            placeholder="un réal visionnaire ou pas..."
            onChange={(val) => setDirector(val)}
          />
          <Input
            value={actors}
            label="avec"
            inputId="actors"
            placeholder="des acteurs marquants..."
            onChange={(val) => setActors(val)}
          />
        </Form>
      </Modale>
    </div>
  );
};

export default InfosPage;
