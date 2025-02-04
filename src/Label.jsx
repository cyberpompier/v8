import React from 'react';
import './Label.css';

function Label({ label, onIconClick }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'fire-truck':
        return '🚒';
      case 'ambulance':
        return '🚑';
      default:
        return '';
    }
  };

  return (
    <div className="label-container">
      <div className="label-icon" onClick={onIconClick}>
        {getIcon(label.icon)}
      </div>
      <div className="label-details">
        <div className="label-title">{label.title}</div>
        <div className="label-description">{label.description}</div>
        <div className="label-verification">
          ✔️ Vérifié le {label.verificationDate}
        </div>
      </div>
      <button className="label-button">Vérifier</button>
    </div>
  );
}

export default Label;
