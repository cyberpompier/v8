import React, { useState, useEffect } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { initializeApp } from 'firebase/app';
    import { getFirestore, collection, getDocs, query, where, doc, updateDoc, getDoc } from 'firebase/firestore';
    import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import auth functions
    import firebaseConfig from './firebaseConfig';
    import './Verification.css';
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    function Verification({ user, setVehicleDenomination }) {
      const { vehicleId } = useParams();
      const [materiels, setMateriels] = useState([]);
      const [materielStatuses, setMaterielStatuses] = useState({}); // 'ok', 'anomalie', 'manquant'
      const [comments, setComments] = useState({});
      const [selectedMaterielId, setSelectedMaterielId] = useState(null);
      const [commentPopupVisible, setCommentPopupVisible] = useState(false);
      const navigate = useNavigate();
      const [vehicleAffection, setVehicleAffection] = useState('');
      const [userProfile, setUserProfile] = useState(null); // User profile state
      const [emplacementFilter, setEmplacementFilter] = useState(''); // État pour le filtre d'emplacement
    
      const auth = getAuth(app); // Get Firebase auth instance
    
      useEffect(() => {
        const fetchVehicleData = async () => {
          try {
            const vehicleRef = doc(db, "vehicles", vehicleId);
            const vehicleSnap = await getDoc(vehicleRef);
    
            if (vehicleSnap.exists()) {
              const vehicleData = vehicleSnap.data();
              setVehicleAffection(vehicleData.denomination);
              setVehicleDenomination(vehicleData.denomination);
            } else {
              console.log("No such document!");
            }
          } catch (error) {
            console.error("Error fetching vehicle data:", error);
          }
        };
    
        fetchVehicleData();
      }, [vehicleId, setVehicleDenomination]);
    
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
    
              // Initialize comments for each material
              const initialComments = {};
              fetchedMateriels.forEach(materiel => {
                initialComments[materiel.id] = materiel.comment || ''; // Initialize with comment from db
              });
              setComments(initialComments);
            }
          } catch (error) {
            console.error("Error fetching materials:", error);
          }
        };
    
        fetchMateriels();
      }, [vehicleId, vehicleAffection]);
    
      useEffect(() => {
        if (user) {
          // Fetch user profile from 'users' collection
          const userRef = doc(db, 'users', user.uid);
          const getUserProfile = async () => {
            try {
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                setUserProfile(userSnap.data());
              } else {
                console.log('No such document!');
                setUserProfile(null);
              }
            } catch (error) {
              console.error("Error fetching user profile:", error);
              setUserProfile(null);
            }
          };
          getUserProfile();
        } else {
          setUserProfile(null);
        }
      }, [user]);
    
      const handleStatusChange = async (materielId, status) => {
        try {
          const materielRef = doc(db, "materials", materielId);
          await updateDoc(materielRef, { status: status }); // Update status in Firestore
          // Si le statut est "ok", efface les commentaires
          if (status === 'ok') {
            await updateDoc(materielRef, { status: status, comment: '' }); // Update status and clear comment in Firestore
            setComments(prevComments => {
              const newComments = { ...prevComments };
              delete newComments[materielId];
              return newComments;
            });
          } else {
            await updateDoc(materielRef, { status: status }); // Update status in Firestore
          }
          // After updating Firestore, fetch the updated materials to reflect changes
          fetchMateriels();
        } catch (error) {
          console.error("Error updating status in Firestore:", error);
        }
    
        if (status === 'anomalie' || status === 'manquant') {
          setSelectedMaterielId(materielId);
        }
      };
    
      const handleCommentSubmit = async (materielId, commentText) => {
        const timestamp = new Date().toLocaleString();
        // Assuming you have a way to store and retrieve the user's grade
        const grade = userProfile && userProfile.grade ? userProfile.grade : "Pompier"; // Default grade
        const signature = user ? `${grade} ${user.displayName || user.email}` : "Unknown User"; // Use display name or email
        const comment = `${timestamp} - ${signature}\n${commentText}`;
    
        setComments(prevComments => ({
          ...prevComments,
          [materielId]: comment
        }));
    
        const newStatus = materielStatuses[materielId] === 'manquant' ? 'manquant' : 'anomalie';
    
        try {
          const materielRef = doc(db, "materials", materielId);
          await updateDoc(materielRef, { comment: comment, status: newStatus }); // Update comment and status in Firestore
        } catch (error) {
          console.error("Error updating comment in Firestore:", error);
        }
    
        setMaterielStatuses(prevStatuses => ({
          ...prevStatuses,
          [materielId]: newStatus
        }));
    
        setSelectedMaterielId(null); // Close the popup
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
    
      const getMaterielStyle = (materielId) => {
        if (materielStatuses[materielId] === 'anomalie') {
          return { backgroundColor: 'orange' };
        }
        if (materielStatuses[materielId] === 'manquant') {
          return { backgroundColor: 'red' };
        }
        return {};
      };
    
      const showCommentPopup = (materielId) => {
        setSelectedMaterielId(materielId);
        setCommentPopupVisible(true);
      };
    
      const closeCommentPopup = () => {
        setCommentPopupVisible(false);
        setSelectedMaterielId(null);
      };
    
      const handleEmplacementFilterChange = (e) => {
        setEmplacementFilter(e.target.value);
      };
    
      const filteredMateriels = emplacementFilter === ''
        ? materiels
        : materiels.filter(materiel => materiel.emplacement === emplacementFilter);
    
      return (
        <div className="verification">
          <div className="filter-container">
            <label className="filter-label" htmlFor="emplacementFilter">Filtrer par emplacement:</label>
            <select
              id="emplacementFilter"
              className="filter-select"
              value={emplacementFilter}
              onChange={handleEmplacementFilterChange}
            >
              <option value="">Tous les emplacements</option>
              {materiels && [...new Set(materiels.map(materiel => materiel.emplacement))].map(emplacement => (
                <option key={emplacement} value={emplacement}>
                  {emplacement}
                </option>
              ))}
            </select>
          </div>
          {filteredMateriels.length > 0 ? (
            <div className="materiels-container">
              {filteredMateriels.map(materiel => (
                <div
                  key={materiel.id}
                  className="materiel-container"
                  style={getMaterielStyle(materiel.id)}
                >
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
                    <div className="materiel-title">
                      {materiel.denomination}
                    </div>
                    <div>
                      Quantité: {materiel.quantity}
                    </div>
                    <div>
                      Emplacement: {materiel.emplacement}
                    </div>
                  </div>
                  {comments[materiel.id] && (
                    <span
                      className="comment-badge"
                      onClick={() => showCommentPopup(materiel.id)}
                    >
                      ⓘ
                    </span>
                  )}
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
    
          {selectedMaterielId && !commentPopupVisible && (
            <CommentPopup
              materielId={selectedMaterielId}
              onCommentSubmit={handleCommentSubmit}
              onClose={() => setSelectedMaterielId(null)}
            />
          )}
    
          {commentPopupVisible && userProfile && (
            <CommentDisplayPopup
              materielId={selectedMaterielId}
              comment={comments[selectedMaterielId]}
              userPhoto={userProfile.photoURL} // Assuming userProfile has a photoURL
              onClose={closeCommentPopup}
            />
          )}
        </div>
      );
    }
    
    function CommentPopup({ materielId, onCommentSubmit, onClose }) {
      const [commentText, setCommentText] = useState('');
    
      const handleSubmit = () => {
        onCommentSubmit(materielId, commentText);
        onClose();
      };
    
      return (
        <div className="comment-popup">
          <div className="comment-popup-content">
            <h3>Add Comment</h3>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Enter comment..."
            />
            <div className="comment-popup-buttons">
              <button onClick={handleSubmit}>Valider</button>
              <button onClick={onClose}>Annuler</button>
            </div>
          </div>
        </div>
      );
    }
    
    function CommentDisplayPopup({ materielId, comment, userPhoto, onClose }) {
      const lines = comment ? comment.split('\n') : [];
      const timestampSignature = lines.length > 0 ? lines[0] : '';
      const commentText = lines.length > 1 ? lines[1] : '';
    
      return (
        <div className="comment-popup">
          <div className="comment-popup-content">
            <h3>Commentaire</h3>
            <div className="user-photo-bubble">
              <img src={userPhoto} alt="User Photo" />
            </div>
            <p style={{ textAlign: 'center' }}>
              {timestampSignature}
            </p>
            <p style={{ textAlign: 'center', fontWeight: 'bold', whiteSpace: 'pre-line' }}>
              {commentText}
            </p>
            <div className="comment-popup-buttons">
              <button onClick={onClose}>Fermer</button>
            </div>
          </div>
        </div>
      );
    }
    
    export default Verification;
