import React from "react";
import "./ListHeader.css";
import { LuSettings2 } from "react-icons/lu";

const ListHeader = ({ title, count, showFilters}) => {
  return (
    <div className="list-header">
    <div className="header-title-count">
        <h1>{title}</h1>
      <div className="list-count">({count})</div>
    </div>
    <div className="header-actions">
    <div></div>
      <LuSettings2 onClick={() => showFilters(true)}/>
    </div>
    </div>
  );
};

export default ListHeader;
