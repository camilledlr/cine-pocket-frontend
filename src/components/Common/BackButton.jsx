import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoArrowLeft } from "react-icons/go";
import './BackButton.css';

function BackButton() {
  const navigate = useNavigate();

  return (
    <div className="back-button" onClick={() => navigate(-1)}>
    <GoArrowLeft />
    </div>
  );
}

export default BackButton;