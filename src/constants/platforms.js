// Plateformes proposées pour la dispo d'un film (stockées en base sous la forme { id, label })
export const PLATFORMS = [
  { id: "prime_video", label: "Prime Video" },
  { id: "netflix", label: "Netflix" },
  { id: "disney_plus", label: "Disney +" },
  { id: "arte", label: "Arte" },
  { id: "universciné", label: "Universciné" },
  { id: "france_tv", label: "France TV" },
  { id: "hbo", label: "HBO max" },
  { id: "cine", label: "Au ciné" },
  { id: "m6", label: "M6 +" },
  { id: "tf1", label: "TF1 +" },
  { id: "vod", label: "VOD" },
];

// Option à part : exclusive avec toutes les autres
export const NO_DISPO = { id: "no_dispo", label: "Indisponible" };

export const ALL_PLATFORMS = [...PLATFORMS, NO_DISPO];
