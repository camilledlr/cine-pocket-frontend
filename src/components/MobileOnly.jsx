import React from 'react';

const MobileOnly = ({ children }) => {
  const isMobile = window.innerWidth <= 768;

  if (!isMobile) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>🌐 Version desktop bientôt disponible</h1>

      </div>
    );
  }

  return children;
};

export default MobileOnly;