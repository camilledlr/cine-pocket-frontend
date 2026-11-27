// Filtres et tris des listes (Films vus, Watchlist), à partir des filtres de l'URL
// (voir usePersistentFilters).

const same = (a, b) => a?.toLowerCase() === b?.toLowerCase();

// Au moins une des valeurs du film correspond à au moins un des filtres choisis
const matchesAny = (values = [], selected = []) =>
  values.some((v) => selected.some((s) => same(v, s)));

export const lastWatchedTime = (film) => {
  const dates = film.watchedDates || [];
  return dates.length ? new Date(dates[dates.length - 1]).getTime() : 0;
};

export const filterFilms = (films, filters) =>
  (films || []).filter((film) => {
    if (filters.onlyHyped && !film.hyped) return false;
    if (filters.onlyLiked && !film.liked) return false;
    if (
      filters.watchYear &&
      !(film.watchedDates || []).some(
        (date) => new Date(date).getFullYear() === Number(filters.watchYear)
      )
    )
      return false;
    if (filters.director?.length && !matchesAny([film.director], filters.director)) return false;
    if (filters.origin?.length && !matchesAny([film.origin], filters.origin)) return false;
    if (
      filters.platform?.length &&
      !matchesAny((film.platform || []).map((p) => p.label), filters.platform)
    )
      return false;
    if (filters.tag?.length && !matchesAny(film.tags, filters.tag)) return false;
    if (filters.actor?.length && !matchesAny(film.actors, filters.actor)) return false;
    if (filters.rating) {
      const [min, max] = parseRatingRange(filters.rating);
      if (!film.rating || film.rating < min || film.rating > max) return false;
    }
    if (filters.tears && !((film.tearsLevel || 0) >= Number(filters.tears))) return false;
    return true;
  });

const SORTS = {
  // Films vus : dernier visionnage le plus récent en haut
  date: (a, b, listType) =>
    listType === "watchlist"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : lastWatchedTime(b) - lastWatchedTime(a),
  rating: (a, b) => (b.rating || 0) - (a.rating || 0),
  hyped: (a, b) => (b.hyped === true) - (a.hyped === true),
  title: (a, b) => (a.title || "").localeCompare(b.title || "", "fr", { sensitivity: "base" }),
  tears: (a, b) => (b.tearsLevel || 0) - (a.tearsLevel || 0),
  views: (a, b) => (b.watchedDates?.length || 0) - (a.watchedDates?.length || 0),
};

export const sortFilms = (films, sortBy, listType) => {
  const compare = SORTS[sortBy];
  return compare ? [...films].sort((a, b) => compare(a, b, listType)) : [...films];
};

// Plage de notes, stockée dans l'URL sous la forme "min-max" (ex. "6-9")
export const RATING_MIN = 1;
export const RATING_MAX = 10;

export const parseRatingRange = (value) => {
  const [min, max] = String(value || "").split("-").map(Number);
  return [
    Number.isFinite(min) && min >= RATING_MIN ? min : RATING_MIN,
    Number.isFinite(max) && max <= RATING_MAX ? max : RATING_MAX,
  ];
};

// null quand la plage couvre toutes les notes : le filtre est alors inactif
export const formatRatingRange = (min, max) =>
  min === RATING_MIN && max === RATING_MAX ? null : `${min}-${max}`;

export const ratingRangeLabel = (value) => {
  const [min, max] = parseRatingRange(value);
  if (min === max) return `Note ${min}`;
  if (max === RATING_MAX) return `Note ${min}+`;
  return `Note ${min} à ${max}`;
};

// Un seul choix : le film m'a fait pleurer (quel que soit le niveau)
export const TEARS_OPTIONS = [{ value: "1", label: "💧 M'a fait pleurer" }];

export const SORT_OPTIONS = {
  seenlist: [
    { value: "date", label: "Date de visionnage" },
    { value: "rating", label: "Note" },
    { value: "title", label: "Titre (A → Z)" },
    { value: "tears", label: "Niveau de larmes" },
    { value: "views", label: "Nombre de visionnages" },
  ],
  watchlist: [
    { value: "date", label: "Date d'ajout" },
    { value: "hyped", label: "Hype" },
    { value: "title", label: "Titre (A → Z)" },
  ],
};

export const labelFor = (options, value) =>
  options.find((o) => o.value === value)?.label || value;
