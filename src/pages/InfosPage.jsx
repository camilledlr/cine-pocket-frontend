import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { useLoading } from "../context/LoadingContext";
import Modale from "../components/Common/Modale";
import { updateFilmInfos, getFilmById } from "../services/films";
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
  const [origin, setOrigin] = useState(null);
  const [actors, setActors] = useState(null);

  useEffect(() => {
  const fetchFilm = async () => {
    try {
      const fetchedFilm = await getFilmById(filmId);
      setFilm(fetchedFilm);
      setDirector(fetchedFilm.director || null);
      setOrigin(fetchedFilm.origin || null);
      setActors((fetchedFilm.actors || []).join(", "));
    } catch (err) {
      console.error(err);
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
      const result = await updateFilmInfos(filmId, {
        director: data.director,
        actors: parseCommaSeparated(data.actors),
        origin: data.origin,
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
    <motion.div
    initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 0 }}
      transition={{ duration: 0.3 }}
    >
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
          <Input
            value={origin}
            label="de"
            inputId="origin"
            placeholder="un pays de cinéma..."
            onChange={(val) => setOrigin(val)}
          />
        </Form>
      </Modale>
    </div>
    </motion.div>
  );
};

export default InfosPage;
