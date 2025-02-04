l'etiquetteimport React from 'react';
import './Label.css';

function Label({ label, onIconClick }) {
  return (
    <div className="label-container">
      <div className="label-icon" onClick={onIconClick}>
        {label.photo ? (
          <img src={label.photo} alt={label.denomination} style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            objectFit: 'cover'
          }} />
        ) : (
          label.immatriculation ? label.immatriculation.substring(0, 2) : 'N/A'
        )}
      </div>
      <div className="label-details">
        <div className="label-title">{label.denomination}</div>
        <div className="label-verification">
          Status: {label.status}
        </div>
      </div>
      <button className="label-button">Vérifier</button>
    </div>
  );
}

export default Label;
