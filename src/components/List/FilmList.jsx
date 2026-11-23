import React from "react";
import ListHeader from "./ListHeader";
import FilmListItem from "./FilmListItem";
import ScrollToTop from "react-scroll-to-top";

const FilmList = ({title, list, listType, detailed='false', showFilters, filters}) => {
  const hasFilms = list && list.length > 0;

  return (
    <>
    <ListHeader title={title} count={list.length} showFilters={showFilters} filters={filters} />
    <div className="film-list">
      {hasFilms ? (
        list
        .map((film) => (
          <FilmListItem key={film.slug} film={film} listType={listType} detailed={detailed} />
        ))
      ) : (
        <p className="no-info empty-list">La watchlist est vide.</p>
      )}
    </div>
    <ScrollToTop smooth style={{
    background: '#FBF0DA',
    color: '#1F3654',
  }} />
    </>
  );
};

export default FilmList;
