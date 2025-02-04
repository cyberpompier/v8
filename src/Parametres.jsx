import React, { useState } from 'react';
import './Parametres.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function Parametres({ labelsData }) {
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [isAddingMateriel, setIsAddingMateriel] = useState(false);

  const handleAddVehicleClick = () => {
    setIsAddingVehicle(true);
  };

  const handleAddMaterielClick = () => {
    setIsAddingMateriel(true);
  };

  const handleAddVehicleSubmit = async (newVehicle) => {
    try {
      const vehiclesCollection = collection(db, "vehicles");
      await addDoc(vehiclesCollection, newVehicle);
      console.log('New Vehicle added successfully!');
      setIsAddingVehicle(false);
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
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
        <AddVehicleForm
          onSubmit={handleAddVehicleSubmit}
          onCancel={handleAddVehicleCancel}
          onClose={() => setIsAddingVehicle(false)} // Pass onClose function
        />
      )}

      {isAddingMateriel && (
        <AddMaterielForm onSubmit={handleAddMaterielSubmit} onCancel={handleAddMaterielCancel} />
      )}
    </div>
  );
}

function AddVehicleForm({ onSubmit, onCancel, onClose }) {
  const [denomination, setDenomination] = useState('');
  const [immatriculation, setImmatriculation] = useState('');
  const [caserne, setCaserne] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [emplacement, setEmplacement] = useState('');
  const [lien, setLien] = useState('');
  const [documentation, setDocumentation] = useState('');
  const [photo, setPhoto] = useState(''); // Changed url to photo
  const [status, setStatus] = useState('');

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {};
    if (!denomination) newErrors.denomination = 'Denomination is required';
    if (!immatriculation) newErrors.immatriculation = 'Immatriculation is required';
    if (!caserne) newErrors.caserne = 'Caserne is required';
    if (!vehicleType) newErrors.vehicleType = 'Vehicle Type is required';
    if (!emplacement) newErrors.emplacement = 'Emplacement is required';

    setErrors(newErrors);

    // If there are errors, stop submission
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const newVehicle = {
      denomination,
      immatriculation,
      caserne,
      vehicleType,
      emplacement,
      lien,
      documentation,
      photo, // Changed url to photo
      status,
    };
    onSubmit(newVehicle);
    onClose(); // Close the popup after submission
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result); // Set the base64 encoded string as the photo
      };
      reader.readAsDataURL(file);
    } else {
      setPhoto(''); // Clear the photo if no file is selected
    }
  };

  return (
    <div className="add-form-overlay">
      <div className="add-form">
        <h2>Ajouter un véhicule</h2>
        <form onSubmit={handleSubmit}>
          <label>Denomination:</label>
          <input type="text" value={denomination} onChange={(e) => setDenomination(e.target.value)} required />
          {errors.denomination && <p className="error">{errors.denomination}</p>}

          <label>Immatriculation:</label>
          <input type="text" value={immatriculation} onChange={(e) => setImmatriculation(e.target.value)} required />
          {errors.immatriculation && <p className="error">{errors.immatriculation}</p>}

          <label>Caserne:</label>
          <input type="text" value={caserne} onChange={(e) => setCaserne(e.target.value)} required />
          {errors.caserne && <p className="error">{errors.caserne}</p>}

          <label>Vehicle Type:</label>
          <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} required>
            <option value="">Select Vehicle Type</option>
            <option value="Incendie">Incendie</option>
            <option value="Sanitaire">Sanitaire</option>
            <option value="Operations Diverses">Operations Diverses</option>
          </select>
          {errors.vehicleType && <p className="error">{errors.vehicleType}</p>}

          <label>Emplacement:</label>
          <input type="text" value={emplacement} onChange={(e) => setEmplacement(e.target.value)} required />
          {errors.emplacement && <p className="error">{errors.emplacement}</p>}

          <label>Lien:</label>
          <input type="text" value={lien} onChange={(e) => setLien(e.target.value)} />

          <label>Documentation:</label>
          <input type="text" value={documentation} onChange={(e) => setDocumentation(e.target.value)} />

          <label>Photo (URL or File):</label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
          {photo && (
            <img src={photo} alt="Vehicle Photo" style={{ maxWidth: '100px', marginTop: '10px' }} />
          )}

          <label>Status:</label>
          <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} />

          <div className="form-buttons">
            <button type="submit">Valider</button>
            <button type="button" onClick={onCancel}>Annuler</button>
          </div>
        </form>
      </div>
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
