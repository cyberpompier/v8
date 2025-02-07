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
      const [commentPopupVisible, setCommentPopupVisible] = useState(false);
      const [selectedMaterielComment, setSelectedMaterielComment] = useState(null);
      const [blinking, setBlinking] = useState(true);
      const [emplacementFilter, setEmplacementFilter] = useState('');
      const [vehicleFilter, setVehicleFilter] = useState('');
      const [vehicles, setVehicles] = useState([]);
      const [emplacementOptions, setEmplacementOptions] = useState([]);

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
              comment: doc.data().comment, // Retrieve comment
              ...doc.data()
            }));
            console.log("Données récupérées de Firebase :", fetchedMateriels); // Ajout d'un console.log
            setMateriels(fetchedMateriels);
          } catch (error) {
            console.error("Erreur lors de la récupération des matériels :", error);
          }
        };

        const fetchVehicles = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, "vehicles"));
            const fetchedVehicles = querySnapshot.docs.map(doc => ({
              id: doc.id,
              denomination: doc.data().denomination,
            }));
            setVehicles(fetchedVehicles);
          } catch (error) {
            console.error("Error fetching vehicles:", error);
          }
        };

        fetchMateriels();
        fetchVehicles();
      }, []);

      useEffect(() => {
        const intervalId = setInterval(() => {
          setBlinking((prevBlinking) => !prevBlinking);
        }, 500); // Change blinking state every 0.5 second

        return () => clearInterval(intervalId); // Clean up interval on unmount
      }, []);

      useEffect(() => {
        // Update emplacement options based on selected vehicle
        if (vehicleFilter) {
          const filteredMateriels = materiels.filter(materiel => materiel.affection === vehicleFilter);
          const uniqueEmplacements = [...new Set(filteredMateriels.map(materiel => materiel.emplacement))];
          setEmplacementOptions(uniqueEmplacements);
        } else {
          // If no vehicle is selected, show all unique locations
          const uniqueEmplacements = [...new Set(materiels.map(materiel => materiel.emplacement))];
          setEmplacementOptions(uniqueEmplacements);
        }
        // Reset emplacement filter when vehicle filter changes
        setEmplacementFilter('');
      }, [vehicleFilter, materiels]);

      const handleIconClick = (materiel) => {
        setSelectedMateriel(materiel);
      };

      const handleClosePopup = () => {
        setSelectedMateriel(null);
      };

      const handleCommentIconClick = (materiel) => {
        setSelectedMaterielComment(materiel.comment);
        setCommentPopupVisible(true);
      };

      const handleCloseCommentPopup = () => {
        setCommentPopupVisible(false);
        setSelectedMaterielComment(null);
      };

      const handleEmplacementFilterChange = (e) => {
        setEmplacementFilter(e.target.value);
      };

      const handleVehicleFilterChange = (e) => {
        setVehicleFilter(e.target.value);
      };

      const filteredMateriels = materiels
        ? materiels.filter(materiel =>
          (vehicleFilter === '' || materiel.affection === vehicleFilter) &&
          (emplacementFilter === '' || materiel.emplacement === emplacementFilter)
        )
        : [];

      return (
        <div className="materiels">
          <h2>Page Matériels</h2>
          <div className="filter-container">
            <label className="filter-label" htmlFor="vehicleFilter">Filtrer par véhicule:</label>
            <select
              id="vehicleFilter"
              className="filter-select"
              value={vehicleFilter}
              onChange={handleVehicleFilterChange}
            >
              <option value="">Tous les véhicules</option>
              {vehicles && vehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.denomination}>
                  {vehicle.denomination}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-container">
            <label className="filter-label" htmlFor="emplacementFilter">Filtrer par emplacement:</label>
            <select
              id="emplacementFilter"
              className="filter-select"
              value={emplacementFilter}
              onChange={handleEmplacementFilterChange}
            >
              <option value="">Tous les emplacements</option>
              {emplacementOptions && emplacementOptions.map(emplacement => (
                <option key={emplacement} value={emplacement}>
                  {emplacement}
                </option>
              ))}
            </select>
          </div>
          <div className="materiels-container">
            {filteredMateriels.map((materiel) => (
              <div key={materiel.id} className="materiel-item">
                <Materiel
                  materiel={materiel}
                  onIconClick={() => handleIconClick(materiel)}
                />
                {materiel.comment && (
                  <div
                    className={`girophare-badge ${blinking ? 'blinking' : ''}`}
                    onClick={() => handleCommentIconClick(materiel)}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      fontSize: '1.2em',
                      color: 'red',
                      cursor: 'pointer',
                    }}
                  >
                    🚨
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedMateriel && (
            <MaterielPopup
              materiel={selectedMateriel}
              onClose={handleClosePopup}
            />
          )}

          {commentPopupVisible && (
            <CommentPopup
              comment={selectedMaterielComment}
              onClose={handleCloseCommentPopup}
            />
          )}
        </div>
      );
    }

    function CommentPopup({ comment, onClose }) {
      return (
        <div className="comment-popup">
          <div className="comment-popup-content">
            <h3>Commentaire</h3>
            <p>{comment}</p>
            <button onClick={onClose}>Fermer</button>
          </div>
        </div>
      );
    }

    export default Materiels;
