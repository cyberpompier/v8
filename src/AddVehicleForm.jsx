import React, { useState } from 'react';

function AddVehicleForm({ onSubmit, onCancel, onClose }) {
  const [denomination, setDenomination] = useState('');
  const [immatriculation, setImmatriculation] = useState('');
  const [caserne, setCaserne] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [emplacement, setEmplacement] = useState('');
  const [lien, setLien] = useState('');
  const [documentation, setDocumentation] = useState('');
  const [photo, setPhoto] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newVehicle = {
      denomination,
      immatriculation,
      caserne,
      vehicleType,
      emplacement,
      lien,
      documentation,
      photo,
    };
    onSubmit(newVehicle);
    onClose();
  };

  return (
    <div className="add-form">
      <h2>Ajouter un véhicule</h2>
      <form onSubmit={handleSubmit}>
        <label>Dénomination:</label>
        <input type="text" value={denomination} onChange={(e) => setDenomination(e.target.value)} required />
        
        <label>Immatriculation:</label>
        <input type="text" value={immatriculation} onChange={(e) => setImmatriculation(e.target.value)} required />
        
        <label>Caserne:</label>
        <input type="text" value={caserne} onChange={(e) => setCaserne(e.target.value)} required />
        
        <label>Type de véhicule:</label>
        <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} required>
          <option value="">Sélectionner le type de véhicule</option>
          <option value="Incendie">Incendie</option>
          <option value="Sanitaire">Sanitaire</option>
          <option value="Operations Diverses">Operations Diverses</option>
        </select>
        
        <label>Emplacement:</label>
        <input type="text" value={emplacement} onChange={(e) => setEmplacement(e.target.value)} required />
        
        <label>Lien:</label>
        <input type="text" value={lien} onChange={(e) => setLien(e.target.value)} />
        
        <label>Documentation:</label>
        <input type="text" value={documentation} onChange={(e) => setDocumentation(e.target.value)} />
        
        <label>Photo:</label>
        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
        
        <button type="submit">Ajouter</button>
        <button type="button" onClick={onCancel}>Annuler</button>
      </form>
    </div>
  );
}

export default AddVehicleForm;
