import React, { useState, useEffect } from 'react';
 import { useParams, Link } from 'react-router-dom';
 import './TierDetail.css'; // Erstelle diese CSS-Datei
 
 function TierDetail() {
  const { id } = useParams();
  const [tier, setTier] = useState(null);
  const [anamnese, setAnamnese] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
  setLoading(true);
  setError(null);
 
  // Tierdaten abrufen
  fetch(`http://localhost:3001/tiere/${id}`)
  .then(response => {
  if (!response.ok) {
  throw new Error('Fehler beim Laden der Tierdaten');
  }
  return response.json();
  })
  .then(data => setTier(data))
  .catch(err => setError(err.message))
  .finally(() => setLoading(false));
 
  // Anamnese abrufen
  fetch(`http://localhost:3001/Anamnese/${id}`)
  .then(response => {
  if (!response.ok) {
  throw new Error('Fehler beim Laden der Anamnese');
  }
  return response.text(); // Oder .json(), falls die API JSON zurückgibt
  })
  .then(text => setAnamnese(text))
  .catch(err => setError(err.message))
  .finally(() => setLoading(false)); // Oder ein separater setLoading für Anamnese
  }, [id]);
 
  if (loading) {
  return <div>Lade Daten...</div>;
  }
 
  if (error) {
  return <div>Fehler: {error}</div>;
  }
 
  if (!tier) {
  return <div>Tier nicht gefunden</div>;
  }
 
  return (
  <div className="tier-detail-container">
  <Link to="/tierpatienten" className="back-button">Zurück zu Tierpatienten</Link>
  <h2>{tier.name}</h2>
  <img src={`/assets/${tier.bild}`} alt={tier.name} className="tier-detail-bild" style={{ height: '400px' }} />
  <table className="tier-detail-table">
  <tbody>
  <tr>
  <th>Art</th>
  <td>{tier.art}</td>
  </tr>
  <tr>
  <th>Alter</th>
  <td>{tier.alter}</td>
  </tr>
  <tr>
  <th>Gewicht</th>
  <td>{tier.gewicht}</td>
  </tr>
  <tr>
  <th>Krankheit</th>
  <td>{tier.krankheit}</td>
  </tr>
  </tbody>
  </table>
  <div className="anamnese-section">
  <h3>Anamnese</h3>
  <p>{anamnese}</p>
  </div>
  </div>
  );
 }
 
 export default TierDetail;