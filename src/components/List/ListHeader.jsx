import React from "react";
import "./ListHeader.css";

const ListHeader = ({ title, count }) => {
  return (
    <div className="list-header">
    <div className="header-title-count">
        <h1>{title}</h1>
      <div className="list-count">({count})</div>
    </div>
    <div className="header-actions"></div>
    </div>
  );
};

export default ListHeader;
