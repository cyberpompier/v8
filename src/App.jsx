import React, { useState, useEffect } from 'react';
    import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
    import { initializeApp } from 'firebase/app';
    import { getFirestore, collection, getDocs } from 'firebase/firestore';
    import firebaseConfig from './firebaseConfig';
    import Label from './Label';
    import LabelPopup from './LabelPopup';
    import Home from './Home';
    import Materiels from './Materiels';
    import Parametres from './Parametres';
    import Verification from './Verification';
    import Login from './Login';
    import Register from './Register';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import './App.css';
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    function App() {
      const [user, setUser] = useState(null);
      const auth = getAuth(app);
    
      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
        });
    
        return () => unsubscribe();
      }, [auth]);
    
      return (
        <Router>
          <div className="app">
            <header className="app-header">
              <h1>Gestion des Véhicules</h1>
            </header>
    
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/labels" element={<LabelsPage user={user} />} />
              <Route path="/materiels" element={<Materiels />} />
              <Route path="/parametres" element={user ? <Parametres /> : <Home />} />
              {/* Page de connexion accessible */}
              <Route path="/login" element={<Login />} />
              {/* Page d'enregistrement accessible */}
              <Route path="/register" element={<Register />} />
              <Route path="/verification/:vehicleId" element={<Verification user={user} />} />
            </Routes>
    
            <footer className="app-footer">
              <Link to="/" className="home-icon">🏠</Link>
              <Link to="/labels" className="vehicle-icon">🚒</Link>
              <Link to="/materiels" className="materiels-icon">🛠️</Link>
              {user ? (
                <Link to="/parametres" className="parametres-icon">⚙️</Link>
              ) : null}
            </footer >
          </div >
        </Router >
      );
    }
    
    function LabelsPage({ user }) {
      const [labels, setLabels] = useState([]);
      const [selectedLabel, setSelectedLabel] = useState(null);
      const [isEditing, setIsEditing] = useState(false);
      const auth = getAuth(app);
    
      useEffect(() => {
        const fetchLabels = async () => {
          const querySnapshot = await getDocs(collection(db, "vehicles"));
          const fetchedLabels = querySnapshot.docs.map(doc => ({
            id: doc.id,
            immatriculation: doc.data().immatriculation,
            caserne: doc.data().caserne,
            vehicleType: doc.data().vehicleType,
            emplacement: doc.data().emplacement,
            lien: doc.data().lien,
            documentation: doc.data().documentation,
            photo: doc.data().url,
            status: doc.data().status,
            denomination: doc.data().denomination,
            ...doc.data()
          }));
          setLabels(fetchedLabels);
        };
    
        fetchLabels();
      }, []);
    
      const handleIconClick = (label) => {
        setSelectedLabel(label);
      };
    
      const handleClosePopup = () => {
        setSelectedLabel(null);
        setIsEditing(false);
      };
    
      const handleEditClick = () => {
        setIsEditing(true);
      };
    
      const handleSave = (updatedLabel) => {
        setLabels(labels.map(label =>
          label.id === updatedLabel.id ? updatedLabel : label
        ));
        setSelectedLabel(updatedLabel);
        setIsEditing(false);
      };
    
      return (
        <div className="labels-page">
          <div className="labels-container">
            {labels.map((label) => (
              <Label
                key={label.id}
                label={label}
                onIconClick={() => handleIconClick(label)}
                onVerifyClick={() => {
                  window.location.href = `/verification/${label.id}`;
                }}
                user={user}
              />
            ))}
          </div>
          {selectedLabel && (
            <LabelPopup
              label={selectedLabel}
              onClose={handleClosePopup}
              isEditing={isEditing}
              onEditClick={handleEditClick}
              onSave={handleSave}
            />
          )}
        </div >
      );
    }
    
    export default App;
