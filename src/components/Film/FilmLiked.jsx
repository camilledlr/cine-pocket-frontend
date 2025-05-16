import React, { useState } from "react";
import { toggleFilmHype, toggleFilmLike } from "../../services/films";
import { useToast } from "../../context/ToastContext";
import "./FilmLiked.css";
import { FaHeart } from "react-icons/fa";
import { AiFillFire } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { AiOutlineFire } from "react-icons/ai";

function FilmLiked({ mode = "like", active, filmId }) {
  const isLikedMode = mode === "like";
  const [isActive, setIsActive] = useState(active);
  const Icon = isLikedMode ? FaHeart : AiFillFire;
  const Button = isLikedMode ?  FaRegHeart : AiOutlineFire;
  const toast = useToast();

  const handleToggleHype = async () => {
    try {
      const result = await toggleFilmHype(filmId);
      setIsActive(result.film.hyped);
    } catch (error) {
      toast({
        message: "Erreur lors de la modification du hype",
        type: "error",
      });
    }
  };
  const handleToggleLike = async () => {
    try {
      const result = await toggleFilmLike(filmId);
      setIsActive(result.film.liked);
    } catch (error) {
      toast({
        message: "Erreur lors de la modification du like",
        type: "error",
      });
    }
  };

  return (
    <div className="film-liked-container" onClick={isLikedMode? handleToggleLike : handleToggleHype }>
      <div className="liked-button">
        {isActive ? (
          <Icon className="film-liked" />
        ) : (
          <Button />
        )}
      </div>
    </div>
  );
}

export default FilmLiked;
