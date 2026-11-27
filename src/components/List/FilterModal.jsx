import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { getFiltersData } from "../../services/films";
import { TfiClose } from "react-icons/tfi";
import {
  TEARS_OPTIONS,
  SORT_OPTIONS,
  RATING_MIN,
  RATING_MAX,
  parseRatingRange,
  formatRatingRange,
  filterFilms,
} from "../../utils/listFilters";
import "./FilterModal.css";

const toOptions = (list = []) => list.map((item) => ({ value: item, label: item }));

const EMPTY_DRAFT = {
  sortBy: "date",
  onlyHyped: false,
  onlyLiked: false,
  watchYear: null,
  rating: null,
  tears: null,
  director: [],
  origin: [],
  platform: [],
  tag: [],
  actor: [],
};

// Une section du panneau : petit titre (+ valeur courante à droite) et contenu
const Section = ({ title, value, children }) => (
  <section className="filter-section">
    <h3 className="filter-section-title">
      {title}
      {value && <span className="filter-section-value">{value}</span>}
    </h3>
    {children}
  </section>
);

const Pill = ({ active, onClick, children }) => (
  <button
    type="button"
    className={`filter-pill${active ? " is-active" : ""}`}
    aria-pressed={active}
    onClick={onClick}
  >
    {children}
  </button>
);

// Ligne de pastilles à choix unique : un 2e tap sur la pastille active la désélectionne
// (sauf si `required`, pour le tri qui a toujours une valeur)
const PillGroup = ({ options, value, onChange, label, required = false }) => (
  <div className="filter-pills" role="group" aria-label={label}>
    {options.map((option) => {
      const active = value === option.value;
      return (
        <Pill
          key={option.value}
          active={active}
          onClick={() => onChange(active && !required ? null : option.value)}
        >
          {option.label}
        </Pill>
      );
    })}
  </div>
);

const ratingValueLabel = (rating) => {
  if (!rating) return "Toutes";
  const [min, max] = parseRatingRange(rating);
  return min === max ? `${min}` : `${min} – ${max}`;
};

// Double curseur de 1 à 10 : deux input range superposés, les poignées ne se croisent pas
const RatingRange = ({ value, onChange }) => {
  const [min, max] = parseRatingRange(value);
  const toPercent = (n) => ((n - RATING_MIN) / (RATING_MAX - RATING_MIN)) * 100;

  return (
    <div className="rating-range">
      <div className="rating-range-slider">
        <div className="rating-range-track" />
        <div
          className="rating-range-fill"
          style={{ left: `${toPercent(min)}%`, right: `${100 - toPercent(max)}%` }}
        />
        <input
          type="range"
          min={RATING_MIN}
          max={RATING_MAX}
          step={1}
          value={min}
          aria-label="Note minimale"
          // Poignées collées en haut de l'échelle : la poignée « min » passe dessus pour pouvoir redescendre
          style={{ zIndex: min > (RATING_MIN + RATING_MAX) / 2 ? 3 : 1 }}
          onChange={(e) => onChange(formatRatingRange(Math.min(Number(e.target.value), max), max))}
        />
        <input
          type="range"
          min={RATING_MIN}
          max={RATING_MAX}
          step={1}
          value={max}
          aria-label="Note maximale"
          style={{ zIndex: 2 }}
          onChange={(e) => onChange(formatRatingRange(min, Math.max(Number(e.target.value), min)))}
        />
      </div>
      <div className="rating-range-scale" aria-hidden="true">
        <span>{RATING_MIN}</span>
        <span>{RATING_MAX}</span>
      </div>
    </div>
  );
};

