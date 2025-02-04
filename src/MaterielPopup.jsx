import React, { useState, useEffect } from 'react';
import './MaterielPopup.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function MaterielPopup({ materiel, onClose }) {
  const [materielData, setMaterielData] = useState(null);

  useEffect(() => {
    const fetchMaterielDetails = async () => {
      try {
        const docRef = doc(db, "materials", materiel.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMaterielData(docSnap.data());
        } else {
          console.log("Aucun document trouvé !");
          setMaterielData(null);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des détails du matériel :", error);
      }
    };

    fetchMaterielDetails();
  }, [materiel.id]);

  if (!materielData) {
    return (
      <div className="materiel-popup">
        <div className="popup-content">
          <span className="close-button" onClick={onClose}>
            &times;
          </span>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="materiel-popup">
      <div className="popup-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>

        <div className="photo-container">
          <img src={materielData.photo} alt={materielData.denomination} />
        </div>

        <h2>{materielData.denomination}</h2>
        <p>Quantité: {materielData.quantity}</p>
        <p>Affectation: {materielData.affection}</p>
        <p>Emplacement: {materielData.emplacement}</p>
        <p>
          Lien: <a href={materielData.lien} target="_blank" rel="noopener noreferrer">{materielData.lien}</a>
        </p>
        <p>
          Documentation: <a href={materielData.doc} target="_blank" rel="noopener noreferrer">{materielData.doc}</a>
        </p>
      </div>
    </div>
  );
}

export default MaterielPopup;
