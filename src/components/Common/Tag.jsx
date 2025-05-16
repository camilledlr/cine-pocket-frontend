import React from 'react';
import './Tag.css';

function Tag({ text, size = 'medium',variant = 'primary' }) {
  return (
    <span className={`tag tag-${size} tag-${variant}`}>
      {text}
    </span>
  );
}

export default Tag;
