import React, { useEffect, useRef } from "react";
import "./Input.css";

const Input = ({ inputId, label, placeholder, value, onChange }) => {
  const textareaRef = useRef(null);

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

  return (
    <div>
      {label && <label htmlFor={inputId}>{label}</label>}
      <textarea
        id={inputId}
        name={inputId}
        ref={textareaRef}
        className="custom-input"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        style={{ overflow: "hidden", resize: "none" }}
      />
    </div>
  );
};

export default Input;
