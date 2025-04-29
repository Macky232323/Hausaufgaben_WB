import React, { useState, useEffect, useRef } from 'react';
 import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
 import TierCard from './TierCard';
 import TierHinzufuegen from './TierHinzufuegen'; // Geändert
 import './Tierpatienten.css';
 

 function Tierpatienten() {
  const [tiere, setTiere] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const contentRef = useRef(null);
  const navigate = useNavigate();
 

  useEffect(() => {
  const fetchTiere = async () => {
  setLoading(true);
  setError(null);
  try {
  const response = await fetch('http://localhost:3001/tiere');
  if (!response.ok) {
  throw new Error('Fehler beim Laden der Tierdaten');
  }
  const data = await response.json();
  setTiere(data);
  } catch (err) {
  setError(err.message);
  } finally {
  setLoading(false);
  }
  };
 

  fetchTiere();
  }, [location]);
 

  const handleAddTierClick = () => {
  navigate('/tierpatienten/Hinzufuegen'); // Geändert
  };
 

  if (loading) {
  return <div>Lade Tierdaten...</div>;
  }
 

  if (error) {
  return <div>Fehler: {error}</div>;
  }
 

  return (
  <div className="tierpatienten-container" ref={contentRef}>
  <div className="add-tier-button-container">
  <button onClick={handleAddTierClick} className="add-tier-button">
  Tier Hinzufügen
  </button>
  </div>
  <Routes>
  <Route path="/" element={
  <div className="tier-grid">
  {tiere.map(tier => (
  <TierCard key={tier.id} {...tier} />
  ))}
  </div>
  } />
  <Route path="/Hinzufuegen" element={<TierHinzufuegen />} /> // Geändert
  </Routes>
  </div>
  );
 }
 

 export default Tierpatienten;