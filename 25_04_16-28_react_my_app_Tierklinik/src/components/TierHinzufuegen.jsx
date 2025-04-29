import React, { useState } from 'react';
 import { useNavigate, Link } from 'react-router-dom';
 import { addTier } from '../services/api'; // Importiere API-Funktion
 import './TierDetail.css'; // Reuse existing styles

 function TierHinzufuegen() {
  const [formData, setFormData] = useState({ name: '', art: '', age: '', gewicht: '', krankheit: '', anamnese: '' });
  const [newBild, setNewBild] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBildChange = (e) => {
  setNewBild(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  if (!newBild) {
    setError('Bitte wählen Sie ein Bild aus.');
    setLoading(false);
    return;
  }

  const dataToSend = new FormData(); // FormData ist notwendig für Datei-Uploads
  dataToSend.append('art', formData.art);
  dataToSend.append('name', formData.name);
  dataToSend.append('age', formData.age);
  dataToSend.append('gewicht', formData.gewicht);
  dataToSend.append('krankheit', formData.krankheit);
  dataToSend.append('anamnese', formData.anamnese);
  dataToSend.append('bild', newBild, newBild.name); // Füge die Datei hinzu

  try {
  const response = await addTier(dataToSend); // Verwende API-Funktion
  alert(response.data); // Zeige Erfolgsmeldung vom Backend
  navigate('/tierpatienten'); // Zurück zur Tierliste
  } catch (err) {
  console.error("Fehler beim Hinzufügen:", err);
  setError(err.response?.data || err.message || 'Fehler beim Hinzufügen des Tiers.');
  } finally {
  setLoading(false);
  }
  };

  return (
  <div className="tier-detail-container"> {/* Reuse container style */}
  <h2>Neuen Tierpatienten hinzufügen</h2>
  <form className="edit-form" onSubmit={handleSubmit}> {/* Reuse form style */}
  <label htmlFor="name">Name:</label>
  <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />

  <label htmlFor="art">Art:</label>
 <input type="text" id="art" name="art" value={formData.art} onChange={handleInputChange} required />

 <label htmlFor="age">Alter:</label>
 <input type="text" id="age" name="age" value={formData.age} onChange={handleInputChange} required />

 <label htmlFor="gewicht">Gewicht:</label>
 <input type="text" id="gewicht" name="gewicht" value={formData.gewicht} onChange={handleInputChange} required />

 <label htmlFor="krankheit">Krankheit:</label>
 <input type="text" id="krankheit" name="krankheit" value={formData.krankheit} onChange={handleInputChange} required />

 <label htmlFor="bild">Bild:</label>
 <input type="file" id="bild" name="bild" accept="image/*" onChange={handleBildChange} required />

 <label htmlFor="anamnese">Anamnese:</label>
 <textarea id="anamnese" name="anamnese" value={formData.anamnese} onChange={handleInputChange} required></textarea>

 <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}> {/* Button Container */}
 <button type="submit" className="save-button" disabled={loading}>
 {loading ? 'Speichern...' : 'Tier Hinzufügen'}
 </button>
 <Link to="/tierpatienten" className="cancel-button" style={{ textDecoration: 'none' }}>
 Abbrechen
 </Link>
 </div>
 {error && <p className="error-message">{error}</p>}
 </form>
 </div>
 );
}

export default TierHinzufuegen;