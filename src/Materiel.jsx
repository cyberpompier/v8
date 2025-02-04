import React from 'react';
import './Materiel.css';

function Materiel({ materiel, onIconClick }) {
  return (
    <div className="materiel-container">
      <div className="materiel-icon" onClick={onIconClick}>
        {materiel.photo ? (
          <img src={materiel.photo} alt={materiel.denomination} style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            objectFit: 'cover'
          }} />
        ) : (
          'N/A'
        )}
      </div>
      <div className="materiel-details">
        <div className="materiel-title">{materiel.denomination}</div>
        <div>
          Quantité: {materiel.quantity}
        </div>
        <div>
          Affectation: {materiel.affection}
        </div>
        <div>
          Emplacement: {materiel.emplacement}
        </div>
      </div>
    </div>
  );
}

export default Materiel;
