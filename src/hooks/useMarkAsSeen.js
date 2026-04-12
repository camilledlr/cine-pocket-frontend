import { useToast } from "../context/ToastContext";
import { markFilmAsSeen } from "../services/films"; // à créer si non existant
import { useNavigate } from "react-router-dom";

export const useMarkAsSeen = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const markAsSeen = async (filmId) => {
    try {
      const result = await markFilmAsSeen(filmId);

      if (result?.film) {
        toast({
          message: "Film marqué comme vu !",
          type: "success",
          actionLabel : "Ajoter une review",
          onAction : () => navigate(`/films/review/${filmId}`),
        });
        const year = new Date().getFullYear();
        window.dispatchEvent(new CustomEvent('filmMarkedAsSeen', { detail: { year } }));
        window.dispatchEvent(new Event('watchlistUpdated'));
        window.dispatchEvent(new Event('seenlistUpdated'));
        return result.film;
      } else {
        toast({
          message: result?.error || "Impossible de marquer le film comme vu.",
          type: "error",
        });
        return null;
      }
    } catch (error) {
      toast({
        message: `Erreur réseau : ${error.message}`,
        type: "error",
      });
      return null;
    }
  };

  return markAsSeen;
};
