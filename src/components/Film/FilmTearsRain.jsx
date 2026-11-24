import React, { useMemo } from "react";
import { createPortal } from "react-dom";

const MAX_LEVEL = 5;

// Une averse de larmes sur tout l'écran (overlay non cliquable).
// Plus le niveau est haut, plus il y a de larmes ; au niveau max, l'écran est inondé.
const FilmTearsRain = ({ level }) => {
  const drops = useMemo(
    () =>
      Array.from({ length: 4 + level * 6 }, (_, i) => ({
        id: i,
        left: Math.random() * 100, // vw
        delay: Math.random() * (0.25 + level * 0.1), // s
        duration: 0.9 + Math.random() * 0.7, // s
        size: 8 + Math.random() * 8, // px
        drift: (Math.random() - 0.5) * 30, // px de déviation horizontale
      })),
    [level]
  );

  return createPortal(
    <div className="tears-rain" aria-hidden="true">
      {drops.map((d) => (
        <span
          key={d.id}
          className="tears-rain-drop"
          style={{
            left: `${d.left}vw`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            "--drift": `${d.drift}px`,
          }}
        />
      ))}

      {level === MAX_LEVEL && (
        <div className="tears-flood">
          <svg className="tears-wave tears-wave-back" viewBox="0 0 200 20" preserveAspectRatio="none">
            <path d="M0 10 Q25 0 50 10 T100 10 T150 10 T200 10 V20 H0 Z" />
          </svg>
          <svg className="tears-wave tears-wave-front" viewBox="0 0 200 20" preserveAspectRatio="none">
            <path d="M0 10 Q25 20 50 10 T100 10 T150 10 T200 10 V20 H0 Z" />
          </svg>
          <div className="tears-flood-body" />
        </div>
      )}
    </div>,
    document.body
  );
};

export default FilmTearsRain;
