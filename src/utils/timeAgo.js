const DAY_MS = 24 * 60 * 60 * 1000;
const rtf = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });

// Temps écoulé depuis une date, en français :
// "aujourd’hui", "hier", "il y a 3 jours", "il y a 2 semaines", "il y a 5 mois", "il y a 2 ans"
export const timeAgo = (date) => {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;

  // On compare des jours calendaires (minuit local), pas des tranches de 24 h
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = new Date(d);
  day.setHours(0, 0, 0, 0);
  const days = Math.round((today - day) / DAY_MS);

  if (days < 7) return rtf.format(-days, "day");
  if (days < 30) return rtf.format(-Math.floor(days / 7), "week");
  if (days < 365) return rtf.format(-Math.floor(days / 30), "month");
  return rtf.format(-Math.floor(days / 365), "year");
};

// Date du visionnage le plus récent d'un film (watchedDates), ou null
export const lastWatchedDate = (film) => {
  const dates = (film.watchedDates || [])
    .map((d) => new Date(d))
    .filter((d) => !Number.isNaN(d.getTime()));
  if (dates.length === 0) return null;
  return new Date(Math.max(...dates));
};
