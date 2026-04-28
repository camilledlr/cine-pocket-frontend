import { useState, useMemo } from "react";

const matchesAnyFilter = (values, filters) =>
  values?.some((v) =>
    filters.some((f) => (v.label ?? v)?.toLowerCase() === f.label.toLowerCase())
  );

export const useWhatToWatchFilters = (films) => {
  const [onlyHyped, setOnlyHyped] = useState(false);
  const [platformsFilter, setPlatformsFilter] = useState([]);
  const [tagsFilter, setTagsFilter] = useState([]);

  const filteredFilms = useMemo(
    () =>
      (films || []).filter((film) => {
        if (onlyHyped && !film.hyped) return false;
        if (platformsFilter.length && !matchesAnyFilter(film.platform, platformsFilter)) return false;
        if (tagsFilter.length && !matchesAnyFilter(film.tags, tagsFilter)) return false;
        return true;
      }),
    [films, onlyHyped, platformsFilter, tagsFilter]
  );

  return {
    filteredFilms,
    filterState: { onlyHyped, platformsFilter, tagsFilter },
    filterHandlers: { setOnlyHyped, setPlatformsFilter, setTagsFilter },
  };
};
