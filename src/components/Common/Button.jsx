import React from 'react';
import './Button.css';


function Button({ text, action, color = 'primary', size = 'medium', icon = null, variant = 'filled', ...props }) {
  const className = `btn btn-${variant} btn-${color} btn-${size}`;

  return (
    <button className={className} {...props} onClick={action}>
      {text}
      {icon && <span className="btn-icon">{icon}</span>}
    </button>
  );
}

export default Button;
