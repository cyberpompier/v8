import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Label from './Label';
import LabelPopup from './LabelPopup';
import Home from './Home';
import Materiels from './Materiels';
import Parametres from './Parametres';
import './App.css';

const labelsData = [
  {
    id: 1,
    title: 'FPTL 417',
    description: 'Fourgon Pompe-Tonne Léger',
    verificationDate: '12/06/2023',
    icon: 'fire-truck',
    image: 'fire-truck.png',
  },
  {
    id: 2,
    title: 'VSAV 219',
    description: 'Véhicule de Secours et d\'Assistance aux Victimes',
    verificationDate: '14/06/2023',
    icon: 'ambulance',
    image: 'ambulance.png',
  },
];

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
          <Route path="/parametres" element={<Parametres labelsData={labelsData} />} />
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
  const [labels, setLabels] = React.useState(labelsData);
  const [selectedLabel, setSelectedLabel] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);

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
