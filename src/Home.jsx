import React, { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
    import { initializeApp } from 'firebase/app';
    import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
    import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
    import firebaseConfig from './firebaseConfig';
    import './Home.css';

    // Initialiser Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const storage = getStorage(app);

    function Home() {
      const [user, setUser] = useState(null);
      const auth = getAuth(app);
      const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
      const [userProfile, setUserProfile] = useState(null);

      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          if (user) {
            fetchUserProfile(user.uid);
          }
        });

        return () => unsubscribe(); // Nettoyer l'abonnement lors du démontage
      }, [auth]);

      const fetchUserProfile = async (uid) => {
        try {
          const userRef = doc(db, 'users', uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserProfile(userSnap.data());
          } else {
            console.log('Aucun document trouvé !');
            setUserProfile(null);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du profil utilisateur :", error);
          setUserProfile(null);
        }
      };

      const handleLogout = async () => {
        try {
          await signOut(auth);
        } catch (error) {
          console.error('Échec de la déconnexion :', error);
        }
      };

      const handleOpenEditProfilePopup = () => {
        setIsEditProfilePopupOpen(true);
      };

      const handleCloseEditProfilePopup = () => {
        setIsEditProfilePopupOpen(false);
      };

      return (
        <div className="home">
          <h2>Bienvenue sur la page d'accueil</h2>
          <p>Ceci est la page d'accueil de l'application.</p>
          <div className="buttons-container">
            {user ? (
              <>
                <button className="logout-button" onClick={handleLogout}>Déconnexion</button>
                <button className="edit-profile-button" onClick={handleOpenEditProfilePopup}>Modifier mon Profil</button>
              </>
            ) : (
              <>
                <Link to="/login" className="login-button">Se connecter</Link>
                <Link to="/register" className="register-button">S'enregistrer</Link>
              </>
            )}
          </div>

          {isEditProfilePopupOpen && userProfile && (
            <EditProfilePopup
              userProfile={userProfile}
              onClose={handleCloseEditProfilePopup}
              userId={user.uid}
            />
          )}
        </div>
      );
    }

    function EditProfilePopup({ userProfile, onClose, userId }) {
      const [name, setName] = useState(userProfile?.name || '');
      const [firstname, setFirstname] = useState(userProfile?.firstname || '');
      const [Grade, setGrade] = useState(userProfile?.Grade || '');
      const [Caserne, setCaserne] = useState(userProfile?.Caserne || '');
      const [userPhoto, setUserPhoto] = useState(userProfile?.userPhoto || '');
      const [selectedImage, setSelectedImage] = useState(null);
      const [userPhotoLink, setUserPhotoLink] = useState(userProfile?.userPhoto || '');

      const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setSelectedImage(file);
          setUserPhoto(URL.createObjectURL(file));
        }
      };

      const handleUpdateProfile = async () => {
        try {
          let photoURL = userPhoto;
          if (selectedImage) {
            const storageRef = ref(storage, `users/${userId}/profileImage`);
            await uploadBytes(storageRef, selectedImage);
            photoURL = await getDownloadURL(storageRef);
          } else if (userPhotoLink) {
            photoURL = userPhotoLink; // Utiliser le lien si fourni
          }

          const userRef = doc(db, 'users', userId);
          await updateDoc(userRef, {
            name: name,
            firstname: firstname,
            Grade: Grade,
            Caserne: Caserne,
            userPhoto: photoURL
          });
          alert('Profil mis à jour avec succès !');
          onClose();
        } catch (error) {
          console.error("Erreur lors de la mise à jour du profil :", error);
          alert('Échec de la mise à jour du profil.');
        }
      };

      return (
        <div className="edit-profile-popup">
          <div className="edit-profile-content">
            <h3>Modifier mon Profil</h3>
            <div className="user-photo-thumbnail">
              <img src={userPhoto} alt="User Photo" />
            </div>
            <div className="form-group">
              <label htmlFor="name">Nom :</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="firstname">Prénom :</label>
              <input type="text" id="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="Grade">Grade :</label>
              <input type="text" id="Grade" value={Grade} onChange={(e) => setGrade(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="Caserne">Caserne :</label>
              <input type="text" id="Caserne" value={Caserne} onChange={(e) => setCaserne(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="userPhoto">Télécharger une photo :</label>
              <input type="file" id="userPhoto" accept="image/*" onChange={handlePhotoChange} />
            </div>
            <div className="form-group">
              <label htmlFor="userPhotoLink">Ou coller un lien de photo :</label>
              <input type="text" id="userPhotoLink" value={userPhotoLink} onChange={(e) => setUserPhotoLink(e.target.value)} />
            </div>
            <div className="edit-profile-buttons">
              <button onClick={handleUpdateProfile} className="update-button">Mettre à jour</button>
              <button onClick={onClose} className="cancel-button">Annuler</button>
            </div>
          </div>
        </div>
      );
    }

    export default Home;
