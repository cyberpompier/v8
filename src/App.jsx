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
    import Login from './Login'; // Import Login component
    import Register from './Register'; // Import Register component
    import './App.css';
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    function App() {
      return (
        <Router>
          <div className="app">
            <header className="app-header">
              <h1>Gestion des Véhicules</h1>
            </header>
    
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/labels" element={<LabelsPage />} />
              <Route path="/materiels" element={<Materiels />} />
              <Route path="/parametres" element={<Parametres />} />
              <Route path="/verification/:vehicleId" element={<Verification />} />
              <Route path="/login" element={<Login />} /> {/* Add Login route */}
              <Route path="/register" element={<Register />} /> {/* Add Register route */}
            </Routes>
    
            <footer className="app-footer">
              <Link to="/" className="home-icon">🏠</Link>
              <Link to="/labels" className="vehicle-icon">🚒</Link>
              <Link to="/materiels" className="materiels-icon">🛠️</Link>
              <Link to="/parametres" className="parametres-icon">⚙️</Link>
            </footer>
          </div>
        </Router>
      );
    }
    
    function LabelsPage() {
      const [labels, setLabels] = useState([]);
      const [selectedLabel, setSelectedLabel] = useState(null);
      const [isEditing, setIsEditing] = useState(false);
    
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
                  // Navigate to the verification page with the vehicle's ID
                  window.location.href = `/verification/${label.id}`;
                }}
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
        </div>
      );
    }
    
    export default App;
