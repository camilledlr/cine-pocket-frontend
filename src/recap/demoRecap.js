// Données FICTIVES pour développer et tester le moteur de la Séance.
// Rien ici ne vient de tes vrais films : titres, chiffres et textes sont inventés.
// Le vrai contenu (calculé à partir de tes données) arrivera dans src/recap/content/.

const demoRecap = {
  year: 2026,
  viewer: "Spectatrice",
  scenes: [
    {
      type: "carton",
      lines: ["Il était une fois…", "une année de cinéma."],
    },
    {
      type: "number",
      before: "Cette année, tu as vu",
      value: 42,
      after: "films",
      caption: "Chiffre inventé pour la démo.",
    },
    {
      type: "posters",
      title: "Quelques images de l'année",
      films: [
        { title: "Le Grand Départ" },
        { title: "Nuit Blanche à Lisbonne" },
        { title: "Les Oiseaux de Papier" },
        { title: "Opération Tournesol" },
        { title: "La Dernière Bobine" },
        { title: "Un Été sans Fin" },
      ],
      caption: "Des films qui n'existent pas.",
    },
    {
      type: "guess",
      question: "D'après toi, quel genre a dominé ton année (démo) ?",
      choices: ["Comédie", "Drame", "Science-fiction"],
      answer: 1,
      reveal: "Le drame, évidemment. (Réponse inventée.)",
    },
    {
      type: "carton",
      lines: ["Et maintenant…", "place au générique."],
    },
  ],
  credits: [
    { role: "Une année réalisée par", names: ["Toi"] },
    { role: "Avec", names: ["Le Grand Départ", "La Dernière Bobine", "Un Été sans Fin"] },
    { role: "Projection", names: ["Ciné Pocket"] },
  ],
  postCredits: {
    lines: ["Tu es restée jusqu'au bout.", "Rendez-vous l'année prochaine."],
  },
};

export default demoRecap;
