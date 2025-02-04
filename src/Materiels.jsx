import React from 'react';
import Materiel from './Materiel';
import MaterielPopup from './MaterielPopup';
import './Materiels.css';

const materielsData = [
  {
    id: 1,
    title: 'Tuyau d\'incendie',
    description: 'Tuyau de 20 mètres',
    verificationDate: '15/06/2023',
    icon: 'hose',
    image: 'hose.png',
  },
  {
    id: 2,
    title: 'Extincteur',
    description: 'Extincteur à poudre ABC',
    verificationDate: '10/06/2023',
    icon: 'extinguisher',
    image: 'extinguisher.png',
  },
  {
    id: 3,
    title: 'Casque de pompier',
    description: 'Casque avec visière',
    verificationDate: '20/06/2023',
    icon: 'helmet',
    image: 'helmet.png',
  },
  {
    id: 4,
    title: 'Hache de pompier',
    description: 'Hache avec manche en fibre de verre',
    verificationDate: '25/06/2023',
    icon: 'axe',
    image: 'axe.png',
  },
];

function Materiels() {
  const [materiels, setMateriels] = React.useState(materielsData);
  const [selectedMateriel, setSelectedMateriel] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);

  const handleIconClick = (materiel) => {
    setSelectedMateriel(materiel);
  };

  const handleClosePopup = () => {
    setSelectedMateriel(null);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedMateriel) => {
    setMateriels(materiels.map(materiel =>
      materiel.id === updatedMateriel.id ? updatedMateriel : materiel
    ));
    setSelectedMateriel(updatedMateriel);
    setIsEditing(false);
  };

  return (
    <div className="materiels">
      <h2>Page Matériels</h2>
      <div className="materiels-container">
        {materiels.map((materiel) => (
          <Materiel
            key={materiel.id}
            materiel={materiel}
            onIconClick={() => handleIconClick(materiel)}
          />
        ))}
      </div>

      {selectedMateriel && (
        <MaterielPopup
          materiel={selectedMateriel}
          onClose={handleClosePopup}
          isEditing={isEditing}
          onEditClick={handleEditClick}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default Materiels;
