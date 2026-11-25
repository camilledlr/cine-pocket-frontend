import React, { useEffect, useRef, useState } from "react";
import "./Input.css";

const MAX_SUGGESTIONS = 6;

// Comparaison sans casse ni accents : « eric » trouve « Éric Rohmer »
const normalize = (str) =>
  str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

// Suggestions qui correspondent à la saisie : celles qui commencent par le texte d'abord,
// puis celles qui le contiennent (ex. un nom de famille)
const findMatches = (query, suggestions, exclude = []) => {
  const q = normalize(query);
  if (!q) return [];
  const excluded = exclude.map(normalize);
  const candidates = suggestions.filter(
    (s) => s && !excluded.includes(normalize(s)) && normalize(s) !== q
  );
  const starts = candidates.filter((s) => normalize(s).startsWith(q));
  const contains = candidates.filter(
    (s) => !normalize(s).startsWith(q) && normalize(s).includes(q)
  );
  return [...starts, ...contains].slice(0, MAX_SUGGESTIONS);
};

// Champ texte (textarea qui s'agrandit tout seul).
// Options d'autocomplétion :
// - suggestions : liste de valeurs proposées pendant la saisie
// - multiple : valeurs séparées par des virgules (ex. acteurs) ; la suggestion
//   complète alors le dernier nom tapé
const Input = ({ inputId, label, placeholder, value, onChange, suggestions, multiple = false }) => {
  const textareaRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const text = value || "";

  // Ajuster la hauteur automatiquement quand `value` change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleInputChange = (e) => {
    onChange?.(e.target.value);
  };

  // En mode multiple, on ne complète que le nom en cours (après la dernière virgule)
  const parts = multiple ? text.split(",") : [text];
  const currentPart = parts[parts.length - 1];
  const alreadyChosen = multiple ? parts.slice(0, -1) : [];
  const matches =
    suggestions && focused ? findMatches(currentPart, suggestions, alreadyChosen) : [];

  const applySuggestion = (suggestion) => {
    if (multiple) {
      const kept = parts.slice(0, -1).map((p) => p.trim()).filter(Boolean);
      // On ajoute ", " pour enchaîner directement sur le nom suivant
      onChange?.([...kept, suggestion].join(", ") + ", ");
    } else {
      onChange?.(suggestion);
    }
    textareaRef.current?.focus();
  };

  return (
    // Avec un label : label au-dessus du champ, tous deux alignés à gauche
    <div className={label ? "input-field" : undefined}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        name={inputId}
        ref={textareaRef}
        className="custom-input"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete="off"
        style={{ overflow: "hidden", resize: "none" }}
      />

      {matches.length > 0 && (
        <div className="input-suggestions" role="listbox" aria-label={`Suggestions pour ${label || inputId}`}>
          {matches.map((s) => (
            <button
              key={s}
              type="button"
              role="option"
              aria-selected="false"
              className="input-suggestion"
              // mousedown : on garde le focus dans le champ pendant le choix
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applySuggestion(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Input;
