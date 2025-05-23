import React from "react";
import { useNavigate } from "react-router-dom";
import { useAddToList } from "../../hooks/useAddToList";
import { useMarkAsSeen } from "../../hooks/useMarkAsSeen";
import BackButton from "../Common/BackButton";
import Button from "../Common/Button";
import Tag from "../Common/Tag";
import FilmRating from "../Film/FilmRating";
import FilmLiked from "../Film/FilmLiked";
import "../../styles/FilmPage.css";
import { FiPlus } from "react-icons/fi";
import { FaPen } from "react-icons/fa";

const FilmTemplate = ({ filmInfos, onFilmUpdated }) => {
   const navigate = useNavigate();
  const addToList = useAddToList();
  const markAsSeen = useMarkAsSeen();
  const handleAddToWatchListClick =  async () => {
    const result = await addToList({
        filmId: filmInfos._id,
        slug: filmInfos.slug,
        title: filmInfos.title,
      });
      if (result?.film) {
        onFilmUpdated(result.film); // <- on met à jour le state de la page
      }
  };
  
  const handleMarkAsSeen = async () => {
    const updatedFilm = await markAsSeen({
        filmId: filmInfos._id,
        slug: filmInfos.slug,
        title: filmInfos.title,
      });
    if (updatedFilm) {
      onFilmUpdated(updatedFilm); // met à jour le state local
    }
  };
  return (
    <div>
      <div className="film-header">
        <BackButton />
        <div className="film-eval">
          <FilmLiked mode={filmInfos.status === "watched" ? "like" : "hype"} active={filmInfos.status === "watched" ?filmInfos.liked: filmInfos.hyped} filmId={filmInfos._id}/>
          {filmInfos.rating && <FilmRating rating={filmInfos.rating} />}
        </div>
      </div>
      <h1 className="film-title">{filmInfos.title}</h1>

      <div className="film-actions">
        {filmInfos.status === "to watch" && <Tag text="A voir" size="large"/>}
        {filmInfos.status === "to_rewatch" && <Tag text="A revoir" size="large"/>}
        {filmInfos.status !== "watched" && (
          <div className="film-action">
            <Button
              text="Marquer comme Vu"
              icon={<FiPlus />}
              color="secondary"
              size="large"
              variant="filled"
              action={handleMarkAsSeen}
            />
          </div>
        )}
        {!["to watch", "to_rewatch"].includes(filmInfos.status) && (
          <div className="film-action">
            <Button
              text="Ajouter à la Watchlist"
              icon={<FiPlus />}
              color="primary"
              size="large"
              variant="filled"
              action={handleAddToWatchListClick}
            />
          </div>
        )}
        <div className="film-action">
          {(filmInfos.status !== "to watch") && ((filmInfos.shortReview || filmInfos.longReview || filmInfos.rating) ? (
            <Button
              text="Modifier la review"
              icon={<FaPen />}
              color="primary"
              size="large"
              variant="text"
              action={ ()=>navigate(`/films/review/${filmInfos._id}`, { state: { title: filmInfos.title } })}
            />
          ): (<Button
              text="Ajouter une review"
              icon={<FaPen />}
              color="primary"
              size="large"
              variant="text"
              action={ ()=>navigate(`/films/review/${filmInfos._id}`, { state: { title: filmInfos.title } })}
            />))}
        </div>
      </div>
    </div>
  );
};

export default FilmTemplate;
