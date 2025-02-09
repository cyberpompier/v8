import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';
import Materiel from './Materiel';
import MaterielPopup from './MaterielPopup';
import './Materiels.css';

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function Materiels() {
  // Déclaration des états pour gérer les données des matériels, la sélection, les popups, etc.
  const [materiels, setMateriels] = useState([]); // Liste de tous les matériels
  const [selectedMateriel, setSelectedMateriel] = useState(null); // Matériel sélectionné pour afficher les détails
  const [commentPopupVisible, setCommentPopupVisible] = useState(false); // Contrôle la visibilité du popup de commentaire
  const [selectedMaterielComment, setSelectedMaterielComment] = useState(null); // Commentaire du matériel sélectionné
  const [blinking, setBlinking] = useState(true); // État pour l'animation de clignotement (e.g., pour indiquer un commentaire)
  const [emplacementFilter, setEmplacementFilter] = useState(''); // Filtre pour l'emplacement des matériels
  const [vehicleFilter, setVehicleFilter] = useState(''); // Filtre pour le véhicule auquel le matériel est affecté
  const [vehicles, setVehicles] = useState([]); // Liste des véhicules pour le filtre
  const [emplacementOptions, setEmplacementOptions] = useState([]); // Options d'emplacement basées sur le véhicule sélectionné
  const [userPhoto, setUserPhoto] = useState(null); // État pour stocker la photo de l'utilisateur

  // useEffect pour récupérer les données des matériels et des véhicules depuis Firebase au montage du composant
  useEffect(() => {
    // Fonction asynchrone pour récupérer les matériels depuis Firebase
    const fetchMateriels = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "materials")); // Récupère tous les documents de la collection "materials"
        const fetchedMateriels = querySnapshot.docs.map(doc => ({
          id: doc.id, // L'ID du document
          denomination: doc.data().denomination, // La dénomination du matériel
          quantity: doc.data().quantity, // La quantité du matériel
          affection: doc.data().affection, // L'affectation du matériel (e.g., à quel véhicule)
          emplacement: doc.data().emplacement, // L'emplacement du matériel
          lien: doc.data().lien, // Un lien associé au matériel
          doc: doc.data().doc, // Un document associé au matériel
          photo: doc.data().photo, // Une photo du matériel
          comment: doc.data().comment, // Récupérer le commentaire
          ...doc.data() // Autres données du document
        }));
        console.log("Données récupérées de Firebase :", fetchedMateriels); // Ajout d'un console.log
        setMateriels(fetchedMateriels); // Mise à jour de l'état avec les données récupérées
      } catch (error) {
        console.error("Erreur lors de la récupération des matériels :", error);
      }
    };

    // Fonction asynchrone pour récupérer les véhicules depuis Firebase
    const fetchVehicles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "vehicles")); // Récupère tous les documents de la collection "vehicles"
        const fetchedVehicles = querySnapshot.docs.map(doc => ({
          id: doc.id, // L'ID du document
          denomination: doc.data().denomination, // La dénomination du véhicule
        }));
        setVehicles(fetchedVehicles); // Mise à jour de l'état avec les données récupérées
      } catch (error) {
        console.error("Erreur lors de la récupération des véhicules :", error);
      }
    };

    fetchMateriels(); // Appel de la fonction pour récupérer les matériels
    fetchVehicles(); // Appel de la fonction pour récupérer les véhicules
  }, []); // Le tableau vide signifie que cet effet s'exécute une seule fois, au montage du composant

  // useEffect pour gérer l'animation de clignotement
  useEffect(() => {
    const intervalId = setInterval(() => {
      setBlinking((prevBlinking) => !prevBlinking); // Inverse l'état de clignotement à chaque intervalle
    }, 500); // Changer l'état de clignotement toutes les 0,5 secondes

    return () => clearInterval(intervalId); // Nettoyer l'intervalle lors du démontage
  }, []); // Le tableau vide signifie que cet effet s'exécute une seule fois, au montage du composant

  // useEffect pour mettre à jour les options d'emplacement en fonction du véhicule sélectionné
  useEffect(() => {
    // Mettre à jour les options d'emplacement en fonction du véhicule sélectionné
    if (vehicleFilter) {
      const filteredMateriels = materiels.filter(materiel => materiel.affection === vehicleFilter); // Filtre les matériels par véhicule
      const uniqueEmplacements = [...new Set(filteredMateriels.map(materiel => materiel.emplacement))]; // Récupère les emplacements uniques
      setEmplacementOptions(uniqueEmplacements); // Mise à jour des options d'emplacement
    } else {
      // Si aucun véhicule n'est sélectionné, afficher tous les emplacements uniques
      const uniqueEmplacements = [...new Set(materiels.map(materiel => materiel.emplacement))]; // Récupère tous les emplacements uniques
      setEmplacementOptions(uniqueEmplacements); // Mise à jour des options d'emplacement
    }
    // Réinitialiser le filtre d'emplacement lorsque le filtre de véhicule change
    setEmplacementFilter('');
  }, [vehicleFilter, materiels]); // Dépendances : cet effet se réexécute lorsque vehicleFilter ou materiels changent

  // Fonction pour gérer le clic sur l'icône d'un matériel
  const handleIconClick = (materiel) => {
    setSelectedMateriel(materiel); // Met à jour l'état avec le matériel sélectionné
  };

  // Fonction pour fermer le popup de détails du matériel
  const handleClosePopup = () => {
    setSelectedMateriel(null); // Réinitialise le matériel sélectionné
  };

  // Fonction pour gérer le clic sur l'icône de commentaire
  const handleCommentIconClick = (materiel) => {
    setSelectedMaterielComment(materiel.comment); // Met à jour l'état avec le commentaire du matériel sélectionné
    // Extraire l'ID de l'utilisateur à partir du commentaire (si possible)
    const commentParts = materiel.comment ? materiel.comment.split('\n') : [];
    const timestampSignature = commentParts.length > 0 ? commentParts[0] : '';
    // Supposons que l'ID de l'utilisateur est stocké dans timestampSignature
    // Vous devrez peut-être ajuster la logique en fonction de la structure réelle de vos commentaires
    // Exemple : const userId = timestampSignature.split(' ')[0];
    setUserPhoto('URL_DE_LA_PHOTO_DE_L_UTILISATEUR'); // Remplacez par l'URL réelle de la photo de l'utilisateur
    setCommentPopupVisible(true); // Affiche le popup de commentaire
  };

  // Fonction pour fermer le popup de commentaire
  const handleCloseCommentPopup = () => {
    setCommentPopupVisible(false); // Masque le popup de commentaire
    setSelectedMaterielComment(null); // Réinitialise le commentaire sélectionné
    setUserPhoto(null); // Réinitialise la photo de l'utilisateur
  };

  // Fonction pour gérer le changement du filtre d'emplacement
  const handleEmplacementFilterChange = (e) => {
    setEmplacementFilter(e.target.value); // Met à jour l'état avec la nouvelle valeur du filtre
  };

  // Fonction pour gérer le changement du filtre de véhicule
  const handleVehicleFilterChange = (e) => {
    setVehicleFilter(e.target.value); // Met à jour l'état avec la nouvelle valeur du filtre
  };

  // Filtre les matériels en fonction des filtres d'emplacement et de véhicule
  const filteredMateriels = materiels
    ? materiels.filter(materiel =>
      (vehicleFilter === '' || materiel.affection === vehicleFilter) && // Filtre par véhicule si un véhicule est sélectionné
      (emplacementFilter === '' || materiel.emplacement === emplacementFilter) // Filtre par emplacement si un emplacement est sélectionné
    )
    : [];

  // Rendu du composant
  return (
    <div className="materiels">
      <h2>Page Matériels</h2>
      {/* Conteneur pour les filtres */}
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
      {/* Conteneur pour la liste des matériels */}
      <div className="materiels-container">
        {filteredMateriels.map((materiel) => (
          <div key={materiel.id} className="materiel-item">
            <Materiel
              materiel={materiel}
              onIconClick={() => handleIconClick(materiel)}
            />
            {/* Affichage conditionnel d'un badge si un commentaire est associé au matériel */}
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

      {/* Affichage conditionnel du popup de détails du matériel */}
      {selectedMateriel && (
        <MaterielPopup
          materiel={selectedMateriel}
          onClose={handleClosePopup}
        />
      )}

      {/* Affichage conditionnel du popup de commentaire */}
      {commentPopupVisible && (
        <CommentPopup
          comment={selectedMaterielComment}
          userPhoto={userPhoto} // Passe la photo de l'utilisateur au popup
          onClose={handleCloseCommentPopup}
        />
      )}
    </div>
  );
}

// Composant pour afficher un popup de commentaire
function CommentPopup({ comment, userPhoto, onClose }) {
  // Divise le commentaire en horodatage/signature et texte du commentaire
  const lines = comment ? comment.split('\n') : [];
  const timestampSignature = lines.length > 0 ? lines[0] : '';
  const commentText = lines.length > 1 ? lines[1] : '';

  return (
    <div className="comment-popup">
      <div className="comment-popup-content">
        <h3>Commentaire</h3>
        {/* Affiche la bulle avec la photo de l'utilisateur */}
        {userPhoto && (
          <div className="user-photo-bubble" style={{ backgroundImage: `url(${userPhoto})` }}>
            <img src={userPhoto} alt="User Photo" />
          </div>
        )}
        {/* Affiche l'horodatage et la signature */}
        <p>{timestampSignature}</p>
        {/* Affiche le texte du commentaire en gras */}
        <p><b>{commentText}</b></p>
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

export default Materiels;
