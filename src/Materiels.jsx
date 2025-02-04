import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';
import Materiel from './Materiel';
import MaterielPopup from './MaterielPopup';
import './Materiels.css';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function Materiels() {
  const [materiels, setMateriels] = useState([]);
  const [selectedMateriel, setSelectedMateriel] = useState(null);

  useEffect(() => {
    const fetchMateriels = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "materials"));
        const fetchedMateriels = querySnapshot.docs.map(doc => ({
          id: doc.id,
          denomination: doc.data().denomination,
          quantity: doc.data().quantity,
          affection: doc.data().affection,
          emplacement: doc.data().emplacement,
          lien: doc.data().lien,
          doc: doc.data().doc,
          photo: doc.data().photo,
          ...doc.data()
        }));
        console.log("Données récupérées de Firebase :", fetchedMateriels); // Ajout d'un console.log
        setMateriels(fetchedMateriels);
      } catch (error) {
        console.error("Erreur lors de la récupération des matériels :", error);
      }
    };

    fetchMateriels();
  }, []);

  const handleIconClick = (materiel) => {
    setSelectedMateriel(materiel);
  };

  const handleClosePopup = () => {
    setSelectedMateriel(null);
  };

  return (
    <div className="materiels">
      <h2>Page Matériels</h2>
      <div className="materiels-container">
        {materiels.map((materiel) => (
          <Materiel
            key={materiel.id}
            materiel={materiel}
            onIconClick={() => handleIconClick(materiel)}
          />
        ))}
      </div>

      {selectedMateriel && (
        <MaterielPopup
          materiel={selectedMateriel}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}

export default Materiels;
