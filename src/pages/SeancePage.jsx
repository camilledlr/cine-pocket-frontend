import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import SeancePlayer from "../components/Seance/SeancePlayer";
import BackButton from "../components/Common/BackButton";
import demoRecap from "../recap/demoRecap";

// La séance d'une année ouvre ses portes le 1er janvier de l'année suivante
const opensAt = (year) => new Date(Number(year) + 1, 0, 1);

// Page /seance/:year
// - ?demo=1 : séance de démonstration avec des données inventées (pour le développement)
// - sinon : salle fermée tant que la date d'ouverture n'est pas passée.
//   (Le vrai contenu, calculé à partir de tes films, sera branché plus tard.)
const SeancePage = () => {
  const { year } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isDemo = searchParams.get("demo") === "1";

  const exit = () => navigate("/");

  if (isDemo) {
    return (
      <SeancePlayer recap={{ ...demoRecap, year: Number(year) || demoRecap.year }} onExit={exit} />
    );
  }

  if (new Date() < opensAt(year)) {
    return (
      <div className="seance-closed">
        <BackButton />
        <h1>La Séance {year}</h1>
        <p>
          Les portes ouvrent le{" "}
          {opensAt(year).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          .
        </p>
      </div>
    );
  }

  // Après l'ouverture : le contenu réel n'est pas encore branché
  return (
    <div className="seance-closed">
      <BackButton />
      <h1>La Séance {year}</h1>
      <p>La bobine n'est pas encore prête.</p>
    </div>
  );
};

export default SeancePage;
