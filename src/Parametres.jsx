import React, { useState } from 'react';
import './Parametres.css';

function Parametres({ labelsData }) {
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [isAddingMateriel, setIsAddingMateriel] = useState(false);

  const handleAddVehicleClick = () => {
    setIsAddingVehicle(true);
  };

  const handleAddMaterielClick = () => {
    setIsAddingMateriel(true);
  };

  const handleAddVehicleSubmit = (newVehicle) => {
    // Handle the submission of the new vehicle
    console.log('New Vehicle:', newVehicle);
    setIsAddingVehicle(false);
  };

  const handleAddMaterielSubmit = (newMateriel) => {
    // Handle the submission of the new material
    console.log('New Material:', newMateriel);
    setIsAddingMateriel(false);
  };

  const handleAddVehicleCancel = () => {
    setIsAddingVehicle(false);
  };

  const handleAddMaterielCancel = () => {
    setIsAddingMateriel(false);
  };

  return (
    <div className="parametres">
      <h2>Page Paramètres</h2>
      <div className="button-container">
        <button onClick={handleAddVehicleClick}>Ajouter un véhicule</button>
        <button onClick={handleAddMaterielClick}>Ajouter un matériel</button>
      </div>

      {isAddingVehicle && (
        <AddVehicleForm onSubmit={handleAddVehicleSubmit} onCancel={handleAddVehicleCancel} />
      )}

      {isAddingMateriel && (
        <AddMaterielForm onSubmit={handleAddMaterielSubmit} onCancel={handleAddMaterielCancel} />
      )}
    </div>
  );
}

function AddVehicleForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [verificationDate, setVerificationDate] = useState('');
  const [icon, setIcon] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newVehicle = {
      id: Date.now(),
      title,
      description,
      verificationDate,
      icon,
      image,
    };
    onSubmit(newVehicle);
  };

  return (
    <div className="add-form">
      <h2>Ajouter un véhicule</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label>Description:</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        <label>Verification Date:</label>
        <input type="text" value={verificationDate} onChange={(e) => setVerificationDate(e.target.value)} />
        <label>Icon:</label>
        <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} />
        <label>Image:</label>
        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
        <div className="form-buttons">
          <button type="submit">Valider</button>
          <button type="button" onClick={onCancel}>Annuler</button>
        </div>
      </form>
    </div>
  );
}

function AddMaterielForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [verificationDate, setVerificationDate] = useState('');
  const [icon, setIcon] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMateriel = {
      id: Date.now(),
      title,
      description,
      verificationDate,
      icon,
      image,
    };
    onSubmit(newMateriel);
  };

  return (
    <div className="add-form">
      <h2>Ajouter un matériel</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label>Description:</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        <label>Verification Date:</label>
        <input type="text" value={verificationDate} onChange={(e) => setVerificationDate(e.target.value)} />
        <label>Icon:</label>
        <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} />
        <label>Image:</label>
        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
        <div className="form-buttons">
          <button type="submit">Valider</button>
          <button type="button" onClick={onCancel}>Annuler</button>
        </div>
      </form>
    </div>
  );
}

export default Parametres;
