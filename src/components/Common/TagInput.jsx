import React, { useRef, useState } from "react";
import { FiX, FiPlus } from "react-icons/fi";
import "./TagInput.css";

const MAX_SUGGESTIONS = 8;
const sameTag = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

// Saisie de tags personnalisés : chaque tag devient une pastille supprimable.
// - Entrée ou virgule : ajoute le tag tapé
// - Retour arrière dans un champ vide : retire le dernier tag
// - Suggestions : tags déjà utilisés sur d'autres films, filtrés par la saisie
const TagInput = ({ label, value = [], onChange, suggestions = [], placeholder }) => {
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const addTag = (raw) => {
    const tag = raw.trim().replace(/,+$/, "").trim();
    setText("");
    if (!tag || value.some((t) => sameTag(t, tag))) return;
    onChange([...value, tag]);
  };

  const removeTag = (tag) => onChange(value.filter((t) => t !== tag));

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault(); // Entrée ne doit pas soumettre le formulaire
      addTag(text);
    } else if (e.key === "Backspace" && !text && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  // Le texte collé avec des virgules donne plusieurs tags
  const handleChange = (e) => {
    const next = e.target.value;
    if (next.includes(",")) {
      const parts = next.split(",");
      const last = parts.pop();
      const toAdd = parts.map((p) => p.trim()).filter(Boolean);
      const merged = [...value];
      toAdd.forEach((tag) => {
        if (!merged.some((t) => sameTag(t, tag))) merged.push(tag);
      });
      onChange(merged);
      setText(last);
    } else {
      setText(next);
    }
  };

  const query = text.trim().toLowerCase();
  const available = suggestions.filter((s) => !value.some((t) => sameTag(t, s)));
  const shownSuggestions = (query
    ? available.filter((s) => s.toLowerCase().includes(query))
    : available
  ).slice(0, MAX_SUGGESTIONS);
  const canCreate = query && !suggestions.some((s) => sameTag(s, text)) && !value.some((t) => sameTag(t, text));

  return (
    <div className="tag-input">
      {label && (
        <label className="input-label" htmlFor="tag-input-field">
          {label}
        </label>
      )}

      <div className="tag-input-box" onClick={() => inputRef.current?.focus()}>
        {value.map((tag) => (
          <span key={tag} className="tag-input-chip">
            {tag}
            <button
              type="button"
              className="tag-input-remove"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              aria-label={`Retirer le tag ${tag}`}
            >
              <FiX aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          id="tag-input-field"
          ref={inputRef}
          className="tag-input-field"
          type="text"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          // En quittant le champ, le texte en cours devient un tag (pas de saisie perdue)
          onBlur={() => text.trim() && addTag(text)}
          placeholder={value.length === 0 ? placeholder : "Ajouter…"}
          enterKeyHint="done"
          autoComplete="off"
        />
      </div>

      {(shownSuggestions.length > 0 || canCreate) && (
        <div className="tag-input-suggestions">
          {canCreate && (
            <button
              type="button"
              className="tag-input-suggestion is-new"
              // mousedown : on ajoute avant que le champ perde le focus
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => addTag(text)}
            >
              <FiPlus aria-hidden="true" /> Créer « {text.trim()} »
            </button>
          )}
          {shownSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              className="tag-input-suggestion"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => addTag(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;
