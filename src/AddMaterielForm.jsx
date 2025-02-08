import React, { useState } from 'react';

function AddMaterielForm({ onSubmit, onCancel, onClose }) {
  const [denomination, setDenomination] = useState('');
  const [quantity, setQuantity] = useState('');
  const [affection, setAffection] = useState('');
  const [emplacement, setEmplacement] = useState('');
  const [lien, setLien] = useState('');
  const [doc, setDoc] = useState('');
  const [photo, setPhoto] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMateriel = {
      denomination,
      quantity,
      affection,
      emplacement,
      lien,
      doc,
      photo,
    };
    onSubmit(newMateriel);
    onClose();
  };

  return (
    <div className="add-form">
      <h2>Ajouter un matériel</h2>
      <form onSubmit={handleSubmit}>
        <label>Dénomination:</label>
        <input type="text" value={denomination} onChange={(e) => setDenomination(e.target.value)} required />
        
        <label>Quantité:</label>
        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
        
        <label>Affectation:</label>
        <input type="text" value={affection} onChange={(e) => setAffection(e.target.value)} required />
        
        <label>Emplacement:</label>
        <input type="text" value={emplacement} onChange={(e) => setEmplacement(e.target.value)} required />
        
        <label>Lien:</label>
        <input type="text" value={lien} onChange={(e) => setLien(e.target.value)} />
        
        <label>Documentation:</label>
        <input type="text" value={doc} onChange={(e) => setDoc(e.target.value)} />
        
        <label>Photo:</label>
        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
        
        <button type="submit">Ajouter</button>
        <button type="button" onClick={onCancel}>Annuler</button>
      </form>
    </div>
  );
}

export default AddMaterielForm;
