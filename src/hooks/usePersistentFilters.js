import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

const getFilterArray = (params, name) => params.getAll(name).filter(Boolean);

export default function usePersistentFilters(defaults = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => ({
    sortBy: searchParams.get("sortBy") || defaults.sortBy || "date",
    onlyHyped: searchParams.get("onlyHyped") === "true",
    onlyLiked: searchParams.get("onlyLiked") === "true",
    director: getFilterArray(searchParams, "director"),
    origin: getFilterArray(searchParams, "origin"),
    platform: getFilterArray(searchParams, "platform"),
  }), [searchParams]);
  
// Function to set filters based on form input
  // This function updates the URL search parameters based on the selected filters
  const setFiltersFromForm = (selectedFilters) => {
    const params = new URLSearchParams();

    if (selectedFilters.sortBy) params.set("sortBy", selectedFilters.sortBy);
    if (selectedFilters.onlyHyped) params.set("onlyHyped", "true");
    if (selectedFilters.onlyLiked) params.set("onlyLiked", "true");

    selectedFilters.director.forEach((d) => params.append("director", d));
    selectedFilters.origin.forEach((o) => params.append("origin", o));
    selectedFilters.platform.forEach((p) => params.append("platform", p));

    setSearchParams(params);
  };

  // Helper function to build options for Select components
  const buildFilterOptions = (list) =>
    list.map((item) => ({ value: item, label: item }));

  return { filters, setFiltersFromForm, buildFilterOptions };
}
