import React, { useState, useEffect } from 'react';
import './Parametres.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';
import AddVehicleForm from './AddVehicleForm';
import AddMaterielForm from './AddMaterielForm';

// Initialiser Firebase
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
      console.log('Nouveau véhicule ajouté avec succès !');
      setIsAddingVehicle(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du véhicule :", error);
    }
  };

  const handleAddMaterielSubmit = async (newMateriel) => {
    try {
      const materielsCollection = collection(db, "materials");
      await addDoc(materielsCollection, newMateriel);
      console.log('Nouveau matériel ajouté avec succès !');
      setIsAddingMateriel(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du matériel :", error);
    }
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
        <div className="add-form-overlay">
          <AddVehicleForm
            onSubmit={handleAddVehicleSubmit}
            onCancel={handleAddVehicleCancel}
            onClose={() => setIsAddingVehicle(false)}
          />
        </div>
      )}

      {isAddingMateriel && (
        <div className="add-form-overlay">
          <AddMaterielForm onSubmit={handleAddMaterielSubmit} onCancel={handleAddMaterielCancel} onClose={() => setIsAddingMateriel(false)} />
        </div>
      )}
    </div>
  );
}

export default Parametres;
