import React, { useState } from 'react';
import './LabelPopup.css';

function LabelPopup({ label, onClose, isEditing, onEditClick, onSave }) {
  const [editedLabel, setEditedLabel] = useState({ ...label });
  const [selectedImage, setSelectedImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      setSelectedImage(file);
      setEditedLabel(prevLabel => ({
        ...prevLabel,
        url: URL.createObjectURL(file) // Use a local URL for preview
      }));
    } else {
      setEditedLabel(prevLabel => ({
        ...prevLabel,
        [name]: value
      }));
    }
  };

  const handleSaveClick = () => {
    onSave(editedLabel);
  };

  return (
    <div className="label-popup">
      <div className="popup-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h2>{label.denomination}</h2>

        {isEditing ? (
          <div className="edit-form">
             <label>Denomination:</label>
            <input
              type="text"
              name="denomination"
              value={editedLabel.denomination}
              onChange={handleChange}
            />
            <label>Immatriculation:</label>
            <input
              type="text"
              name="immatriculation"
              value={editedLabel.immatriculation}
              onChange={handleChange}
            />
            <label>Caserne:</label>
            <input
              type="text"
              name="caserne"
              value={editedLabel.caserne}
              onChange={handleChange}
            />
            <label>Vehicle Type:</label>
            <input
              type="text"
              name="vehicleType"
              value={editedLabel.vehicleType}
              onChange={handleChange}
            />
            <label>Emplacement:</label>
            <input
              type="text"
              name="emplacement"
              value={editedLabel.emplacement}
              onChange={handleChange}
            />
             <label>Lien:</label>
            <input
              type="text"
              name="lien"
              value={editedLabel.lien}
              onChange={handleChange}
            />
             <label>Documentation:</label>
            <input
              type="text"
              name="documentation"
              value={editedLabel.documentation}
              onChange={handleChange}
            />
            <label>Photo:</label>
            <input
              type="file"
              name="url"
              onChange={handleChange}
            />
            {editedLabel.photo && (
              <img src={editedLabel.url} alt="Preview" style={{maxWidth: '100px'}} />
            )}
            <label>Status:</label>
            <input
              type="text"
              name="status"
              value={editedLabel.status}
              onChange={handleChange}
            />
            <button onClick={handleSaveClick}>Save</button>
          </div>
        ) : (
          <>
            <img src={label.url} alt={label.denomination} />
            <p>Caserne: {label.caserne}</p>
            <p>Type: {label.vehicleType}</p>
            <p>Emplacement: {label.emplacement}</p>
             <p>Lien: {label.lien}</p>
              <p>Documentation: {label.documentation}</p>
            <p>Status: {label.status}</p>
            <button onClick={onEditClick}>Edit</button>
          </>
        )}
      </div>
    </div>
  );
}

export default LabelPopup;
