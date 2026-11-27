import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

// Helper function to extract multiple values for a given filter from URL search parameters
const getFilterArray = (params, name) => params.getAll(name).filter(Boolean);

// Helper function to build options for Select components.
// Defined outside the hook so its reference stays stable between renders
// (it is used as a useEffect dependency in FilterModal).
const buildFilterOptions = (list) =>
  list.map((item) => ({ value: item, label: item }));

// Filtres à valeurs multiples, stockés en paramètres répétés dans l'URL (?tag=a&tag=b)
const MULTI_FILTERS = ["director", "origin", "platform", "tag", "actor"];

export default function usePersistentFilters(defaults = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => ({
    sortBy: searchParams.get("sortBy") || defaults.sortBy || "date",
    watchYear: searchParams.get("watchYear") || null,
    rating: searchParams.get("rating") || null, // plage de notes "min-max" (ex. "6-9")
    tears: searchParams.get("tears") || null, // niveau de larmes minimal
    onlyHyped: searchParams.get("onlyHyped") === "true",
    onlyLiked: searchParams.get("onlyLiked") === "true",
    ...Object.fromEntries(MULTI_FILTERS.map((name) => [name, getFilterArray(searchParams, name)])),
  }), [searchParams, defaults.sortBy]);

  // Function to set filters based on form input
  // This function updates the URL search parameters based on the selected filters
  const setFiltersFromForm = (selectedFilters) => {
    const params = new URLSearchParams();

    if (selectedFilters.sortBy) params.set("sortBy", selectedFilters.sortBy);
    if (selectedFilters.onlyHyped) params.set("onlyHyped", "true");
    if (selectedFilters.onlyLiked) params.set("onlyLiked", "true");
    if (selectedFilters.watchYear) params.set("watchYear", selectedFilters.watchYear);
    if (selectedFilters.rating) params.set("rating", selectedFilters.rating);
    if (selectedFilters.tears) params.set("tears", selectedFilters.tears);

    MULTI_FILTERS.forEach((name) =>
      (selectedFilters[name] || []).forEach((value) => params.append(name, value))
    );

    setSearchParams(params);
  };

  return { filters, setFiltersFromForm, buildFilterOptions };
}
