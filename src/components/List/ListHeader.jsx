import React from "react";
import "./ListHeader.css";
import { FaSort } from "react-icons/fa";

const ListHeader = ({ title, count, showFilters}) => {
  return (
    <div className="list-header">
    <div className="header-title-count">
        <h1>{title}</h1>
      <div className="list-count">({count})</div>
    </div>
    <div className="header-actions">
      <FaSort onClick={() => showFilters(true)}/>
    </div>
    </div>
  );
};

export default ListHeader;
