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

        fetchMateriels();
      }, []);

      useEffect(() => {
        const intervalId = setInterval(() => {
          setBlinking((prevBlinking) => !prevBlinking);
        }, 500); // Change blinking state every 0.5 second

        return () => clearInterval(intervalId); // Clean up interval on unmount
      }, []);

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

      return (
        <div className="materiels">
          <h2>Page Matériels</h2>
          <div className="materiels-container">
            {materiels.map((materiel) => (
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
