import React, { useRef } from "react";
import "./Input.css";

const Input = ({ inputId, label, textarea, placeholder, value, onChange }) => {
  const textareaRef = useRef(null);

  const handleInputChange = (e) => {
    onChange?.(e.target.value);

    // Auto-ajustement de la hauteur
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // reset
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // ajustement
    }
  };

  return (
    <div>
      {label && <label htmlFor={inputId}>{label}</label>}
      <textarea
        id={inputId}
        name={inputId}
        ref={textareaRef}
        className={`custom-input ${textarea ? "custom-textarea" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
          }
        }}
        style={{ overflow: "hidden", resize: "none" }}
      />
    </div>
  );
};

export default Input;
