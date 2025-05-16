import React from "react";
import "./Checkbox.css";

const Checkbox = ({ id, label, checked, onChange }) => {
  return (
    <div className="checkbox-wrapper">
      <label htmlFor={id} className="checkbox-label">
        <input
          type="checkbox"
          id={id}
          name={id}
          checked={checked}
          onChange={onChange}
          className="checkbox-input"
        />
        <span className="custom-box"></span>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
