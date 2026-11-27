import React from "react";
import Tag from "../Common/Tag";
import "./ListHeader.css";
import { LuSettings2 } from "react-icons/lu";
import { TEARS_OPTIONS, labelFor, ratingRangeLabel } from "../../utils/listFilters";

// Pastilles des filtres actifs, affichées à côté du bouton de filtres
const activeFilterLabels = (filters) => {
  if (!filters) return [];
  return [
    filters.watchYear,
    filters.rating && ratingRangeLabel(filters.rating),
    filters.tears && labelFor(TEARS_OPTIONS, filters.tears),
    ...(filters.tag || []).map((tag) => `#${tag}`),
    ...(filters.director || []),
    ...(filters.actor || []),
    ...(filters.origin || []),
  ].filter(Boolean);
};

const ListHeader = ({ title, count, showFilters, filters}) => {
  return (
    <div className="list-header">
    <div className="header-title-count">
        <h1>{title}</h1>
      <div className="list-count">({count})</div>
    </div>
    <div className="header-actions">
    <div>
      {activeFilterLabels(filters).map((label) => (
        <Tag key={label} text={label} variant="primary-fill" />
      ))}
  </div>
      <LuSettings2 onClick={() => showFilters(true)}/>
    </div>
    </div>
  );
};

export default ListHeader;
