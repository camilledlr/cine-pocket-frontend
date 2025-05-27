import { useToast } from "../context/ToastContext";
import { addFilmToWatchlist } from "../services/films";
import { useNavigate } from 'react-router-dom';


export const useAddToList = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const addToList = async ({ filmId, slug, title }) => {
    try {
      const result = await addFilmToWatchlist(filmId, slug, title);
      if (result && result.message) {
        toast({
          message: `Ajouté à la watchlist`,
          type: "success",
          actionLabel : "Accéder à la watchlist",
          onAction : () => navigate(`/watchlist`),
        });
      } else {
        toast({
          message: `${result.error}`,
          type: "info",
        });
      }

      return result;
    } catch (error) {
      toast({
        message: `Erreur réseau : ${error.message}`,
        type: "error",
      });
    }
  };

  return addToList;
};
