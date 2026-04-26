import React from "react";
import Tag from "../Common/Tag";  
import "./ListHeader.css";
import { LuSettings2 } from "react-icons/lu";

const ListHeader = ({ title, count, showFilters, filters}) => {
  return (
    <div className="list-header">
    <div className="header-title-count">
        <h1>{title}</h1>
      <div className="list-count">({count})</div>
    </div>
    <div className="header-actions">
    <div>
    {filters  && filters.watchYear && (
      <Tag text={filters.watchYear} variant="primary-fill"/>
  )}

    {filters.director?.map(dir => (
    <Tag text={dir} variant="primary-fill"/>
  ))}
    {filters.origin?.map(orig => (
    <Tag text={orig} variant="primary-fill"/>
  ))}
  </div>
      <LuSettings2 onClick={() => showFilters(true)}/>
    </div>
    </div>
  );
};

export default ListHeader;
