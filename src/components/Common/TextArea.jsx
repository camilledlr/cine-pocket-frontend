import React, { useRef } from "react";
import "./TextArea.css";

const TextArea = ({ inputId, label, placeholder, value, onChange }) => {
  const textareaRef = useRef(null);

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
        className="custom-textarea"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        style={{ overflow: "hidden", resize: "none" }}
      />
    </div>
  );
};

export default TextArea;
