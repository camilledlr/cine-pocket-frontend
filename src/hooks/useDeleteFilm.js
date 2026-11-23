import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { deleteFilm } from "../services/films";

export const useDeleteFilm = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const removeFilm = async ({ slug, title }) => {
    setDeleting(true);
    try {
      await deleteFilm(slug);

      toast({ message: `« ${title} » a été supprimé`, type: "success" });
      // Les listes ouvertes se rechargent
      window.dispatchEvent(new Event("watchlistUpdated"));
      window.dispatchEvent(new Event("seenlistUpdated"));

      // Retour à la page précédente (en général la liste d'où on vient).
      // Si on est arrivé directement sur la page film (pas d'historique), on va à l'accueil.
      const hasHistory = (window.history.state?.idx ?? 0) > 0;
      if (hasHistory) {
        navigate(-1);
      } else {
        navigate("/", { replace: true });
      }
      return true;
    } catch (error) {
      toast({ message: error.message, type: "error" });
      setDeleting(false);
      return false;
    }
  };

  return { removeFilm, deleting };
};
