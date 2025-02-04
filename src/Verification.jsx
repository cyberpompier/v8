import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, doc, updateDoc, getDoc } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';
import './Verification.css';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function Verification() {
  const { vehicleId } = useParams();
  const [materiels, setMateriels] = useState([]);
  const [materielStatuses, setMaterielStatuses] = useState({}); // 'ok', 'anomalie', 'manquant'
  const navigate = useNavigate();
  const [vehicleAffection, setVehicleAffection] = useState('');

  useEffect(() => {
    const fetchVehicleAffection = async () => {
      try {
        const vehicleRef = doc(db, "vehicles", vehicleId);
        const vehicleSnap = await getDoc(vehicleRef);

        if (vehicleSnap.exists()) {
          setVehicleAffection(vehicleSnap.data().denomination);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching vehicle affection:", error);
      }
    };

    fetchVehicleAffection();
  }, [vehicleId]);

  useEffect(() => {
    const fetchMateriels = async () => {
      try {
        if (vehicleAffection) {
          const materielsRef = collection(db, "materials");
          const q = query(materielsRef, where("affection", "==", vehicleAffection));
          const querySnapshot = await getDocs(q);
          const fetchedMateriels = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setMateriels(fetchedMateriels);

          // Initialize statuses for each material
          const initialStatuses = {};
          fetchedMateriels.forEach(materiel => {
            initialStatuses[materiel.id] = materiel.status || 'ok'; // Default to 'ok'
          });
          setMaterielStatuses(initialStatuses);
        }
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };

    fetchMateriels();
  }, [vehicleId, vehicleAffection]);

  const handleStatusChange = (materielId, status) => {
    setMaterielStatuses(prevStatuses => ({
      ...prevStatuses,
      [materielId]: status
    }));
  };

  const handleValidate = async () => {
    try {
      // Update the 'status' field in Firestore for each material
      for (const materielId in materielStatuses) {
        const materielRef = doc(db, "materials", materielId);
        await updateDoc(materielRef, { status: materielStatuses[materielId] });
      }

      navigate('/labels');
    } catch (error) {
      console.error("Error updating materials:", error);
    }
  };

  return (
    <div className="verification">
      <h2>Verification</h2>
      {materiels.length > 0 ? (
        <div className="materiels-container">
          {materiels.map(materiel => (
            <div key={materiel.id} className="materiel-container">
              <div className="materiel-icon">
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
                  Emplacement: {materiel.emplacement}
                </div>
              </div>
              <div className="status-icons">
                <span
                  className={`status-icon ok ${materielStatuses[materiel.id] === 'ok' ? 'active' : ''}`}
                  onClick={() => handleStatusChange(materiel.id, 'ok')}
                >
                  OK
                </span>
                <span
                  className={`status-icon anomalie ${materielStatuses[materiel.id] === 'anomalie' ? 'active' : ''}`}
                  onClick={() => handleStatusChange(materiel.id, 'anomalie')}
                >
                  Anomalie
                </span>
                <span
                  className={`status-icon manquant ${materielStatuses[materiel.id] === 'manquant' ? 'active' : ''}`}
                  onClick={() => handleStatusChange(materiel.id, 'manquant')}
                >
                  Manquant
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No materials found for this vehicle.</p>
      )}
      <button className="validate-button" onClick={handleValidate}>VALIDER</button>
    </div>
  );
}

export default Verification;
