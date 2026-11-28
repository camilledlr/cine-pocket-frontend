import React from "react";
import Tag from "../Common/Tag";
import "./ListHeader.css";
import { LuSettings2 } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
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

const ListHeader = ({ title, count, showFilters, filters, listType }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Le classement part de la liste telle qu'elle est filtrée : on transmet les filtres de l'URL
  const startRanking = () => {
    const params = new URLSearchParams(location.search);
    params.set("from", listType);
    navigate(`/tops/nouveau?${params.toString()}`);
  };

  return (
    <div className="list-header">
    <div className="header-title-count">
        <h1>{title}</h1>
      <div className="list-count">({count})</div>
    </div>
    <div className="header-actions">
      {/* À gauche : bouton « Créer un top » puis les filtres actifs ; à droite : l'icône des filtres */}
      <div className="header-left">
        {listType && count > 1 && (
          <button type="button" className="rank-start-button" onClick={startRanking}>
            🏆 Créer un top
          </button>
        )}
        {activeFilterLabels(filters).map((label) => (
          <Tag key={label} text={label} variant="primary-fill" />
        ))}
      </div>
      <LuSettings2 className="header-filter-icon" onClick={() => showFilters(true)}/>
    </div>
    </div>
  );
};

export default ListHeader;
