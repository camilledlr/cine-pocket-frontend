import React from 'react';
import './FilmRating.css';

function FilmRating({ rating, size = 'large', editable = false, onChange }) {
  return (
    <span className={`film-rating-contener film-rating-contener-${size}`}>
      {editable ? (
        <>
          <input
            type="number"
            id="rating"
            name="rating"
            min="1"
            max="10"
            value={rating}
            onChange={(e) => onChange?.(e.target.value)}
            className={`film-rating-input rating-${size}`}
          />
          <span className="film-rating-unit">/10</span>
        </>
      ) : (
        <>
          <span className={`film-rating rating-${size}`}>{rating}</span>
          <span className="film-rating-unit">/10</span>
        </>
      )}
    </span>
  );
}

export default FilmRating;
