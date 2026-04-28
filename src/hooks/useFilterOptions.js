import { useEffect, useState } from "react";
import { getFiltersData } from "../services/films";

const toSelectOptions = (list) => list.map((item) => ({ value: item, label: item }));

export const useFilterOptions = () => {
  const [options, setOptions] = useState({ platforms: [], tags: [] });

  useEffect(() => {
    getFiltersData()
      .then((data) =>
        setOptions({
          platforms: toSelectOptions(data.platforms),
          tags: toSelectOptions(data.tags),
        })
      )
      .catch((err) => console.error("Erreur chargement filtres :", err.message));
  }, []);

  return { options };
};
