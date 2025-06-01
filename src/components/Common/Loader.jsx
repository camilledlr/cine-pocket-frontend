// src/components/Loader.jsx
import React from 'react';
import { RiMovie2Fill } from 'react-icons/ri';
import './Loader.css'; // ou Tailwind si tu préfères

const Loader = () => {
  return (
    <div className="loader-overlay">
      <RiMovie2Fill className="reel-icon" />
    </div>
  );
};

export default Loader;
