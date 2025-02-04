import React, { useState } from 'react';
import './MaterielPopup.css';

function MaterielPopup({ materiel, onClose, isEditing, onEditClick, onSave }) {
  const [editedMateriel, setEditedMateriel] = useState({ ...materiel });
  const [selectedImage, setSelectedImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      setSelectedImage(file);
      setEditedMateriel(prevMateriel => ({
        ...prevMateriel,
        image: URL.createObjectURL(file) // Use a local URL for preview
      }));
    } else {
      setEditedMateriel(prevMateriel => ({
        ...prevMateriel,
        [name]: value
      }));
    }
  };

  const handleSaveClick = () => {
    onSave(editedMateriel);
  };

  return (
    <div className="materiel-popup">
      <div className="popup-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h2>{materiel.title}</h2>

        {isEditing ? (
          <div className="edit-form">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={editedMateriel.title}
              onChange={handleChange}
            />
            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={editedMateriel.description}
              onChange={handleChange}
            />
            <label>Verification Date:</label>
            <input
              type="text"
              name="verificationDate"
              value={editedMateriel.verificationDate}
              onChange={handleChange}
            />
            <label>Image:</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
            />
            {editedMateriel.image && (
              <img src={editedMateriel.image} alt="Preview" style={{ maxWidth: '100px' }} />
            )}
            <button onClick={handleSaveClick}>Save</button>
          </div>
        ) : (
          <>
            <img src={materiel.image} alt={materiel.title} />
            <p>{materiel.description}</p>
            <p>Vérifié le {materiel.verificationDate}</p>
            <button onClick={onEditClick}>Edit</button>
          </>
        )}
      </div>
    </div>
  );
}

export default MaterielPopup;
