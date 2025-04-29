import React, { useState, useEffect } from 'react';
 import { useParams, Link, useNavigate } from 'react-router-dom';
 import { getTierById, getAnamneseById, updateTier, deleteTier } from '../services/api'; // Importiere API-Funktionen
 import './TierDetail.css';

 function TierDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tier, setTier] = useState(null);
  const [anamnese, setAnamnese] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', art: '', age: '', gewicht: '', krankheit: '' }); // Bild wird separat behandelt
  const [editedAnamnese, setEditedAnamnese] = useState('');
  const [newBild, setNewBild] = useState(null); // Für den Datei-Upload
  const [currentBildFilename, setCurrentBildFilename] = useState(''); // Zum Löschen des alten Bildes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lade Tierdaten und Anamnese
  useEffect(() => {
  const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
  const [tierResponse, anamneseResponse] = await Promise.all([
  getTierById(id),
  getAnamneseById(id) // Nimmt an, dass dies einen Fehler wirft, wenn nicht gefunden
  ]);

  if (tierResponse.data) {
  setTier(tierResponse.data);
  setFormData({ // Initialisiere ohne Bild
  name: tierResponse.data.name,
  art: tierResponse.data.art,
  age: tierResponse.data.age,
  gewicht: tierResponse.data.gewicht,
  krankheit: tierResponse.data.krankheit
  });
  setCurrentBildFilename(tierResponse.data.bild); // Speichere aktuellen Bildnamen
  } else {
  throw new Error(`Tier mit der ID ${id} nicht gefunden.`);
  }

  // Anamnese kann optional sein, Text oder leeren String setzen
  setAnamnese(anamneseResponse.data || ''); // Axios gibt Daten im .data Feld zurück
  setEditedAnamnese(anamneseResponse.data || '');

  } catch (err) {
  console.error("Fehler beim Laden der Details:", err);
  // Unterscheide zwischen "nicht gefunden" und anderen Fehlern
  if (err.response && err.response.status === 404) {
       setError(`Tier oder Anamnese mit der ID ${id} nicht gefunden.`);
  } else {
       setError(err.message || 'Ein unbekannter Fehler ist aufgetreten.');
  }
       setTier(null); // Setze Tier zurück im Fehlerfall
  } finally {
  setLoading(false);
  }
  };
  fetchData();
  }, [id]);

  const enableEditing = () => {
  // Stelle sicher, dass formData aktuell ist, bevor editiert wird
  if (tier) {
  setFormData({
  name: tier.name,
  art: tier.art,
  age: tier.age,
  gewicht: tier.gewicht,
  krankheit: tier.krankheit
  });
  setEditedAnamnese(anamnese);
  setNewBild(null); // Setze Bild-Upload zurück
  }
  setIsEditing(true);
  };

  const disableEditing = () => {
  setIsEditing(false);
  setNewBild(null); // Setze Bild-Upload zurück
  // Setze Formular auf ursprüngliche Werte zurück (optional, aber gut für UX)
  if (tier) {
       setFormData({
           name: tier.name,
           art: tier.art,
           age: tier.age,
           gewicht: tier.gewicht,
           krankheit: tier.krankheit
       });
       setEditedAnamnese(anamnese);
   }
  };

  const handleInputChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAnamneseChange = (e) => {
  setEditedAnamnese(e.target.value);
  };

  const handleBildChange = (e) => {
  setNewBild(e.target.files[0]);
  };

  const saveChanges = async () => {
  setLoading(true);
  setError(null);

  const dataToSend = new FormData(); // FormData für Datei-Uploads verwenden
  dataToSend.append('art', formData.art);
  dataToSend.append('name', formData.name);
  dataToSend.append('age', formData.age);
  dataToSend.append('gewicht', formData.gewicht);
  dataToSend.append('krankheit', formData.krankheit);
  dataToSend.append('anamnese', editedAnamnese);

  if (newBild) {
  dataToSend.append('bild', newBild, newBild.name);
  dataToSend.append('oldBild', currentBildFilename); // Sende alten Bildnamen mit
  }
  // Wenn kein neues Bild, wird das alte im Backend beibehalten (oder 'default.png')

  try {
  const response = await updateTier(id, dataToSend, currentBildFilename); // Verwende API-Funktion
  setTier(response.data); // Aktualisiere Tierdaten mit der Antwort
  setAnamnese(editedAnamnese); // Aktualisiere lokale Anamnese
   if(response.data.bild) {
       setCurrentBildFilename(response.data.bild); // Update den Bildnamen falls geändert
   }
  setIsEditing(false);
  alert('Änderungen erfolgreich gespeichert!');
  } catch (err) {
  console.error("Fehler beim Speichern:", err);
  setError(err.response?.data || err.message || 'Fehler beim Speichern der Änderungen.');
  } finally {
  setLoading(false);
  }
  };

  const handleDelete = async () => {
  if (window.confirm(`Möchten Sie ${tier?.name || 'dieses Tier'} wirklich löschen?`)) {
  setLoading(true);
  setError(null);
  try {
  await deleteTier(id); // Verwende API-Funktion
  alert(`Tier ${tier?.name || ''} wurde erfolgreich gelöscht.`);
  navigate('/tierpatienten');
  } catch (err) {
  console.error("Fehler beim Löschen:", err);
  setError(err.response?.data || err.message || 'Fehler beim Löschen des Tiers.');
  setLoading(false); // Bleibe auf der Seite, um Fehler anzuzeigen
  }
  // setLoading(false) wird durch navigate() überflüssig, außer im Fehlerfall
  }
  };

  // --- Render Logic ---
  let content;

  if (loading) {
  content = <div>Lade Details...</div>;
  } else if (error) {
  content = <div className="error-message">Fehler: {error}</div>;
  } else if (!tier) {
  content = <div>Tier nicht gefunden.</div>;
  } else if (isEditing) {
  content = (
  <form className="edit-form" onSubmit={(e) => e.preventDefault()}> {/* Verhindere Standard-Submit */}
  <label htmlFor="name">Name:</label>
  <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />

  <label htmlFor="art">Art:</label>
  <input type="text" id="art" name="art" value={formData.art} onChange={handleInputChange} />

  <label htmlFor="age">Alter:</label>
  <input type="text" id="age" name="age" value={formData.age} onChange={handleInputChange} />

  <label htmlFor="gewicht">Gewicht:</label>
<input type="text" id="gewicht" name="gewicht" value={formData.gewicht} onChange={handleInputChange} />

<label htmlFor="krankheit">Krankheit:</label> {/* Feld hinzugefügt */}
<input type="text" id="krankheit" name="krankheit" value={formData.krankheit} onChange={handleInputChange} />

<label htmlFor="bild">Neues Bild (optional):</label>
<input type="file" id="bild" name="bild" accept="image/*" onChange={handleBildChange} />
 {currentBildFilename && !newBild && <p>Aktuelles Bild: {currentBildFilename}</p>} {/* Zeige aktuellen Bildnamen */}

<label htmlFor="anamnese">Anamnese:</label>
<textarea id="anamnese" name="anamnese" value={editedAnamnese} onChange={handleAnamneseChange} />

{/* Buttons werden außerhalb des Formulars gerendert */}
 </form>
 );
 } else {
 content = (
 <>
 <h2>{tier.name}</h2>
 {/* Verwende currentBildFilename für die Anzeige, da 'tier.bild' evtl. veraltet ist */}
 <img src={`/assets/${currentBildFilename}`} alt={tier.name} className="tier-detail-bild" style={{ maxHeight: '400px', objectFit: 'contain' }} onError={(e) => { e.target.onerror = null; e.target.src="/assets/default.png"; }} /> {/* Fallback-Bild */}
 <table className="tier-detail-table">
 <tbody>
 <tr><th>Art</th><td>{tier.art}</td></tr>
 <tr><th>Alter</th><td>{tier.age}</td></tr>
 <tr><th>Gewicht</th><td>{tier.gewicht}</td></tr>
 <tr><th>Krankheit</th><td>{tier.krankheit}</td></tr>
 </tbody>
 </table>
 <div className="anamnese-section">
 <h3>Anamnese</h3>
 {/* Zeige die aktuellste Anamnese an */}
 <p>{anamnese || 'Keine Anamnese verfügbar.'}</p>
 </div>
 </>
 );
 }

 return (
 <div className={`tier-detail-container ${isEditing ? 'editing' : ''}`}>
 <Link to="/tierpatienten" className="back-button">Zurück zur Tierliste</Link>

 {tier && !loading && ( // Zeige Buttons nur wenn Tier geladen und nicht im Ladezustand
 isEditing ? (
 <div className="edit-buttons">
 <button onClick={saveChanges} className="save-button" disabled={loading}>
 {loading ? 'Speichern...' : 'Speichern'}
 </button>
 <button onClick={handleDelete} className="delete-button" disabled={loading}>
 Löschen
 </button>
 <button onClick={disableEditing} className="cancel-button" disabled={loading}>
 Abbrechen
 </button>
 </div>
 ) : (
 <div className="edit-button-container">
 <button onClick={enableEditing} className="edit-button">
 Bearbeiten
 </button>
 </div>
 )
 )}

 {content}
 {error && !loading && <p className="error-message">{error}</p>} {/* Zeige Fehler, wenn nicht gerade geladen wird */}
 </div>
 );
}

export default TierDetail;