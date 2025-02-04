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
        image: URL.createObjectURL(file) // Use a local URL for preview
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
        <h2>{label.title}</h2>

        {isEditing ? (
          <div className="edit-form">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={editedLabel.title}
              onChange={handleChange}
            />
            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={editedLabel.description}
              onChange={handleChange}
            />
            <label>Verification Date:</label>
            <input
              type="text"
              name="verificationDate"
              value={editedLabel.verificationDate}
              onChange={handleChange}
            />
            <label>Image:</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
            />
            {editedLabel.image && (
              <img src={editedLabel.image} alt="Preview" style={{maxWidth: '100px'}} />
            )}
            <button onClick={handleSaveClick}>Save</button>
          </div>
        ) : (
          <>
            <img src={label.image} alt={label.title} />
            <p>{label.description}</p>
            <p>Vérifié le {label.verificationDate}</p>
            <button onClick={onEditClick}>Edit</button>
          </>
        )}
      </div>
    </div>
  );
}

export default LabelPopup;
