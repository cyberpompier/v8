import React from 'react';
import './Materiel.css';

function Materiel({ materiel, onIconClick }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'hose':
        return '🧯';
      case 'extinguisher':
        return '🔥';
      case 'helmet':
        return '⛑️';
      case 'axe':
        return '🪓';
      default:
        return '🛠️';
    }
  };

  return (
    <div className="materiel-container">
      <div className="materiel-icon" onClick={onIconClick}>
        {getIcon(materiel.icon)}
      </div>
      <div className="materiel-details">
        <div className="materiel-title">{materiel.title}</div>
        <div className="materiel-description">{materiel.description}</div>
        <div className="materiel-verification">
          ✔️ Vérifié le {materiel.verificationDate}
        </div>
      </div>
      <button className="materiel-button">Vérifier</button>
    </div>
  );
}

export default Materiel;
