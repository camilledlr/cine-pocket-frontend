import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TfiClose } from "react-icons/tfi";
import './Modale.css'
const Modale = ({modaleTitle, children}) => {
  const navigate = useNavigate();
  return (
    <div className="page-template">
      <header className="modale-header">
        <div className="modale-title">{modaleTitle}</div>
        <TfiClose className="modale-close"  onClick={() => navigate(-1)}/>
      </header>
      <main className="page-content">
        {children}
      </main>
    </div>
  )
}

export default Modale