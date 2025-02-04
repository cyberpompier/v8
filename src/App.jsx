import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Label from './Label';
import LabelPopup from './LabelPopup';
import Home from './Home';
import Materiels from './Materiels'; // Import the new component
import './App.css';

const labelsData = [
  {
    id: 1,
    title: 'FPTL 417',
    description: 'Fourgon Pompe-Tonne Léger',
    verificationDate: '12/06/2023',
    icon: 'fire-truck',
    image: 'fire-truck.png', // Placeholder image
  },
  {
    id: 2,
    title: 'VSAV 219',
    description: 'Véhicule de Secours et d\'Assistance aux Victimes',
    verificationDate: '14/06/2023',
    icon: 'ambulance',
    image: 'ambulance.png', // Placeholder image
  },
];

function App() {
  const [labels, setLabels] = useState(labelsData);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Gestion des Véhicules</h1>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/labels" element={
            <div className="labels-container">
              {labels.map((label) => (
                <Label
                  key={label.id}
                  label={label}
                  onIconClick={() => handleIconClick(label)}
                />
              ))}
            </div>
          } />
          <Route path="/materiels" element={<Materiels />} /> {/* Add the new route */}
        </Routes>

        {selectedLabel && (
          <LabelPopup
            label={selectedLabel}
            onClose={handleClosePopup}
            isEditing={isEditing}
            onEditClick={handleEditClick}
            onSave={handleSave}
          />
        )}

        <footer className="app-footer">
          <Link to="/" className="home-icon">🏠</Link>
          <Link to="/labels" className="vehicle-icon">🚒</Link>
          <Link to="/materiels" className="materiels-icon">🛠️</Link> {/* Add the new icon */}
        </footer>
      </div>
    </Router>
  );
}

export default App;