// react-select aux couleurs de l'app : champ arrondi, valeurs choisies en pastilles pleines
const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "2.75rem",
    borderRadius: "1.4rem",
    backgroundColor: "transparent",
    borderColor: state.isFocused ? "var(--color-text)" : "rgba(31, 54, 84, 0.3)",
    boxShadow: "none",
    paddingLeft: "0.35rem",
    "&:hover": { borderColor: "var(--color-text)" },
  }),
  placeholder: (base) => ({ ...base, color: "rgba(31, 54, 84, 0.5)" }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "var(--color-text)",
    borderRadius: "1rem",
  }),
  multiValueLabel: (base) => ({ ...base, color: "var(--color-bg)", paddingLeft: "0.6rem" }),
  multiValueRemove: (base) => ({
    ...base,
    color: "var(--color-bg)",
    borderRadius: "0 1rem 1rem 0",
    "&:hover": { backgroundColor: "transparent", color: "var(--color-accent)" },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  menu: (base) => ({
    ...base,
    zIndex: 5,
    borderRadius: "0.75rem",
    overflow: "hidden",
    backgroundColor: "var(--color-bg)",
    boxShadow: "0 6px 20px rgba(31, 54, 84, 0.18)",
  }),
  option: (base, state) => ({
    ...base,
    color: "var(--color-text)",
    backgroundColor: state.isFocused ? "rgba(246, 178, 54, 0.25)" : "transparent",
  }),
};

const MultiSelect = ({ title, options, value, onChange, placeholder }) => (
  <Section title={title}>
    <Select
      options={options}
      value={value.map((v) => ({ value: v, label: v }))}
      onChange={(selected) => onChange((selected || []).map((s) => s.value))}
      placeholder={placeholder}
      noOptionsMessage={() => "Aucun résultat"}
      menuPlacement="auto" // s'ouvre vers le haut près du bas de l'écran
      styles={selectStyles}
      isClearable
      isMulti
    />
  </Section>
);

const FilterModal = ({ listType, isOpen, onClose, onApply, filters, films }) => {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [options, setOptions] = useState({
    directors: [],
    origins: [],
    platforms: [],
    tags: [],
    actors: [],
  });

  // À chaque ouverture, on repart des filtres actifs (ceux de l'URL)
  useEffect(() => {
    if (isOpen) setDraft({ ...EMPTY_DRAFT, ...filters });
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getFiltersData()
      .then((data) => {
        setOptions({
          directors: toOptions(data.directors),
          origins: toOptions(data.origins),
          platforms: toOptions(data.platforms),
          tags: toOptions(data.tags),
          actors: toOptions(data.actors),
        });
      })
      .catch((err) => console.error("Erreur filtre :", err));
  }, []);

  // Années où au moins un film de la liste a été vu, de la plus récente à la plus ancienne
  const yearOptions = useMemo(() => {
    const years = new Set();
    (films || []).forEach((film) =>
      (film.watchedDates || []).forEach((date) => years.add(new Date(date).getFullYear()))
    );
    return [...years]
      .filter((year) => !Number.isNaN(year))
      .sort((a, b) => b - a)
      .map((year) => ({ value: String(year), label: String(year) }));
  }, [films]);

  // Nombre de films correspondant aux filtres en cours de réglage (affiché sur le bouton)
  const resultCount = useMemo(() => filterFilms(films, draft).length, [films, draft]);

  const update = (key) => (value) => setDraft((prev) => ({ ...prev, [key]: value }));

  if (!isOpen) return null;

  const isSeenlist = listType === "seenlist";

  return (
    <div className="filter-modal" role="dialog" aria-modal="true" aria-labelledby="filter-modal-title">
      <header className="filter-modal-header">
        <h2 id="filter-modal-title">Filtres</h2>
        <button type="button" className="filter-modal-close" onClick={onClose} aria-label="Fermer">
          <TfiClose />
        </button>
      </header>

      <div className="filter-modal-body">
        <Section title="Trier par">
          <PillGroup
            label="Trier par"
            options={SORT_OPTIONS[listType]}
            value={draft.sortBy}
            onChange={update("sortBy")}
            required
          />
        </Section>

        <Section title="Afficher">
          <div className="filter-pills">
            {isSeenlist ? (
              <>
                <Pill active={draft.onlyLiked} onClick={() => update("onlyLiked")(!draft.onlyLiked)}>
                  ♥ Coups de cœur
                </Pill>
                <Pill
                  active={!!draft.tears}
                  onClick={() => update("tears")(draft.tears ? null : TEARS_OPTIONS[0].value)}
                >
                  {TEARS_OPTIONS[0].label}
                </Pill>
              </>
            ) : (
              <Pill active={draft.onlyHyped} onClick={() => update("onlyHyped")(!draft.onlyHyped)}>
                🔥 Hypés
              </Pill>
            )}
          </div>
        </Section>

        {isSeenlist && yearOptions.length > 0 && (
          <Section title="Vus en">
            <PillGroup
              label="Année de visionnage"
              options={yearOptions}
              value={draft.watchYear}
              onChange={update("watchYear")}
            />
          </Section>
        )}

        {isSeenlist && (
          <Section title="Note" value={ratingValueLabel(draft.rating)}>
            <RatingRange value={draft.rating} onChange={update("rating")} />
          </Section>
        )}

        <MultiSelect
          title="Tags"
          options={options.tags}
          value={draft.tag}
          onChange={update("tag")}
          placeholder="Choisir un tag"
        />
        <MultiSelect
          title="Réalisateur"
          options={options.directors}
          value={draft.director}
          onChange={update("director")}
          placeholder="Choisir un réalisateur"
        />
        <MultiSelect
          title="Acteurs / actrices"
          options={options.actors}
          value={draft.actor}
          onChange={update("actor")}
          placeholder="Choisir un acteur ou une actrice"
        />
        <MultiSelect
          title="Pays d'origine"
          options={options.origins}
          value={draft.origin}
          onChange={update("origin")}
          placeholder="Choisir un pays"
        />
        {!isSeenlist && (
          <MultiSelect
            title="Plateforme"
            options={options.platforms}
            value={draft.platform}
            onChange={update("platform")}
            placeholder="Choisir une plateforme"
          />
        )}
      </div>

      <footer className="filter-modal-footer">
        <button type="button" className="filter-reset" onClick={() => setDraft(EMPTY_DRAFT)}>
          Tout effacer
        </button>
        <button type="button" className="filter-apply" onClick={() => onApply(draft)}>
          {resultCount === 0
            ? "Aucun film"
            : `Voir ${resultCount} film${resultCount > 1 ? "s" : ""}`}
        </button>
      </footer>
    </div>
  );
};

export default FilterModal;
